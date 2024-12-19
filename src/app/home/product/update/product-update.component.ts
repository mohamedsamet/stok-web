import {Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductModel, ProductRequest, ProductType, ProductUnit} from "../product.model";
import {Subject} from "rxjs";

@Component({
  selector: 'app-product-update',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './product-update.component.html'
})
export class ProductUpdateComponent implements OnInit {
  typeEnum = ProductType;
  unitEnum = ProductUnit;
  @ViewChild("btnUpdateModal") btn: ElementRef<HTMLButtonElement> | undefined;
  @Output() submitUpdate = new EventEmitter<ProductRequest>()

  @Input() set product(product: ProductModel) {
    this.openUpdateModal(product)
  }
  formGroup: FormGroup = new FormGroup<any>({});
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      provider: [''],
      unit: ['', Validators.required],
      type: ['', Validators.required],
    })
  }

  submit() {
    this.submitUpdate.emit(this.formGroup.value);
    this.formGroup.reset();
  }

  private openUpdateModal(product: ProductModel) {
    if (product.publicId) {
      this.formGroup.patchValue({
        name: product.name,
        provider: product.provider,
        unit: product.unit,
        type: product.type
      });
      this.btn?.nativeElement?.click();
    }
  }
}
