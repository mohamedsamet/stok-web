import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToastService, Status, ToastPayload } from "./toast.service";
import { MarketNotification } from "../models/market-notification.model";

interface ActiveToast extends ToastPayload {
  id: number;
  progress: number;
  _timerId?: ReturnType<typeof setInterval>;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  toasts: ActiveToast[] = [];       // toasts normaux → haut droite
  alerts: ActiveToast[] = [];       // alertes Kafka  → bas droite
  private idCounter = 0;
  statusEnum = Status;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.getToast().subscribe((payload: ToastPayload) => {
      // Si le payload vient de Kafka, il aura `alert` défini
      if (payload.status === Status.ALERT) {
  this.pushAlert(payload);
} else {
  this.push(payload);
}
    });
  }

  // --- Toasts normaux (haut droite) ---
  push(payload: ToastPayload): void {
    const toast: ActiveToast = { ...payload, id: ++this.idCounter, progress: 100 };
    this.toasts.unshift(toast);
    this.startTimer(toast, this.toasts);
    if (this.toasts.length > 5) this.close(this.toasts.length - 1, this.toasts);
  }

  // --- Alertes Kafka (bas droite) ---
  pushAlert(payload: ToastPayload): void {
    const toast: ActiveToast = { ...payload, id: ++this.idCounter, progress: 100 };
    this.alerts.unshift(toast);
    this.startTimer(toast, this.alerts);
    if (this.alerts.length > 5) this.close(this.alerts.length - 1, this.alerts);
  }

  private startTimer(toast: ActiveToast, list: ActiveToast[]): void {
    const duration = 6000;
    const step = 100 / (duration / 100);
    toast._timerId = setInterval(() => {
      toast.progress -= step;
      if (toast.progress <= 0) this.removeById(toast.id, list);
    }, 100);
  }

  close(index: number, list: ActiveToast[]): void {
    const toast = list[index];
    if (toast?._timerId) clearInterval(toast._timerId);
    list.splice(index, 1);
  }

  removeById(id: number, list?: ActiveToast[]): void {
  const target = list ?? [...this.toasts, ...this.alerts]; // fallback si appelé sans liste
  const arr = list ?? (this.toasts.find(t => t.id === id) ? this.toasts : this.alerts);
  const index = arr.findIndex(t => t.id === id);
  if (index > -1) this.close(index, arr);
}

  openAlert(alert: MarketNotification): void {
    window.open(`http://localhost:5173/analyses?id=${alert.mongoId}`, 'market-feedback');
  }

  urgenceColor(urgence: string): string {
    return { haute: '#dc2626', élevée: '#dc2626', moyenne: '#d97706', faible: '#16a34a' }[urgence] ?? '#71717a';
  }
}