import { A, F, R, S, flow, pipe } from "@mobily/ts-belt";
import { getSource } from "../utilities";

const processLine = (line: string) =>
  pipe(
    line.replace(/[^0-9]/g, ""),
    S.split(""),
    (arr) => arr[0] + arr[arr.length - 1]
  );

const solve = async () => {
  const input = await getSource(1);
  pipe(
    input,
    R.map(
      flow(
        F.tap(console.log),
        S.split("\n"),
        A.map(processLine),
        A.map(Number),
        A.tap(console.log),
        A.reduce(0, (acc, curr) => acc + curr),
        console.log
      )
    )
  );
};

solve();
