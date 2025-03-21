import {Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProviderRequest} from "../provider.model";

@Component({
  selector: 'app-provider-update',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './provider-update.component.html'
})
export class ProviderUpdateComponent implements OnInit {
  providerPublicId: string = "";
  @ViewChild("btnUpdateProvModal") btn: ElementRef<HTMLButtonElement> | undefined;
  @Output() submitUpdate = new EventEmitter<ProviderRequest>()
  provider: ProviderRequest = {} as ProviderRequest;
  formGroup: FormGroup = new FormGroup<any>({});
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      fiscalAddress: ['']
    })
  }

  submit() {
    if (!this.sameProduct()) {
      const request: ProviderRequest = this.formGroup.value as ProviderRequest;
      request.publicId = this.providerPublicId;
      this.submitUpdate.emit(request);
    }
    this.formGroup.reset();
  }

  public openUpdateModal(provider: ProviderRequest) {
    if (provider.publicId) {
      this.provider = provider;
      this.providerPublicId = provider.publicId;
      this.formGroup.patchValue({
        name: provider.name,
        address: provider.address,
        fiscalAddress: provider.fiscalAddress
      });
      this.btn?.nativeElement?.click();
    }
  }

  private sameProduct() {
    return this.provider.name === this.formGroup.get('name')?.value
      && this.provider.address === this.formGroup.get('address')?.value
      && this.provider.fiscalAddress === this.formGroup.get('fiscalAddress')?.value;
  }
}
