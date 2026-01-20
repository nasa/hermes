import React from 'react';

import {
    getUiOptions,
    titleId,
    ArrayFieldTitleProps,
    FormContextType,
    RJSFSchema,
    StrictRJSFSchema
} from '@rjsf/utils';

const REQUIRED_FIELD_SYMBOL = '*';

/** The `ArrayFieldTitleTemplate` component renders a `TitleFieldTemplate` with an `id` derived from
 * the `idSchema`.
 *
 * @param props - The `ArrayFieldTitleProps` for the component
 */
export default function ArrayFieldTitleTemplate<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: ArrayFieldTitleProps<T, S, F>) {
    const { idSchema, title, uiSchema, required, registry } = props;
    const options = getUiOptions<T, S, F>(uiSchema, registry.globalUiOptions);
    const { label: displayLabel = true } = options;
    if (!title || !displayLabel) {
        return null;
    }
    return (
        <legend className="array-title" id={titleId<T>(idSchema)}>
            {title}
            {required && <span className='required'>{REQUIRED_FIELD_SYMBOL}</span>}
        </legend>
    );
}
