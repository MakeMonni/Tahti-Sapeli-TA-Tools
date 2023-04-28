import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { PlayerService } from '../player.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-player-score2',
  templateUrl: './player-score2.component.html',
  styleUrls: ['./player-score2.component.css'],
})
export class PlayerScore2Component implements OnInit {
  constructor(
    private webSocketService: WebsocketService,
    private playerService: PlayerService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  public thisPlayerId: string = '';

  public score: number = 0;
  public misses: number = 0;
  public acc: string = '100';
  public combo: number = 0;

  public isMissed: boolean = false;

  ngOnInit() {
    this.webSocketService.connect().subscribe((message) => {
      if (
        message.type === 'score' &&
        message.user.userId === this.thisPlayerId
      ) {
        if (message.missBadCuts > this.misses) {
          this.isMissed = true;
          setTimeout(() => {
            this.isMissed = false;
          }, 500);
        }

        this.score = message.score;
        this.misses = message.missBadCuts;
        this.acc = (message.accuracy * 100).toFixed(2);
        this.combo = message.combo;
      }
    });
    this.playerService.currentPlayers.subscribe((players) => {
      if (players[1] !== undefined) this.thisPlayerId = players[1].userId;
    });
  }
}
