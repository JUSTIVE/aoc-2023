import { P, match } from "ts-pattern";
import { A, B, S, flow, pipe } from "@mobily/ts-belt";
import { problem, sum } from "../utilities";
type Coord = [number, number];
export type Part = {
  value: number;
  coord: readonly Coord[];
};

export type Symbol = {
  value: string;
  coord: Coord;
};

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
          {
            value: Number(numStack),
            coord: pipe(
              numStack,
              S.split(""),
              A.mapWithIndex((index, _) => [lineNumber, offset - index - 1])
            ),
          } satisfies Part,
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
                  {
                    value: Number(numStack),
                    coord: pipe(
                      numStack,
                      S.split(""),
                      A.mapWithIndex((index, _) => [
                        lineNumber,
                        offset - index - 1,
                      ])
                    ),
                  },
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
    A.map(([index, char]) => ({ value: char, coord: [lineNumber, index] }))
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

problem(3, (input) => {
  const parts = pipe(
    input,
    A.mapWithIndex((lineNumber, line) =>
      parseParts(lineNumber, 0, "", [], line)
    ),
    A.flat
  );

  const symbols = pipe(
    input,
    A.mapWithIndex((lineNumber, line) => parseSymbols(lineNumber, line)),
    A.flat
  );

  return pipe(
    parts,
    A.filter((part) => pipe(symbols, A.some(isPartAdjacentToSymbol(part)))),
    A.map((part) => part.value),
    sum
  );
});
