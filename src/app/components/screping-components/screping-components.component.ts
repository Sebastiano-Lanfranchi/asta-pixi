import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-screping-components',
  templateUrl: './screping-components.component.html',
  styleUrls: ['./screping-components.component.scss']
})
export class ScrepingComponentsComponent implements OnInit {

  //https://medium.com/@charlyyy/how-to-bypass-cors-and-scrap-any-websites-using-javascript-serverless-76115eeecddd
  URL = "https://crossorigin.me/https://en.wikipedia.org/wiki/Cricket_World_Cup";

  constructor() { }

  ngOnInit(): void {
    this.getCricketWorldCupsList();
  }

  getRawData(URL: string){
    return fetch(URL, {mode: 'cors'})
       .then((response) => response.text())
       .then((data) => {
          return data;
       });
 };

 async getCricketWorldCupsList(){
  const cricketWorldCupRawData = await this.getRawData(this.URL);
   console.log('qrfawfa',cricketWorldCupRawData);
 }

}
