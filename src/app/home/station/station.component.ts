import {Component, ViewChild} from '@angular/core';
import {RouterModule} from "@angular/router";
import {Observable} from "rxjs";
import {SearchStationModel, StationModel, StationRequest, StationResponse} from "./station.model";
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
import {PaginationComponent} from "../shared/pagination/pagination.component";
import {PlaceholderComponent} from "../shared/placeholder/placeholder.component";

@Component({
  selector: 'app-station',
  imports: [RouterModule, CommonModule, FormsModule, PaginationComponent, PlaceholderComponent, StationCreateComponent, StationUpdateComponent, FinalizeComponent, TransformationComponent],
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
  isLoading = true;
  @ViewChild(FinalizeComponent) finalizeComponent?: FinalizeComponent;
  @ViewChild(TransformationComponent) transformationComponent?: TransformationComponent;
  @ViewChild(StationUpdateComponent) stationUpdate?: StationUpdateComponent;
  @ViewChild(PaginationComponent) pagination?: PaginationComponent;

  private findProducts(): Observable<ProductModel[]> {
    const searchRequest: SearchProductModel = {
      page: 0,
      types: [ProductType.RAW, ProductType.FINAL]
    } as SearchProductModel;
    return this.productService.findAllProducts(searchRequest).pipe(
      map((products: ProductResponse) => products.products)
    );
  }

  private findStations(search?: string | null, page: number = 0): Observable<StationModel[]> {
    this.isLoading = true;
    const searchRequest = {
      name: search,
      page: page
    } as SearchStationModel;
    return this.stationService.findStations(searchRequest).pipe(
      tap((stations: StationResponse) => {
        this.stationCount = stations.count;
        this.isLoading = false;
      }),
      map(stationsResponse => stationsResponse.stations)
    );
  }

  createStation(stationForm: StationRequest) {
    this.stationService.createStation(stationForm)
      .pipe(
        tap((response: StationModel) => {
          this.toastService.showSucess(`Station <${response.name}> créé avec succées`)
          this.stations = this.findStations();
          this.pagination?.init();
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

  changePage(page: number) {
    this.stations = this.findStations(null, page - 1);
  }
}
