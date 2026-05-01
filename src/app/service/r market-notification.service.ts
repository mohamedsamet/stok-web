import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface MarketAnalysisEvent {
  id: string;
  sourceId: string;
  theme: string;
  type: string;
  genereLe: string;
  prediction: string;
  proposition: string;
  ton: 'positif' | 'negatif' | 'neutre';
  urgence: 'haute' | 'moyenne' | 'basse';
  categorie: string;
  analyseEl: string;
}

@Injectable({ providedIn: 'root' })
export class MarketNotificationService {

  private readonly BASE = 'http://localhost:8080/api/test/market_events_analyses';
  private stream$ = new Subject<MarketAnalysisEvent>();
  private eventSource: EventSource | null = null;

  constructor(private zone: NgZone) {
    this.connectSSE();
  }

  private connectSSE(): void {
    this.eventSource = new EventSource(`${this.BASE}/stream`);

    this.eventSource.addEventListener('market-analysis', (event: MessageEvent) => {
      this.zone.run(() => {
        const data: MarketAnalysisEvent = JSON.parse(event.data);
        this.stream$.next(data);
      });
    });

    this.eventSource.onerror = () => {
      this.eventSource?.close();
      // reconnect auto après 5s
      setTimeout(() => this.connectSSE(), 5000);
    };
  }

  onAnalysis(): Observable<MarketAnalysisEvent> {
    return this.stream$.asObservable();
  }

  disconnect(): void {
    this.eventSource?.close();
  }
}
