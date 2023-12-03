import { A, F, R, S, flow, pipe } from "@mobily/ts-belt";
import fs from "fs";
import { P, match } from "ts-pattern";
import { getSource } from "../utilities";

const stringParser = (fixed: string): string =>
  fixed
    .replaceAll("one", "o1e")
    .replaceAll("two", "t2o")
    .replaceAll("three", "t3e")
    .replaceAll("four", "f4r")
    .replaceAll("five", "f5e")
    .replaceAll("six", "s6x")
    .replaceAll("seven", "s7n")
    .replaceAll("eight", "e8t")
    .replaceAll("nine", "n9e");

const processLine = (line: string) =>
  pipe(
    line,
    stringParser,
    (s) => s.replace(/[^0-9]/g, ""),
    S.split(""),
    (arr) => arr[0] + arr[arr.length - 1]
  );

const solve = async () => {
  const input = await getSource(1);
  pipe(
    input,
    R.tap(
      flow(
        S.split("\n"),
        A.map(processLine),
        A.map(Number),
        A.reduce(0, (acc, curr) => acc + curr),
        console.log
      )
    )
  );
};

solve();
