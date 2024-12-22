import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RemoveModel} from "./remove.model";

@Component({
  selector: 'app-remove',
  imports: [RouterModule, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './remove.component.html'
})
export class RemoveComponent {

  title: String = "";
  content: String = "";
  id: string = "";
  @ViewChild("btnDeleteModal") btnDelete: ElementRef<HTMLButtonElement> | undefined;
  @Input() set context(context: RemoveModel) {
   this.openRemoveModal(context);
  }
  @Output() validDelete = new EventEmitter<boolean>();

  private openRemoveModal(context: RemoveModel) {
    this.title = context.title;
    this.content = context.content;
    this.id = context.id;
    this.btnDelete?.nativeElement?.click();
  }
}
