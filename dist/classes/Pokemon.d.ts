import { AllPokemon, TempEvolutions, Evolutions, SinglePokemon, AllForms } from '../typings/dataTypes';
import { NiaMfObj, Generation, TempEvo, EvoBranch, MegaStats } from '../typings/general';
import Masterfile from './Masterfile';
export default class Pokemon extends Masterfile {
    parsedPokemon: AllPokemon;
    parsedForms: AllForms;
    FormsList: any;
    PokemonList: any;
    GenderList: any;
    TempEvolutions: any;
    FamilyId: any;
    generations: Generation;
    megaStats: MegaStats;
    lcBanList: any;
    evolvedPokemon: any;
    constructor();
    pokemonName(id: number): string;
    formName(id: number, formName: string, noCap?: boolean): string;
    lookupPokemon(name: string): string;
    getMoves(moves: string[]): any[];
    compare(formData: number[], parentData: number[]): boolean;
    getTypes(incomingTypes: string[]): any[];
    compileEvos(mfObject: EvoBranch[]): Evolutions[];
    compileTempEvos(mfObject: TempEvo[], primaryForm: SinglePokemon): TempEvolutions[];
    generateProtoForms(): void;
    addForm(object: NiaMfObj): void;
    addPokemon(object: NiaMfObj): void;
    megaInfo(): void;
    futureMegas(): void;
    littleCup(): void;
}
