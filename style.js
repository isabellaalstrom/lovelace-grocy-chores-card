import {css} from "https://unpkg.com/lit@2.8.0?module";

const style = css`

  .info {
    padding-bottom: 1em;
  }

  .flex {
    display: flex;
    justify-content: space-between;
  }

  .card-content {
    padding-bottom: 0;
  }

  .overdue {
    color: var(--red, red) !important;
  }

  .due-today {
    color: var(--orange, orange) !important;
  }

  .not-showing {
    margin-left: 16px;
    padding-bottom: 16px;
  }

  .primary {
    display: block;
    color: var(--primary-text-color, #8c96a5);
    font-size: var(--paper-font-subhead_-_font-size);
  }

  .secondary {
    display: block;
    color: var(--secondary-text-color, #8c96a5);
    font-size: var(--paper-font-body1_-_font-size);
  }

  .add-row {
    margin-top: -16px;
    padding-bottom: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
  }

  .add-input {
    padding-right: 16px;
    width: 100%;
  }

  .hide-button {
    padding: 0 0 16px 16px;
  }

  .grocy-item-container, .grocy-item-container-no-border {
    border-bottom: 1px solid var(--entities-divider-color, var(--divider-color, transparent));
    padding-top: 12px;
    align-items: center;
  }

  .grocy-item-container-no-border {
    border: none;
  }

  .expand-button {
    --mdc-ripple-color: none;
  }

  .track-button {
    --mdc-ripple-color: none;
  }

  .track-checkbox {
    --mdc-ripple-color: none;
  }

  .more-items-title {
    padding: 6px 16px 6px 16px;
    width: calc(100% - 32px);
    margin-top: -8px;
  }

  .show-more-button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    font-size: var(--paper-font-subhead_-_font-size);
    line-height: calc(var(--paper-font-subhead_-_font-size) + 20px);
  }

  .show-more-button:hover {
    color: var(--accent-color)
  }

  .track-button-icon {
    color: var(--primary-text-color);
  }

  .track-button-icon:hover {
    color: var(--green, var(--active-color, green));
  }

  .card-overflow-content {

  }

  .hidden-class {
    display: none;
  }

  .show-class {

  }

  .card-overflow-content {
    margin-top: 0;
  }

`;

export default style;