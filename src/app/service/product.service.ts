import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ProductModel, ProductRequest, ProductType} from "../home/product/product.model";
import {HttpClient} from "@angular/common/http";
import {HOST} from "../../environments/environment";
import {BASE_URL, PRODUCT, LOGIN, PRODUCT_SEARCH_BY_TYPE} from "../utils/url.constants";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  findProducts(type: ProductType): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${HOST}${BASE_URL}${PRODUCT_SEARCH_BY_TYPE}${type}`)
  }

  createProduct(product: ProductRequest): Observable<ProductModel> {
    return this.http.post<ProductModel>(`${HOST}${BASE_URL}${PRODUCT}`, product)
  }

  updateProduct(product: ProductRequest): Observable<ProductModel> {
    return this.http.put<ProductModel>(`${HOST}${BASE_URL}${PRODUCT}`, product)
  }

  removeProduct(publicId: string): Observable<any> {
    return this.http.delete(`${HOST}${BASE_URL}${PRODUCT}/${publicId}`);
  }
}
