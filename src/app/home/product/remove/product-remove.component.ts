import {Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductModel, ProductRequest, ProductType, ProductUnit} from "../product.model";
import {Subject} from "rxjs";

@Component({
  selector: 'app-product-remove',
  imports: [RouterModule, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './product-remove.component.html'
})
export class ProductRemoveComponent {

  name: String = "";
  @ViewChild("btnDeleteModal") btnDelete: ElementRef<HTMLButtonElement> | undefined;
  @Input() set productName(name: string) {
   this.openRemoveModal(name);
  }
  @Output() validDelete = new EventEmitter<boolean>();

  private openRemoveModal(name: string) {
    this.name = name;
    this.btnDelete?.nativeElement?.click();
  }
}
