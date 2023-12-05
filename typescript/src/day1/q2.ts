import { A, S, flow } from '@mobily/ts-belt'
import { problem, sum } from '../utilities'

const stringParser = flow(
  S.replaceAll('one', 'o1e'),
  S.replaceAll('two', 't2o'),
  S.replaceAll('three', '3e'),
  S.replaceAll('four', '4'),
  S.replaceAll('five', '5e'),
  S.replaceAll('six', '6'),
  S.replaceAll('seven', '7n'),
  S.replaceAll('eight', '8'),
  S.replaceAll('nine', '9')
)

const processLine = flow(
  stringParser,
  (s) => s.replace(/[^0-9]/g, ''),
  S.split(''),
  (x) => x[0] + x.at(-1),
  Number
)

problem(1, flow(A.map(processLine), sum))
