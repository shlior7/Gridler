import React, { FunctionComponent, useState } from "react";
import { BoardMatrix, InputMatrix } from "../matrix/matrix";
import MainGrid from "../Solver/MainGridd";
import "./griddler.scss";
type GriddlerProps = {
  rows: number;
  cols: number;
  save: (name: string, left: number[][], up: number[][]) => void;
  reload: Function;
};

export const Griddler: FunctionComponent<GriddlerProps> = ({
  rows,
  cols,
  save,
  reload,
}) => {
  //const [name, setName] = useState("");
  const [leftGrid, setleftGrid] = useState([
    [0, 0, 1, 1, 1, 1],
    [0, 0, 2, 2, 2, 2],
    [2, 2, 1, 1, 2, 2],
    [0, 0, 4, 1, 1, 4],
    [0, 0, 0, 0, 4, 4],
    [0, 0, 0, 0, 2, 5],
    [0, 0, 0, 0, 0, 6],
    [0, 0, 0, 1, 1, 4],
    [0, 0, 0, 0, 0, 10],
    [0, 0, 0, 0, 0, 12],
    [0, 0, 0, 0, 7, 6],
    [0, 0, 0, 1, 2, 6],
    [0, 0, 0, 0, 4, 6],
    [0, 0, 0, 0, 3, 6],
    [0, 0, 0, 0, 0, 6],
  ]);
  const [upGrid, setUpGrid] = useState([
    [0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 2, 6, 5, 1, 2, 2, 2, 0, 0, 5, 2, 3, 3],
    [3, 3, 2, 6, 7, 3, 6, 3, 5, 11, 14, 8, 7, 6, 5],
  ]);

  //const [okInput, setokInput] = useState(true);
  let okInput = true;
  let name = "";
  /* if (leftGrid.length !== rows) {
    console.log("rerender rows");
    setleftGrid(
      Array.from({ length: rows }, () => Array.from({ length: 5 }, () => 0))
    );
  }
  if (upGrid[0].length !== cols) {
    console.log("rerender cols");
    setUpGrid(
      Array.from({ length: 6 }, () => Array.from({ length: cols }, () => 0))
    );
  }*/
  console.log(okInput);
  let solveGrid: MainGrid = new MainGrid(leftGrid, upGrid);

  const createGrid = () => {
    console.log(okInput);
    if (okInput) {
      //  solveGrid = new MainGridd(leftGrid, upGrid);
      // solveGrid.solve();
      console.log(solveGrid);
      //reload();
    }
  };
  const saveGrid = () => {
    if (okInput) {
      save(name, leftGrid, upGrid);
      reload();
    }
  };
  return (
    <div className="grid-container">
      <div className="buttons">
        <button className="submit_button" onClick={createGrid}>
          Solve
        </button>
        <input
          className="name_input"
          placeholder="Name"
          onChange={(e) => (name = e.target.value)}
        ></input>
        <button className="save_button" onClick={() => saveGrid()}>
          Save
        </button>
      </div>
      <div className="left">
        <InputMatrix
          getGrid={(matrix: number[][]) => setleftGrid(matrix)}
          grid={leftGrid}
          maxValue={upGrid[0].length}
          isOkay={(ok) => (okInput = ok)}
        ></InputMatrix>
      </div>
      <div className="up">
        <InputMatrix
          getGrid={(matrix: number[][]) => setUpGrid(matrix)}
          grid={upGrid}
          maxValue={leftGrid.length}
          isOkay={(ok) => (okInput = ok)}
        ></InputMatrix>
      </div>
      <div className="main">
        <BoardMatrix
          grid={solveGrid.grid}
          setValue={(i, j, value) => (solveGrid.grid[i][j].value = value)}
        ></BoardMatrix>
      </div>
    </div>
  );
};

enum squareValue {
  blue = 2,
  black = 1,
  white = 0,
  X = -1,
  green = 3,
  purple = 4,
}
export class square {
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
export enum orientation {
  row = 0,
  col = 1,
}
class subBlock {
  length: number;
  block: square[];
  orient: orientation;

