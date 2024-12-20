import {Component, OnInit} from '@angular/core';
import {RouterModule} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {ProductModel, ProductRequest, ProductType} from "./product.model";
import {CommonModule} from "@angular/common";
import {ProductService} from "../../service/product.service";
import {catchError, switchMap, tap} from "rxjs/operators";
import {FormsModule} from "@angular/forms";
import {ProductCreateComponent} from "./creation/product-create.component";
import {ToastService} from "../../shared/toast/toast.service";
import {ProductUpdateComponent} from "./update/product-update.component";
import {ProductRemoveComponent} from "./remove/product-remove.component";

@Component({
  selector: 'app-product',
  imports: [RouterModule, CommonModule, FormsModule, ProductCreateComponent, ProductUpdateComponent, ProductRemoveComponent],
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(private productService: ProductService, private toastService: ToastService) {
  }
  type: ProductType = ProductType.RAW;

  products: Observable<ProductModel[]> = this.findProducts();
  productCount: number = 0;
  typeEnum = ProductType;

  selectedProduct: ProductModel = {} as ProductModel;
  productToRemove: ProductModel = {} as ProductModel;

  ngOnInit(): void {
    this.findProducts();
  }

  private findProducts(): Observable<ProductModel[]> {
    return this.productService.findProducts(this.type).pipe(
      tap((products: ProductModel[]) => this.productCount = products.length)
    )
  }

  change(type: ProductType) {
    this.type = type;
    this.products = this.findProducts()
  }

  createProduct(productForm: ProductRequest) {
    this.productService.createProduct(productForm)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Produit <${response.name}> créé avec succées`)
        }),
        switchMap((response: ProductModel) => {
          this.products = this.findProducts();
          return this.products;
        }),
        catchError(() => {
          this.toastService.showSucess('Problème survenu lors de la création du produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  updateProduct(productForm: ProductRequest) {
    productForm.publicId = this.selectedProduct.publicId;
    this.productService.updateProduct(productForm)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Produit <${response.name}> modifié avec succées`)
        }),
        switchMap((response: ProductModel) => {
          this.products = this.findProducts();
          this.selectedProduct = {} as ProductModel;
          return this.products;
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la modification du produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  deleteProduct() {
    this.productService.removeProduct(this.productToRemove.publicId)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Produit <${this.productToRemove.name}> supprimé avec succées`)
        }),
        switchMap(() => {
          this.products = this.findProducts();
          this.productToRemove = {} as ProductModel;
          return this.products;
        }),
        catchError((errror) => {
          console.log(errror)
          this.toastService.showFail('Problème survenu lors de la suppression du produit');
          return new Observable();
        })
      )
      .subscribe()
  }
}
