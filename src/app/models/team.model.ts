import { Player } from './player.model';

export interface Team{
    id: number 
    name: string 
    code: string 
    country: string 
    founded: number 
    national: boolean 
    logo: string 
    players: Player[] | undefined;
}