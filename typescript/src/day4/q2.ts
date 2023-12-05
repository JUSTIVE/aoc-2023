import { A, D, F, N, O, S, flow, pipe } from '@mobily/ts-belt'
import { problem, sum } from '../utilities'

const parseNumLine = flow(
  S.trim,
  S.replaceAll('  ', ' '),
  S.split(' '),
  A.map(Number)
)
const massageLine = flow(
  S.split(':'),
  A.at(1),
  O.getExn,
  S.split('|'),
  A.take(2),
  A.map(parseNumLine)
) as (x: string) => [number[], number[]]
const countMatch = ([a, b]: [number[], number[]]) =>
  pipe(
    a,
    A.filter((x) => A.some(b, F.equals(x))),
    A.length
  )

const evalCard = (
  state: Record<number, number>,
  cardNum: number,
  matchCount: number
): Record<number, number> =>
  pipe(
    pipe(matchCount, A.make(cardNum + 1), A.mapWithIndex(N.add)),
    A.reduce(state, (acc, x) =>
      pipe(
        acc,
        D.set(
          x,
          pipe(
            acc,
            D.get(x),
            O.getWithDefault(0),
            N.add((state[`${cardNum}`] ?? 0) + 1)
          )
        )
      )
    ),
    (acc) =>
      D.set(
        acc,
        cardNum,
        pipe(acc, D.get(cardNum), O.getWithDefault(0), N.add(1))
      )
  )

const logic = flow(
  A.map(flow(massageLine, countMatch)),
  A.mapWithIndex((i, x) => [i + 1, x]),
  A.reduce({}, (acc, [i, x]) => evalCard(acc, i, x)),
  D.values,
  sum
)

problem(4, logic)
