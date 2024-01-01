import { A, O, S, flow, pipe } from '@mobily/ts-belt';
import { driver, problem_, sum } from '../utilities';
import { P, match } from 'ts-pattern';

export type Matrix = readonly string[];
export const rotateMatrix = (matrix: Matrix): Matrix => {
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

const mirrorPos = (matrix: readonly string[]): number => {
  return pipe(
    matrix,
    A.mapWithIndex((i, row): [number, readonly number[]] => {
      const finds: readonly number[] = pipe(
        matrix,
        A.mapWithIndex<string, [number, string]>((j, row_) => [j, row_]),
        A.filter<[number, string]>(([, row_]) => row === row_),
        A.map(([j]) => j),
      );
      return [i, finds];
    }),
    A.sort(([, finds]) =>
      match(finds)
        .with([P.number], () => 999)
        .with([P.number, P.number], ([first, last]) => last - first)
        .otherwise(() => 999),
    ),
    A.head,
    O.getExn,
    ([idx, [first, last]]) => {
      if ((last ?? 0) - (first ?? 0) === 1) return idx + 1;
      return idx;
    },
  );
};

const solveSingleCase = (input: readonly string[]): number => {
  const originalMirrorPos = mirrorPos(input);
  const crossAxisMirrorPos = pipe(input, rotateMatrix, mirrorPos);

  return originalMirrorPos * 100 + crossAxisMirrorPos;
};

const logic = flow(
  S.split('\n\n'),
  A.map(flow(S.split('\n'), solveSingleCase)),
  sum,
);
const ip = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.`;

driver(ip, logic);

// problem_(11, logic);
