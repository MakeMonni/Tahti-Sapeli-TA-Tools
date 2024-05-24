import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.css'],
})
export class SongInfoComponent implements OnInit {
  constructor(
    private webSocketService: WebsocketService,
    private playerService: PlayerService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { }

  public songName: string = 'FEHLT';
  public songSubName: string = '';
  public nps: number = 12.3;
  public bpm: number = 234;
  public duration: string = '0:00';
  public mapper: string = 'Nolaniyymationsy';
  public songAuthor: string = 'Schwank';
  public coverImageUrl: string = 'https://eu.cdn.beatsaver.com/2b4fb21d8752a3b07a8dfbd7a1082e1a1448427a.jpg';
  public bsrKey: string = '17e17';
  public diffId: string = 'Easy';
  public diffString: string = 'Easy';

  public songNameTag: string =
    '<marquee direction="left" scrollamount="5" class="song">{{songName}}</marquee>';

  private followedCordId: string = '';

  ngOnInit() {
    this.webSocketService.connect().subscribe(async (message) => {

      if (message.type === 'coordinatorFollow') {
        this.followedCordId = message.coordinatorId;
      }

      if (message.type === 'matches') {
        console.log('match updated');
        const followedMatch = message.matches.find(
          (x: { coordinatorUser: { guid: string } }) =>
            x.coordinatorUser.guid === this.followedCordId
        );

        if (followedMatch) {
          const users = followedMatch.matchUsers.sort(
            (a: { name: string }, b: { name: string }) => a.name > b.name
          );
          let players = users.filter(
            (x: { userId: string }) => x.userId.length > 5
          );
          this.playerService.changePlayers(players);

          const mapHash = followedMatch.song.hash;
          if (followedMatch.song.hash) {
            const songInfo = await fetch(`https://api.monni.moe/map?h=${mapHash}`)
              .then((res) => res.json())
              .catch((err) => console.log(err));

            this.songName = songInfo.metadata.songName;
            this.songSubName = songInfo.metadata.songSubName;
            this.mapper = songInfo.metadata.levelAuthorName;
            this.songAuthor = songInfo.metadata.songAuthorName;

            this.coverImageUrl = songInfo.versions[0].coverURL;
            this.bsrKey = songInfo.key;
            this.bpm = songInfo.metadata.bpm;

            if (followedMatch.song?.char) {
              try {
                const diffIdentifier = followedMatch.song?.diffIndex;
                this.diffId = diffIdentifier;
                this.diffString = diffIdentifier.replace('Plus', '+');
                const diff = songInfo.versions[0].diffs.find(
                  (x: { difficulty: any }) => x.difficulty === diffIdentifier
                );

                this.nps = Number(diff.nps.toFixed(2));

                const time = (seconds: number) =>
                  `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${(seconds % 60).toFixed(0)}`;
                this.duration = time(diff.seconds);
              } catch (err) {
                console.log('Diff not selected');
              }
            }
          }

        }
      }
    });

    this.webSocketService.send({ type: 'matchesPlease' });
  }
}
