import React, { FunctionComponent, useState } from "react";
import "./square.scss";

type SquareProps = {
  onChange: (val: number) => void;
  MaxValue: number;
  isOkay: (ok: boolean) => void;
  inputValue: string;
};
export const Numbersquare: FunctionComponent<SquareProps> = ({
  onChange,
  isOkay,
  MaxValue,
  inputValue,
}) => {
  const validate = (val: string) => {
    if (val === "") {
      isOkay(true);
      return 0;
    }
    const value = parseInt(val);
    if (isNaN(value) || value > MaxValue) {
      isOkay(false);
      return -1;
    }
    isOkay(true);
    return value;
  };
  const [val, setVal] = useState(validate(inputValue));
  const handleChange = (value: string) => {
    const value_number = validate(value);
    setVal(value_number);
    onChange(value_number);
  };
  return (
    <input
      style={{
        backgroundColor: val === -1 ? "red" : "white",
      }}
      className="square"
      onChange={(e) => {
        handleChange(e.target.value);
      }}
      value={val ? val : ""}
    ></input>
  );
};

type BSquareProps = {
  value: number;
  setValue: (val: number) => void;
};

export const Boolsquare: FunctionComponent<BSquareProps> = ({
  value,
  setValue,
}) => {
  const [innerValue, setInnerValue] = useState(value);

  const getGradientColor = (value: number) => {
    let color = "white";

    return color;
  };
  const getColor = (value: number) => {
    let color = "";
    switch (value) {
      case 0:
        color = "white";
        break;
      case 1:
        color = "black";
        break;
    }
    return color;
  };
  const [color, setColor] = useState(getColor(value));
  const handleClick = () => {
    setInnerValue(innerValue ? 0 : 1);
    setValue(innerValue);
  };
  const handleDoubleClick = () => {
    setInnerValue(-1);
    setValue(innerValue);
  };
  return (
    <input
      className="bool-square"
      style={{
        backgroundColor: getColor(value),
      }}
      defaultValue={value === -1 ? "X" : ""}
      disabled
      // onClick={handleClick}
      //onDoubleClick={handleDoubleClick}
    ></input>
  );
};
