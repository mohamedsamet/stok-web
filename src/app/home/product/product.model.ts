
export interface ProductModel {
  publicId: string;
  provider: string;
  name: string;
  quantity: number;
  unit: string;
  type: ProductType;
}

export interface ProductQuantityModel {
  quantity: number;
  publicId: string;
}

export interface ProductRequest {
  provider: string;
  name: string;
  initialValue: number;
  unit: ProductUnit;
  type: ProductType;
  publicId: string;
}

export enum ProductType {
  RAW = "RAW",
  FINAL = "FINAL"
}

export enum ProductUnit {
  KG = "KG",
  PIECE = "PIECE"
}

export interface SelectProductModel {
  publicId: string;
  product: ProductModel;
}
