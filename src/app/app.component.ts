import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from './components/header-components/header.component';
import { SwitchPageService } from './services/switch-page.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'asta-pixi';
  @ViewChild('header') header!: HeaderComponent;

  constructor(public switchPage: SwitchPageService){}
}
