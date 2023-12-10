import { A, B, F, N, O, S, flow, pipe } from '@mobily/ts-belt';
import { int, problem } from '../utilities';

const parseline = flow(
  S.split(':'),
  A.at(1),
  O.getWithDefault(''),
  S.replaceByRe(/(\s+)/, ' '),
  S.split(' '),
  A.filter(flow(F.equals(''), B.not)),
  A.map(int),
);

const parseInput = (inputs: readonly string[]): readonly [number, number][] => {
  const [time, dist] = A.map(inputs, parseline);
  return A.zip(time ?? [], dist ?? []) as readonly [number, number][];
};

const runBoat = ([time, dist]: [number, number]) =>
  pipe(
    A.range(0, time),
    A.map((velo) => (time - velo) * velo),
    A.filter(N.gt(dist)),
    A.length,
  );

const logic = flow(parseInput, A.map(runBoat), A.reduce(1, N.multiply));

problem(6, logic);
