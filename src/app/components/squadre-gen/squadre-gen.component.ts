import { Component, OnInit } from '@angular/core';
import { Squad } from '../../models/squad.model';
import { FirebaseService } from '../../services/firebase-service.service';

@Component({
  selector: 'app-squadre-gen',
  templateUrl: './squadre-gen.component.html',
  styleUrls: ['./squadre-gen.component.scss']
})
export class SquadreGenComponent implements OnInit {

  squad: Squad = new Squad();
  arrSquadre: Squad[] | undefined;

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.firebaseService.GetSquad().subscribe(item=>{
      this.arrSquadre = item;
    })
  }

}
