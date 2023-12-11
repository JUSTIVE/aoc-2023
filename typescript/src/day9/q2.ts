import { A, F, S, flow, pipe } from '@mobily/ts-belt';
import { int, problem, sum } from '../utilities';

const allDiffZero = flow(A.every(F.equals(0)));
const genDiffArr = (arr: readonly number[]): readonly number[] =>
  A.mapWithIndex(arr, (i, x) => x - (arr[i - 1] ?? 0)).slice(1);

const genDiffMap = (state: (readonly number[])[]): (readonly number[])[] =>
  allDiffZero(state[0] ?? [0])
    ? state
    : genDiffMap([genDiffArr(state[0] ?? [0]), ...state]);

const genNewNum = (arr: (readonly number[])[]): number => {
  const newNumber = (arr.at(1)?.at(0) ?? 0) - (arr.at(0)?.at(0) ?? 0);
  return arr.length === 2
    ? newNumber
    : genNewNum([[newNumber, ...(arr[1] ?? [])], ...arr.slice(2)]);
};

const genMirage = (arr: readonly number[]): number =>
  pipe([arr], genDiffMap, genNewNum);

const logic = flow(
  A.map(flow(S.split(' '), A.map(int))),
  A.map(genMirage),
  sum,
);

problem(9, logic);
