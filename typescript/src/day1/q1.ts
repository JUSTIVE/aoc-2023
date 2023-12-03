import { A, flow, pipe } from "@mobily/ts-belt";
import { problem, sum } from "../utilities";

const processLine = (line: string) =>
  pipe(line.replace(/[^0-9]/g, "").split(""), (x) => x[0] + x.at(-1));

problem(1, flow(A.map(flow(processLine, Number)), sum));
