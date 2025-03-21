import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HOST} from "../../environments/environment";
import {BASE_URL, CLOSE, DRAFT, STATION, STATION_SEARCH} from "../utils/url.constants";
import {StationModel, StationRequest, StationResponse} from "../home/station/station.model";
import {SearchModel} from "../home/shared/model/search.model";

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }

  findStations(searchModel: SearchModel): Observable<StationResponse> {
    return this.http.post<StationResponse>(`${HOST}${BASE_URL}${STATION_SEARCH}`, searchModel)
  }

  createStation(station: StationRequest): Observable<StationModel> {
    return this.http.post<StationModel>(`${HOST}${BASE_URL}${STATION}`, station)
  }

  createDraft(): Observable<StationModel> {
    return this.http.post<StationModel>(`${HOST}${BASE_URL}${STATION}${DRAFT}`, {})
  }

  updateStation(station: StationRequest): Observable<StationModel> {
    return this.http.put<StationModel>(`${HOST}${BASE_URL}${STATION}/${station.publicId}`, station)
  }

  finalizeStation(stationPublicId: string): Observable<StationModel> {
    return this.http.put<StationModel>(`${HOST}${BASE_URL}${STATION}${CLOSE}/${stationPublicId}`, {});
  }

  removeStation(stationPublicId: string): Observable<any> {
    return this.http.delete(`${HOST}${BASE_URL}${STATION}/${stationPublicId}`);
  }

}
