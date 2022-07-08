import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SwitchPageService {

  isGenSquad: boolean = true;
  isEstraz: boolean = false;

  constructor() { }

  SwitchPage(titolo: string) {
    switch (titolo) {
      case 'genSquad':
        this.isGenSquad = true;
        this.isEstraz = false;
        break;
      case 'estr':
        this.isEstraz = true;
        this.isGenSquad = false;
        break;
      default:
        break;
    }
  }
}
