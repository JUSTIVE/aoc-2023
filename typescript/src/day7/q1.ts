import { A, D, N, O, S, flow } from '@mobily/ts-belt';
import { int, problem, sum } from '../utilities';
import { match } from 'ts-pattern';

const massage = flow(
  S.replaceAll('A', 'E'),
  S.replaceAll('K', 'D'),
  S.replaceAll('Q', 'C'),
  S.replaceAll('J', 'B'),
  S.replaceAll('T', 'A'),
);

type Player = {
  hand: string;
  bid: number;
  level: number;
};

const parseline = flow(S.split(' '), ([x, y]) => ({
  hand: massage(x ?? ''),
  bid: int(y ?? ''),
  level: evalHand(x ?? ''),
}));

const countSet = flow(
  S.split(''),
  A.reduce({} as Record<string, number>, (acc, x) =>
    D.update(acc, x, flow(O.getWithDefault(0), N.succ)),
  ),
  D.values,
  A.sort(N.subtract),
  A.reverse,
);

const evalHand = flow(countSet, (x) =>
  match(x)
    .with([5], () => 6)
    .with([4, 1], () => 5)
    .with([3, 2], () => 4)
    .with([3, 1, 1], () => 3)
    .with([2, 2, 1], () => 2)
    .with([2, 1, 1, 1], () => 1)
    .otherwise(() => 0),
);

const determineWinner = (
  { hand: hand1, level: level1 }: Player,
  { hand: hand2, level: level2 }: Player,
): number =>
  level1 === level2
    ? hand1 > hand2
      ? 1
      : hand1 < hand2
        ? -1
        : 1
    : level1 - level2;

const logic = flow(
  A.map(parseline),
  A.sort(determineWinner),
  A.mapWithIndex((i, { bid }) => (i + 1) * bid),
  sum,
);

problem(7, logic);
