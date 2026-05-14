import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MarketAlertWebSocketService } from '../../../service/market-alert-websocket.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { MarketNotification } from '../../../shared/models/market-notification.model';

@Component({
  selector: 'app-notification-bar',
  standalone: true,
  imports: [CommonModule],
  template: ''
})
export class NotificationBarComponent implements OnInit, OnDestroy {
  private sub = new Subscription();
  private idCounter = 0;

  constructor(
    private wsService: MarketAlertWebSocketService,
    private toastService: ToastService
  ) {}

 ngOnInit(): void {
  this.sub = this.wsService.alerts$.subscribe((alert: any) => {
    console.log('[ALERTE REÇUE]', alert);

    if (!alert._id && !alert.id) return;
    if (!alert.themes?.length) return;

    alert.themes.forEach((theme: any) => {
      const notif: MarketNotification = {
        id: ++this.idCounter,
        mongoId: alert._id || alert.id || '',
        theme: theme.theme || '',
        prediction: theme.prediction || '',
        urgence: theme.propositions?.urgence || 'faible',
        categorie: theme.propositions?.categorie || 'autre',
        progress: 100
      };

      this.toastService.showAlert(notif);
    });
  });
}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}