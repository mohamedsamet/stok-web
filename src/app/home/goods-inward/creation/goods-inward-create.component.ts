import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {GoodsInwardModel, GoodsInwardRequest} from "../goods-inward.model";

@Component({
  selector: 'app-goods-inward-create',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './goods-inward-create.component.html'
})
export class GoodsInwardCreateComponent implements OnInit {
  goodsInward: GoodsInwardModel = {} as GoodsInwardModel;

  @Input() reference = "";
  @Output() submitCreation = new EventEmitter<GoodsInwardRequest>();
  @Output() createDraft = new EventEmitter<any>();
  @ViewChild("btnUpdateGoodsInwardModal") btn: ElementRef<HTMLButtonElement> | undefined;

  formGroup: FormGroup = new FormGroup<any>({});
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      provider: ['', Validators.required],
      creationDate: ['', Validators.required]
    });
  }

  submit() {
    this.submitCreation.emit(this.formGroup.value);
    this.formGroup.reset();
  }

  public openUpdateModal(goodsInward: GoodsInwardModel) {
    if (goodsInward.publicId) {
      this.goodsInward = goodsInward;
      this.formGroup.patchValue({
        provider: goodsInward.provider?.name,
        creationDate: goodsInward.creationDate
      });
      this.btn?.nativeElement?.click();
    }
  }
}
