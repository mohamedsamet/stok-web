import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Notification {
  id: number;
  tag: string;
  theme: string;
  proposition: string;
  ton: 'positif' | 'negatif' | 'neutre' | 'warning';
  time: string;
  _timerId?: ReturnType<typeof setInterval>;
  progress: number;
}

@Component({
  selector: 'app-notification-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit {

  notifications: Notification[] = [];
  private idCounter = 0;

  private demos: Omit<Notification, 'id' | 'progress'>[] = [
    {
      ton: 'positif',
      tag: 'Hausse',
      theme: 'BMW AG — +4.2%',
      proposition: 'Signal haussier détecté. Momentum favorable sur 5 jours.',
      time: 'À l\'instant'
    },
    {
      ton: 'negatif',
      tag: 'Alerte',
      theme: 'LVMH — Correction',
      proposition: 'Franchissement du support à 680 €. Risque élevé à court terme.',
      time: 'À l\'instant'
    },
    {
      ton: 'neutre',
      tag: 'Info',
      theme: 'Portefeuille mis à jour',
      proposition: 'Rééquilibrage automatique effectué. 12 lignes ajustées.',
      time: 'À l\'instant'
    },
    {
      ton: 'warning',
      tag: 'warning',
      theme: 'Volatilité détectée',
      proposition: 'VIX > 25. Exposition aux actifs risqués recommandée à la baisse.',
      time: 'À l\'instant'
    },
    {
      ton: 'positif',
      tag: 'Dividende',
      theme: 'Total Energies — Coupon',
      proposition: 'Versement de 0.79 € par action confirmé pour le 26 avril.',
      time: 'À l\'instant'
    },
    {
      ton: 'negatif',
      tag: 'Stop-loss',
      theme: 'Airbus — Seuil atteint',
      proposition: 'Ordre stop déclenché à 148.20 €. Position clôturée.',
      time: 'À l\'instant'
    }
  ];

  ngOnInit(): void {
    // Ajouter 3 notifications de démo au démarrage
    this.demos.slice(0, 3).forEach((demo, i) => {
      setTimeout(() => this.push(demo), i * 400);
    });
  }

  /**
   * Ajoute une notification avec auto-suppression après 6 secondes
   */
  push(data: Omit<Notification, 'id' | 'progress'>): void {
    const notif: Notification = {
      ...data,
      id: ++this.idCounter,
      progress: 100,
      time: 'À l\'instant'
    };

    this.notifications.unshift(notif);

    // Barre de progression décroissante sur 6 secondes
    const step = 100 / 60; // 60 ticks × 100ms = 6 000ms
    notif._timerId = setInterval(() => {
      notif.progress -= step;
      if (notif.progress <= 0) {
        this.removeById(notif.id);
      }
    }, 100);
  }

  close(index: number): void {
    const notif = this.notifications[index];
    if (notif?._timerId) clearInterval(notif._timerId);
    this.notifications.splice(index, 1);
  }

  clearAll(): void {
    this.notifications.forEach(n => { if (n._timerId) clearInterval(n._timerId); });
    this.notifications = [];
  }

  addRandom(): void {
    const demo = this.demos[Math.floor(Math.random() * this.demos.length)];
    this.push(demo);
    if (this.notifications.length > 6) {
      this.close(this.notifications.length - 1);
    }
  }

  private removeById(id: number): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index > -1) this.close(index);
  }
}
