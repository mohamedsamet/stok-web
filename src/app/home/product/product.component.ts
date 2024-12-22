import {Component, ViewChild} from '@angular/core';
import {RouterModule} from "@angular/router";
import {Observable} from "rxjs";
import {ProductModel, ProductQuantityModel, ProductRequest, ProductType} from "./product.model";
import {CommonModule} from "@angular/common";
import {ProductService} from "../../service/product.service";
import {catchError, tap} from "rxjs/operators";
import {FormsModule} from "@angular/forms";
import {ProductCreateComponent} from "./creation/product-create.component";
import {ToastService} from "../../shared/toast/toast.service";
import {ProductUpdateComponent} from "./update/product-update.component";
import {RemoveComponent} from "../shared/remove/remove.component";
import {ProductQuantityComponent} from "./quantity/product-quantity.component";

@Component({
  selector: 'app-product',
  imports: [RouterModule, CommonModule, FormsModule, ProductQuantityComponent, ProductCreateComponent, ProductUpdateComponent, RemoveComponent],
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {

  constructor(private productService: ProductService, private toastService: ToastService) {
  }
  type: ProductType = ProductType.RAW;

  products: Observable<ProductModel[]> = this.findProducts();
  productCount: number = 0;
  typeEnum = ProductType;
  quantityMode = '';

  @ViewChild(ProductQuantityComponent) productQuantity?: ProductQuantityComponent;
  @ViewChild(ProductUpdateComponent) productUpdate?: ProductUpdateComponent;
  @ViewChild(RemoveComponent) removeComponent?: RemoveComponent;

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
          this.products = this.findProducts();
        }),
        catchError(() => {
          this.toastService.showSucess('Problème survenu lors de la création du produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  updateProduct(productForm: ProductRequest) {
    this.productService.updateProduct(productForm)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Produit <${response.name}> modifié avec succées`);
          this.products = this.findProducts();
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la modification du produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  deleteProduct(product: ProductRequest) {
    this.productService.removeProduct(product.publicId)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Produit <${product?.name}> supprimé avec succées`);
          this.products = this.findProducts();
        }),
        catchError((errror) => {
          console.log(errror)
          this.toastService.showFail('Problème survenu lors de la suppression du produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  addQuantity(productQuantity: ProductQuantityModel) {
    this.productService.addQuantity(productQuantity.publicId, productQuantity.quantity)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Quantité de produit modifiée avec succès`);
          this.products = this.findProducts();
        }),
        catchError((errror) => {
          console.log(errror)
          this.toastService.showFail('Problème survenu lors de la modification de la qunatité de produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  subtractQuantity(productQuantity: ProductQuantityModel) {
    this.productService.subtractQuantity(productQuantity.publicId, productQuantity.quantity)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Quantité de produit modifié avec succès`);
          this.products = this.findProducts();
        }),
        catchError((errror) => {
          console.log(errror)
          this.toastService.showFail('Problème survenu lors de la modification de la qunatité de produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  openModalChangeQuantity(item: ProductModel, sign: string) {
    this.quantityMode = sign;
    this.productQuantity?.openQuantityModal(item);
  }
}
