import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SwitchPageService {

  isGenSquad: boolean = false;
  isEstraz: boolean = false;
  isPanSquad: boolean = true;

  constructor() { }

  SwitchPage(titolo: string) {
    switch (titolo) {
      case 'panSquad':
        this.isPanSquad = true;
        this.isGenSquad = false;
        this.isEstraz = false;
        break;
      case 'genSquad':
        this.isGenSquad = true;
        this.isEstraz = false;
        this.isPanSquad = false;
        break;
      case 'estr':
        this.isEstraz = true;
        this.isGenSquad = false;
        this.isPanSquad = false;
        break;
      default:
        break;
    }
  }
}
