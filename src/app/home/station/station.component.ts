import {Component} from '@angular/core';
import {RouterModule} from "@angular/router";
import {Observable} from "rxjs";
import {StationModel, StationRequest} from "./station.model";
import {CommonModule} from "@angular/common";
import {catchError, tap} from "rxjs/operators";
import {FormsModule} from "@angular/forms";
import {ToastService} from "../../shared/toast/toast.service";
import {StationService} from "../../service/station.service";
import {StationCreateComponent} from "./creation/station-create.component";
import {StationUpdateComponent} from "./update/station-update.component";
import {TransformationComponent} from "./transformation/transformation.component";
import {ProductModel} from "../product/product.model";
import {ProductService} from "../../service/product.service";
import {FinalizeComponent} from "./cloture/finalize.component";
import {TransformationModel} from "./transformation/transformation.model";

@Component({
  selector: 'app-station',
  imports: [RouterModule, CommonModule, FormsModule, StationCreateComponent, StationUpdateComponent, FinalizeComponent, TransformationComponent],
  standalone: true,
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent {

  constructor(private stationService: StationService,
              private toastService: ToastService,
              private productService: ProductService) {
  }

  stations: Observable<StationModel[]> = this.findStations();
  stationCount: number = 0;
  selectedStation: StationModel = {} as StationModel;
  clotureStation: StationModel = {} as StationModel;
  transformStation: StationModel = {} as StationModel;
  products: Observable<ProductModel[]> = this.findProducts();

  private findProducts(): Observable<ProductModel[]> {
    return this.productService.findAllProducts();
  }

  private findStations(): Observable<StationModel[]> {
    return this.stationService.findStations().pipe(
      tap((stations: StationModel[]) => this.stationCount = stations.length)
    );
  }

  createStation(stationForm: StationRequest) {
    this.stationService.createStation(stationForm)
      .pipe(
        tap((response: StationModel) => {
          this.toastService.showSucess(`Station <${response.name}> créé avec succées`)
          this.stations = this.findStations();
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la création de la station');
          return new Observable();
        })
      )
      .subscribe()
  }

  updateStation(stationForm: StationRequest) {
    stationForm.publicId = this.selectedStation.publicId;
    this.stationService.updateStation(stationForm)
      .pipe(
        tap((response: StationModel) => {
          this.toastService.showSucess(`Produit <${response.name}> modifié avec succées`);
          this.stations = this.findStations();
          this.selectedStation = {} as StationModel;
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la modification du produit');
          return new Observable();
        })
      )
      .subscribe()
  }

  addTransformations(item: StationModel) {
    this.transformStation = item;
  }

  reload() {
    this.stations = this.findStations();
    this.transformStation = {} as StationModel;
  }

  finalize() {
    this.stationService.finalizeStation(this.clotureStation)
      .pipe(
        tap((response: StationModel) => {
          this.toastService.showSucess(`La station <${response.name}> est cloturé avec succées`);
          this.stations = this.findStations();
          this.clotureStation = {} as StationModel;
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la cloture de la station');
          return new Observable();
        })
      )
      .subscribe()
  }

  dismissUpdate() {
    this.selectedStation = {} as StationModel;
  }

  initTransform() {
    this.transformStation = {} as StationModel;
  }

  dismissFinalize() {
    this.clotureStation = {} as StationModel;
  }
}
