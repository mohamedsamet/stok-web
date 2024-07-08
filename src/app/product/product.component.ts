import { Component, OnInit } from '@angular/core';
import {SelectButtonModule} from "primeng/selectbutton";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ProductService} from "./product.service";
import {TableModule} from "primeng/table";
import {ProductModel} from "./model/product.model";
import {Observable, of} from "rxjs";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  standalone: true,
  imports: [SelectButtonModule, CommonModule, FormsModule, TableModule],
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  selectedType = 'RAW';
  types: any[] = [
    {
      label: 'Matière Première',
      key: 'RAW',
      value: 0
    },
    {
      label: 'Produit Fini',
      key: 'FINAL',
      value: 1
    }
  ];
  public products: ProductModel[] = [];


  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.selectType(this.selectedType);

  }

  selectType(selected: string) {
    this.selectedType = selected;
    this.productService.searchByType(this.selectedType).subscribe(products => {
        this.products = products;
      }
    );
  }
}
