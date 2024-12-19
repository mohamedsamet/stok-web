export interface ProductModel {
  publicId: string;
  provider: string;
  name: string;
  quantity: number;
  unit: string;
}

export enum ProductType {
  RAW = "RAW",
  FINAL = "FINAL"
}
