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