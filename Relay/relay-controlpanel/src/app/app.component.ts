import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'relay-controlpanel';

  async login() {
    window.location.href = "https://discord.com/oauth2/authorize?client_id=746364134219710577&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A51207%2F&scope=identify"
  }
}
