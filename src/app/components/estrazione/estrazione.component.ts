import { Component, OnInit } from '@angular/core';
import * as SerieA from '../../json/serieA.json';

@Component({
  selector: 'app-estrazione',
  templateUrl: './estrazione.component.html',
  styleUrls: ['./estrazione.component.scss']
})
export class EstrazioneComponent implements OnInit {
  dataTeams!: { id: number; name: string; type: string; logo: string; teams: { team: { id: number; name: string; code: string; country: string; founded: number; national: boolean; logo: string; players: ({ id: number; name: string; age: null; number: number; position: string; photo: string; } | { id: number; name: string; age: number; number: number; position: string; photo: string; } | { id: number; name: string; age: number; number: null; position: string; photo: string; })[]; }; venue: { id: number; name: string; address: string; city: string; capacity: number; surface: string; image: string; }; }[]; };
  players: any = [];

  constructor() { }

  ngOnInit(): void {
    this.dataTeams = SerieA;
    this.dataTeams.teams.forEach(x=>{
      x.team.players.forEach(y=>{
       this.players.push(y);
      })
    })
    console.log(this.players)
  }
}
