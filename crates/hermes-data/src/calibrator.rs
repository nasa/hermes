use hermes_xtce::{
    MathOperationCalibratorTypeContent, MathOperatorsType, PolynomialCalibratorType,
};

use crate::util::parse_float;
use crate::{Error, ParameterInstanceRef, Result};

#[derive(Clone, Debug)]
pub struct SplinePoint {
    ///The raw encoded value.
    pub raw: f64,
    ///The engineering/calibrated value associated with the raw value for this point.
    pub calibrated: f64,
}

///Describe a spline function for calibration using a set of at least 2 points.  Raw values are converted to calibrated values by finding a position on the line corresponding to the raw value.  The line may be interpolated and/or extrapolated as needed. The interpolation order may be specified for all the points and overridden on individual points.  The algorithm triggers on the input parameter. See CalibratorType.
#[derive(Clone, Debug)]
pub struct Spline {
    ///The interpolation order to apply to the overall spline function.  Order 0 is no slope between the points (flat).  Order 1 is linear interpolation.  Order 2 would be quadratic and in this special case, 3 points would be required, etc.
    pub order: i64,
    ///Extrapolation allows the closest outside point and the associated interpolation to extend outside of the range of the points in the spline function.
    pub extrapolate: bool,
    ///Describes a single point of the spline or piecewise function.
    pub points: Vec<SplinePoint>,
}

impl Spline {
    pub fn new(spline_calibrator: hermes_xtce::SplineCalibratorType) -> Result<Spline> {
        if spline_calibrator.spline_point.len() < 2 {
            return Err(Error::InvalidSpline(
                "Spline must have at least 2 points".to_string(),
            ));
        }

        // Convert XTCE spline points to internal representation
        let mut points: Vec<SplinePoint> = spline_calibrator
            .spline_point
            .iter()
            .map(|p| SplinePoint {
                raw: p.raw,
                calibrated: p.calibrated,
            })
            .collect();

        // Sort points by raw value to ensure proper interpolation
        points.sort_by(|a, b| {
            a.raw
                .partial_cmp(&b.raw)
                .unwrap_or(std::cmp::Ordering::Equal)
        });

        // Validate no duplicate raw values after sorting
        for window in points.windows(2) {
            if (window[0].raw - window[1].raw).abs() < f64::EPSILON {
                return Err(Error::InvalidSpline(format!(
                    "Duplicate raw value {} found in spline points",
                    window[0].raw
                )));
            }
        }

        Ok(Spline {
            order: spline_calibrator.order,
            extrapolate: spline_calibrator.extrapolate,
            points,
        })
    }

    pub fn compute(&self, x: f64) -> f64 {
        // Find the two points that surround the 'x' value
        let (x1, x2) = match self.points.iter().position(|point| point.raw >= x) {
            // x is outside the spline coordinates to the right
            // Choose the last two points
            None => (self.points.len() - 2, self.points.len() - 1),
            // x is outside the spline coordinates to the left
            // Choose the first two points
            Some(0) => (0, 1),
            // Choose the two points that surround x
            Some(i) => (i - 1, i),
        };

        let p1 = &self.points[x1];
        let p2 = &self.points[x2];

        let a1 = p1.raw;
        let a2 = p2.raw;

        let b1 = p1.calibrated;
        let b2 = p2.calibrated;

        ((b1 - b2) * x + (a1 * b2 - b1 * a2)) / (a1 - a2)
    }
}

///Describe a polynomial equation for calibration. This is a calibration type where a curve in a raw vs calibrated plane is described using a set of polynomial coefficients.  Raw values are converted to calibrated values by finding a position on the curve corresponding to the raw value. The first coefficient belongs with the X^0 term, the next coefficient belongs to the X^1 term and so on. See CalibratorType.
#[derive(Clone, Debug)]
pub struct Polynomial(Vec<f64>);

impl Polynomial {
    pub fn new(polynomial: PolynomialCalibratorType) -> Result<Polynomial> {
        if polynomial.term.is_empty() {
            return Err(Error::InvalidPolynomial(
                "Polynomial must have at least one term".to_string(),
            ));
        }

        // Find the maximum exponent to size the coefficient vector
        let max_exponent = polynomial
            .term
            .iter()
            .map(|term| term.exponent as usize)
            .max()
            .unwrap();

        // Initialize coefficient vector with zeros
        let mut coefficients = vec![0.0; max_exponent + 1];

        // Fill in the coefficients at their respective exponent positions
        for term in &polynomial.term {
            let exp = term.exponent as usize;
            if coefficients[exp] != 0.0 {
                return Err(Error::InvalidPolynomial(format!(
                    "Duplicate exponent {} found in polynomial terms",
                    exp
                )));
            }
            coefficients[exp] = term.coefficient;
        }

        Ok(Polynomial(coefficients))
    }

    pub fn compute(&self, x: f64) -> f64 {
        self.0
            .iter()
            .fold((0.0, 1.0), |(sum, xn), coeff| (sum + xn * coeff, xn * x))
            .0
    }
}

#[derive(Clone, Debug)]
pub enum MathOperationItem {
    ///Use a constant in the calculation.
    Value(f64),
    ///Use the value of this parameter in the calculation. It is the calibrator's value only.  If the raw value is needed, specify it explicitly using ParameterInstanceRefOperand. Note this element has no content.
    ThisParameterOperand,
    ///All operators utilize operands on the top values in the stack and leaving the result on the top of the stack.  Ternary operators utilize the top three operands on the stack, binary operators utilize the top two operands on the stack, and unary operators use the top operand on the stack.
    Operator(MathOperatorsType),
    ///This element is used to reference the last received/assigned value of any Parameter in this math operation.
    ParameterInstanceRefOperand(ParameterInstanceRef),
}

