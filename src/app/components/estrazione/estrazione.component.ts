import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase-service.service'
import Swal from 'sweetalert2';
import * as SerieA from '../../json/serieA.json';
import { Squad } from 'src/app/models/squad.model';

@Component({
  selector: 'app-estrazione',
  templateUrl: './estrazione.component.html',
  styleUrls: ['./estrazione.component.scss']
})
export class EstrazioneComponent implements OnInit {
  dataTeams!: any;
  players: any = [];
  playerArr: any;
  daGenerare: boolean = false;
  selectedPlayer: any;
  squadSub: any;
  squadSelected: any;
  creditiSpesi = 0;
  roleArr = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];
  roleSelected = 'Goalkeeper';
  estrMancanti = 0;


  constructor(public firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.firebaseService.GetSquad().subscribe((x: any) => {
      this.squadSub = x;
      this.squadSelected = x[0].nome;
    })
    if (localStorage.getItem('players') === null || localStorage.getItem('players') === undefined) {
      this.daGenerare = true;
    } else {
      this.playerArr = JSON.parse(localStorage.getItem('players')!);
      this.selectedPlayer = JSON.parse(localStorage.getItem('selectedPlayer')!)
      this.daGenerare = false;
    }
  }

  Associa() {
    Swal.fire({
      title: 'Sicuro di voler associare questo gicoatore?',
      text: "Non potrai tornarnare indietro, l'acquisto non è rimborsabile",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si,associa',
      cancelButtonText: 'Annulla'
    }).then((result) => {
      if (result.isConfirmed) {
        let tempSquad: any;
        tempSquad = this.squadSub.find((x: any) => x.nome == this.squadSelected);
        if (tempSquad.crediti - this.creditiSpesi < 0) {
          Swal.fire('Crediti non sufficienti')
        } else if(this.selectedPlayer.preso === true) {
          Swal.fire('Giocatore già acquistato')
        }else{
          var BreakException = {};
          this.playerArr.forEach((player: any) => {
            try {
              if (player.name == JSON.parse(localStorage.getItem('selectedPlayer')!).name && player.team == JSON.parse(localStorage.getItem('selectedPlayer')!).team) {
                player.preso = true;
                this.selectedPlayer.preso = true;
                localStorage.setItem('selectedPlayer', JSON.stringify(this.selectedPlayer));
                localStorage.setItem('players', JSON.stringify(this.playerArr));
                if (player.preso === true) throw BreakException;
                console.log(player);
              }
            }
            catch (e) {
              if (e !== BreakException) throw e;
            }
          });
          tempSquad.crediti = tempSquad.crediti - this.creditiSpesi;
          tempSquad.players.push(this.selectedPlayer!);
          this.firebaseService.UpdateSquad(tempSquad)
          this.creditiSpesi = 0;
          Swal.fire(
            'Associato!',
            this.squadSelected + ' ha acquistato ' + this.selectedPlayer.name + ' per ' + this.creditiSpesi + ' crediti!',
            'success'
          )
        }
      }
    })

  }

  SelectRandom() {
    var BreakException = {}
    this.playerArr = JSON.parse(localStorage.getItem('players')!).sort(() => 0.5 - Math.random());
    let tempArr = [...this.playerArr.filter((x: any) => x.position == this.roleSelected)]
    for (let index = 0; index < tempArr.length; index++) {
      if (tempArr.some((x: any) => x.estratto !== true && x.position == this.roleSelected)) {
        localStorage.setItem('selectedPlayer', JSON.stringify(tempArr[index]));
        this.selectedPlayer = JSON.parse(localStorage.getItem('selectedPlayer')!);
        this.playerArr.forEach((player: any) => {
          try {
            if (player.name == JSON.parse(localStorage.getItem('selectedPlayer')!).name && player.team == JSON.parse(localStorage.getItem('selectedPlayer')!).team) {
              this.selectedPlayer.estratto = true;
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
    localStorage.setItem('players', JSON.stringify(this.playerArr));
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

