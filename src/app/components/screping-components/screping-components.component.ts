import { Component, OnInit } from '@angular/core';
import { parse } from 'node-html-parser';


@Component({
  selector: 'app-screping-components',
  templateUrl: './screping-components.component.html',
  styleUrls: ['./screping-components.component.scss']
})
export class ScrepingComponentsComponent implements OnInit {
  //https://cors-anywhere.herokuapp.com/corsdemo
  //https://app.sportdataapi.com/documentation
  //https://medium.com/@charlyyy/how-to-bypass-cors-and-scrap-any-websites-using-javascript-serverless-76115eeecddd
  URL = "https://cors-anywhere.herokuapp.com/https://www.transfermarkt.it/juventus-turin/startseite/verein/506";
  dataParse: any;
  constructor() { }

  ngOnInit(): void {
    this.getCricketWorldCupsList().then((res)=>{
      this.dataParse = res.toString();
      this.dataParse = this.dataParse.split('<table class="items">').pop().split('</table>').toString();
      this.dataParse = this.dataParse.split('<tbody>').pop().split('</tbody>').toString();
     
      console.log(typeof this.dataParse);
      console.log(this.dataParse)
    });
  }

  getRawData(URL: string) {
    return fetch(URL, { mode: 'cors' })
      .then((response) => response.text())
      .then((data) => {
        return data;
      });
  };

  async getCricketWorldCupsList() {
    const cricketWorldCupRawData = await this.getRawData(this.URL);
    return cricketWorldCupRawData
  }

  
}
