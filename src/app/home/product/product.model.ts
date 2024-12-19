export interface ProductModel {
  publicId: string;
  provider: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface ProductRequest {
  provider: string;
  name: string;
  initialValue: number;
  unit: ProductUnit;
  type: ProductType
}

export enum ProductType {
  RAW = "RAW",
  FINAL = "FINAL"
}

export enum ProductUnit {
  KG = "KG",
  PIECE = "PIECE"
}
