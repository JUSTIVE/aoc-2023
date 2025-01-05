import { A, F, O, flow, pipe } from '@mobily/ts-belt';
import { max, problem } from '../utilities';
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
type Map = Block[][];

const updateDist = (map: Map, [x, y]: Coord, value: number): Map => {
  map[y] =
    map[y]?.map((row, i) => {
      if (i === x) {
        return {
          ...row,
          dist: value,
        };
      }
      return row;
    }) ?? [];
  return map;
};

const findStart = (map: Block[][]): Coord =>
  map
    .flat()
    .filter((x) => x.value === 'S')
    .at(0)?.coord ?? [0, 0];

const blockAt = (map: Map, [x, y]: Coord) => map.at(y)?.at(x) ?? baseBlock;

const valueAt = (map: Map, [x, y]: Coord) =>
  pipe(blockAt(map, [x, y]), ({ value }) => value);

const getNextBlock = (
  { value, coord: [x, y] }: Block,
  map: Map,
): readonly Block[] => {
  let right: O.Option<Coord> = undefined;
  switch (valueAt(map, [x + 1, y])) {
    case '-':
    case '7':
    case 'J':
      right = [x + 1, y] as Coord;
      break;
  }

  let left: O.Option<Coord> = undefined;
  switch (valueAt(map, [x - 1, y])) {
    case '-':
    case 'L':
    case 'F':
      left = [x - 1, y] as Coord;
      break;
  }

  let down: O.Option<Coord> = undefined;
  switch (valueAt(map, [x, y + 1])) {
    case '|':
    case 'J':
    case 'L':
      down = [x, y + 1] as Coord;
      break;
  }

  let up: O.Option<Coord> = undefined;
  switch (valueAt(map, [x, y - 1])) {
    case '|':
    case '7':
    case 'F':
      up = [x, y - 1] as Coord;
      break;
  }

  let next: (Coord | undefined)[] = [];
  switch (value) {
    case 'S':
      next = [up, down, left, right];
      break;
    case '-':
      next = [left, right];
      break;
    case '|':
      next = [up, down];
      break;
    case 'F':
      next = [right, down];
      break;
    case 'J':
      next = [left, up];
      break;
    case '7':
      next = [left, down];
      break;
    case 'L':
      next = [up, right];
      break;
  }

  return next
    .filter((x) => x !== undefined)
    .map((x) => blockAt(map, x))
    .filter(({ dist }) => dist === -1);
};

const parseLine = (line: string, y: number): readonly Block[] =>
  line.split('').map(
    (value, x) =>
      ({
        coord: [x, y],
        value: value,
        dist: -1,
      }) as Block,
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
const printMap = (map: Map): void => {
  process.stdout.cursorTo(0, 0);

  const x = map
    .map((row) =>
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
    )
    .join('\n');
  console.log(x);
};
const joinMap = (map: Map, map2: Map): Map => {
  return A.zip(map, map2).map(([row, row2]) =>
    A.zip(row, row2).map(([block1, block2]) => {
      let dist = -1;
      if (block1.dist === -1 && block2.dist === -1) {
        dist = -1;
      } else if (block1.dist === -1) dist = block2.dist;
      else if (block2.dist === -1) dist = block1.dist;
      else dist = Math.min(block1.dist, block2.dist);
      return {
        ...block1,
        dist,
      };
    }),
  );
};

const walk = (
  map: Map,
  candidates: (readonly Block[])[],
  depth: number,
): Map => {
  printMap(map);

  if ((candidates[0]?.length ?? 0) === 0) return map;

  const updatedMap = (candidates[0] ?? [])
    .map(({ coord }) => updateDist(map, coord, depth))
    .reduce(joinMap, map);

  const nextSteps = [
    (candidates[0] ?? []).flatMap((block) => getNextBlock(block, updatedMap)),
  ];

  const nextCandidates = nextSteps.concat(candidates.slice(1));

  return walk(updatedMap, nextCandidates, depth + 1);
};

const logic = flow(parse, (map) => {
  const start = pipe(findStart(map), (x) => blockAt(map, x));

  return pipe(
    walk(map, [[start]], 0),
    F.tap(printMap),
    A.flat,
    A.map(({ dist }) => dist),
    A.reduce(-1, max),
  );
});

// const ip = `..........
// .S------7.
// .|F----7|.
// .||OOOO||.
// .||OOOO||.
// .|L-7F-J|.
// .|II||II|.
// .L--JL--J.
// ..........`;

// lineDriver(ip, logic);
problem(10, logic);
