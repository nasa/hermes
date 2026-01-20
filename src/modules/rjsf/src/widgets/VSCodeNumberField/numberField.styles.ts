import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
} from "@microsoft/fast-foundation";
import {
    borderWidth,
    buttonPrimaryForeground,
    buttonPrimaryHoverBackground,
    cornerRadiusRound,
    designUnit,
    disabledOpacity,
    dropdownBorder,
    focusBorder,
    fontFamily,
    foreground,
    inputBackground,
    inputForeground,
    inputHeight,
    inputMinWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "./design-tokens";

export const numberFieldStyles = () => css`
  ${display("inline-block")} :host {
    font-family: ${fontFamily};
    outline: none;
    user-select: none;
  }
  .root {
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: row;
    color: ${inputForeground};
    background: ${inputBackground};
    border-radius: calc(${cornerRadiusRound} * 1px);
    border: calc(${borderWidth} * 1px) solid ${dropdownBorder};
    height: calc(${inputHeight} * 1px);
    min-width: ${inputMinWidth};
  }
  .control {
    -webkit-appearance: none;
    font: inherit;
    background: transparent;
    border: 0;
    color: inherit;
    height: calc(100% - (${designUnit} * 1px));
    width: 100%;
    margin-top: auto;
    margin-bottom: auto;
    border: none;
    padding: 0 calc(${designUnit} * 2px + 1px);
    font-size: ${typeRampBaseFontSize};
    line-height: ${typeRampBaseLineHeight};
  }
  .control:hover,
.control:${focusVisible},
.control:disabled,
.control:active {
    outline: none;
  }
  .label {
    display: block;
    color: ${foreground};
    cursor: pointer;
    font-size: ${typeRampBaseFontSize};
    line-height: ${typeRampBaseLineHeight};
    margin-bottom: 2px;
  }
  .label__hidden {
    display: none;
    visibility: hidden;
  }
  .start,
  .end {
    display: flex;
    margin: auto;
    fill: currentcolor;
  }
  ::slotted(svg),
  ::slotted(span) {
    width: calc(${designUnit} * 4px);
    height: calc(${designUnit} * 4px);
  }
  .start {
    margin-inline-start: calc(${designUnit} * 2px);
  }
  .end {
    margin-inline-end: calc(${designUnit} * 2px);
  }
  :host(:hover:not([disabled])) .root {
    background: ${inputBackground};
    border-color: ${dropdownBorder};
  }
  :host(:active:not([disabled])) .root {
    background: ${inputBackground};
    border-color: ${focusBorder};
  }
  :host(:focus-within:not([disabled])) .root {
    border-color: ${focusBorder};
  }
  :host([disabled]) .label,
  :host([readonly]) .label,
  :host([readonly]) .control,
  :host([disabled]) .control {
    cursor: ${disabledCursor};
  }
  :host([disabled]) {
    opacity: ${disabledOpacity};
  }
  :host([disabled]) .control {
    border-color: ${dropdownBorder};
  }

  .step-up-glyph::before,
  .step-down-glyph::before {
    top: 0;
    position: relative;
    right: 90%;
    margin: 40%;
    content: "";
    display: block;
    border: 4px solid transparent;
  }

  .step-up-glyph::before {
    border-bottom-color: ${inputForeground};
  }

  .step-down-glyph::before {
    border-top-color: ${inputForeground};
  }

  .step-up-glyph:hover::before {
    border-bottom-color: ${buttonPrimaryForeground};
    cursor: pointer;
  }

  .step-down-glyph:hover::before {
    border-top-color: ${buttonPrimaryForeground};
    cursor: pointer;
  }

  .step-up-glyph:active::before {
    border-bottom-color: ${buttonPrimaryHoverBackground};
  }

  .step-down-glyph:active::before {
    border-top-color: ${buttonPrimaryHoverBackground};
  }
`;
