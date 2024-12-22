import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-finalize',
  imports: [RouterModule, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './finalize.component.html'
})
export class FinalizeComponent {

  stationName: String = "";
  @ViewChild("btnFinalizeModal") btn: ElementRef<HTMLButtonElement> | undefined;
  @Input() set name(name: string) {
   this.openFinalizeModal(name);
  }
  @Output() valid = new EventEmitter<boolean>();
  @Output() dismiss = new EventEmitter();

  private openFinalizeModal(context: string) {
    this.stationName = context;
    this.btn?.nativeElement?.click();
  }
}
