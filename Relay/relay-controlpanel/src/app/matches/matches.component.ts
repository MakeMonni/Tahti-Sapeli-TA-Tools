import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WebsocketService } from '../websocket.service';

@Component({
    selector: 'app-matches',
    templateUrl: './matches.component.html',
    styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

    constructor(
        private webSocketService: WebsocketService
    ) { }

    @ViewChild('userInput') userInputRef!: ElementRef<HTMLInputElement>;
    private secretKey: string = "";

    ngOnInit(): void {
        this.webSocketService.connect().subscribe((message) => {

            console.log(message)
            if (message.type === "matches") {

                for (let i = 0; i < message.matches.length; i++) {
                    message.matches[i].matchUsers = message.matches[i].matchUsers.filter((x: { userId: string | any[]; }) => x.userId.length > 5)
                }

                const matchesToAdd = message.matches.filter((x: any) => {
                    let matches: any[] = [];
                    for (let i = 0; i < this.matches.length; i++) {
                        if (this.matches[i].matchUsers.toString() !== x.matches.matchUsers.toString()) {
                            matches.push(x)
                        }
                    }
                    return matches;
                });
                console.log(...matchesToAdd);

                const matchesToRemove = this.matches.filter((x: any) => {
                    return x.matchUsers !== message.matches.matchUsers
                })

                console.log(matchesToRemove);

                this.matches.push(...matchesToAdd);
                //his.matches.filter( matchesToRemove);

                //// maybe not needed?
                //for (let i = 0; i < this.localPools.length; i++) {
                //    const index = message.matches.findIndex((x: { coordinatorUser: any; }) => x.coordinatorUser.name === this.localPools[i].coordinatorUser.name)
                //    if (index !== -1) {
                //        message.matches[index].pool = this.localPools[i].pool;
                //    }
                //}
                //this.matches = message.matches;
            }
            else if (message.type === "") {
                // TODO
            }
        }

        );
        this.webSocketService.send({ type: 'matchesPlease' });
    }

    saveToMemory(): void {
        this.secretKey = this.userInputRef.nativeElement.value;
        this.userInputRef.nativeElement.value = '';
    }

    public matches: any = [];
    private localPools: any = [];

    copyText(event: MouseEvent): void {
        const textElement = event.target as HTMLElement;
        const textToCopy = textElement.innerText;

        navigator.clipboard.writeText(textToCopy).then(() => {
            console.log('Text copied to clipboard');
            alert('Text copied to clipboard: ' + textToCopy);
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }

    poolUploaded(event: any, coordinator: any): void {
        if (this.secretSet()) {

            try {
                const file: File = event.target.files[0];
                const reader = new FileReader();

                reader.onload = async (event) => {
                    const fileContent: string | ArrayBuffer | null = event.target?.result ?? null;

                    if (typeof fileContent === "string") {
                        try {
                            let jsonContent = JSON.parse(fileContent);
                            jsonContent.image = "";

                            const pool = jsonContent.songs;
                            const songHashes = pool.map((e: { hash: string; }) => e.hash);
                            const joinedHash = songHashes.join(',');

                            const songInfos = await fetch(`https://api.monni.moe/maps?h=${joinedHash}`)
                                .then((res) => res.json())
                                .catch((err) => console.log(err));

                            // Sort api return back into same order as on the playlist
                            const sortedArr = songHashes.map((ref: any) => {
                                const found = songInfos.find((e: { versions: { hash: any; }[]; }) => e.versions[0].hash === ref);
                                if (found) { return found; }
                            });

                            if (!this.localPools.includes({ pool: sortedArr, coordinatorUser: coordinator })) {
                                this.localPools.push({ pool: sortedArr, coordinatorUser: coordinator })
                            }
                            this.matches.find((x: { coordinatorUser: any; }) => x.coordinatorUser.name === coordinator.name).pool = sortedArr

                            const response = await fetch(`https://api.monni.moe/overlayPoolChange`, {
                                method: 'post',
                                body: JSON.stringify({ pool: jsonContent, coordinatorUser: coordinator, auth: this.secretKey }),
                                headers: { 'Content-Type': 'application/json' }
                            });

                            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}, ${response.statusText}`);

                        } catch (error) {
                            console.error("Error parsing JSON:", error);
                        }
                    } else {
                        console.log("Invalid playlist");
                    }
                };

                reader.readAsText(file);
            } catch (error) {
                alert(error);
            }
        }
    }

    async mapPicked(event: any, hash: string, player: string) {
        if (this.secretSet()) {
            try {
                const response = await fetch(`https://api.monni.moe/overlayMapAction`, {
                    method: 'post',
                    body: JSON.stringify({
                        pickBan: "pick",
                        hash: hash,
                        player: player,
                        undo: (!event.target.checked),
                        auth: this.secretKey
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}, ${response.statusText}`);

            } catch (error) {
                alert(error);
            }
        }
    }

    async mapBanned(event: any, hash: string, player: string) {

        if (this.secretSet()) {
            try {
                const response = await fetch(`https://api.monni.moe/overlayMapAction`, {
                    method: 'post',
                    body: JSON.stringify({
                        pickBan: "ban",
                        hash: hash,
                        player: player,
                        undo: (!event.target.checked),
                        auth: this.secretKey
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}, ${response.statusText}`);
            }
            catch (error) {
                alert(error);
            }
        }
    }

    async mapWon(event: any, hash: string, playerName: string, playerId: string) {
        if (this.secretSet()) {

            try {
                const response = await fetch(`https://api.monni.moe/overlayWinAction`, {
                    method: 'post',
                    body: JSON.stringify({
                        hash: hash,
                        player: playerName,
                        playerId: playerId,
                        undo: (!event.target.checked),
                        auth: this.secretKey
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}, ${response.statusText}`);
            }

            catch (error) {
                alert(error);
            }
        }
    }

    async matchSelected(coordinator: any) {
        if (this.secretSet()) {
            try {

                console.log(coordinator);

                const response = await fetch(`https://api.monni.moe/overlayFollowCoordinator`, {
                    method: 'post',
                    body: JSON.stringify({ coordinatorUser: coordinator, auth: this.secretKey }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}, ${response.statusText}`);

            } catch (error) {
                alert(error);
            }
        }
    }

    secretSet(): boolean {
        if (!this.secretKey) {
            alert('No secret set!');
            return false;
        }
        return true
    }
}

