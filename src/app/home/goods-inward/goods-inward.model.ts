import {ProviderModel} from "../provider/provider.model";

export interface GoodsInwardModel {
  provider: ProviderModel;
  publicId: string;
  reference: string;
  creationDate: Date;
}

export interface GoodsInwardResponse {
  goodsInwards: GoodsInwardModel[];
  count: number;
}


export interface GoodsInwardRequest {
  publicId: string;
}

