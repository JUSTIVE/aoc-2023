import { A, D, S, pipe } from '@mobily/ts-belt';
import { problem_ } from '../utilities';

const getPattern =
  (pattern: string) =>
  (idx: number): 1 | 0 =>
    pattern[idx % pattern.length] === 'R' ? 1 : 0;

const parseLine = (line: string): [string, [string, string]] =>
  pipe(
    line,
    S.split(' = '),
    ([key, value]) =>
      [
        key,
        value?.replaceAll('(', '').replaceAll(')', '')?.split(', ') ?? [
          'ZZZ',
          'ZZZ',
        ],
      ] as [string, [string, string]],
  );

const navigate = (
  tree: Record<string, [string, string]>,
  key: readonly string[],
  // history: ReadonlyArray<ReadonlyArray<string>>,
  depth: number,
  getNext: (x: number) => 1 | 0,
): number => {
  // if (depth %  === 0)
  // console.log(key, depth);
  // pipe(
  //   key,
  //   O.fromPredicate(A.some(S.endsWith('Z'))),
  //   O.tap((x) => console.log(depth, x)),
  // );

  if (A.every(key, S.endsWith('Z'))) return depth;
  return navigate(
    tree,
    pipe(
      key,
      A.map((key) => tree[key]?.[getNext(depth)] ?? ''),
    ),
    // [...history, key],
    depth + 1,
    getNext,
  );
};

const logic = (x: string) => {
  const [patStr, lines] = x.split('\n\n');
  const getNext = getPattern(patStr ?? '');
  const tree = pipe((lines ?? '').split('\n'), A.map(parseLine), D.fromPairs);

  return navigate(
    tree,
    pipe(tree, D.keys, A.filter(S.endsWith('A'))),
    // [],
    0,
    getNext,
  );
};

problem_(8, logic);
