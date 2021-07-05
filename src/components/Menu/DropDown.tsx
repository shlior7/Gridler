import React, { FunctionComponent, useState } from "react";
import "./DropDown.scss";

export const DropDown: React.FC = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <ul className="nav-item">
      <a className="icon-button" onClick={() => setOpen(!open)}>
        ▼
      </a>
      <div className="dropdown" onClick={() => setOpen(false)}>
        {open ? children : null}
      </div>
    </ul>
  );
};

type DropDownitem = {
  onClickItem: () => void;
};

export const DropDownItem: FunctionComponent<DropDownitem> = ({
  onClickItem,
  children,
}) => {
  return (
    <a className="menu-item" onClick={onClickItem}>
      {children}
    </a>
  );
};
