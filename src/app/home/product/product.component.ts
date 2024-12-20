import {Component, OnInit} from '@angular/core';
import {RouterModule} from "@angular/router";
import {Observable} from "rxjs";
import {ProductModel, ProductRequest, ProductType} from "./product.model";
import {CommonModule} from "@angular/common";
import {ProductService} from "../../service/product.service";
import {catchError, tap} from "rxjs/operators";
import {FormsModule} from "@angular/forms";
import {ProductCreateComponent} from "./creation/product-create.component";
import {ToastService} from "../../shared/toast/toast.service";
import {ProductUpdateComponent} from "./update/product-update.component";
import {ProductRemoveComponent} from "./remove/product-remove.component";
import {ProductQuantityComponent} from "./quantity/product-quantity.component";

@Component({
  selector: 'app-product',
  imports: [RouterModule, CommonModule, FormsModule, ProductQuantityComponent, ProductCreateComponent, ProductUpdateComponent, ProductRemoveComponent],
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
  quantityMode = '';
  selectedProduct: ProductModel = {} as ProductModel;
  selectedQuantityProduct: ProductModel = {} as ProductModel;
  productToRemove: ProductModel = {} as ProductModel;
  searchProduct: string = "";

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
    productForm.publicId = this.selectedProduct.publicId;
    this.productService.updateProduct(productForm)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Produit <${response.name}> modifié avec succées`);
          this.products = this.findProducts();
          this.selectedProduct = {} as ProductModel;
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
          this.toastService.showSucess(`Produit <${this.productToRemove.name}> supprimé avec succées`);
          this.products = this.findProducts();
          this.productToRemove = {} as ProductModel;
        }),
        catchError((errror) => {
          console.log(errror)
          this.toastService.showFail('Problème survenu lors de la suppression du produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  addQuantity(quantity: number) {
    this.productService.addQuantity(this.selectedQuantityProduct.publicId, quantity)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Quantité de produit modifié avec succès`);
          this.products = this.findProducts();
          this.selectedQuantityProduct = {} as ProductModel;
        }),
        catchError((errror) => {
          console.log(errror)
          this.toastService.showFail('Problème survenu lors de la modification de la qunatité de produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  subtractQuantity(quantity: number) {
    this.productService.subtractQuantity(this.selectedQuantityProduct.publicId, quantity)
      .pipe(
        tap((response: ProductModel) => {
          this.toastService.showSucess(`Quantité de produit modifié avec succès`);
          this.products = this.findProducts();
          this.selectedQuantityProduct = {} as ProductModel;
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
    this.selectedQuantityProduct = item;
    this.quantityMode = sign;

  }
}
