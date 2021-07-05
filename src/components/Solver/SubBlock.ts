import Square from "./square";
import orientation from "./eOrientation";

class subBlock {
  length: number;
  block: Square[];
  orient: orientation;

  constructor(orient: orientation) {
    this.length = 0;
    this.block = [];
    this.orient = orient;
  }
  IsSubBlockClosed() {
    let isIt = this.block.every((Square) =>
      Square.myOrientedBlocks(this.orient).every(
        (block) => block.logical_length === this.length
      )
    );

    this.block.map((s) => console.log(s, s.myOrientedBlocks(this.orient)));
    console.log(this, isIt, "SubClosed");
    return isIt;
  }
  IsSquaresLoyal() {
    return (
      this.block.some((Square) => Square.IsLoyalSquare(this.orient)) &&
      this.block.length !== 0
    );
  }
  push(Square: Square) {
    if (
      this.block.find((s) => Square.row === s.row && Square.col === s.col) ===
      undefined
    ) {
      this.block.push(Square);
      this.length++;
    }
  }
  pop() {
    this.block.pop();
    this.length--;
  }
  unshift(Square: Square) {
    this.block.unshift(Square);
    this.length++;
  }
  clear() {
    this.block = [];
    this.length = 0;
  }
  GetActualStartAndEnd() {
    let start, end;
    if (this.length === 0) {
      return { start: Number.MAX_SAFE_INTEGER, end: -Number.MAX_SAFE_INTEGER };
    }
    if (this.orient === orientation.row) {
      start = this.block[0].col;
      end = this.block[this.block.length - 1].col;
    } else {
      start = this.block[0].row;
      end = this.block[this.block.length - 1].row;
    }
    return { start: start, end: end };
  }
}

export default subBlock;
