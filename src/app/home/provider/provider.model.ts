export interface ProviderModel {
  name: string;
  publicId: string;
  address: string;
  fiscalAddress: string;
  reference: string;
  creationDate: Date;
}

export interface ProviderResponse {
  providers: ProviderModel[];
  count: number;
}


export interface ProviderRequest {
  publicId: string;
  name: string;
  address: string;
  fiscalAddress: string;
}

