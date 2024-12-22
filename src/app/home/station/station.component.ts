import {Component, OnInit} from '@angular/core';
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
import {RemoveModel} from "../shared/remove/remove.model";
import {RemoveComponent} from "../shared/remove/remove.component";

@Component({
  selector: 'app-station',
  imports: [RouterModule, CommonModule, FormsModule, StationCreateComponent, StationUpdateComponent, RemoveComponent],
  standalone: true,
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent implements OnInit {

  constructor(private stationService: StationService, private toastService: ToastService) {
  }

  stations: Observable<StationModel[]> = this.findStations();
  stationCount: number = 0;
  selectedStation: StationModel = {} as StationModel;

  ngOnInit(): void {
    this.findStations();
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

}
