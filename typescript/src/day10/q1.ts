import { A, F, O, S, flow, pipe } from '@mobily/ts-belt';
import { P, match } from 'ts-pattern';
import { lineDriver, max, probe, problem } from '../utilities';
import chalk from 'chalk';

type Coord = [number, number];
type Block = {
  coord: Coord;
  value: 'S' | '-' | '|' | 'F' | 'J' | '7' | 'L' | '.';
  dist: number;
};

const baseBlock: Block = {
  coord: [0, 0],
  value: '.',
  dist: -1,
};
type Map = readonly (readonly Block[])[];

const updateDist = (map: Map, [x, y]: Coord, value: number): Map =>
  A.updateAt(map, y, (row) =>
    A.updateAt(row, x, (cell) => ({ ...cell, dist: value })),
  );

const findStart = (map: readonly (readonly Block[])[]): Coord =>
  pipe(
    map,
    A.flat,
    A.filter((x) => x.value === 'S'),
    A.head,
    O.getExn,
    (x) => x.coord,
  );

const blockAt =
  (map: Map) =>
  ([x, y]: Coord): Block =>
    pipe(map, A.at(y), O.flatMap(A.at(x)), O.getWithDefault(baseBlock));

const valueAt = (map: Map) =>
  F.memoize(([x, y]: Coord): Block['value'] =>
    pipe(blockAt(map)([x, y]), ({ value }) => value),
  );

const distAt =
  (map: Map) =>
  ([x, y]: Coord): number =>
    pipe(blockAt(map)([x, y]), ({ dist }) => dist);

const getNextBlock = (
  { value, coord: [x, y] }: Block,
  map: Map,
): readonly Block[] => {
  const right = match(valueAt(map)([x + 1, y]))
    .returnType<O.Option<Coord>>()
    .with(P.union('-', '7', 'J'), F.always([x + 1, y]))
    .otherwise(F.always(O.None));
  const left = match(valueAt(map)([x - 1, y]))
    .returnType<O.Option<Coord>>()
    .with(P.union('-', 'L', 'F'), F.always([x - 1, y]))
    .otherwise(F.always(O.None));
  const down = match(valueAt(map)([x, y + 1]))
    .returnType<O.Option<Coord>>()
    .with(P.union('|', 'J', 'L'), F.always([x, y + 1]))
    .otherwise(F.always(O.None));
  const up = match(valueAt(map)([x, y - 1]))
    .returnType<O.Option<Coord>>()
    .with(P.union('|', '7', 'F'), F.always([x, y - 1]))
    .otherwise(F.always(O.None));
  return pipe(
    match(value)
      .returnType<readonly O.Option<Coord>[]>()
      .with('S', () => [up, down, left, right])
      .with('-', () => [left, right])
      .with('|', () => [up, down])
      .with('F', () => [right, down])
      .with('J', () => [left, up])
      .with('7', () => [left, down])
      .with('L', () => [up, right])
      .otherwise(F.always([])),
    A.filterMap(F.identity),
    A.filter(
      ([x, y]) =>
        x >= 0 && x < (map[0]?.length ?? 0) && y >= 0 && y < map.length,
    ),
    A.map(blockAt(map)),
    A.filter(({ dist, value }) => dist === -1 || value === '.'),
  );
};

const parseLine = (line: string, y: number): readonly Block[] =>
  pipe(
    line,
    S.split(''),
    A.mapWithIndex(
      (x, value) =>
        ({
          coord: [x, y],
          value: value as any,
          dist: -1,
        }) as Block,
    ),
  );

const parse = A.mapWithIndex<string, readonly Block[]>((y, line) =>
  parseLine(line, y),
);

function numberToRainbowColor(number: number): {
  r: number;
  g: number;
  b: number;
} {
  // Constants to adjust the frequency of the colors
  const frequency = 0.0005;

  // Use sine function to calculate RGB components
  // Adjusting the phase for each to create a rainbow effect
  let r = Math.sin(frequency * number + 0) * 127 + 128;
  let g = Math.sin(frequency * number + 2) * 127 + 128;
  let b = Math.sin(frequency * number + 4) * 127 + 128;

  // Normalize the values to the range [0, 255]
  r = Math.floor(r);
  g = Math.floor(g);
  b = Math.floor(b);

  return { r, g, b };
}
const printMap = (map: Map): void =>
  pipe(
    map,
    // F.tap(console.clear),
    F.tap(() => process.stdout.cursorTo(0, 0)),
    A.map((row) =>
      row
        // .map(({ dist }) => `${dist}`.padStart(2, ' '))
        .map(({ dist, value }) => {
          const { r, g, b } = numberToRainbowColor(dist);

          return dist === -1
            ? ' '
            : chalk.rgb(
                r,
                g,
                b,
              )(
                value
                  .replaceAll('7', '┓')
                  .replaceAll('L', '┗')
                  .replaceAll('J', '┛')
                  .replaceAll('F', '┏')
                  .replaceAll('|', '┃')
                  .replaceAll('-', '━'),
              );
        })
        .map((x) => chalk.green(x))
        .join(''),
    ),
    A.join('\n'),

    console.log,
  );

const joinMap = (map: Map, map2: Map): Map => {
  return pipe(
    map,
    A.zip(map2),
    A.map(([row, row2]) =>
      pipe(
        A.zip(row, row2),
        A.map(([block1, block2]) => ({
          ...block1,
          dist: match([block1.dist, block2.dist])
            .with([-1, -1], F.always(-1))
            .with([-1, P.number], ([, b]) => b)
            .with([P.number, -1], ([a]) => a)
            .with([P.number, P.number], ([a, b]) => Math.min(a, b))
            .exhaustive(),
        })),
      ),
    ),
  );
};

const joinTransaction = (map: Map, { coord, dist }: Block): Map => {
  const prev = distAt(map)(coord);
  return updateDist(map, coord, prev === -1 ? dist : Math.min(prev, dist));
};

const walk = (
  map: Map,
  candidates: (readonly Block[])[],
  depth: number,
): Map => {
  printMap(map);

  if (A.isEmpty(candidates)) return map;
  const updatedMap = pipe(
    candidates[0] ?? [],
    // A.reduce(map, joinTransaction),
    A.map((block) => updateDist(map, block.coord, depth)),
    A.reduce(map, joinMap),
  );
  const nextSteps = pipe(
    candidates[0] ?? [],
    A.flatMap((block) => getNextBlock(block, updatedMap)),
  );

  const nextCandidates = A.isNotEmpty(nextSteps)
    ? [nextSteps, ...candidates.slice(1)]
    : candidates.slice(1);
  // return walk(updatedMap, nextCandidates, depth + 1);
  return walk(updatedMap, nextCandidates, depth + 1);
};

const logic = flow(parse, (map) => {
  const start = pipe(map, findStart, blockAt(map));

  return pipe(
    walk(map, [[start]], 0),
    F.tap(printMap),
    A.flat,
    A.map(({ dist }) => dist),
    A.reduce(-1, max),
  );
});

const ip = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`;

// lineDriver(ip, logic);
problem(10, logic);
