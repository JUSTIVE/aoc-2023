import { A, D, N, O, S, flow, pipe } from '@mobily/ts-belt';
import { problem, sum } from '../utilities';

const parseNumLine = flow(
  S.trim,
  S.replaceAll('  ', ' '),
  S.split(' '),
  A.map(Number),
);
const massageLine = flow(
  S.split(':'),
  A.at(1),
  O.getExn,
  S.split('|'),
  A.map(parseNumLine),
) as (x: string) => [number[], number[]];
const countMatch = ([a, b]: [number[], number[]]) =>
  A.intersection(a, b).length;
const oad1 = flow(O.getWithDefault(0), N.add(1));

const evalCard = (
  state: Record<number, number>,
  cardNum: number,
  matchCount: number,
): Record<number, number> =>
  pipe(
    pipe(matchCount, A.make(cardNum + 1), A.mapWithIndex(N.add)),
    A.reduce(state, (acc, x) =>
      D.update(acc, x, flow(oad1, N.add(state[cardNum] ?? 0))),
    ),
    D.update(cardNum, flow(oad1)),
  );

const logic = flow(
  A.map(flow(massageLine, countMatch)),
  A.mapWithIndex((i, x) => [i + 1, x]),
  A.reduce({}, (acc, [i, x]) => evalCard(acc, i ?? 0, x ?? 1)),
  D.values,
  sum,
);

problem(4, logic);
