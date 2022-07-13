import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase-service.service';

@Component({
  selector: 'app-focus-squad',
  templateUrl: './focus-squad.component.html',
  styleUrls: ['./focus-squad.component.scss']
})
export class FocusSquadComponent implements OnInit {

  squads: any;

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.firebaseService.GetSquad().subscribe(squads => {
      this.squads = squads;
      this.squads.forEach((item: any) =>{
        item['open'] = false;
      })
      console.log(squads)
    })
  }

}
