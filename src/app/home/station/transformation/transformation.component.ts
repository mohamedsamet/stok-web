import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {StationModel, StationRequest} from "../station.model";
import {Observable} from "rxjs";
import {ProductSelectorComponent} from "./product-selector/product-selector.component";
import {ProductModel, SelectProductModel} from "../../product/product.model";
import {TransFormationEnum, TransformationModel} from "./transformation.model";
import {TransformTypePipe} from "../../shared/pipe/transform-type.pipe";
import {TransformationService} from "../../../service/transformation.service";
import {catchError, tap} from "rxjs/operators";
import {ToastService} from "../../../shared/toast/toast.service";

@Component({
  selector: 'app-transformation',
  imports: [RouterModule, CommonModule, FormsModule, ProductSelectorComponent, TransformTypePipe],
  standalone: true,
  templateUrl: './transformation.component.html'
})
export class TransformationComponent {

  @ViewChild("btnTransformationModal") btn: ElementRef<HTMLButtonElement> | undefined;
  @Output() reload = new EventEmitter();
  @Output() dismiss = new EventEmitter();
  transformations: TransformationModel[] = [];
  transformEnum = TransFormationEnum;
  station: StationModel = {} as StationModel;
  @Input() set stationTransform(station: StationModel) {
    this.openTransformationModal(station)
  }

  @Input() products = new Observable<ProductModel[]>();

  constructor(private transformSerivce: TransformationService, private toast: ToastService) {
  }

  submit() {
    this.transformations = this.transformations.filter(transform => transform?.productPublicId && transform?.quantity > 0)
    this.transformSerivce.addTransformations(this.station.publicId, this.transformations)
      .pipe(
        tap(success => {
          this.toast.showSucess(`Transformations sur la station ${success.name} ajoutées avec succès`);
          this.reload.emit();
        }),
        catchError(() => {
          this.toast.showFail(`Une erreur est survenue lors de l'enregistrement des transformation`);
          return new Observable();
        })
      )
      .subscribe()
  }

  private openTransformationModal(station: StationModel) {
    if (station.publicId) {
      this.station = station;
      this.transformations = station.transformations;
      this.btn?.nativeElement?.click();
    }
  }

  addTransformation(type: TransFormationEnum) {
    this.transformations = this.transformations.concat({
      publicId: crypto.randomUUID(),
      type
    } as TransformationModel);

  }

  addProductTransform(selectProductModel: SelectProductModel) {
    const transform = this.transformations
      .find(transform => transform.publicId === selectProductModel.publicId);

    if (transform) {
      transform.product = selectProductModel.product;
      transform.productPublicId = selectProductModel.product.publicId;
    }
  }

  removeTransformation(publicId: string) {
    this.transformations = this.transformations.filter(transform => transform.publicId !== publicId);
  }
}
