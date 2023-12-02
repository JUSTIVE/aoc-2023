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

type MinimumGame = {
  id: number;
  set: GameSet;
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

const joinGameSetMinimum = (acc: GameSet, curr: GameSet): GameSet => ({
  red: Math.max(acc.red, curr.red),
  green: Math.max(acc.green, curr.green),
  blue: Math.max(acc.blue, curr.blue),
});

const calculateMinimumGame = ({ id, set }: Game): MinimumGame => {
  const set_ = pipe(set, A.reduce(BaseGameSet, joinGameSetMinimum));
  return { id, set: set_ };
};

const countValue = ({ set: { red, green, blue } }: MinimumGame) =>
  red * green * blue;

const solve = () => {
  const filePath = `${import.meta.dir}/../../../data/day2/q1.txt`;
  const input = fs.readFileSync(filePath).toString().split("\n");
  pipe(
    input,
    A.map(flow(parseGame, calculateMinimumGame, countValue)),
    A.reduce(0, (acc, curr) => acc + curr),
    console.log
  );
};
solve();
