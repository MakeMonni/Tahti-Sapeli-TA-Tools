import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-player2',
  templateUrl: './player2.component.html',
  styleUrls: ['./player2.component.css'],
})
export class Player2Component implements OnInit {
  constructor(
    private webSocketService: WebsocketService,
    private playerService: PlayerService
  ) { }

  public thisPlayer: any = { userId: "76561198061930684" };
  public thisPlayerScore: number = 0;
  public boxes: any[] = Array(3).fill(null);
  public playerName: string = 'Player';
  public playerImageUrl: string =
    'https://cdn.scoresaber.com/avatars/oculus.png';

  ngOnInit() {
    this.webSocketService.connect().subscribe((message) => {

      if (message.type === 'mapWon' && message.playerId === this.thisPlayer.userId) {

        if (!message.undo && this.thisPlayerScore < 3) {
          this.thisPlayerScore++;
        }

        else if (this.thisPlayerScore > 0 && message.undo) {
          this.thisPlayerScore--;
        }
      }
    });
    this.playerService.currentPlayers.subscribe((players) => {

      if (players[1] !== undefined && players[1] !== "") {

        if (this.thisPlayer !== players[1]) {
          console.log("Resetting player score", this.thisPlayer, players[1])
          this.thisPlayerScore = 0;
        }

        this.thisPlayer = players[1];
        this.playerName = players[1].name;

        if (players[1].userId.length === 17) {
          this.playerImageUrl = `https://cdn.scoresaber.com/avatars/${players[1].userId}.jpg`;
        }
        else {
          this.playerImageUrl = `https://cdn.scoresaber.com/avatars/oculus.png`
        }
      }
    });
  }
}
