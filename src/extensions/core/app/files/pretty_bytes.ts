const BYTE_UNITS = [
    'B',
    'kB',
    'MB',
    'GB',
    'TB',
    'PB',
    'EB',
    'ZB',
    'YB',
];

const BIBYTE_UNITS = [
    'B',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
];

const BIT_UNITS = [
    'b',
    'kbit',
    'Mbit',
    'Gbit',
    'Tbit',
    'Pbit',
    'Ebit',
    'Zbit',
    'Ybit',
];

const BIBIT_UNITS = [
    'b',
    'kibit',
    'Mibit',
    'Gibit',
    'Tibit',
    'Pibit',
    'Eibit',
    'Zibit',
    'Yibit',
];

/*
Formats the given number using `Number#toLocaleString`.
- If locale is a string, the value is expected to be a locale-key (for example: `de`).
- If locale is true, the system default locale is used for translation.
- If no value for locale is specified, the number is returned unmodified.
*/
const toLocaleString = (n: number, locale?: boolean | string | readonly string[], options?: Options) => {
    let result: string | number = n;
    if (typeof locale === 'string' || Array.isArray(locale)) {
        result = n.toLocaleString(locale, options);
    } else if (locale === true || options !== undefined) {
        result = n.toLocaleString(undefined, options);
    }

    return result;
};

const log10 = (numberOrBigInt: number | bigint) => {
    if (typeof numberOrBigInt === 'number') {
        return Math.log10(numberOrBigInt);
    }

    const string = numberOrBigInt.toString(10);

    return string.length + Math.log10(Number(`0.${string.slice(0, 15)}`));
};

const log = (numberOrBigInt: number | bigint) => {
    if (typeof numberOrBigInt === 'number') {
        return Math.log(numberOrBigInt);
    }

    return log10(numberOrBigInt) * Math.log(10);
};

const divide = (numberOrBigInt: number | bigint, divisor: number) => {
    if (typeof numberOrBigInt === 'number') {
        return numberOrBigInt / divisor;
    }

    const integerPart = numberOrBigInt / BigInt(divisor);
    const remainder = numberOrBigInt % BigInt(divisor);
    return Number(integerPart) + (Number(remainder) / divisor);
};

const applyFixedWidth = (result: string, fixedWidth?: number) => {
    if (fixedWidth === undefined) {
        return result;
    }

    if (typeof fixedWidth !== 'number' || !Number.isSafeInteger(fixedWidth) || fixedWidth < 0) {
        throw new TypeError(`Expected fixedWidth to be a non-negative integer, got ${typeof fixedWidth}: ${fixedWidth}`);
    }

    if (fixedWidth === 0) {
        return result;
    }

    return result.length < fixedWidth ? result.padStart(fixedWidth, ' ') : result;
};

const buildLocaleOptions = (options: Options) => {
    const { minimumFractionDigits, maximumFractionDigits } = options;

    if (minimumFractionDigits === undefined && maximumFractionDigits === undefined) {
        return undefined;
    }

    return {
        ...(minimumFractionDigits !== undefined && { minimumFractionDigits }),
        ...(maximumFractionDigits !== undefined && { maximumFractionDigits }),
        roundingMode: 'trunc',
    };
};

