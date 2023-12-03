import fs from "fs";

const processLine = (line:string) => {
  return ((arr) => arr[0] + arr[arr.length - 1])(line
    .replace(/[^0-9]/g, "")
    .split(""))
}

const solve = () => { 
  const input = fs
    .readFileSync(`${import.meta.dir}/../../../data/day1/q1.txt`)
    .toString()
    .split("\n");
  
  return console.log(input
    .map(processLine)
    .map(Number)
    .reduce((acc:number, curr:number) => acc + curr,0))
}

solve();
