import { A, N, O, S, flow, pipe } from '@mobily/ts-belt';
import { int, problem } from '../utilities';

const parseline = flow(
  S.split(':'),
  A.at(1),
  O.getWithDefault(''),
  S.trim,
  S.replaceByRe(/\s+/g, ''),
  // probe,
  int,
);

const parseInput = (inputs: readonly string[]): [number, number] =>
  A.map(inputs, parseline) as [number, number];

const runBoat = ([time, dist]: [number, number]) =>
  pipe(
    A.range(0, time),
    A.map((velo) => (time - velo) * velo),
    A.filter(N.gt(dist)),
    A.length,
  );

const logic = flow(parseInput, runBoat);

problem(6, logic);
