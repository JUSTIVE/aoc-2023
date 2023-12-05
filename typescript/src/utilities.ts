import { A, AR, F, R, S, pipe } from '@mobily/ts-belt'

export const compare = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b)

export const test_ = (input: unknown, expected: unknown) =>
  console.log(compare(input, expected) ? 'PASS' : 'FAIL')

export const getSource = async (day: number): Promise<string> =>
  pipe(
    R.fromPromise(
      fetch(`https://adventofcode.com/2023/day/${day}/input`, {
        headers: {
          cookie: `session=${process.env.SESSION}`
        }
      })
    ),
    AR.flatMap((res: Response) => R.fromPromise(res.text())),
    AR.map((res: string) => res.trim()),
    AR.getWithDefault('')
  )

export const getSourceLines = async (day: number): Promise<readonly string[]> =>
  pipe(await getSource(day), S.split('\n'))

export const sum = A.reduce<number, number>(0, (acc, curr) => acc + curr)

export const problem = async (
  day: number,
  logic: (lines: readonly string[]) => string | number
) => pipe(await getSourceLines(day), logic, console.log)

export const probe = <T>(x: T) => F.tap<T>((x) => console.log(x))(x)
