import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MarketAlertWebSocketService } from '../../../service/market-alert-websocket.service';

export interface MarketNotification {
  id: number;
  mongoId: string;
  theme: string;
  prediction: string;
  urgence: string;
  categorie: string;
  progress: number;
  _timerId?: ReturnType<typeof setInterval>;
}

@Component({
  selector: 'app-notification-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit, OnDestroy {

  notifications: MarketNotification[] = [];
  private idCounter = 0;
  private subscription: Subscription = new Subscription();

  constructor(private wsService: MarketAlertWebSocketService) {}

  ngOnInit(): void {
    this.subscription = this.wsService.alerts$.subscribe((alert: any) => {

      console.log('[NOTIF REÇUE]', alert);

      if (!alert.prediction || alert.prediction.trim() === '') return;
      if (!alert.theme || alert.theme.trim() === '') return;
      if (!alert._id && !alert.id) return;
      if (!alert.source_id) return; 

      this.push({
        mongoId: alert._id || alert.id || '',
        theme: alert.theme || '',
        prediction: alert.prediction || '',
        urgence: alert.urgence || 'faible',
        categorie: alert.categorie || 'autre'
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  push(data: Omit<MarketNotification, 'id' | 'progress'>): void {
    const notif: MarketNotification = {
      ...data,
      id: ++this.idCounter,
      progress: 100
    };

    this.notifications.unshift(notif);

    const step = 100 / 3000;
    notif._timerId = setInterval(() => {
      notif.progress -= step;
      if (notif.progress <= 0) {
        this.removeById(notif.id);
      }
    }, 100);

    if (this.notifications.length > 6) {
      this.close(this.notifications.length - 1);
    }
  }

  openAlert(n: MarketNotification): void {
window.open(`http://localhost:5173/analyses?id=${n.mongoId}`, 'market-feedback');  }

  close(index: number): void {
    const notif = this.notifications[index];
    if (notif?._timerId) clearInterval(notif._timerId);
    this.notifications.splice(index, 1);
  }

  clearAll(): void {
    this.notifications.forEach(n => { if (n._timerId) clearInterval(n._timerId); });
    this.notifications = [];
  }

  private removeById(id: number): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index > -1) this.close(index);
  }
}