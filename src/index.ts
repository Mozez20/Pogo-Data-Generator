import * as fs from 'fs'
import extend from 'extend'
import Fetch from 'node-fetch'

import { Input, FullTemplate } from './typings/inputs'
import Pokemon from './classes/Pokemon'
import Items from './classes/Item'
import Moves from './classes/Move'
import Quests from './classes/Quest'
import Invasions from './classes/Invasion'

const fetch = async (url: string) => {
  return new Promise(resolve => {
    Fetch(url)
      .then(res => res.json())
      .then(json => {
        return resolve(json)
      })
  })
}

const stock: FullTemplate = {
  pokemon: {
    enabled: true,
    options: {
      key: 'id',
      array: true,
      formsKey: 'formId',
      keyJoiner: '_',
      unsetDefaultForm: false,
      skipNormalIfUnset: false,
      skipForms: [],
      includeProtos: true,
      includeEstimatedPokemon: true,
    },
    template: {
      name: true,
      forms: {
        formId: false,
        name: true,
        proto: true,
        isCostume: true,
        evolutions: {
          id: true,
          formId: true,
        },
        tempEvolutions: true,
        attack: true,
        defense: true,
        stamina: true,
        height: true,
        weight: true,
        types: {
          typeId: true,
          typeName: true,
        },
        quickMoves: true,
        chargedMoves: true,
        family: true,
      },
      defaultFormId: true,
      pokedexId: true,
      genId: false,
      generation: true,
      types: {
        typeId: true,
        typeName: true,
      },
      attack: true,
      defense: true,
      stamina: true,
      height: true,
      weight: true,
      fleeRate: true,
      captureRate: true,
      quickMoves: true,
      chargedMoves: true,
      tempEvolutions: true,
      evolutions: {
        id: true,
        formId: true,
      },
      legendary: true,
      mythic: true,
      buddyGroupNumber: true,
      buddyDistance: true,
      thirdMoveStardust: true,
      thirdMoveCandy: true,
      gymDefenderEligible: true,
      family: true,
      little: true,
    },
  },
  moves: {
    enabled: true,
    options: {
      key: 'id',
      keyJoiner: '_',
      includeProtos: true,
    },
    template: {
      id: true,
      name: true,
      proto: true,
      type: true,
      power: true,
    },
  },
  items: {
    enabled: true,
    options: {
      key: 'id',
      keyJoiner: '_',
      minTrainerLevel: 50,
    },
    template: {
      id: true,
      name: true,
      proto: true,
      type: true,
      category: true,
      minTrainerLevel: true,
    },
  },
  questConditions: {
    enabled: true,
    options: {
      key: 'id',
      keyJoiner: '_',
    },
    template: {
      id: false,
      proto: true,
      formatted: true,
    },
  },
  questRewardTypes: {
    enabled: true,
    options: {
      key: 'id',
      keyJoiner: '_',
    },
    template: {
      id: false,
      proto: true,
      formatted: true,
    },
  },
  invasions: {
    enabled: true,
    options: {
      key: 'id',
      keyJoiner: '_',
      placeholderData: true,
    },
    template: {
      id: false,
      type: true,
      gender: true,
      grunt: true,
      secondReward: true,
      encounters: true,
    },
  },
}

export async function generate({ template, safe, url, test }: Input = {}) {
  const start: any = new Date()
  const urlToFetch =
    url || safe
      ? 'https://raw.githubusercontent.com/WatWowMap/Masterfile-Generator/master/master-latest.json'
      : 'https://raw.githubusercontent.com/PokeMiners/game_masters/master/latest/latest.json'

  const merged: FullTemplate = {}
  extend(true, merged, stock, template)

  const data: any = await fetch(urlToFetch)
  const { pokemon, moves, items, questConditions, questRewardTypes, invasions } = merged

  const AllPokemon = pokemon.enabled ? new Pokemon() : null
  const AllItems = items.enabled ? new Items() : null
  const AllMoves = moves.enabled ? new Moves() : null
  const AllQuests = questConditions.enabled || questRewardTypes.enabled ? new Quests() : null
  const AllInvasions = invasions.enabled ? new Invasions() : null

  if (!safe) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i]) {
        if (data[i].data.formSettings && AllPokemon) {
          AllPokemon.addForm(data[i])
        } else if (data[i].data.pokemonSettings && AllPokemon) {
          AllPokemon.addPokemon(data[i])
        } else if (data[i].data.itemSettings && AllItems) {
          AllItems.addItem(data[i])
        } else if (data[i].data.combatMove && AllMoves) {
          AllMoves.addMove(data[i])
        } else if (data[i].templateId === 'COMBAT_LEAGUE_VS_SEEKER_GREAT_LITTLE') {
          AllPokemon.lcBanList = new Set(data[i].data.combatLeague.bannedPokemon)
        }
      }
    }

    if (AllPokemon) {
      if (pokemon.options.includeProtos) {
        AllPokemon.generateProtoForms()
      }
      if (pokemon.options.includeEstimatedPokemon) {
        AllPokemon.megaInfo()
        AllPokemon.futureMegas()
      }
      if (pokemon.template.little) {
        AllPokemon.littleCup()
      }
    }
    if (AllQuests) {
      if (questRewardTypes.enabled) {
        AllQuests.addQuest(true)
      }
      if (questConditions.enabled) {
        AllQuests.addQuest(false)
      }
    }
    if (AllMoves && moves.options.includeProtos) {
      AllMoves.protoMoves()
    }
    if (AllInvasions) {
      const invasionData: any = await fetch('https://raw.githubusercontent.com/ccev/pogoinfo/v2/active/grunts.json')
      AllInvasions.invasions(invasionData)
    }
  }

  const final = {
    pokemon: AllPokemon.parsedPokemon,
    forms: AllPokemon.parsedForms,
    items: AllItems.parsedItems,
    moves: AllMoves.parsedMoves,
    questRewardTypes: AllQuests.parsedRewardTypes,
    questConditions: AllQuests.parsedConditions,
    invasions: AllInvasions.parsedInvasions,
  }

  if (test) {
    fs.writeFile('./masterfile.json', JSON.stringify(final, null, 2), 'utf8', () => {})
    const end: any = new Date()
    console.log(`Generated in ${end - start}ms`)
  } else {
    return final
  }
}
