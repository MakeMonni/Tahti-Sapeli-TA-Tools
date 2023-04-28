import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SongInfoComponent } from './song-info/song-info.component';
import { PlayerComponent } from './player/player.component';
import { Player2Component } from './player2/player2.component';
import { PlayerScoreComponent } from './player-score/player-score.component';
import { PlayerScore2Component } from './player-score2/player-score2.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { ReversePipe } from './reverse.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SongInfoComponent,
    PlayerComponent,
    Player2Component,
    PlayerScoreComponent,
    PlayerScore2Component,
    ReversePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
