import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SwitchPageService } from '../../services/switch-page.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  email: string = '';
  password: string = '';
 
  constructor(public switchPage: SwitchPageService, public auth: AngularFireAuth) {

  }

  ngOnInit(): void {
  }

  logout() {
    this.auth.signOut();
  }

  login() {
    this.auth.signInWithEmailAndPassword(this.email, this.password);
  }

  openNav() {
    let x = document.getElementById("myTopnav");
    if (x!.className === "topnav") {
      x!.className += " responsive";
    } else {
      x!.className = "topnav";
    }
  } 


}
