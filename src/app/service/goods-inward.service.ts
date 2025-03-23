import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HOST} from "../../environments/environment";
import {
  BASE_URL,
  DRAFT, PROVIDER_SEARCH, PROVIDER, GOODS_INWARD, SEARCH
} from "../utils/url.constants";
import {SearchModel} from "../home/shared/model/search.model";
import {ProviderModel, ProviderRequest, ProviderResponse} from "../home/provider/provider.model";
import {GoodsInwardModel, GoodsInwardRequest, GoodsInwardResponse} from "../home/goods-inward/goods-inward.model";

@Injectable({
  providedIn: 'root'
})
export class GoodsInwardService {

  constructor(private http: HttpClient) { }

  createDraftInward(): Observable<GoodsInwardModel> {
    return this.http.post<GoodsInwardModel>(`${HOST}${BASE_URL}${GOODS_INWARD}${DRAFT}`, {})
  }

  createGoodsInward(goodsInward: GoodsInwardRequest): Observable<GoodsInwardModel> {
    return this.http.post<GoodsInwardModel>(`${HOST}${BASE_URL}${GOODS_INWARD}`, goodsInward)
  }

  updateGoodsInward(goodsInward: GoodsInwardRequest): Observable<GoodsInwardModel> {
    return this.http.put<GoodsInwardModel>(`${HOST}${BASE_URL}${GOODS_INWARD}`, goodsInward)
  }

  removeProvider(publicId: string): Observable<any> {
    return this.http.delete(`${HOST}${BASE_URL}${PROVIDER}/${publicId}`);
  }

  findAllGoodsInward(search: SearchModel): Observable<GoodsInwardResponse> {
    return this.http.post<GoodsInwardResponse>(`${HOST}${BASE_URL}${GOODS_INWARD}${SEARCH}`, search)
  }
}