#[derive(Clone, Debug)]
pub struct MathOperation(Vec<MathOperationItem>);

impl MathOperation {
    pub fn new(items: Vec<MathOperationItem>) -> Result<MathOperation> {
        if items.is_empty() {
            Err(Error::MathOperation(
                "Math must have at least one item".to_string(),
            ))
        } else {
            let op = MathOperation(items);
            op.validate()?;
            Ok(op)
        }
    }

    fn validate(&self) -> Result<()> {
        let mut stack_size = 0;
        for (index, item) in self.0.iter().enumerate() {
            let (pop_n, push_n) = match item {
                MathOperationItem::Value(_) => (0, 1),
                MathOperationItem::ThisParameterOperand => (0, 1),
                MathOperationItem::Operator(op) => {
                    match op {
                        // Binary operators
                        MathOperatorsType::Plus
                        | MathOperatorsType::Minus
                        | MathOperatorsType::Multiply
                        | MathOperatorsType::Divide
                        | MathOperatorsType::Modulo
                        | MathOperatorsType::Pow
                        | MathOperatorsType::YX
                        | MathOperatorsType::BitwiseLShift
                        | MathOperatorsType::BitwiseRShift
                        | MathOperatorsType::BitwiseAnd
                        | MathOperatorsType::BitwiseOr
                        | MathOperatorsType::And
                        | MathOperatorsType::Or
                        | MathOperatorsType::Gt
                        | MathOperatorsType::Gte
                        | MathOperatorsType::Lt
                        | MathOperatorsType::Lte
                        | MathOperatorsType::Eq
                        | MathOperatorsType::Neq
                        | MathOperatorsType::Min
                        | MathOperatorsType::Max
                        | MathOperatorsType::Xor
                        | MathOperatorsType::BitwiseNot
                        | MathOperatorsType::Atan2 => (2, 1),

                        // Unary operators
                        MathOperatorsType::Ln
                        | MathOperatorsType::Log
                        | MathOperatorsType::EX
                        | MathOperatorsType::_1X
                        | MathOperatorsType::Factorial
                        | MathOperatorsType::Tan
                        | MathOperatorsType::Cos
                        | MathOperatorsType::Sin
                        | MathOperatorsType::Atan
                        | MathOperatorsType::Acos
                        | MathOperatorsType::Asin
                        | MathOperatorsType::Tanh
                        | MathOperatorsType::Cosh
                        | MathOperatorsType::Sinh
                        | MathOperatorsType::Atanh
                        | MathOperatorsType::Acosh
                        | MathOperatorsType::Asinh
                        | MathOperatorsType::Abs
                        | MathOperatorsType::Div
                        | MathOperatorsType::Int
                        | MathOperatorsType::Not => (1, 1),

                        // Special operators
                        MathOperatorsType::Swap => (2, 2),
                        MathOperatorsType::Drop => (1, 0),
                        MathOperatorsType::Dup => (1, 2),
                        MathOperatorsType::Over => (1, 2),
                    }
                }
                MathOperationItem::ParameterInstanceRefOperand(_) => (0, 1),
            };

            if stack_size < pop_n {
                return Err(Error::MathOperation(format!(
                    "Index {index}: Expected at least {pop_n} on the stack, found {stack_size}"
                )));
            }

            stack_size += push_n;
        }

        Ok(())
    }

    // TODO(tumbar)
    pub fn compute(&self, raw: f64) -> f64 {
        raw
    }
}

#[derive(Clone, Debug)]
pub enum Calibrator {
    None,
    Spline(Spline),
    Polynomial(Polynomial),
    MathOperation(MathOperation),
}

impl Calibrator {
    pub fn new(calibrator: hermes_xtce::CalibratorType) -> Result<Calibrator> {
        for item in calibrator.content {
            match item {
                hermes_xtce::CalibratorTypeContent::SplineCalibrator(def) => {
                    return Ok(Calibrator::Spline(Spline::new(def)?));
                }
                hermes_xtce::CalibratorTypeContent::PolynomialCalibrator(def) => {
                    return Ok(Calibrator::Polynomial(Polynomial::new(def)?));
                }
                hermes_xtce::CalibratorTypeContent::MathOperationCalibrator(m) => {
                    let mut ops = Vec::new();
                    for item in m.content {
                        match item {
                            MathOperationCalibratorTypeContent::AncillaryDataSet(_) => {}
                            MathOperationCalibratorTypeContent::ValueOperand(v) => {
                                ops.push(MathOperationItem::Value(parse_float(&v)?));
                            }
                            MathOperationCalibratorTypeContent::ThisParameterOperand(_) => {
                                ops.push(MathOperationItem::ThisParameterOperand)
                            }
                            MathOperationCalibratorTypeContent::Operator(op) => {
                                ops.push(MathOperationItem::Operator(op))
                            }
                            MathOperationCalibratorTypeContent::ParameterInstanceRefOperand(r) => {
                                ops.push(MathOperationItem::ParameterInstanceRefOperand(r.into()))
                            }
                        }
                    }

                    return Ok(Calibrator::MathOperation(MathOperation::new(ops)?));
                }
                _ => {}
            }
        }

        Ok(Calibrator::None)
    }

    pub fn compute(&self, raw: f64) -> Result<f64> {
        match self {
            Calibrator::None => Ok(raw),
            Calibrator::Spline(spline) => Ok(spline.compute(raw)),
            Calibrator::Polynomial(polynomial) => Ok(polynomial.compute(raw)),
            Calibrator::MathOperation(operation) => Ok(operation.compute(raw)),
        }
    }
}
