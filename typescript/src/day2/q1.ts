import { A, F, S, flow, pipe } from "@mobily/ts-belt";
import fs from "fs";

type BallColors = "red" | "green" | "blue";
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
  const [count, color] = ballString.split(" ");
  return { [color]: Number(count) };
};
const joinGameSet = (acc: GameSet, curr: PartialGameSet): GameSet => ({
  ...acc,
  ...curr,
});

const parseGameSet = (gameSetString: string) =>
  pipe(
    gameSetString,
    S.split(","),
    A.map(S.trim),
    A.map(parseBall),
    A.reduce(BaseGameSet, joinGameSet)
  );

const parseGame = (gameString: string): Game => {
  const [tag, setsString] = gameString.split(":");
  const id = Number(tag.split(" ")[1]);
  const set = pipe(
    setsString,
    S.split(";"),
    A.map(S.trim),
    A.map(parseGameSet)
  );
  return { id, set };
};

const serveConstraints = (game: Game) =>
  pipe(
    game.set,
    A.every(({ red, blue, green }) => red <= 12 && blue <= 14 && green <= 13)
  );

const solve = () => {
  const filePath = `${import.meta.dir}/../../../data/day2/q1.txt`;
  const input = fs.readFileSync(filePath).toString().split("\n");
  pipe(
    input,
    A.map(parseGame),
    A.filter(serveConstraints),
    A.map(({ id }) => id),
    A.reduce(0, (acc, curr) => acc + curr),
    console.log
  );
};
solve();
