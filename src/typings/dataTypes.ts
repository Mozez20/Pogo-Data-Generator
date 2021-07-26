export interface AllInvasions {
  [id: string]: SingleInvasion
}

export interface SingleInvasion {
  id: number
  type: string
  gender: number
  grunt: string
  secondReward: boolean
  encounters: {
    [position: string]: InvasionTeam[]
  }
}

type InvasionTeam = {
  id: number
  formId: number
}

export interface AllMoves {
  [id: number]: SingleMove
}

export interface SingleMove {
  id: number
  name: string
  proto?: string
  typeId?: number
  power?: number
}

export interface AllItems {
  [id: number]: SingleItem
}

export interface SingleItem {
  id: number
  name: string
  proto: string
  type: string
  category: string
  minTrainerLevel: number
}

export interface AllQuests {
  [id: number]: SingleQuest
}

export interface SingleQuest {
  id: number
  proto: string
  formatted: string
}

export interface AllPokemon {
  [id: number]: SinglePokemon
}

export interface AllForms {
  [id: number]: SingleForm
}

export interface SinglePokemon extends SingleForm {
  id?: number
  forms?: number[]
  defaultFormId?: number
  genId?: number
  generation?: string
  fleeRate?: number
  captureRate?: number
  family?: number
  legendary?: boolean
  mythic?: boolean
  buddyGroupNumber?: number
  kmBuddyDistance?: number
  thirdMoveStardust?: number
  thirdMoveCandy?: number
  gymDefenderEligible?: boolean
}

export interface SingleForm extends BaseStats {
  name?: string
  proto?: string
  formId?: number
  isCostume?: boolean
  evolutions?: Evolutions[]
  tempEvolutions?: TempEvolutions[]
  quickMoves?: number[]
  chargedMoves?: number[]
  family?: number
  little?: boolean
}

export interface Unreleased extends TempEvolutions {
  unreleased?: boolean
}

export interface TempEvolutions extends BaseStats {
  tempEvoId: number
}

export interface Evolutions {
  id?: number
  formId?: number
  genderRequirement?: number
}

type BaseStats = {
  attack?: number
  defense?: number
  stamina?: number
  height?: number
  weight?: number
  types?: number[]
}

export interface PokemonTyping {
  typeId: number
  typeName: string
}
