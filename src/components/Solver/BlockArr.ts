import Square from "./square";
import orientation from "./eOrientation";
import Block from "./Block";
import squareValue from "./eSquareValue";
import subBlock from "./SubBlock";

class block_arr {
  index: number;
  lengths: number[];
  blocks: Block[];
  squares: Square[];
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
    console.log(" ");
    return newRight;
  }
  DeleteBlocks(block: Block, index: number) {
    let Finished = false;
    block.XAround.forEach((i) => {
      Finished = true;
      if (this.squares[i]) {
        this.squares[i].X();
        console.log(block, this.squares[i], "XXXXXXX");
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
    //  this.changeBorder();
  }
}
export class blockRowArr extends block_arr {
  constructor(
    index: number,
    row: Square[],
    orient: orientation,
    matrix: number[][]
  ) {
    super(index, orient);
    this.squares = row;
    this.lengths = matrix[index].filter((n) => n !== 0);
    this.lengths.map((b) => {
      this.blocks.push(new Block(b, orientation.row));
    });
  }
  append(index: number, s: Square) {
    let i = 0;
    while (this.blocks[index].block[i].col < s.col) i++;
    this.blocks[index].block.splice(i, 0, s);
    s.black();
  }
}

export class blockColArr extends block_arr {
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
  pushSquare(s: Square) {
    this.squares.push(s);
  }
  pushBlockLength(n: number) {
    this.lengths.push(n);
  }
}
