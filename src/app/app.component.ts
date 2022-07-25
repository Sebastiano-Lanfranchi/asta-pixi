import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from './components/header-components/header.component';
import { SwitchPageService } from './services/switch-page.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'asta-pixi';
  email: string = '';
  password: string = '';
  generate: any;
  @ViewChild('header') header!: HeaderComponent;

  constructor(public switchPage: SwitchPageService, public auth: AngularFireAuth) {
  
   }

   login() {
    this.auth.signInWithEmailAndPassword(this.email, this.password);
  }

  receiveGenerate($event: any) {
    this.generate = $event
  }
}
