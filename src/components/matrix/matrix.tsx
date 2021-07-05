import React, { FunctionComponent, useState } from "react";
import "./square.scss";
import { Numbersquare, Boolsquare } from "./square";
import { square } from "../Griddler/griddler";

type inputMatrixProps = {
  getGrid: (Matrix: number[][]) => void;
  isOkay: (ok: boolean) => void;
  grid: number[][];
  maxValue: number;
};

export const InputMatrix: FunctionComponent<inputMatrixProps> = ({
  getGrid,
  isOkay,
  grid,
  maxValue,
}) => {
  const [numGrid, setnumGrid] = useState(grid);
  const [okGrid, setokGrid] = useState(
    Array.from({ length: grid.length }, () =>
      Array.from({ length: grid[0].length }, () => true)
    )
  );
  const handleOkayness = (ok: boolean, i: number, j: number) => {
    okGrid[i][j] = ok;
    if (okGrid.every((row) => row.every((bools) => bools))) isOkay(true);
    else isOkay(false);
  };
  const handlechange = async (val: number, i: number, j: number) => {
    numGrid[i][j] = val;
    getGrid(numGrid);
  };
  return (
    <div>
      <ul className="grid-dd" key={"input_grid"}>
        {grid.map((row: number[], i) => (
          <ul key={i}>
            {row.map((val: number, j) => (
              <li key={`${i},${j}`}>
                <Numbersquare
                  onChange={(val) => handlechange(val, i, j)}
                  MaxValue={maxValue}
                  isOkay={(ok) => handleOkayness(ok, i, j)}
                  inputValue={grid[i][j] ? grid[i][j].toString() : ""}
                ></Numbersquare>
              </li>
            ))}
          </ul>
        ))}
      </ul>
    </div>
  );
};
type boardMatrixProps = {
  grid: square[][];
  setValue: (row: number, col: number, value: number) => void;
};

export const BoardMatrix: FunctionComponent<boardMatrixProps> = ({
  grid,
  setValue,
}) => {
  return (
    <div>
      <ul className="grid-dd" key={"board_grid"}>
        {grid.map((row: square[], i) => (
          <ul key={i}>
            {row.map((val: square, j) => (
              <li key={`${i},${j}`}>
                <Boolsquare
                  key={`Board:${i},${j}`}
                  value={grid[i][j].value}
                  setValue={(val) => setValue(i, j, val)}
                ></Boolsquare>
              </li>
            ))}
          </ul>
        ))}
      </ul>
    </div>
  );
};
