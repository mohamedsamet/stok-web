import {Component, OnInit} from '@angular/core';
import {RouterModule} from "@angular/router";
import {Observable} from "rxjs";
import {ProductModel, ProductType} from "./product.model";
import {CommonModule} from "@angular/common";
import {ProductService} from "../../service/product.service";
import {tap} from "rxjs/operators";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-product',
  imports: [RouterModule, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(private productService: ProductService) {
  }

  products: Observable<ProductModel[]> = new Observable<ProductModel[]>();
  productCount: number = 0;
  type: ProductType = ProductType.RAW;
  typeEnum = ProductType;

  ngOnInit(): void {
    this.findProducts();
  }

  create() {

  }

  private findProducts() {
    this.products = this.productService.findProducts(this.type).pipe(
      tap((products: ProductModel[]) => this.productCount = products.length)
    )
  }

  change(type: ProductType) {
    this.type = type;
    this.findProducts()
  }
}
