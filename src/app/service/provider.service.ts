import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HOST} from "../../environments/environment";
import {
  BASE_URL,
  DRAFT, PROVIDER_SEARCH, PROVIDER
} from "../utils/url.constants";
import {SearchModel} from "../home/shared/model/search.model";
import {ProviderModel, ProviderRequest, ProviderResponse} from "../home/provider/provider.model";

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  constructor(private http: HttpClient) { }

  createDraftProvider(): Observable<ProviderModel> {
    return this.http.post<ProviderModel>(`${HOST}${BASE_URL}${PROVIDER}${DRAFT}`, {})
  }

  createProvider(provider: ProviderRequest): Observable<ProviderModel> {
    return this.http.post<ProviderModel>(`${HOST}${BASE_URL}${PROVIDER}`, provider)
  }

  updateProvider(provider: ProviderRequest): Observable<ProviderModel> {
    return this.http.put<ProviderModel>(`${HOST}${BASE_URL}${PROVIDER}`, provider)
  }

  removeProvider(publicId: string): Observable<any> {
    return this.http.delete(`${HOST}${BASE_URL}${PROVIDER}/${publicId}`);
  }

  findAllProviders(search: SearchModel): Observable<ProviderResponse> {
    return this.http.post<ProviderResponse>(`${HOST}${BASE_URL}${PROVIDER_SEARCH}`, search)
  }
}
