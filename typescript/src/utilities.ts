import { AR, R, pipe } from "@mobily/ts-belt";

export const compare = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

export const test_ = (input: unknown, expected: unknown) =>
  console.log(compare(input, expected) ? "PASS" : "FAIL");

export const getSource = async (day: number): AR.AsyncResult<string, Error> =>
  pipe(
    R.fromPromise(
      fetch(`https://adventofcode.com/2023/day/${day}/input`, {
        headers: {
          cookie: `session=${process.env.SESSION}`,
        },
      })
    ),
    AR.flatMap((res: Response) => R.fromPromise(res.text())),
    AR.map((res: string) => res.trim())
  );
