import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TA-Overlay-v2';

  constructor(private router: Router) {}

  isInPickban(): boolean {
    return this.router.url.includes('/pickban');
  }
}
