import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketAlertWebSocketService {

  private client: Client;
  private alertSubject = new Subject<any>();

  alerts$ = this.alertSubject.asObservable();

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8008/api/stok/ws'),
      onConnect: () => {
        this.client.subscribe('/topic/alerts', message => {
          const alert = JSON.parse(message.body);
          this.alertSubject.next(alert);
        });
      }
    });

    this.client.activate();
  }
}