import { P, match } from "ts-pattern";
import { A, B, F, N, R, S, flow, pipe } from "@mobily/ts-belt";
import { getSource } from "../utilities";
type Coord = [number, number];
export type Part = {
  value: number;
  coord: readonly Coord[];
  length: number;
};

export type Symbol = {
  value: string;
  coord: Coord;
};

const makePart = (
  value: number,
  coord: readonly Coord[],
  length: number
): Part => ({
  value,
  coord,
  length,
});

const makeSymbol = (value: string, coord: Coord): Symbol => ({
  value,
  coord,
});

const parseParts = (
  lineNumber: number,
  offset: number,
  numStack: string,
  state: Part[],
  line: string
): Part[] =>
  match(line)
    .with(P.union("", P.nullish), () =>
      match(numStack)
        .with("", () => state)
        .otherwise(() => [
          ...state,
          makePart(
            Number(numStack),
            pipe(
              numStack,
              S.split(""),
              A.mapWithIndex((index, _) => [lineNumber, offset - index - 1])
            ),
            numStack.length
          ),
        ])
    )
    .otherwise(([head, ...tail]) =>
      match(head)
        .when(flow(Number, isNaN, B.not), (head) =>
          parseParts(
            lineNumber,
            offset + 1,
            numStack + head,
            state,
            tail.join("")
          )
        )
        .otherwise(() =>
          match(numStack)
            .with("", () =>
              parseParts(lineNumber, offset + 1, numStack, state, tail.join(""))
            )
            .otherwise(() =>
              parseParts(
                lineNumber,
                offset + 1,
                "",
                [
                  ...state,
                  makePart(
                    Number(numStack),
                    pipe(
                      numStack,
                      S.split(""),
                      A.mapWithIndex((index, _) => [
                        lineNumber,
                        offset - index - 1,
                      ])
                    ),
                    numStack.length
                  ),
                ],
                tail.join("")
              )
            )
        )
    );

const parseSymbols = (lineNumber: number, line: string): readonly Symbol[] =>
  pipe(
    line,
    S.split(""),
    A.mapWithIndex((index, char) => [index, char] as const),
    A.filter(([_, char]) => char !== "."),
    A.filter(([_, char]) => !/\d/.test(char)),
    A.map(([index, char]) => makeSymbol(char, [lineNumber, index]))
  );

const isPartAdjacentToSymbol =
  (parts: Part) =>
  (symbol: Symbol): boolean =>
    pipe(
      symbol.coord,
      ([x, y]) => [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        [x, y - 1],
        [x, y],
        [x, y + 1],
        [x + 1, y - 1],
        [x + 1, y],
        [x + 1, y + 1],
      ],
      A.some(([x, y]) =>
        A.some(parts.coord, ([x1, y1]) => x === x1 && y === y1)
      )
    );

const solve = async () => {
  const input = R.getExn(await getSource(3));
  const parts = pipe(
    input,
    S.split("\n"),
    A.mapWithIndex((lineNumber, line) =>
      parseParts(lineNumber, 0, "", [], line)
    ),
    A.flat
  );

  const symbols = pipe(
    input,
    S.split("\n"),
    A.mapWithIndex((lineNumber, line) => parseSymbols(lineNumber, line)),
    A.flat
  );

  pipe(
    parts,
    A.filter((part) => pipe(symbols, A.some(isPartAdjacentToSymbol(part)))),
    A.map((part) => part.value),
    // F.tap((x) => console.log(x)),
    A.reduce(0, (acc, curr) => acc + curr),
    console.log
  );
};

solve();
