import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { MarketNotification } from "../models/market-notification.model";

export interface ToastPayload {
  message: string;
  status: Status;
  marketAlert?: MarketNotification;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toast$ = new Subject<ToastPayload>();

  getToast() {
    return this.toast$.asObservable();
  }

  showSucess(message: string) {
    this.toast$.next({ message, status: Status.SUCCESS });
  }

  showFail(message: string) {
    this.toast$.next({ message, status: Status.FAIL });
  }

  showAlert(alert: MarketNotification) {
    this.toast$.next({ message: alert.prediction, status: Status.ALERT, marketAlert: alert });
  }
}

export enum Status {
  SUCCESS = 'success',
  FAIL = 'fail',
  ALERT = 'alert'
}