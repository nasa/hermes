import React from "react";
import { html } from 'lit';

import { createComponent } from "@lit/react";
import { VscodeMultiSelect } from "@vscode-elements/elements/dist/vscode-multi-select/vscode-multi-select.js";
import { customElement } from "@vscode-elements/elements/dist/includes/VscElement";

const __decorate = function (decorators: any[], target: any) {
    let r = target;
    for (const d of decorators.reverse()) {
        r = d(r) || r;
    }
    return r;
};

class AnnotatedMultiSelect extends VscodeMultiSelect {
    multipleLabel: string = "Selected";

    static get properties() {
        return {
            ...super.properties,
            multipleLabel: { type: String }
        };
    }

    constructor() {
        super();

        (this as any)._renderLabel = () => {
            const selected = this._opts.selectedIndexes.map((i) => this._opts.options[i]);
            // The All option is selected only while every other option is, so we name it instead of counting it
            if (selected.some((option) => option.value === '*')) {
                return html`<span class="select-face-badge">All ${this.multipleLabel}</span>`;
            }
            switch (selected.length) {
                case 0:
                    return html`<span class="select-face-badge no-item"></span>`;
                case 1:
                    return html`<span class="select-face-badge">${selected[0].label}</span>`;
                default:
                    return html`<span class="select-face-badge"
                  >${selected.length} ${this.multipleLabel}</span
                >`;
            }
        };
    }
}

(AnnotatedMultiSelect as any) = (__decorate as any)([
    customElement('annotated-multi-select')
], AnnotatedMultiSelect);

const AnnotatedMultiSelectComp = createComponent({
    tagName: "annotated-multi-select",
    elementClass: AnnotatedMultiSelect,
    react: React,
    displayName: "AnnotatedMultiSelect",
    events: {
        onChange: "change",
        onInvalid: "invalid",
        onVscMultiSelectCreateOption: "vsc-multi-select-create-option",
    },
});

export default AnnotatedMultiSelectComp;
