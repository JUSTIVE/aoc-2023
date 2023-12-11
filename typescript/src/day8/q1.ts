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
  key: string,
  depth: number,
  getNext: (x: number) => number,
): number => {
  if (key === 'ZZZ') return depth;
  return navigate(tree, tree[key]?.[getNext(depth)] ?? '', depth + 1, getNext);
};

const logic = (x: string) => {
  const [patStr, lines] = x.split('\n\n');
  const getNext = getPattern(patStr ?? '');
  const tree = pipe((lines ?? '').split('\n'), A.map(parseLine), D.fromPairs);
  return navigate(tree, 'AAA', 0, getNext);
};

problem_(8, logic);
