import { A, S, flow } from "@mobily/ts-belt";
import { problem, sum } from "../utilities";

const stringParser = flow(
  S.replaceAll("one", "o1e"),
  S.replaceAll("two", "t2o"),
  S.replaceAll("three", "t3e"),
  S.replaceAll("four", "f4r"),
  S.replaceAll("five", "f5e"),
  S.replaceAll("six", "s6x"),
  S.replaceAll("seven", "s7n"),
  S.replaceAll("eight", "e8t"),
  S.replaceAll("nine", "n9e")
);

const processLine = flow(
  stringParser,
  (s) => s.replace(/[^0-9]/g, ""),
  S.split(""),
  (x) => x[0] + x.at(-1)
);

problem(1, flow(A.map(flow(processLine, Number)), sum));
