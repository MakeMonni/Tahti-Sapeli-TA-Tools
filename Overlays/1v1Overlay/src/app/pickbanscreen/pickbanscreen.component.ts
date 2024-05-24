import { Component, OnInit } from '@angular/core';
import { PickbanmapComponent } from '../pickbanmap/pickbanmap.component';
import { WebsocketService } from '../websocket.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pickbanscreen',
  templateUrl: './pickbanscreen.component.html',
  styleUrls: ['./pickbanscreen.component.css']
})
export class PickbanscreenComponent implements OnInit {

  constructor(
    private webSocketService: WebsocketService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) { }

  //Temp, clean this away later
  private songInfo = {
    hash: "",
    songName: "I Don't Know Why",
    songSubName: "(Ellis Remix)",
    mapper: "General Dumbass",
    songAuthor: "NOTD, Astrid S",
    coverImageUrl: "https://eu.cdn.beatsaver.com/31cc90945ba84bd41aa966cd2bf2b84e54b3ab8d.jpg",
    bsrKey: "17e17",
    bpm: 120,
    diffId: "Expert",
    diffString: "Expert",
    nps: 5.67,
    picker: "",
    winner: "",
    picktype: "",
    category: "Tech",
    order: -1
  };

  private songInfo2 = {
    hash: "",
    songName: "I Don't Know Why",
    songSubName: "(Ellis Remix)",
    mapper: "General Dumbass",
    songAuthor: "NOTD, Astrid S",
    coverImageUrl: "https://eu.cdn.beatsaver.com/991e8a488c2b9212670195d0e1c5d85614d5390e.jpg",
    bsrKey: "17e17",
    bpm: 120,
    diffId: "ExpertPlus",
    diffString: "Expert+",
    nps: 5.67,
    picker: "",
    winner: "",
    picktype: "",
    playerImageUrl: "https://cdn.scoresaber.com/avatars/76561198061930684.jpg",
    category: "Speed",
    order: -1
  };

  private songInfo3 = {
    hash: "",
    songName: "I Don't Know Why",
    songSubName: "(Ellis Remix)",
    mapper: "General Dumbass",
    songAuthor: "NOTD, Astrid S",
    coverImageUrl: "https://eu.cdn.beatsaver.com/61fa79e024a54672df4794f23f47797f43461b99.jpg",
    bsrKey: "17e17",
    bpm: 120,
    diffId: "Expert",
    diffString: "Expert",
    nps: 5.67,
    picker: "",
    winner: "",
    picktype: "",
    playerImageUrl: "https://cdn.scoresaber.com/avatars/76561198061930684.jpg",
    category: "Accuracy",
    order: -1
  };

  private songInfo4 = {
    hash: "",
    songName: "I Don't Know Why",
    songSubName: "(Ellis Remix)",
    mapper: "General Dumbass",
    songAuthor: "NOTD, Astrid S",
    coverImageUrl: "https://eu.cdn.beatsaver.com/991e8a488c2b9212670195d0e1c5d85614d5390e.jpg",
    bsrKey: "17e17",
    bpm: 120,
    diffId: "ExpertPlus",
    diffString: "Expert+",
    nps: 5.67,
    picker: "76561198148209170",
    winner: "Make",
    picktype: "ban",
    playerImageUrl: this.resolvePlayerImage("76561198148209170"),
    category: "MidSpeed",
    order: -1
  };

  private songInfo5 = {
    hash: "",
    songName: "I Dgon't QKnyIow Why",
    songSubName: "(Ellis Remix)",
    mapper: "GeneIralg DumQqbyass",
    songAuthor: "NgOTyD, AstrQqid S",
    coverImageUrl: "https://eu.cdn.beatsaver.com/991e8a488c2b9212670195d0e1c5d85614d5390e.jpg",
    bsrKey: "17e17",
    bpm: 120,
    diffId: "ExpertPlus",
    diffString: "Expert+",
    nps: 5.67,
    picktype: "pick",
    winner: "Generalyy Dumbass",
    picker: "76561198061930684",
    playerImageUrl: this.resolvePlayerImage("76561198061930684"),
    category: "Classic",
    order: 1
  };

