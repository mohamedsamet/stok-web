import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HOST} from "../../environments/environment";
import {BASE_URL, CLOSE, PRODUCT, STATION} from "../utils/url.constants";
import {StationModel, StationRequest} from "../home/station/station.model";

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }

  findStations(): Observable<StationModel[]> {
    return this.http.get<StationModel[]>(`${HOST}${BASE_URL}${STATION}`)
  }

  createStation(station: StationRequest): Observable<StationModel> {
    return this.http.post<StationModel>(`${HOST}${BASE_URL}${STATION}`, station)
  }

  updateStation(station: StationRequest): Observable<StationModel> {
    return this.http.put<StationModel>(`${HOST}${BASE_URL}${STATION}/${station.publicId}`, station)
  }

  finalizeStation(stationPublicId: string): Observable<StationModel> {
    return this.http.put<StationModel>(`${HOST}${BASE_URL}${STATION}${CLOSE}/${stationPublicId}`, {});
  }

}
