import { A, F, S, flow, pipe } from "@mobily/ts-belt";
import fs from "fs";
import { P, match } from "ts-pattern";

const stringParser =
  (fixed: string) =>
  (line: string[]): string =>
    match(line)
      .with([], () => fixed)
      .with(["o", "n", "e", ...P.array(P.string)], () =>
        stringParser(fixed + "1")(line.slice(2))
      )
      .with(["t", "w", "o", ...P.array(P.string)], () =>
        stringParser(fixed + "2")(line.slice(2))
      )
      .with(["t", "h", "r", "e", "e", ...P.array(P.string)], () =>
        stringParser(fixed + "3")(line.slice(4))
      )
      .with(["f", "o", "u", "r", ...P.array(P.string)], () =>
        stringParser(fixed + "4")(line.slice(3))
      )
      .with(["f", "i", "v", "e", ...P.array(P.string)], () =>
        stringParser(fixed + "5")(line.slice(3))
      )
      .with(["s", "i", "x", ...P.array(P.string)], () =>
        stringParser(fixed + "6")(line.slice(3))
      )
      .with(["s", "e", "v", "e", "n", ...P.array(P.string)], () =>
        stringParser(fixed + "7")(line.slice(4))
      )
      .with(["e", "i", "g", "h", "t", ...P.array(P.string)], () =>
        stringParser(fixed + "8")(line.slice(4))
      )
      .with(["n", "i", "n", "e", ...P.array(P.string)], () =>
        stringParser(fixed + "9")(line.slice(3))
      )
      .otherwise(() => stringParser(fixed + line[0])(line.slice(1)));

const processLine = (line: string) =>
  pipe(
    line.split(""),
    stringParser(""),
    (s) => s.replace(/[^0-9]/g, ""),
    S.split(""),
    (arr) => arr[0] + arr[arr.length - 1]
  );

const solve = () => {
  console.log(import.meta.dir);
  const input = fs
    .readFileSync(`${import.meta.dir}/../../../data/day1/q2.txt`)
    .toString()
    .split("\n");
  pipe(
    input,
    A.map(processLine),
    A.map(Number),
    A.reduce(0, (acc, curr) => acc + curr),
    console.log
  );
};

solve();
