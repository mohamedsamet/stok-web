import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProviderRequest} from "../provider.model";

@Component({
  selector: 'app-provider-create',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './provider-create.component.html'
})
export class ProviderCreateComponent implements OnInit {
  @Input() reference = "";
  @Output() submitCreation = new EventEmitter<ProviderRequest>();
  @Output() createDraft = new EventEmitter<any>();

  formGroup: FormGroup = new FormGroup<any>({});
  constructor(private fb: FormBuilder) {
  }


  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      fiscalAddress: ['']
    });
  }

  submit() {
    this.submitCreation.emit(this.formGroup.value);
    this.formGroup.reset();
  }
}
