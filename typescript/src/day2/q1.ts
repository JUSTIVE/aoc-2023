import { A, D, F, S, flow, pipe } from '@mobily/ts-belt';
import { problem, sum } from '../utilities';

type BallColors = 'red' | 'green' | 'blue';
type GameSet = Record<BallColors, number>;
type PartialGameSet = Partial<GameSet>;
const BaseGameSet: GameSet = {
  red: 0,
  green: 0,
  blue: 0,
};
type Game = {
  id: number;
  set: readonly GameSet[];
};

const parseBall = (ballString: string): PartialGameSet => {
  const [count, color] = ballString.split(' ');
  return D.update(
    {} as PartialGameSet,
    (color ?? 'red') as BallColors,
    F.always(Number(count ?? '0')),
  ) as PartialGameSet;
};
const joinGameSet = (acc: GameSet, curr: PartialGameSet): GameSet => ({
  ...acc,
  ...curr,
});

const parseGameSet = flow(
  S.split(','),
  A.map(flow(S.trim, parseBall)),
  A.reduce(BaseGameSet, joinGameSet),
);

const parseGame = (gameString: string): Game => {
  const [tag, setsString] = gameString.split(':');
  return {
    id: Number((tag ?? '').split(' ')[1]),
    set: pipe(
      setsString ?? '',
      S.split(';'),
      A.map(S.trim),
      A.map(parseGameSet),
    ),
  };
};

const serveConstraints = ({ set }: Game) =>
  A.every(
    set,
    ({ red, blue, green }) => red <= 12 && green <= 13 && blue <= 14,
  );

problem(
  2,
  flow(
    A.map(parseGame),
    A.filter(serveConstraints),
    A.map(({ id }) => id),
    sum,
  ),
);
