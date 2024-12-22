export interface StationModel {
  publicId: string;
  name: string;
  operator: string;
  date: string;
  duration: number;
  machine: string;
  closed: boolean;
}


export interface StationRequest {
  provider: string;
  name: string;
  initialValue: number;
  publicId?: string;
}

