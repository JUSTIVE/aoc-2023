import { A, S, pipe } from "@mobily/ts-belt";
import fs from "fs";

const processLine = (line: string) =>
  pipe(
    line.replace(/[^0-9]/g, ""),
    S.split(""),
    (arr) => arr[0] + arr[arr.length - 1]
  );

const solve = () => {
  console.log(import.meta.dir);
  const input = fs
    .readFileSync(`${import.meta.dir}/../../../data/day1/q1.txt`)
    .toString()
    .split("\n");
  pipe(
    input,
    A.map(processLine),
    A.map(Number),
    A.tap(console.log),
    A.reduce(0, (acc, curr) => acc + curr),
    console.log
  );
};

solve();
