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
            switch (this._opts.selectedIndexes.length) {
                case 0:
                    return html`<span class="select-face-badge no-item"></span>`;
                case 1:
                    return html`<span class="select-face-badge">${this._opts.options[this._opts.selectedIndexes[0]].label}</span>`;
                default:
                    return html`<span class="select-face-badge"
                  >${this._opts.selectedIndexes.length} ${this.multipleLabel}</span
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
