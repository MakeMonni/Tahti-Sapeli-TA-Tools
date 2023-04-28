import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private messageSource = new BehaviorSubject<any[]>(["", ""]);
  currentPlayers = this.messageSource.asObservable();

  constructor() { }

  changePlayers(players: [any]) {
    this.messageSource.next(players);
  }
}
