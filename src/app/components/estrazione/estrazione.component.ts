import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase-service.service'
import Swal from 'sweetalert2';

import * as SerieA from '../../json/serieAtransfer.json';
import { NgxSpinnerService } from "ngx-spinner";
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import axios from 'Axios';

@Component({
  selector: 'app-estrazione',
  templateUrl: './estrazione.component.html',
  styleUrls: ['./estrazione.component.scss']
})

export class EstrazioneComponent implements OnInit {

  players: any = [];
  playerArr: any;
  filtroNome: any = '';
  filtroTeam: any = '';
  filtroRole: any = '';
  isLoader: boolean = false;
  ready: boolean = false;
  arrfilter: any;
  daGenerare: boolean = false;
  selectedPlayer: any;
  squadSub: any;
  squadSelected: any;
  creditiSpesi = 0;
  roleArr = [{ value: ['Torwart'], it: 'Portiere' }, { value: ['Abwehr'], it: 'Difensore' }, { value: ['Midfielder', 'Mittelfeld'], it: 'centrocampista' }, { value: ['Attacker', 'Sturm'], it: 'Attaccante' }];
  roleSelected = 'Torwart';
  estrMancanti = 0;
  isFiltered = false;
  squadNameSelect: any;
  updateSerieA: any;
  jsonDown: any;
  tmp: any;
  mirror: any;

  constructor(public firebaseService: FirebaseService, private spinner: NgxSpinnerService, private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    this.firebaseService.GetSquad().subscribe((x: any) => {
      this.squadSub = x;
      this.squadNameSelect = this.squadSub.map((x: any) => x.nome);
      console.log(this.squadNameSelect)
      this.squadSelected = x[0].nome;
    })
    this.CheckLocalStorage();
  }

