import {Component, ViewChild} from '@angular/core';
import {RouterModule} from "@angular/router";
import {Observable} from "rxjs";
import {StationModel, StationRequest} from "./station.model";
import {CommonModule} from "@angular/common";
import {catchError, map, tap} from "rxjs/operators";
import {FormsModule} from "@angular/forms";
import {ToastService} from "../../shared/toast/toast.service";
import {StationService} from "../../service/station.service";
import {StationCreateComponent} from "./creation/station-create.component";
import {StationUpdateComponent} from "./update/station-update.component";
import {TransformationComponent} from "./transformation/transformation.component";
import {ProductModel, ProductResponse, ProductType, SearchProductModel} from "../product/product.model";
import {ProductService} from "../../service/product.service";
import {FinalizeComponent} from "./cloture/finalize.component";

@Component({
  selector: 'app-station',
  imports: [RouterModule, CommonModule, FormsModule, StationCreateComponent, StationUpdateComponent, FinalizeComponent, TransformationComponent],
  standalone: true,
  templateUrl: './station.component.html'
})
export class StationComponent {

  constructor(private stationService: StationService,
              private toastService: ToastService,
              private productService: ProductService) {
  }

  stations: Observable<StationModel[]> = this.findStations();
  stationCount: number = 0;
  products: Observable<ProductModel[]> = this.findProducts();
  @ViewChild(FinalizeComponent) finalizeComponent?: FinalizeComponent;
  @ViewChild(TransformationComponent) transformationComponent?: TransformationComponent;
  @ViewChild(StationUpdateComponent) stationUpdate?: StationUpdateComponent;

  private findProducts(): Observable<ProductModel[]> {
    const searchRequest: SearchProductModel = {
      page: 0,
      types: [ProductType.RAW, ProductType.FINAL]
    } as SearchProductModel;
    return this.productService.findAllProducts(searchRequest).pipe(
      map((products: ProductResponse) => products.products),
      tap(prod => console.log(prod))
    );
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
    this.stationService.updateStation(stationForm)
      .pipe(
        tap((response: StationModel) => {
          this.toastService.showSucess(`Station <${response.name}> modifiée avec succées`);
          this.stations = this.findStations();
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la modification de la station');
          return new Observable();
        })
      )
      .subscribe()
  }

  reload() {
    this.stations = this.findStations();
  }

  finalize(stationPublicId: string) {
    this.stationService.finalizeStation(stationPublicId)
      .pipe(
        tap((response: StationModel) => {
          this.toastService.showSucess(`La station <${response.name}> est cloturée avec succées`);
          this.stations = this.findStations();
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la cloture de la station');
          return new Observable();
        })
      )
      .subscribe()
  }
}
