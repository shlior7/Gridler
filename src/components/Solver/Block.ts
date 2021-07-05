import Square from "./square";
import orientation from "./eOrientation";
import squareValue from "./eSquareValue";
import subBlock from "./SubBlock";

class Block {
  readonly logical_length: number;
  offset: number;
  block: Square[];
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
  set squareBlock(squares: Square[]) {
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
            /* if (this.block[actual.start - this.offset - 1]) {
              this.block[actual.start - this.offset - 1].X();
            }
            if (this.block[actual.end - this.offset + 1]) {
              this.block[actual.end - this.offset + 1].X();
            }*/
            // console.log(black_block, "400 XXX");
          }
          if (black_block.IsSquaresLoyal()) {
            i = this.ColorAroundSubBlock(black_block);
            this.mySubBlock = black_block;
            //   console.log("i: " + i);
          } else {
            if (black_block.length > this.logical_length) {
              /*this.deleteBlock(
                black_block.GetActualStartAndEnd().start,
                black_block.GetActualStartAndEnd().end
              );*/
            }
          }
          //  black_block.clear();
          //   console.log(black_block.length + " length after clear");
          //  X_block.clear();
          break;
        case squareValue.white:
          console.log("white");
          if (
            this.right_border - this.logical_length - this.offset < i && //overlapping from left and right border
            i < this.left_border + this.logical_length - this.offset
          ) {
            console.log("current square in gothrogh ");
            console.log(i_square, i);
            this.block[i].black();
            console.log(this.block[i], "color B");
          }
          break;
        case squareValue.X:
          break;
      }
      i++;
    }
    console.log("//////End of Block gothrogh/////////");
  }
  ///gets a index and the subBlock and finds the block of squares of the same squareType around it
  findBlockAround(i_Index: number, t_block: subBlock, squareType: squareValue) {
    t_block.push(this.block[i_Index]);
    function blackBlockLeft(i_LeftIndex: number, block: Square[]) {
      //console.log("i_LeftIndex: " + i_LeftIndex);
      if (i_LeftIndex < 0 || block[i_LeftIndex].value !== squareType) return;
      t_block.unshift(block[i_LeftIndex]);
      // console.log(t_block.length, t_block.block[0], t_block);
      blackBlockLeft(i_LeftIndex - 1, block);
    }
    function blackBlockRight(i_RightIndex: number, block: Square[]): number {
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
    console.log(t_block.length, this, start, end, "len,this,start,end");
    if (t_block.length > this.logical_length) return end - this.offset;
    // console.log("start,end1: " + start, end);
    function ColorLeft(FromIndex: number, To: number, Block: Block) {
      if (FromIndex + Block.offset >= To) return true;
      console.log(FromIndex, "fromIndex");
      if (Block.block[FromIndex].value === squareValue.X) return false;
      Block.block[FromIndex].color(squareValue.black);
      t_block.push(Block.block[FromIndex]);
      if (!ColorLeft(FromIndex + 1, To, Block)) {
        Block.block[FromIndex].color(squareValue.white);
        t_block.pop();
        return false;
      }
      return true;
    }
    function ColorRight(FromIndex: number, To: number, Block: Block) {
      if (FromIndex + Block.offset <= To) return true;
      console.log(FromIndex, "fromIndex");
      if (Block.block[FromIndex].value === squareValue.X) return false;
      Block.block[FromIndex].color(squareValue.black);
      t_block.push(Block.block[FromIndex]);
      if (!ColorLeft(FromIndex - 1, To, Block)) {
        Block.block[FromIndex].color(squareValue.white);
        t_block.pop();
        return false;
      }
      return true;
    }
    ColorLeft(end - this.offset, this.left_border + this.logical_length, this);
    ColorRight(
      start - this.offset,
      this.right_border - this.logical_length,
      this
    );
    /*while (end < this.left_border + this.logical_length) {
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
    }*/

    //  console.log("start,end2: " + start, end);
    ActualBlock = t_block.GetActualStartAndEnd();
    start = ActualBlock.start;
    end = ActualBlock.end;
    console.log(this, t_block, ActualBlock);
    console.log("start,end3: " + start, end);
    this.fillBlockWithX(start, end);
    //this.SetBorderAroundSubBlock(start, end);
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

export default Block;
