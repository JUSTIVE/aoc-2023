import chalk from 'chalk';
import { max, problem_ } from '../utilities';

type Coord = [number, number];
type Block = {
  coord: Coord;
  value: 'S' | '━' | '┃' | '┏' | '┛' | '┓' | '┗' | '.';
  dist: number;
};

const baseBlock: Block = {
  coord: [0, 0],
  value: '.',
  dist: -1,
};
type Map = Block[][];

const findStart = (map: readonly (readonly Block[])[]): Coord =>
  map
    .flat()
    .filter((x) => x.value === 'S')
    .at(0)?.coord ?? [0, 0];

const blockAt = (map: Map, [x, y]: Coord) => map.at(y)?.at(x) ?? baseBlock;

const valueAt = (map: Map, [x, y]: Coord) =>
  (map.at(y)?.at(x) ?? baseBlock).value;

const getNextBlock = (
  { value, coord: [x, y] }: Block,
  map: Map,
): readonly Block[] => {
  const right = () =>
    ({
      '━': [x + 1, y],
      '┓': [x + 1, y],
      '┛': [x + 1, y],
    })[valueAt(map, [x + 1, y])];

  const left = () =>
    ({
      '━': [x - 1, y],
      '┗': [x - 1, y],
      '┏': [x - 1, y],
    })[valueAt(map, [x - 1, y])];

  const down = () =>
    ({
      '┃': [x, y + 1],
      '┛': [x, y + 1],
      '┗': [x, y + 1],
    })[valueAt(map, [x, y + 1])];

  const up = () =>
    ({
      '┃': [x, y - 1],
      '┓': [x, y - 1],
      '┏': [x, y - 1],
    })[valueAt(map, [x, y - 1])];

  const next =
    {
      S: [up(), down(), left(), right()],
      '━': [left(), right()],
      '┃': [up(), down()],
      '┏': [right(), down()],
      '┛': [left(), up()],
      '┓': [left(), down()],
      '┗': [up(), right()],
    }[value] ?? [];

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

const parse = (x: string[]) => x.map((line, y) => parseLine(line, y));

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

const walk = (
  map: Map,
  candidates: (readonly Block[])[],
  depth: number,
): Map => {
  // printMap(map);
  if ((candidates[0]?.length ?? 0) === 0) return map;
  for (let i = 0; i < (candidates[0]?.length ?? 0); i++) {
    const {
      coord: [x, y],
      value,
    } = candidates[0][i];
    if (map[y]?.[x] !== undefined) {
      const { r, g, b } = numberToRainbowColor((map[y][x].dist = depth));
      process.stdout.cursorTo(x, y);
      process.stdout.write(chalk.rgb(r, g, b)(value));
    }
  }

  return walk(
    map,
    [
      (candidates[0] ?? []).flatMap((block) => getNextBlock(block, map)),
      ...candidates.slice(1),
    ],
    depth + 1,
  );
};

const logic = (x: string) => {
  const map = parse(
    x
      .replaceAll('7', '┓')
      .replaceAll('L', '┗')
      .replaceAll('J', '┛')
      .replaceAll('F', '┏')
      .replaceAll('|', '┃')
      .replaceAll('-', '━')
      .split('\n'),
  );

  const start = blockAt(map, findStart(map));
  return walk(map, [[start]], 0)
    .flat()
    .map(({ dist }) => dist)
    .reduce(max, -1);
};
const start = performance.now();
await problem_(10, logic);
const end = performance.now();
console.log(`\n\ntime: ${end - start}`);
