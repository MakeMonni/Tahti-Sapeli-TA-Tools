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
  ) {}

  public songName: string = 'No song selected';
  public songSubName: string = 'sub name';
  public nps: number = 12;
  public bpm: number = 120;
  public duration: string = '0:00';
  public mapper: string = 'mabber 123 & bob';
  public songAuthor: string = 'Bob69Slayer';
  public coverImageUrl: string =
    'https://cdn.discordapp.com/attachments/840144337231806484/1100119704674250812/Beat_Saber_Finland-hehkuton_smol.jpg';
  public bsrKey: string = '123';
  public diffId: string = 'ExpertPlus';
  public diffString: string = 'Expert+';

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
          const songInfo = await fetch(`http://api.monni.moe/map?h=${mapHash}`)
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
                `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${
                  seconds % 60
                }`;
              this.duration = time(diff.seconds);
            } catch (err) {
              console.log('Diff not selected');
            }
          }
        }
      }
    });

    this.webSocketService.send({ type: 'matchesPlease' });
  }
}
