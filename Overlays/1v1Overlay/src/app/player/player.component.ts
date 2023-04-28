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
  ) {}

  public thisPlayer: any = {};
  public thisPlayerScore: number = 0;
  public boxes: any[] = Array(3).fill(null);
  public playerName: string = 'Player';
  public playerImageUrl: string =
    'https://cdn.scoresaber.com/avatars/oculus.png';

  ngOnInit() {
    this.webSocketService.connect().subscribe((message) => {
      if (message.type === 'matchPoint' && message.player === this.thisPlayer.userId) {
        if (message.incrementDecrement === 'increment' && this.thisPlayerScore < 3) {
          console.log("here")
          this.thisPlayerScore++;
        } else if (message.incrementDecrement === 'decrement' && this.thisPlayerScore > 0) {
          this.thisPlayerScore--;
        }
      }
    });
    this.playerService.currentPlayers.subscribe((players) => {
      if (players[0] !== '' && players[0] !== undefined) {
        this.thisPlayer = players[0];
        this.playerName = players[0].name;
        if (players[0].userId.length === 17) {
          this.playerImageUrl = `https://cdn.scoresaber.com/avatars/${players[0].userId}.jpg`;
        }
      }
    });
  }

  getPointBoxes(): string[]{
    return Array.from({length: this.thisPlayerScore}, () => ('pointScored'));
  }
}
