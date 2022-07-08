import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import * as SerieA from '../../json/serieA.json';

@Component({
  selector: 'app-estrazione',
  templateUrl: './estrazione.component.html',
  styleUrls: ['./estrazione.component.scss']
})
export class EstrazioneComponent implements OnInit {
  dataTeams!: any;
  players: any = [];
  daGenerare: boolean = false;
  selectedPlayer: any;
  roleArr = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];
  roleSelected = 'Goalkeeper';
  estrMancanti = 0;

  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem('players') === null || localStorage.getItem('players') === undefined) {
      this.daGenerare = true;
    } else {
      this.selectedPlayer = JSON.parse(localStorage.getItem('selectedPlayer')!)
      this.daGenerare = false;
    }
  }

  SelectRandom() {
    var BreakException = {}
    let playerArr = JSON.parse(localStorage.getItem('players')!).sort(() => 0.5 - Math.random());
    let tempArr = [...playerArr.filter((x: any) => x.position == this.roleSelected)]
    for (let index = 0; index < tempArr.length; index++) {
      if (tempArr.some((x: any) => x.estratto !== true && x.position == this.roleSelected)) {
        localStorage.setItem('selectedPlayer', JSON.stringify(tempArr[index]));
        this.selectedPlayer = JSON.parse(localStorage.getItem('selectedPlayer')!);
        playerArr.forEach((player: any) => {
          try {
            if (player.name == JSON.parse(localStorage.getItem('selectedPlayer')!).name && player.team == JSON.parse(localStorage.getItem('selectedPlayer')!).team) {
              player.estratto = true;
              if (player.estratto === true) throw BreakException;
              console.log(player);
            }
          }
          catch (e) {
            if (e !== BreakException) throw e;
          }
        });
        break;
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Complimenti',
          text: "Tutti i giocatori " + this.roleSelected + " sono stati estratti!",
        })
      }
    }
    localStorage.setItem('players', JSON.stringify(playerArr));
  }


  GenerateData() {
    this.dataTeams = SerieA;
    this.dataTeams.teams.forEach((x: any) => {
      x.team.players.forEach((y: any) => {
        y['team'] = x.team.name;
        y['estratto'] = false;
        y['preso'] = false;
        y['logoT'] = x.team.logo;
        this.players.push(y);
      })
    })
    this.daGenerare = false;
    localStorage.clear();
    localStorage.setItem('players', JSON.stringify(this.players));
    this.SelectRandom();
    Swal.fire({
      icon: 'success',
      title: 'Estrazione generata',
      text: 'Eliminazione generata con successo!',
    })
  }

  Elimina() {

    Swal.fire({
      title: "Sicuro di voler elmminare l'estrazione corrente?",
      text: "Tutti i giocatori estratti e acquistati saranno riportati allo stato iniziale",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annulla',
      confirmButtonText: 'Elimina!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.daGenerare = true;
        localStorage.clear();
        Swal.fire(
          'Eliminata!',
          'Estrazione eliminata con successo.',
          'success'
        )
      }
    })
  }
}

