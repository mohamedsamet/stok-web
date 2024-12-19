import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ProductModel, ProductRequest, ProductType} from "../home/product/product.model";
import {HttpClient} from "@angular/common/http";
import {HOST} from "../../environments/environment";
import {BASE_URL, CREATE_PRODUCT, LOGIN, PRODUCTS} from "../utils/url.constants";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  findProducts(type: ProductType): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${HOST}${BASE_URL}${PRODUCTS}${type}`)
  }

  createProduct(product: ProductRequest): Observable<ProductModel> {
    return this.http.post<ProductModel>(`${HOST}${BASE_URL}${CREATE_PRODUCT}`, product)
  }
}
