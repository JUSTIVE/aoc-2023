import { A, S, flow, pipe } from '@mobily/ts-belt'
import { sum, problem } from '../utilities'

type BallColors = 'red' | 'green' | 'blue'
type GameSet = Record<BallColors, number>
type PartialGameSet = Partial<GameSet>
const BaseGameSet: GameSet = {
  red: 0,
  green: 0,
  blue: 0
}
type Game = {
  id: number
  set: readonly GameSet[]
}

type MinimumGame = {
  id: number
  set: GameSet
}

const parseBall = (ballString: string): PartialGameSet => {
  const [count, color] = ballString.split(' ')
  return { [color]: Number(count) }
}
const joinGameSet = (acc: GameSet, curr: PartialGameSet): GameSet => ({
  ...acc,
  ...curr
})

const parseGameSet = flow(
  S.split(','),
  A.map(S.trim),
  A.map(parseBall),
  A.reduce(BaseGameSet, joinGameSet)
)

const parseGame = (gameString: string): Game => {
  const [tag, setsString] = gameString.split(':')
  const id = Number(tag.split(' ')[1])
  const set = pipe(setsString, S.split(';'), A.map(S.trim), A.map(parseGameSet))
  return { id, set }
}

const joinGameSetMinimum = (acc: GameSet, curr: GameSet): GameSet => ({
  red: Math.max(acc.red, curr.red),
  green: Math.max(acc.green, curr.green),
  blue: Math.max(acc.blue, curr.blue)
})

const calculateMinimumGame = ({ id, set: set_ }: Game): MinimumGame => {
  const set = pipe(set_, A.reduce(BaseGameSet, joinGameSetMinimum))
  return { id, set }
}

const countValue = ({ set: { red, green, blue } }: MinimumGame) =>
  red * green * blue

problem(2, flow(A.map(flow(parseGame, calculateMinimumGame, countValue)), sum))
