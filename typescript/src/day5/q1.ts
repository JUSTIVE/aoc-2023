import { A, F, N, O, R, S, flow, pipe } from '@mobily/ts-belt';
import { int, problem_ } from '../utilities';

const parseLine = flow(S.split(' '), A.take(3), A.map(int)) as (
  a: string,
) => [number, number, number];
const parseSeed = flow(
  S.split(':'),
  A.at(1),
  O.getWithDefault(''),
  S.trim,
  S.split(' '),
  A.map(int),
);

const applyMap =
  ([out_, in_, range]: [number, number, number]) =>
  (value: number) =>
    value >= in_ && value < in_ + range
      ? R.Error(out_ + value - in_)
      : R.Ok(value);

const applyChunk =
  (chunk: readonly [number, number, number][]) => (value: number) =>
    pipe(
      chunk,
      A.map(applyMap),
      A.reduce<
        (a: number) => R.Result<number, number>,
        R.Result<number, number>
      >(R.Ok(value), (acc, x) => R.flatMap(acc, x)),
      R.handleError(F.identity),
      R.getExn,
    );

const logic = flow(S.split('\n\n'), ([seed, ...chunk]) => {
  const chunk_ = (value: number) =>
    pipe(
      A.map(
        chunk,
        flow(S.split('\n'), A.sliceToEnd(1), A.map(parseLine), applyChunk),
      ),
      A.reduce(value, (acc, x) => x(acc)),
    );
  return pipe(
    parseSeed(seed ?? ''),
    A.map(chunk_),
    A.sort(N.subtract),
    A.head,
    O.getExn,
  );
});

problem_(5, logic);
