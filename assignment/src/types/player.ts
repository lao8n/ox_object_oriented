import { BoardLocation } from "./board"
import { Money } from "./money"

export type PlayerID = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type NumPlayers = 2 | 3 | 4 | 5 | 6 | 7 | 8

export type Player<M extends Money> = {
    id: PlayerID
    wealth: M
    location: BoardLocation
    inJail: boolean
}