import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private subject: WebSocketSubject<any>;

  private websocketUrl = 'wss://ta-relay.monni.moe/websocket'; 
  //private websocketUrl = 'ws://localhost:45555'; 

  constructor() {
    this.subject = webSocket(this.websocketUrl);
  }

  public connect(): Observable<any> {
    return this.subject.asObservable();
  }

  public send(message: any): void {
    this.subject.next(message);
  }

  public close(): void {
    this.subject.complete();
  }
}