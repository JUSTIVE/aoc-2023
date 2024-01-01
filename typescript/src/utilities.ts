import { A, AR, F, R, S, pipe } from '@mobily/ts-belt';

export const compare = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

export const test_ = (input: unknown, expected: unknown) =>
  console.log(compare(input, expected) ? 'PASS' : 'FAIL');

export const getSource = async (day: number): Promise<string> =>
  pipe(
    R.fromPromise(
      fetch(`https://adventofcode.com/2023/day/${day}/input`, {
        headers: {
          cookie: `session=${process.env.SESSION}`,
        },
      }),
    ),
    AR.flatMap((res: Response) => R.fromPromise(res.text())),
    AR.map((res: string) => res.trim()),
    AR.getWithDefault(''),
  );

export const sum = A.reduce<number, number>(0, (acc, curr) => acc + curr);

export const problem = async (
  day: number,
  logic: (lines: readonly string[]) => string | number,
) => lineDriver(await getSource(day), logic);

export const problem_ = async (
  day: number,
  logic: (lines: string) => string | number,
) => driver(await getSource(day), logic);

export const probe = <T>(x: T) => F.tap<T>((x) => console.log(x))(x);

export const int = (x: string) => parseInt(x);

export const lineDriver = (
  input: string,
  logic: (lines: readonly string[]) => string | number,
) => pipe(input, S.split('\n'), logic, console.log);

export const driver = (
  input: string,
  logic: (lines: string) => string | number,
) => pipe(input, logic, console.log);

export const max = (a: number, b: number) => Math.max(a, b);

export const rotateMatrix = (matrix: readonly string[]): readonly string[] => {
  const rotatedMatrix = [];
  for (let i = 0; i < matrix.length; i++) {
    let row = '';
    for (let j = 0; j < matrix.length; j++) {
      row += (matrix[j] ?? '')[i];
    }
    rotatedMatrix.push(row);
  }
  return rotatedMatrix;
};
