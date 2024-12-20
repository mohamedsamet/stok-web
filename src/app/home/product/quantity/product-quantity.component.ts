import {Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductModel, ProductRequest, ProductType, ProductUnit} from "../product.model";
import {Subject} from "rxjs";

@Component({
  selector: 'app-product-quantity',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './product-quantity.component.html'
})
export class ProductQuantityComponent {
  quantity: number = 0;
  @ViewChild("btnQuantityModal") btn: ElementRef<HTMLButtonElement> | undefined;
  @Output() addQuantity = new EventEmitter<number>()
  @Output() subtractQuantity = new EventEmitter<number>()
  @Input() mode: string = '';
  @Input() set product(product: ProductModel) {
    this.openQuantityModal(product)
  }

  submit() {
    if (this.mode === '+') {
      this.addQuantity.emit(this.quantity);
    }

    if (this.mode === '-') {
      this.subtractQuantity.emit(this.quantity);
    }

  }

  private openQuantityModal(product: ProductModel) {
    if (product.publicId) {

      this.btn?.nativeElement?.click();
    }
  }
}
