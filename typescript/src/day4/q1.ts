import { A, N, O, S, flow } from "@mobily/ts-belt";
import { problem, sum } from "../utilities";

const powOf2 = (x: number) => Math.pow(2, x);
const parseNumLine = flow(
  S.trim,
  S.replaceAll("  ", " "),
  S.split(" "),
  A.map(Number)
);
const massageLine = flow(
  S.split(":"),
  A.at(1),
  O.getExn,
  S.split("|"),
  A.take(2),
  A.map(parseNumLine)
) as (x: string) => [number[], number[]];
const countMatch = ([a, b]: [number[], number[]]) => A.intersection(a, b);

const logic = flow(
  A.map(flow(massageLine, countMatch)),
  A.filter(A.isNotEmpty),
  A.map(flow(A.length, N.subtract(1), powOf2)),
  sum
);

problem(4, logic);
