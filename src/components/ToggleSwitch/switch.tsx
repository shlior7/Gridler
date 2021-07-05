import React from "react";
import "./switch.scss";
type ToggleProps = {
  onChange: Function;
};
export const ToggleSwitch = ({ onChange }: ToggleProps) => {
  return (
    <div className="toggle-switch">
      <label className="toggle-switch-label">
        <input
          type="checkbox"
          className="toggle-switch-checkbox"
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle-switch-inner" />
      </label>
    </div>
  );
};
