import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RouterModule} from "@angular/router";
import {Observable, Subject, Subscription} from "rxjs";
import {CommonModule} from "@angular/common";
import {catchError, debounceTime, distinctUntilChanged, map, tap} from "rxjs/operators";
import {FormsModule} from "@angular/forms";
import {ToastService} from "../../shared/toast/toast.service";
import {ProviderUpdateComponent} from "./update/provider-update.component";
import {RemoveComponent} from "../shared/remove/remove.component";
import {PaginationComponent} from "../shared/pagination/pagination.component";
import {PlaceholderComponent} from "../shared/placeholder/placeholder.component";
import {ProviderModel, ProviderRequest, ProviderResponse} from "./provider.model";
import {SearchModel} from "../shared/model/search.model";
import {ProviderService} from "../../service/provider.service";
import {ProviderCreateComponent} from "./creation/provider-create.component";

@Component({
  selector: 'app-provider',
  imports: [RouterModule, CommonModule, FormsModule, PaginationComponent, PlaceholderComponent, ProviderCreateComponent, ProviderUpdateComponent, RemoveComponent],
  standalone: true,
  templateUrl: './provider.component.html'
})
export class ProviderComponent implements OnInit, OnDestroy {

  constructor(private providerService: ProviderService, private toastService: ToastService) {
  }
  search: string = "";
  searchSubject = new Subject<string>();
  searchSubscription = new Subscription();
  providers: Observable<ProviderModel[]> = this.findProviders();
  providerCount: number = 0;
  isLoading = true;
  publicId = '';
  reference = '';
  createDraftSubscription = new Subscription();

  @ViewChild(ProviderUpdateComponent) providerUpdate?: ProviderUpdateComponent;
  @ViewChild(RemoveComponent) removeComponent?: RemoveComponent;
  @ViewChild(PaginationComponent) pagination?: PaginationComponent;

  ngOnInit(): void {
    this.listenToSearch();
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
    this.createDraftSubscription.unsubscribe();
  }

  private findProviders(search?: string, page: number = 0): Observable<ProviderModel[]> {
    this.isLoading = true;
    const searchRequest = {
      name: search,
      page: page
    } as SearchModel;
    return this.providerService.findAllProviders(searchRequest).pipe(
      tap((prviders: ProviderResponse) => {
        this.providerCount = prviders.count;
        this.isLoading = false;
      }),
      map(providerModel => providerModel.providers)
    )
  }

  createProvider(providerForm: ProviderRequest) {
    providerForm.publicId = this.publicId;
    this.providerService.createProvider(providerForm)
      .pipe(
        tap((response: ProviderModel) => {
          this.toastService.showSucess(`Fournisseur <${response.name}> créé avec succées`);
          this.search = "";
          this.providers = this.findProviders();
          this.pagination?.init();
          this.createDraftSubscription.unsubscribe();
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la création du fournisseur');
          return new Observable();
        })
      )
      .subscribe()
  }

  updateProvider(providerForm: ProviderRequest) {
    this.providerService.updateProvider(providerForm)
      .pipe(
        tap((response: ProviderModel) => {
          this.toastService.showSucess(`Fournisseur <${response.name}> modifié avec succées`);
          this.providers = this.findProviders(this.search);
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la modification du fournisseur');
          return new Observable();
        })
      )
      .subscribe()
  }

  deleteProvider(provider: ProviderModel) {
    this.providerService.removeProvider(provider.publicId)
      .pipe(
        tap((response: ProviderModel) => {
          this.toastService.showSucess(`Fournisseur <${provider?.name}> supprimé avec succées`);
          this.search = "";
          this.providers = this.findProviders(this.search);
        }),
        catchError((errror) => {
          this.toastService.showFail('Problème survenu lors de la suppression du fournisseur');
          return new Observable();
        })
      )
      .subscribe()
  }

  private listenToSearch() {
    this.searchSubscription = this.searchSubject.asObservable().pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((searchQuery: string) => {
        this.providers = this.findProviders(searchQuery);
        this.pagination?.init();
      })
    ).subscribe()
  }

  changePage(page: number) {
    this.providers = this.findProviders(this.search, page - 1);
  }


  createDraftProvider() {
    this.createDraftSubscription = this.providerService.createDraftProvider()
      .subscribe(provider => {
        this.publicId = provider?.publicId;
        this.reference = provider?.reference;
      })
  }
}
