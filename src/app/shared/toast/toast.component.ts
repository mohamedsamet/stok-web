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
  toasts: ActiveToast[] = [];
  private idCounter = 0;
  statusEnum = Status;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.getToast().subscribe((payload: ToastPayload) => {
      this.push(payload);
    });
  }

  push(payload: ToastPayload): void {
    const toast: ActiveToast = { ...payload, id: ++this.idCounter, progress: 100 };
    this.toasts.unshift(toast);

    const duration = 6000;
    const step = 100 / (duration / 100);
    toast._timerId = setInterval(() => {
      toast.progress -= step;
      if (toast.progress <= 0) this.removeById(toast.id);
    }, 100);

    if (this.toasts.length > 5) this.close(this.toasts.length - 1);
  }

  close(index: number): void {
    const toast = this.toasts[index];
    if (toast?._timerId) clearInterval(toast._timerId);
    this.toasts.splice(index, 1);
  }

  removeById(id: number): void {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index > -1) this.close(index);
  }

  openAlert(alert: MarketNotification): void {
    window.open(`http://localhost:5173/analyses?id=${alert.mongoId}`, 'market-feedback');
  }

  urgenceColor(urgence: string): string {
    return { haute: '#dc2626', élevée: '#dc2626', moyenne: '#d97706', faible: '#16a34a' }[urgence] ?? '#71717a';
  }
}