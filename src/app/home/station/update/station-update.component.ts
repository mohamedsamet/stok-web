import {Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {StationModel, StationRequest} from "../station.model";

@Component({
  selector: 'app-station-update',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './station-update.component.html'
})
export class StationUpdateComponent implements OnInit {

  @ViewChild("btnUpdateStationModal") btn: ElementRef<HTMLButtonElement> | undefined;
  @Output() submitUpdate = new EventEmitter<StationRequest>()
  @Output() dismiss = new EventEmitter()

  @Input() set station(station: StationModel) {
    this.openUpdateModal(station)
  }
  formGroup: FormGroup = new FormGroup<any>({});
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      machine: [''],
      operator: [''],
      duration: [''],
      date: [''],
    })
  }

  submit() {
    this.submitUpdate.emit(this.formGroup.value);
    this.formGroup.reset();
  }

  private openUpdateModal(station: StationModel) {
    if (station.publicId) {
      this.formGroup.patchValue({
        name: station.name,
        machine: station.machine,
        duration: station.duration,
        operator: station.operator,
        date: station.date,
      });
      this.btn?.nativeElement?.click();
    }
  }
}
