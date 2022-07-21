import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase-service.service';

@Component({
  selector: 'app-focus-squad',
  templateUrl: './focus-squad.component.html',
  styleUrls: ['./focus-squad.component.scss']
})
export class FocusSquadComponent implements OnInit {

  squads: any;
  roleArr = [{ value: ['Torwart'], it: 'Portiere' }, { value: ['Abwehr'], it: 'Difensore' }, { value: ['Midfielder', 'Mittelfeld'], it: 'centrocampista' }, { value: ['Attacker', 'Sturm'], it: 'Attaccante' }];
  
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

  getPosition(position: any) {
    let it
    this.roleArr.forEach((role) => {
      if (role.value.includes(position)) {
        it = role.it
      }
    })
    return it
  }

}
