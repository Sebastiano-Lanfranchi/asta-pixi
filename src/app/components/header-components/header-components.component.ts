import { Component, OnInit } from '@angular/core';
import * as SerieA from '../../json/serieA.json';

@Component({
  selector: 'app-header-components',
  templateUrl: './header-components.component.html',
  styleUrls: ['./header-components.component.scss']
})
export class Header implements OnInit {
  //https://cors-anywhere.herokuapp.com/corsdemo
  //https://app.sportdataapi.com/documentation
  //https://medium.com/@charlyyy/how-to-bypass-cors-and-scrap-any-websites-using-javascript-serverless-76115eeecddd
  urlTeamsIta = "https://v3.football.api-sports.io/";
  dataTeams: any;
  prova: any;
  jsonObj: any;
  constructor() { 

  }

  ngOnInit(): void {
    this.dataTeams = SerieA;
  } 
  
  
  // async getTeams() {
  //   const options = {
  //     method: 'GET',
  //     url: 'https://v3.football.api-sports.io/players/squads',
  //     params: {team: '1579'},
  //     headers: {
  //       'x-rapidapi-host': 'v3.football.api-sports.io',
  //       'x-rapidapi-key': '11d9e2510d0bf0efdc2fcc80b67358da'
  //     }
  //   };
    
  //   Axios.request(options).then(function (response) {
  //     return response.data;
  //   }).catch(function (error) {
  //     console.error(error);
  //   });
  //   }


  //6 italy
  // getRawData(URL: string) {
  //   return fetch(URL, { mode: 'cors' })
  //     .then((response) => response.text())
  //     .then((data) => {
  //       return data;
  //     });
  // };

  // async getCricketWorldCupsList() {
  //   const cricketWorldCupRawData = await this.getRawData(this.URL);
  //   return cricketWorldCupRawData
  // }

  
}
