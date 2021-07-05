import { blockColArr, blockRowArr } from "./BlockArr";
import orientation from "./eOrientation";
import squareValue from "./eSquareValue";
import Square from "./square";

class MainGrid {
  cols_number: number;
  row_number: number;
  grid: Square[][];
  rows: blockRowArr[];
  cols: blockColArr[];

  constructor(left: number[][], up: number[][]) {
    this.grid = [];
    this.rows = [];
    this.cols = [];
    this.row_number = left.length;
    this.cols_number = up[0].length;

    for (let i = 0; i < this.row_number; i++) {
      this.grid.push([]);
      this.rows[i] = new blockRowArr(i, this.grid[i], orientation.row, left);
      for (let j = 0; j < this.cols_number; j++) {
        if (!i) this.cols[j] = new blockColArr(up, j, orientation.col); //for every col in the first row create a colBlockArr
        this.grid[i].push(new Square(i, j, this.rows[i], this.cols[j]));
        this.cols[j].pushSquare(this.grid[i][j]);
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
      i < 10 &&
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
export default MainGrid;