  public maps: any[] = []
  private followedCordId: string = '';

  ngOnInit(): void {
    this.webSocketService.connect().subscribe(async (message) => {
      if ( message.type === "matches") {
        const currentPool = this.maps

        try {
          const followedPool = message.matches.find((x: { coordinatorUser: { guid: string; }; }) => x.coordinatorUser.guid === this.followedCordId).pool;

          if ((JSON.stringify(followedPool) !== JSON.stringify(currentPool)) || followedPool === undefined) {
            // Reset current maps
            if(followedPool === undefined){
              this.maps = [];
              return;
            }
            this.maps = [];

            const songHashes = followedPool.map((e: { hash: string; }) => e.hash);
            const joinedHash = songHashes.join(',');

            const songInfos = await fetch(`https://api.monni.moe/maps?h=${joinedHash}`)
              .then((res) => res.json())
              .catch((err) => console.log(err));

            // Sort api return back into same order as on the playlist
            const sortedArr = songHashes.map((ref: any) => {
              const found = songInfos.find((e: { versions: { hash: any; }[]; }) => e.versions[0].hash === ref);
              if (found) { return found; }
            });

            for (let i = 0; i < sortedArr.length; i++) {
              const songInfo = sortedArr[i]
              const diffIdentifier = followedPool[i].difficulties[0].name;

              const diff = songInfo.versions[0].diffs.find(
                (x: { difficulty: any }) => x.difficulty.toUpperCase() === diffIdentifier.toUpperCase()
              );

              this.maps.push({
                hash: songInfo.versions[0].hash,
                songName: songInfo.metadata.songName,
                songSubName: songInfo.metadata.songSubName,
                mapper: songInfo.metadata.levelAuthorName,
                songAuthor: songInfo.metadata.songAuthorName,
                coverImageUrl: songInfo.versions[0].coverURL,
                bsrKey: songInfo.key.toLowerCase(),
                bpm: songInfo.metadata.bpm,
                diffId: this.mapDiff(diffIdentifier),
                diffString: diffIdentifier.charAt(0).toUpperCase() + diffIdentifier.slice(1).replace('Plus', '+'),
                nps: Number(diff.nps.toFixed(2)),
                category: followedPool[i].difficulties[0].category
              })
            }
          }

        } catch (err) {
          console.log(err)
          this.maps = currentPool
        }


      } else if (message.type === 'pickBan') {

        const mapIndex = this.maps.findIndex(e => e.hash === message.hash)

        if (mapIndex !== -1) {

          let map = this.maps[mapIndex]

          if (message.undo) {
            map.picktype = ""
            map.picker = ""
            map.playerImageUrl = ""
            this.maps[mapIndex] = map;
          }
          else {
            map.picktype = message.pickBan
            map.picker = message.player
            map.playerImageUrl = this.resolvePlayerImage(message.player)
          }

          this.maps[mapIndex] = map;
        }
      } else if (message.type === 'mapWon') {
        const mapIndex = this.maps.findIndex(e => e.hash === message.hash)

        if (mapIndex !== -1) {
          let map = this.maps[mapIndex]
          if (message.undo) {
            map.winner = ""
          }
          else {
            map.winner = message.player
          }
          this.maps[mapIndex] = map;
        }
      }
      else if (message.type === 'coordinatorFollow') {
        this.followedCordId = message.coordinatorId;
      }

    });
  }

  private mapDiff(diff: string): string {
    switch (diff.toUpperCase()) {
      case "EXPERTPLUS": return "ExpertPlus"
      case "EXPERT": return "Expert"
      case "HARD": return "Hard"
      case "NORMAL": return "Normal"
      default: return "Easy"
    }
  }

  private resolvePlayerImage(playerId: string): string {
    if (playerId.length === 17) {
      return `https://cdn.scoresaber.com/avatars/${playerId}.jpg`;
    }
    else return 'https://cdn.scoresaber.com/avatars/oculus.png';
  }

}