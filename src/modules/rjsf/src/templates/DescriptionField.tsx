import React from 'react';

import { DescriptionFieldProps, FormContextType, RJSFSchema, StrictRJSFSchema, getUiOptions } from '@rjsf/utils';
import Markdown from 'markdown-to-jsx';

/** The `DescriptionField` is the template to use to render the description of a field
 *
 * @param props - The `DescriptionFieldProps` for this component
 */
export default function DescriptionField<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: DescriptionFieldProps<T, S, F>) {
    const { id = '', schema, uiSchema, registry } = props;

    const uiOptions = getUiOptions<T, S, F>(uiSchema, registry.globalUiOptions);
    const description = (uiOptions.description || props.schema.description || schema.description || '') + "\n";

    if (!description) {
        return null;
    }

    return (
        <div id={id} className='field-description'>
            <Markdown>
                {description}
            </Markdown>
        </div>
    );
}