export type Options = {
    /**
    Include plus sign for positive numbers. If the difference is exactly zero a space character will be prepended instead for better alignment.

    @default false
    */
    readonly signed?: boolean;

    /**
    - If `false`: Output won't be localized.
    - If `true`: Localize the output using the system/browser locale.
    - If `string`: Expects a [BCP 47 language tag](https://en.wikipedia.org/wiki/IETF_language_tag) (For example: `en`, `de`, …)
    - If `string[]`: Expects a list of [BCP 47 language tags](https://en.wikipedia.org/wiki/IETF_language_tag) (For example: `en`, `de`, …)

    @default false
    */
    readonly locale?: boolean | string | readonly string[];

    /**
    Format the number as [bits](https://en.wikipedia.org/wiki/Bit) instead of [bytes](https://en.wikipedia.org/wiki/Byte). This can be useful when, for example, referring to [bit rate](https://en.wikipedia.org/wiki/Bit_rate).

    @default false

    @example
    ```
    import prettyBytes from 'pretty-bytes';

    prettyBytes(1337, {bits: true});
    //=> '1.34 kbit'
    ```
    */
    readonly bits?: boolean;

    /**
    Format the number using the [Binary Prefix](https://en.wikipedia.org/wiki/Binary_prefix) instead of the [SI Prefix](https://en.wikipedia.org/wiki/SI_prefix). This can be useful for presenting memory amounts. However, this should not be used for presenting file sizes.

    @default false

    @example
    ```
    import prettyBytes from 'pretty-bytes';

    prettyBytes(1000, {binary: true});
    //=> '1000 B'

    prettyBytes(1024, {binary: true});
    //=> '1 KiB'
    ```
    */
    readonly binary?: boolean;

    /**
    The minimum number of fraction digits to display.

    @default undefined

    If neither `minimumFractionDigits` nor `maximumFractionDigits` is set, the default behavior is to round to 3 significant digits.

    Note: When `minimumFractionDigits` or `maximumFractionDigits` is specified, values are truncated instead of rounded to provide more intuitive results for file sizes.

    @example
    ```
    import prettyBytes from 'pretty-bytes';

    // Show the number with at least 3 fractional digits
    prettyBytes(1900, {minimumFractionDigits: 3});
    //=> '1.900 kB'

    prettyBytes(1900);
    //=> '1.9 kB'
    ```
    */
    readonly minimumFractionDigits?: number;

    /**
    The maximum number of fraction digits to display.

    @default undefined

    If neither `minimumFractionDigits` nor `maximumFractionDigits` is set, the default behavior is to round to 3 significant digits.

    Note: When `minimumFractionDigits` or `maximumFractionDigits` is specified, values are truncated instead of rounded to provide more intuitive results for file sizes.

    @example
    ```
    import prettyBytes from 'pretty-bytes';

    // Show the number with at most 1 fractional digit
    prettyBytes(1920, {maximumFractionDigits: 1});
    //=> '1.9 kB'

    prettyBytes(1920);
    //=> '1.92 kB'
    ```
    */
    readonly maximumFractionDigits?: number;

    /**
    Put a space between the number and unit.

    @default true

    @example
    ```
    import prettyBytes from 'pretty-bytes';

    prettyBytes(1920, {space: false});
    //=> '1.92kB'

    prettyBytes(1920);
    //=> '1.92 kB'
    ```
    */
    readonly space?: boolean;

    /**
    Use a non-breaking space instead of a regular space to prevent the unit from wrapping to a new line.

    Has no effect when `space` is `false`.

    @default false
    */
    readonly nonBreakingSpace?: boolean;

    /**
    Pad the output to a fixed width by right-aligning it.

    Useful for creating aligned columns in tables or progress bars.

    If the output is longer than the specified width, no padding is applied.

    Must be a non-negative integer. Throws a `TypeError` for invalid values.

    @default undefined

    @example
    ```
    import prettyBytes from 'pretty-bytes';

    prettyBytes(1337, {fixedWidth: 10});
    //=> '   1.34 kB'

    prettyBytes(100_000, {fixedWidth: 10});
    //=> '  100 kB'

    // Useful for progress bars and tables
    [1000, 10_000, 100_000].map(bytes => prettyBytes(bytes, {fixedWidth: 8}));
    //=> ['   1 kB', '  10 kB', ' 100 kB']
    ```
    */
    readonly fixedWidth?: number;
};

export default function prettyBytes(number: number | bigint, options: Options) {
    if (typeof number !== 'bigint' && !Number.isFinite(number)) {
        throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
    }

    options = {
        bits: false,
        binary: false,
        space: true,
        nonBreakingSpace: false,
        ...options,
    };

    const UNITS = options.bits
        ? (options.binary ? BIBIT_UNITS : BIT_UNITS)
        : (options.binary ? BIBYTE_UNITS : BYTE_UNITS);

    const separator = options.space ? (options.nonBreakingSpace ? '\u00A0' : ' ') : '';

    // Handle signed zero case
    const isZero = typeof number === 'number' ? number === 0 : number === 0n;
    if (options.signed && isZero) {
        const result = ` 0${separator}${UNITS[0]}`;
        return applyFixedWidth(result, options.fixedWidth);
    }

    const isNegative = number < 0;
    const prefix = isNegative ? '-' : (options.signed ? '+' : '');

    if (isNegative) {
        number = -number;
    }

    const localeOptions = buildLocaleOptions(options);
    let result;

    if (number < 1) {
        const numberString = toLocaleString(number as number, options.locale, localeOptions);
        result = prefix + numberString + separator + UNITS[0];
    } else {
        const exponent = Math.min(Math.floor(options.binary ? log(number) / Math.log(1024) : log10(number) / 3), UNITS.length - 1);
        number = divide(number, (options.binary ? 1024 : 1000) ** exponent);

        if (!localeOptions) {
            const minPrecision = Math.max(3, Math.floor(number).toString().length);
            // @ts-expect-error We still convert this to a number later
            number = number.toPrecision(minPrecision);
        }

        const numberString = toLocaleString(Number(number), options.locale, localeOptions);
        const unit = UNITS[exponent];
        result = prefix + numberString + separator + unit;
    }

    return applyFixedWidth(result, options.fixedWidth);
}
