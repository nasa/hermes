import {
    NumberField as FoundationNumberField,
    numberFieldTemplate as template,
    NumberFieldOptions,
} from '@microsoft/fast-foundation';
import { numberFieldStyles as styles } from './numberField.styles.js';

/**
 * The Visual Studio Code number field class.
 *
 * @public
 */
export class NumberField extends FoundationNumberField {
    /**
     * Component lifecycle method that runs when the component is inserted
     * into the DOM.
     *
     * @internal
     */
    public connectedCallback() {
        super.connectedCallback();
        if (this.textContent) {
            this.setAttribute('aria-label', this.textContent);
        } else {
            // Describe the generic component if no label is provided
            this.setAttribute('aria-label', 'Text field');
        }
    }
}

/**
 * The Visual Studio Code number field component registration.
 *
 * @remarks
 * HTML Element: `<vscode-number-field>`
 *
 * @public
 */
export const vsCodeNumberField = NumberField.compose<
    NumberFieldOptions,
    typeof NumberField
>({
    baseName: "number-field",
    styles,
    template,
    shadowOptions: {
        delegatesFocus: true,
    },
    stepDownGlyph: `<span class="step-down-glyph" part="step-down-glyph"></span>`,
    stepUpGlyph: `<span class="step-up-glyph" part="step-up-glyph"></span>`,
});