import React from 'react';

import { withTheme, ThemeProps, FormProps } from '@rjsf/core';

import { CheckboxWidget } from './widgets/CheckboxWidget';
import { FileWidget } from './widgets/FileWidget';
import { SelectWidget } from './widgets/SelectWidget';
import { TextareaWidget } from './widgets/TextareaWidget';

import ArrayField from './fields/ArrayField';
import ArraySchemaField from './fields/ArraySchemaField';
import DescriptionField from './templates/DescriptionField';
import GridField from './fields/GridField';
import ObjectField from './fields/ObjectField';

import ArrayFieldItemTemplate from './templates/ArrayFieldItemTemplate';
import ArrayFieldTemplate from './templates/ArrayFieldTemplate';
import ArrayFieldTitleTemplate from './templates/ArrayFieldTitleTemplate';
import BaseInputTemplate from './templates/BaseInputTemplate';
import ObjectFieldTemplate from './templates/ObjectFieldTemplate';
import WrapIfAdditionalTemplate from './templates/WrapIfAdditionalTemplate';

import { AddButton, MoveDownButton, MoveUpButton, RemoveButton } from './templates/ButtonTemplates';

import "./index.scss";
import { Tooltip } from 'react-tooltip';

export const VSCodeTheme: ThemeProps = {
    widgets: {
        CheckboxWidget,
        FileWidget,
        SelectWidget,
        TextareaWidget,
        // TextWidget,
    },
    fields: {
        ArrayField,
        ArraySchemaField,
        GridField,
        ObjectField,
    },
    templates: {
        ArrayFieldItemTemplate,
        ArrayFieldTemplate,
        ArrayFieldTitleTemplate,
        BaseInputTemplate,
        DescriptionFieldTemplate: DescriptionField,
        ObjectFieldTemplate,
        WrapIfAdditionalTemplate,

        ButtonTemplates: {
            AddButton,
            MoveDownButton,
            MoveUpButton,
            RemoveButton
        }
    }
};

export * from './common';

const VSCodeFormTheme = withTheme(VSCodeTheme);
export default function VSCodeForm(props: FormProps) {
    return (
        <VSCodeFormTheme {...props}>
            <Tooltip disableStyleInjection='core' className='tooltip' id='rjsf-tooltip' />
        </VSCodeFormTheme>
    );
}

