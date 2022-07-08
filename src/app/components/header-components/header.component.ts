import { Component, OnInit } from '@angular/core';
import { SwitchPageService } from '../../services/switch-page.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  //https://cors-anywhere.herokuapp.com/corsdemo
  //https://app.sportdataapi.com/documentation
  //https://medium.com/@charlyyy/how-to-bypass-cors-and-scrap-any-websites-using-javascript-serverless-76115eeecddd
  urlTeamsIta = "https://v3.football.api-sports.io/";
 
  constructor(public switchPage: SwitchPageService) {

  }

  ngOnInit(): void {
  }


}
