import {Component, OnDestroy, ViewChild} from '@angular/core';
import {RouterModule} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {CommonModule} from "@angular/common";
import {catchError, map, tap} from "rxjs/operators";
import {FormsModule} from "@angular/forms";
import {ToastService} from "../../shared/toast/toast.service";
import {RemoveComponent} from "../shared/remove/remove.component";
import {PaginationComponent} from "../shared/pagination/pagination.component";
import {PlaceholderComponent} from "../shared/placeholder/placeholder.component";
import {SearchModel} from "../shared/model/search.model";
import {GoodsInwardModel, GoodsInwardRequest, GoodsInwardResponse} from "./goods-inward.model";
import {GoodsInwardService} from "../../service/goods-inward.service";
import {GoodsInwardCreateComponent} from "./creation/goods-inward-create.component";

@Component({
  selector: 'app-goods-inward',
  imports: [RouterModule, CommonModule, FormsModule, PaginationComponent, PlaceholderComponent, RemoveComponent, GoodsInwardCreateComponent],
  standalone: true,
  templateUrl: './goods-inward.component.html'
})
export class GoodsInwardComponent implements OnDestroy {

  constructor(private goodsInwardService: GoodsInwardService, private toastService: ToastService) {
  }
  goodsInwards: Observable<GoodsInwardModel[]> = this.findGoodsInwards();
  goodsInwardCount: number = 0;
  isLoading = true;
  publicId = '';
  reference = '';
  createDraftSubscription = new Subscription();

  @ViewChild(GoodsInwardCreateComponent) goodsInwardCreateComponent?: GoodsInwardCreateComponent;
  @ViewChild(RemoveComponent) removeComponent?: RemoveComponent;
  @ViewChild(PaginationComponent) pagination?: PaginationComponent;

  ngOnDestroy(): void {
    this.createDraftSubscription.unsubscribe();
  }

  private findGoodsInwards(page: number = 0): Observable<GoodsInwardModel[]> {
    this.isLoading = true;
    const searchRequest = {
      page: page
    } as SearchModel;
    return this.goodsInwardService.findAllGoodsInward(searchRequest).pipe(
      tap((goods: GoodsInwardResponse) => {
        this.goodsInwardCount = goods.count;
        this.isLoading = false;
      }),
      map(goodsModel => goodsModel.goodsInwards)
    )
  }

  createGoodsInward(goodsInwardRequest: GoodsInwardRequest) {
    goodsInwardRequest.publicId = this.publicId;
    this.goodsInwardService.createGoodsInward(goodsInwardRequest)
      .pipe(
        tap((response: GoodsInwardModel) => {
          this.toastService.showSucess(`Bon d'entré N° <${response.reference}> est créé avec succées`);
          this.goodsInwards = this.findGoodsInwards();
          this.pagination?.init();
          this.createDraftSubscription.unsubscribe();
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la création du bon d\'entré');
          return new Observable();
        })
      )
      .subscribe()
  }

  changePage(page: number) {
    this.goodsInwards = this.findGoodsInwards(page - 1);
  }


  createDraftGoodsInward() {
    this.createDraftSubscription = this.goodsInwardService.createDraftInward()
      .subscribe(goodInward => {
        this.publicId = goodInward?.publicId;
        this.reference = goodInward?.reference;
      })
  }
}
