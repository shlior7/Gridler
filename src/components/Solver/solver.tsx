import React from "react";
let LinkedList = require("linked-list");

type Point = {
  row: number;
  col: number;
};
type solverProps = {
  connect: (row: number[]) => void;
};
export const solver = (): solverProps => {
  return {
    connect: () => {},
  };
};
