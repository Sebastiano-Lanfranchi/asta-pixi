import { Component, OnInit } from '@angular/core';
import { Squad } from '../../models/squad.model';
import { FirebaseService } from '../../services/firebase-service.service';
import axios from 'Axios';
import * as SerieA from '../../json/serieA.json';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-squadre-gen',
  templateUrl: './squadre-gen.component.html',
  styleUrls: ['./squadre-gen.component.scss']
})
export class SquadreGenComponent implements OnInit {

  squad: Squad = new Squad();
  arrSquadre: Squad[] | undefined;
  isLoader: boolean = false;

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.firebaseService.GetSquad().subscribe(item => {
      this.arrSquadre = item;
    })
  }

  async UpdateSquadPlayer() {
    this.isLoader = true;
    let tmp = JSON.parse(JSON.stringify(SerieA));
    this.isLoader = true;
    tmp.teams.forEach((team: any, index: any) => {
      setTimeout(() => {
        const options = {
          method: 'GET',
          url: 'https://v3.football.api-sports.io/players/squads',
          params: { team: team.team.id },
          headers: {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": "11d9e2510d0bf0efdc2fcc80b67358da"
          }
        };
        axios.request(options).then((response) => {
          team.team.players = response.data.reponse[0].players;
        }).catch((error) => {
          localStorage.setItem('SerieA', JSON.stringify(SerieA));
          console.error(error);
        });
        if (index == 19) {
          this.isLoader = false;
          localStorage.setItem('SerieA', JSON.stringify(tmp));
          Swal.fire(
            'Ottimo!',
            'Ultimi aggiornamenti di mercato salvati!',
            'success'
          )
        }
      }, 400 * (index + 1));

    });
  }
}
