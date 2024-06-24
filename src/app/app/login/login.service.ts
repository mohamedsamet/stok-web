import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BASE_URL, LOGIN, USER} from "../utils/url.constants";
import {HOST} from "../../../environments/environment";
import {Observable} from "rxjs";
import {LoginRequest} from "./model/login-request.model";
import {LoginResponseModel} from "./model/login-response.model";
import {TokenResponseModel} from "./model/token-response.model";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  createUser(loginRequest: LoginRequest): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>(`${HOST}${BASE_URL}${USER}`, loginRequest)
  }

  loginUser(loginRequest: LoginRequest): Observable<TokenResponseModel> {
    return this.http.post<TokenResponseModel>(`${HOST}${BASE_URL}${LOGIN}`, loginRequest)
  }
}
