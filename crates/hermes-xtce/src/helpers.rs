use crate::ComparisonOperatorsType;

impl std::fmt::Display for ComparisonOperatorsType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ComparisonOperatorsType::Eq => f.write_str("=="),
            ComparisonOperatorsType::Neq => f.write_str("!="),
            ComparisonOperatorsType::Lt => f.write_str("<"),
            ComparisonOperatorsType::Lte => f.write_str("<="),
            ComparisonOperatorsType::Gt => f.write_str(">"),
            ComparisonOperatorsType::Gte => f.write_str(">="),
        }
    }
}

impl PartialEq for ComparisonOperatorsType {
    fn eq(&self, other: &Self) -> bool {
        core::mem::discriminant(self) == core::mem::discriminant(other)
    }
}
