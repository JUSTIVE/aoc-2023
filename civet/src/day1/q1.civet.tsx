import fs from "fs";
import { problem,sum } from "../utilities.civet"

const processLine = (line:string) => {
  return ((x) => x[0] + x.at(-1))(line
    .replace(/[^0-9]/g, "")
    .split(""))
}

problem(
  1,
  (input) => {
    return sum(input
    .map(processLine)
    .map(Number))
  },)
