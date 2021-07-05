import { blockColArr, blockRowArr } from "./BlockArr";
import Block from "./Block";
import orientation from "./eOrientation";
import squareValue from "./eSquareValue";

class Square {
  value: number;
  row: number;
  col: number;
  rowBlock: blockRowArr;
  colBlock: blockColArr;
  myBlocks: Block[];
  constructor(
    row: number,
    col: number,
    rowBlock: blockRowArr,
    colBlock: blockColArr
  ) {
    this.row = row;
    this.col = col;
    this.rowBlock = rowBlock;
    this.colBlock = colBlock;
    this.value = 0;
    this.myBlocks = [];
  }

  myOrientedBlocks(orient: orientation) {
    return this.myBlocks.filter((block) => block.orient === orient);
  }
  IsLoyalSquare(orient: orientation) {
    return this.myOrientedBlocks(orient).length === 1;
  }
  color(value: squareValue) {
    this.value = value;
  }
  black() {
    this.value = squareValue.black;
  }
  white() {
    this.value = squareValue.white;
  }
  X() {
    this.value = squareValue.X;
  }
}
export default Square;