  Associa() {
    Swal.fire({
      title: 'Sicuro di voler associare questo giocatore?',
      text: "Non potrai tornare indietro, l'acquisto non è rimborsabile",
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
        } else if (this.selectedPlayer.preso === true) {
          Swal.fire('Giocatore già acquistato')
        } else {
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
          Swal.fire(
            'Associato!',
            this.squadSelected + ' ha acquistato ' + this.selectedPlayer.name + ' per ' + this.creditiSpesi + ' crediti!',
            'success'
          )
          this.creditiSpesi = 0;
        }
      }
    })
  }

  getPosition(position: any) {
    let it
    this.roleArr.forEach((role) => {
      if (role.value.includes(position)) {
        it = role.it
      }
    })
    return it
  }


  GetClass(type: string) {
    let classString = '';
    if (type === 'normal') {
      classString = 'bg-[url(src/assets/normal.png)] text-black'
    } else if (type === 'good') {
      classString = 'bg-[url(src/assets/gold1.png)] text-black'
    } else if (type === 'top') {
      classString = 'bg-[url(src/assets/op.png)] text-white'
    } else if (type === 'captain') {
      classString = 'bg-[url(src/assets/captain.png)] text-white'
    }
    return classString
  }

  generateDownloadJsonUri() {
    var theJSON = JSON.stringify(JSON.parse(localStorage.getItem('SerieA')!));
    var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
    this.jsonDown = uri;
  }

  SelectRandom() {
    var BreakException = {}
    this.playerArr = JSON.parse(localStorage.getItem('players')!).sort(() => 0.5 - Math.random());
    let tempArr = [...this.playerArr.filter((x: any) => this.roleSelected.includes(x.positions.first.group))]
    if (tempArr.some((x: any) => x.estratto !== true && this.roleSelected.includes(x.positions.first.group))) {
      let daCiclare = tempArr.filter(z => z.estratto == false && this.roleSelected.includes(z.positions.first.group));
      localStorage.setItem('selectedPlayer', JSON.stringify(daCiclare[0]));
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
          localStorage.setItem('players', JSON.stringify(this.playerArr))
          if (e !== BreakException) throw e;
        }
      })
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Complimenti',
        text: "Tutti i giocatori " + this.getPosition(this.roleSelected) + " sono stati estratti!",
      })
    }
    localStorage.setItem('players', JSON.stringify(this.playerArr));
  }

  SelectFiltered() {
    this.playerArr = [];
    this.playerArr = JSON.parse(localStorage.getItem('players')!).sort(() => 0.5 - Math.random());
    let tempArr = [...this.playerArr].filter(p => p.preso == false);
    this.arrfilter = [];
    if (this.filtroNome != '' && this.filtroTeam != '' && this.filtroRole != '') {
      this.arrfilter.push(tempArr.filter((x: any) => x.name.toLowerCase().includes(this.filtroNome.toLowerCase()) && x.team.toLowerCase().includes(this.filtroTeam.toLowerCase()) && this.filtroRole.includes(x.positions.first.group)));
    } else if (this.filtroNome == '' && this.filtroTeam != '' && this.filtroRole == '') {
      this.arrfilter.push(tempArr.filter((x: any) => x.team.toLowerCase().includes(this.filtroTeam.toLowerCase())));
    } else if (this.filtroNome != '' && this.filtroTeam == '' && this.filtroRole == '') {
      this.arrfilter.push(tempArr.filter((x: any) => x.name.toLowerCase().includes(this.filtroNome.toLowerCase())));
    } else if (this.filtroNome != '' && this.filtroTeam != '' && this.filtroRole == '') {
      this.arrfilter.push(tempArr.filter((x: any) => x.position == this.filtroRole));
    } else if (this.filtroNome != '' && this.filtroTeam != '' && this.filtroRole == '') {
      this.arrfilter.push(tempArr.filter((x: any) => x.name.toLowerCase().includes(this.filtroNome.toLowerCase()) && x.team.toLowerCase().includes(this.filtroTeam.toLowerCase())));
    } else if (this.filtroNome == '' && this.filtroTeam != '' && this.filtroRole != '') {
      this.arrfilter.push(tempArr.filter((x: any) => x.team.toLowerCase().includes(this.filtroTeam.toLowerCase()) && this.filtroRole.includes(x.positions.first.group)));
    } else if (this.filtroNome != '' && this.filtroTeam == '' && this.filtroRole != '') {
      this.arrfilter.push(tempArr.filter((x: any) => x.name.toLowerCase().includes(this.filtroNome.toLowerCase()) && this.filtroRole.includes(x.positions.first.group)));
    }
    this.ready = true;
    console.log(this.arrfilter)
  }

  AssociaRicerca(find: any) {
    var BreakException = {}
    Swal.fire({
      title: 'Multiple inputs',
      input: 'select',
      inputOptions: this.squadNameSelect,
      inputPlaceholder: 'Seleziona una squadra',
      showCancelButton: true,
      html:
        '<label>crediti</label>' +
        '<input type="number" id="swal-input2" class="swal2-input">',
      focusConfirm: false,
      preConfirm: (value) => {
        return [
          this.tmp = value,
          (document.getElementById('swal-input2') as HTMLInputElement).value
        ]
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.squadSub[this.tmp].players.push(find);
        this.squadSub[this.tmp].crediti = this.squadSub[this.tmp].crediti - Number((document.getElementById('swal-input2') as HTMLInputElement).value);
        this.firebaseService.UpdateSquad(this.squadSub[this.tmp]);
        this.playerArr.forEach((player: any) => {
          try {
            if (player.name == find.name && player.team == find.team) {
              find.estratto = true;
              find.preso = true;
              player.preso = true;
              player.estratto = true;
              if (find.preso === true) throw BreakException;
              console.log(player);
            }
          }
          catch (e) {
            localStorage.setItem('players', JSON.stringify(this.playerArr));
            if (e !== BreakException) throw e;
          }
        });
        Swal.fire(
          'Associato!',
          'Associazione avvenuta con successo.',
          'success'
        )
      }
    })
  }

  SwitchSearch(mode: string) {
    if (mode == 'filtered')
      this.isFiltered = true;
    else
      this.isFiltered = false;
  }

  CheckLocalStorage() {
    this.isLoader = true;
    if (JSON.parse(localStorage.getItem('SerieA')!) === null) {
      localStorage.setItem('SerieA', JSON.stringify(SerieA));
      this.GenerateData();
      this.generateDownloadJsonUri();
    } else {
      if (JSON.parse(localStorage.getItem('players')!) === null) {
        this.GenerateData();
        this.generateDownloadJsonUri();
      } else {
        this.selectedPlayer = JSON.parse(localStorage.getItem('selectedPlayer')!)
        this.generateDownloadJsonUri();
        this.isLoader = false;
      }
    }
  }

  UpdateSquadPlayer() {
    this.isLoader = true;
    this.mirror= JSON.parse(JSON.stringify(SerieA));
    this.mirror.teams.forEach((team: any, index: number) => {
      setTimeout(async () => {
        this.GetTransfer(team.id);
      }, index * 1100);
    })
    setTimeout(() => {
      this.GenerateData()
    }, 28000);
    this.isLoader = false;
  }

  async GetTransfer(data: string) {
    const options = {
      method: 'GET',
      url: 'https://transfermarket.p.rapidapi.com/clubs/get-squad',
      params: { id: data },
      headers: {
        'X-RapidAPI-Key': '2dc7824b3cmsh3c8fdbe72d2cae1p183851jsn860ba2af6845',
        'X-RapidAPI-Host': 'transfermarket.p.rapidapi.com'
      }
    };
    await axios.request(options).then((response) => {
      this.mirror.teams.forEach((team: any) => {
        if(team.id == data){
          team = response.data.squad;
          localStorage.setItem('SerieA', JSON.stringify(this.mirror));
        }
        
      })
    }).catch(function (error) {
      console.error(error);
    });
  }

  GenerateData() {
    let dataTeams = JSON.parse(localStorage.getItem('SerieA')!);
    dataTeams.teams.forEach((x: any) => {
      x.squad.forEach((y: any) => {
        y['team'] = x.name;
        y['estratto'] = false;
        y['preso'] = false;
        y['logoT'] = x.image;
        if (y.marketValue.value >= 40000000)
          y['type'] = 'top'
        else if (y.marketValue.value >= 10000000)
          y['type'] = 'good'
        else if (y.marketValue.value < 10000000)
          y['type'] = 'normal'
        if (y.captain == true)
          y['type'] = 'captain'
        this.players.push(y)
        // this.dataTeams.topPlayers.includes(y.id) ? y['top'] = true : y['top'] = false;
      })
      this.daGenerare = false;
      localStorage.setItem('players', JSON.stringify(this.players));
      this.SelectRandom();
      Swal.fire({
        icon: 'success',
        title: 'Estrazione generata',
        text: 'Estrazione generata con successo!',
      })
      this.daGenerare = false;
      this.isLoader = false;
    })
  }

  Elimina() {
    this.players = [];
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

