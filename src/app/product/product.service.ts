import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BASE_URL, PRODUCT_SEARCH, PRODUCT_TYPE, TYPES, USER} from "../utils/url.constants";
import {HOST} from "../../environments/environment";
import {Observable} from "rxjs";
import {ProductModel} from "./model/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  searchByType(type: string): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${HOST}${BASE_URL}${PRODUCT_SEARCH}${PRODUCT_TYPE}/${type}`);
  }
}
