import { A, S, flow } from '@mobily/ts-belt'
import { problem, sum } from '../utilities'

const processLine = flow(
  S.replaceByRe(/[^0-9]/g, ''),
  S.split(''),
  (x) => x[0] + x.at(-1),
  Number
)

problem(1, flow(A.map(processLine), sum))