  constructor(orient: orientation) {
    this.length = 0;
    this.block = [];
    this.orient = orient;
  }
  IsSubBlockClosed() {
    let isIt = this.block.every((square) =>
      square
        .myOrientedBlocks(this.orient)
        .every((block) => block.logical_length === this.length)
    );

    this.block.map((s) => console.log(s, s.myOrientedBlocks(this.orient)));
    console.log(this, isIt, "SubClosed");
    return isIt;
  }
  IsSquaresLoyal() {
    return (
      this.block.some((square) => square.IsLoyalSquare(this.orient)) &&
      this.block.length !== 0
    );
  }
  push(square: square) {
    if (
      this.block.find((s) => square.row === s.row && square.col === s.col) ===
      undefined
    ) {
      this.block.push(square);
      this.length++;
    }
  }
  unshift(square: square) {
    this.block.unshift(square);
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

class Block {
  readonly logical_length: number;
  offset: number;
  block: square[];
  left_border: number;
  right_border: number;
  orient: orientation;
  XAround: number[];
  mySubBlock: subBlock;
  constructor(logical_length: number, orient: orientation) {
    this.logical_length = logical_length;
    this.left_border = 0;
    this.right_border = this.logical_length;
    this.block = [];
    this.orient = orient;
    this.offset = 0;
    this.XAround = [];
    this.mySubBlock = new subBlock(this.orient);
  }
  get ph_length() {
    return this.block.length;
  }
  set squareBlock(squares: square[]) {
    this.block = squares;
    if (this.block.length) {
      this.orient === orientation.row
        ? (this.offset = squares[0].col)
        : (this.offset = squares[0].row);
    }
  }
  getPossibleRight() {
    return (
      this.mySubBlock.GetActualStartAndEnd().start + this.logical_length - 1
    );
  }
  getPossibleLeft() {
    return this.mySubBlock.GetActualStartAndEnd().end - this.logical_length + 1;
  }
  deleteBlock(start: number, end: number) {
    for (let i = start - this.offset; i <= end - this.offset; i++) {
      if (i >= 0 && i < this.block.length) {
        if (
          this.block[i].myBlocks.length === 0 &&
          this.block[i].value === squareValue.white
        ) {
          this.block[i].X();
        }
        this.block[i].myBlocks.splice(
          this.block[i].myBlocks.findIndex(
            (block) =>
              block.logical_length === this.logical_length &&
              block.offset === this.offset &&
              block.orient === this.orient
          ),
          1
        );
      }
    }
  }
  gothrough() {
    // let black_block: subBlock = new subBlock(0, this.orient);
    let i = 0;
    while (i < this.block.length) {
      let i_square = this.block[i];
      // console.log("current square in gothrogh ");
      //  console.log(i_square, i);
      switch (i_square.value) {
        case squareValue.black:
          console.log("current square in gothrogh ");
          console.log(i_square, i);
          //  console.log(i_square.myOrientedBlocks(this.orient).length);
          let black_block: subBlock = new subBlock(this.orient);
          this.findBlockAround(i, black_block, squareValue.black);
          if (black_block.IsSubBlockClosed()) {
            let actual = black_block.GetActualStartAndEnd();
            console.log("AAAAA", actual.start, actual.end);
            if (this.block[actual.start - this.offset - 1]) {
              this.block[actual.start - this.offset - 1].X();
            }
            if (this.block[actual.end - this.offset + 1]) {
              this.block[actual.end - this.offset + 1].X();
            }
            console.log(black_block, "400 XXX");
          }
          if (black_block.IsSquaresLoyal()) {
            i = this.ColorAroundSubBlock(black_block);
            this.mySubBlock = black_block;
            //   console.log("i: " + i);
          } else {
            if (black_block.length > this.logical_length) {
              this.deleteBlock(
                black_block.GetActualStartAndEnd().start,
                black_block.GetActualStartAndEnd().end
              );
            }
          }
          //  black_block.clear();
          //   console.log(black_block.length + " length after clear");
          //  X_block.clear();
          break;
        case squareValue.white:
          if (
            this.right_border - this.logical_length - this.offset < i &&
            i < this.left_border + this.logical_length - this.offset
          ) {
            console.log("current square in gothrogh ");
            console.log(i_square, i);
            this.block[i].color((i * this.block.length) / 100);
            console.log(this.block[i], "color B");
          }
          break;
        case squareValue.X:
          break;
      }
      i++;
    }
  }
  findBlockAround(i_Index: number, t_block: subBlock, squareType: squareValue) {
    t_block.push(this.block[i_Index]);
    function blackBlockLeft(i_LeftIndex: number, block: square[]) {
      //console.log("i_LeftIndex: " + i_LeftIndex);
      if (i_LeftIndex < 0 || block[i_LeftIndex].value !== squareType) return;
      t_block.unshift(block[i_LeftIndex]);
      // console.log(t_block.length, t_block.block[0], t_block);
      blackBlockLeft(i_LeftIndex - 1, block);
    }
    function blackBlockRight(i_RightIndex: number, block: square[]): number {
      console.log("i_RightIndex: " + i_RightIndex);
      if (
        i_RightIndex >= block.length ||
        block[i_RightIndex].value !== squareType
      )
        return i_RightIndex - 1;
      t_block.push(block[i_RightIndex]);
      console.log(t_block.length, t_block.block[t_block.length - 1], t_block);
      return blackBlockRight(i_RightIndex + 1, block);
    }
    blackBlockLeft(i_Index - 1, this.block);
    blackBlockRight(i_Index + 1, this.block);
  }

  ColorAroundSubBlock(t_block: subBlock) {
    let ActualBlock = t_block.GetActualStartAndEnd();
    let start = ActualBlock.start - 1;
    let end = ActualBlock.end + 1;

    if (t_block.length > this.logical_length) return end - this.offset;
    // console.log("start,end1: " + start, end);
    while (end < this.left_border + this.logical_length) {
      if (this.block[end - this.offset].value !== squareValue.X) {
        this.block[end - this.offset].color(squareValue.white);
        console.log(this.block[end - this.offset], "color R");
        t_block.push(this.block[end - this.offset]);
      }
      end++;
    }
    while (start > this.right_border - this.logical_length) {
      if (this.block[start - this.offset].value !== squareValue.X) {
        this.block[start - this.offset].black();
        console.log(this.block[start - this.offset], "color L");
        t_block.unshift(this.block[start - this.offset]);
      }
      start--;
    }

    //  console.log("start,end2: " + start, end);
    ActualBlock = t_block.GetActualStartAndEnd();
    start = ActualBlock.start;
    end = ActualBlock.end;
    console.log(this, t_block, ActualBlock);
    console.log("start,end3: " + start, end);
    this.fillBlockWithX(start, end);
    this.SetBorderAroundSubBlock(start, end);
    return end - this.offset;
  }
  fillBlockWithX(start: number, end: number) {
    let i; // = end - this.logical_length - this.offset;
    if (end - start + 1 === this.logical_length) {
      console.log("Yesssss");
      console.log(start, end, this.block, this.left_border, this.right_border);
      this.XAround = [start - 1, end + 1];
    }
    for (i = this.left_border; i <= this.right_border; i++) {
      let i_inBlock = i - this.offset;

      if (i <= end - this.logical_length || i >= start + this.logical_length) {
        if (this.block[i_inBlock].IsLoyalSquare(this.orient)) {
          this.block[i_inBlock].X();
          console.log("XXX");
          console.log(
            i,
            i_inBlock,
            this.left_border,
            this.right_border,
            this.offset,
            this.block[i_inBlock]
          );
        }
      }
      //console.log(i, end, start, this);

      if (end - start + 1 === this.logical_length && i <= end && i >= start) {
        console.log(i, end, start, this);

        console.log(
          i,
          this,
          this.left_border,
          this.right_border,
          this.offset,
          this.block[i_inBlock],
          this.block[i_inBlock].myBlocks.findIndex((block) => block === this)
        );
      }
    }
  }

  SetBorderAroundSubBlock(start: number, end: number) {
    this.deleteBlock(this.left_border, end - this.logical_length);
    this.deleteBlock(start + this.logical_length, this.right_border);
    this.right_border = start + this.logical_length - 1;
    this.left_border = end - this.logical_length + 1;
    this.squareBlock = this.block.slice(
      this.left_border - this.offset,
      this.right_border - this.offset + 1
    );
  }
  SetNewBorders(left: number, right: number) {
    this.deleteBlock(this.left_border, left - 1);
    this.deleteBlock(right + 1, this.right_border);
    this.squareBlock = this.block.slice(
      left - this.offset,
      right - this.offset + 1
    );
    this.right_border = right;
    this.left_border = left;
  }
}
class block_arr {
  index: number;
  lengths: number[];
  blocks: Block[];
  squares: square[];
  orient: orientation;
  constructor(index: number, orient: orientation) {
    this.index = index;
    this.lengths = [];
    this.blocks = [];
    this.squares = [];
    this.orient = orient;
  }
  jumpOverXLeft(i: number, blLeft: Block, index: number) {
    let k = i;
    let XBlock = new subBlock(blLeft.orient);
    while (
      k < this.squares.length - 1 &&
      this.squares[k].value === squareValue.white
    ) {
      k++;
    }
    console.log(k, blLeft, i);
    if (
      k - i < blLeft.logical_length &&
      this.squares[k].value === squareValue.X
    ) {
      blLeft.findBlockAround(k - blLeft.offset, XBlock, squareValue.X);
      let actual = XBlock.GetActualStartAndEnd();
      i = actual.end + 1;

      //blLeft.deleteBlock(blLeft.left_border, actual.end);

      console.log(k, XBlock, actual, i);
    }
    let newLeft = i;
    if (index > 0) {
      newLeft = Math.max(
        i,
        this.blocks[index - 1].left_border +
          this.blocks[index - 1].logical_length +
          1,
        this.blocks[index - 1].mySubBlock.GetActualStartAndEnd().end + 1
      );
    }
    blLeft.deleteBlock(blLeft.left_border, newLeft - 1);
    return newLeft;
  }
  jumpOverXRight(i: number, blRight: Block, index: number) {
    let f = i;
    let XBlock = new subBlock(blRight.orient);
    while (f > 0 && this.squares[f].value === squareValue.white) {
      f--;
    }
    if (
      i - f < blRight.logical_length &&
      this.squares[f].value === squareValue.X
    ) {
      blRight.findBlockAround(f - blRight.offset, XBlock, squareValue.X);
      let actual = XBlock.GetActualStartAndEnd();
      console.log(f, XBlock, actual, i);
      i = actual.start - 1;
      // blRight.deleteBlock(actual.start, blRight.right_border);
    }
    let newRight = i;
    if (index < this.blocks.length - 1) {
      newRight = Math.min(
        i,
        this.blocks[index + 1].right_border -
          this.blocks[index + 1].logical_length -
          1,
        this.blocks[index + 1].mySubBlock.GetActualStartAndEnd().start - 1
      );
    }
    blRight.deleteBlock(newRight + 1, blRight.right_border);
    return newRight;
  }
  DeleteBlocks(block: Block, index: number) {
    let Finished = false;
    block.XAround.forEach((i) => {
      Finished = true;
      if (this.squares[i]) {
        this.squares[i].X();
        console.log(block, this.squares[i], "640 XXX");
      }
    });
    if (Finished) {
      if (
        this.blocks[index - 1] &&
        this.blocks[index - 1].right_border > block.XAround[0]
      ) {
        this.blocks[index - 1].right_border = block.XAround[0];
      }

      if (
        this.blocks[index + 1] &&
        this.blocks[index + 1].left_border <
          block.XAround[block.XAround.length - 1]
      ) {
        this.blocks[index + 1].left_border =
          block.XAround[block.XAround.length - 1];
      }
      block.deleteBlock(block.left_border, block.right_border);
      this.blocks.splice(index, 1);
    }
    if (this.blocks.length === 0) {
      console.log("fuckkk yeesss");
      this.squares.forEach((s) => {
        if (s.value === squareValue.white) s.X();
      });
    }
  }
  changeBorder() {
    console.log("Change", this);
    this.blocks.map((blLeft, index) => {
      let blRight = this.blocks[this.blocks.length - 1 - index];

      let i = blLeft.left_border;
      let j = blRight.right_border;

      let k = this.jumpOverXLeft(i, blLeft, index);
      let f = this.jumpOverXRight(j, blRight, this.blocks.length - 1 - index);

      /*if (blLeft.getPossibleLeft() > k) {
        k = blLeft.getPossibleLeft();
      }
      if (blRight.getPossibleRight() < f) {
        f = blRight.getPossibleRight();
        if (
          index < this.blocks.length - 1 &&
          this.blocks[index + 1].left_border <= f
        )
          this.blocks[index + 1].left_border = f;
      }*/

      console.log(i, j);
      blLeft.left_border = k;
      blRight.right_border = f;
    });
    this.blocks.map((bl, index) => {
      bl.SetNewBorders(bl.left_border, bl.right_border);

      //console.log("c", bl.left_border, bl.right_border, bl);
      //  bl.squareBlock = this.squares.slice(bl.left_border, bl.right_border + 1);
      // bl.block.forEach((square) => {
      //square.myBlocks.push(bl);
      //   });
    });
  }
  setBorder() {
    let i = 0;
    let j = this.squares.length - 1;
    //console.log(i, j);
    this.blocks.map((blLeft, index) => {
      let blRight = this.blocks[this.blocks.length - 1 - index];
      // console.log("a", i, j, bl);
      blLeft.left_border = i; //including
      blRight.right_border = j;
      i += blLeft.logical_length + 1;
      j -= blRight.logical_length + 1;
      //console.log("b", i, j, bl);
    });
    this.blocks.map((bl) => {
      // console.log("c", bl.left_border, bl.right_border, bl);
      bl.squareBlock = this.squares.slice(bl.left_border, bl.right_border + 1);
      bl.block.forEach((square) => {
        square.myBlocks.push(bl);
      });
    });
  }
  goThrough() {
    this.blocks.forEach((block, index) => {
      block.gothrough();
      this.DeleteBlocks(block, index);
    });
    this.changeBorder();
  }
}
class blockRowArr extends block_arr {
  constructor(
    matrix: number[][],
    index: number,
    row: square[],
    orient: orientation
  ) {
    super(index, orient);
    this.squares = row;
    this.lengths = matrix[index].filter((n) => n !== 0);
    this.lengths.map((b) => {
      this.blocks.push(new Block(b, orientation.row));
    });
  }
  append(index: number, s: square) {
    let i = 0;
    while (this.blocks[index].block[i].col < s.col) i++;
    this.blocks[index].block.splice(i, 0, s);
    s.black();
  }
}

class blockColArr extends block_arr {
  constructor(matrix: number[][], index: number, orient: orientation) {
    super(index, orient);
    let i = matrix.length - 1;
    while (i >= 0 && matrix[i][index]) {
      this.lengths.unshift(matrix[i--][index]);
    }
    this.lengths.map((b) => {
      this.blocks.push(new Block(b, orientation.col));
    });
  }
  pushSquare(s: square) {
    this.squares.push(s);
  }
  pushBlockLength(n: number) {
    this.lengths.push(n);
  }
}

class MainGridd {
  cols_number: number;
  row_number: number;
  grid: square[][];
  rows: blockRowArr[];
  cols: blockColArr[];

  constructor(left: number[][], up: number[][]) {
    this.grid = [];
    this.rows = [];
    this.cols = [];
    this.row_number = left.length;
    this.cols_number = up[0].length;

    for (let i = 0; i < this.row_number; i++) {
      this.rows[i] = new blockRowArr(left, i, this.grid[i], orientation.row);
      for (let j = 0; j < this.cols_number; j++) {
        if (!i) this.cols[j] = new blockColArr(up, j, orientation.col);
        this.grid[i].push(new square(i, j, this.rows[i], this.cols[j]));
        this.cols[j].squares.push(this.grid[i][j]);
        if (i === this.row_number - 1) this.cols[j].setBorder();
      }
      this.rows[i].setBorder();
    }
    try {
      this.solve();
    } catch (error) {
      console.error(error);
    }
  }
  ColorSquare(row: number, col: number) {
    this.grid[row][col].black();
  }
  goThrogh() {
    this.rows.forEach((row) => {
      row.goThrough();
    });
    this.cols.forEach((col) => {
      col.goThrough();
    });
  }
  solve() {
    let i = 0;
    while (
      i < 2 &&
      !this.grid.every((row) =>
        row.every((square) => square.value !== squareValue.white)
      )
    ) {
      i++;
      this.goThrogh();
      console.log("******************************************", i);
    }
  }
}
