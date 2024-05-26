import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  constructor(
    private webSocketService: WebsocketService,
    private playerService: PlayerService
  ) { }

  public thisPlayer: any = {userId: "76561198148209170"};
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
      if (players[0] !== "" && players[0] !== undefined) {

        if (this.thisPlayer.toString() !== players[0].toString()) {
          console.log("Resetting player score", this.thisPlayer, players[0])
          this.thisPlayerScore = 0;
        }

        this.thisPlayer = players[0];
        this.playerName = players[0].name;

        if (players[0].userId.length === 17) {
          this.playerImageUrl = `https://cdn.scoresaber.com/avatars/${players[0].userId}.jpg`;
        }
        else {
          this.playerImageUrl = `https://cdn.scoresaber.com/avatars/oculus.png`
        }
      }
    });
  }

  getPointBoxes(): string[] {
    return Array.from({ length: this.thisPlayerScore }, () => ('pointScored'));
  }
}
