import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RouterModule} from "@angular/router";
import {Observable, Subject, Subscription} from "rxjs";
import {CommonModule} from "@angular/common";
import {debounceTime, distinctUntilChanged, map, tap, window} from "rxjs/operators";
import {FormsModule} from "@angular/forms";
import {ToastService} from "../../shared/toast/toast.service";
import {PaginationComponent} from "../shared/pagination/pagination.component";
import {PlaceholderComponent} from "../shared/placeholder/placeholder.component";
import {InvoiceService} from "../../service/invoice.service";
import {InvoiceModel, InvoiceResponse, SearchInvoiceModel} from "./invoice.model";
import {InvoiceCreateComponent} from "./creation/invoice-create.component";
import {InvoiceUpdateComponent} from "./update/invoice-update.component";
import {CloseComponent} from "../shared/close/close.component";

@Component({
  selector: 'app-invoice',
  imports: [RouterModule, CommonModule, FormsModule, InvoiceUpdateComponent, CloseComponent, PaginationComponent, PlaceholderComponent, InvoiceCreateComponent],
  standalone: true,
  templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit, OnDestroy {

  constructor(private invoiceService: InvoiceService, private toast: ToastService) {}
  search: string = "";
  showUpdate = false;
  searchSubject = new Subject<string>();
  searchSubscription = new Subscription();
  invoices: Observable<InvoiceModel[]> = this.findInvoices();
  invoiceCount: number = 0;
  isLoading = true;
  publicId = '';
  reference = '';
  createDraftSubscription = new Subscription();
  invoiceToUpdate: InvoiceModel = {} as InvoiceModel;
  readOnly = false;
  @ViewChild(CloseComponent) closeComponent?: CloseComponent;
  @ViewChild(PaginationComponent) pagination?: PaginationComponent;

  ngOnInit(): void {
    this.listenToSearch();
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
    this.createDraftSubscription.unsubscribe();
  }

  private findInvoices(search?: string, page: number = 0): Observable<InvoiceModel[]> {
    this.isLoading = true;
    const searchRequest = {
      name: search,
      page: page
    } as SearchInvoiceModel;
    return this.invoiceService.findInvoices(searchRequest).pipe(
      tap((invoices: InvoiceResponse) => {
        this.invoiceCount = invoices.count;
        this.isLoading = false;
      }),
      map(invoices => invoices.invoices)
    )
  }

  private listenToSearch() {
    this.searchSubscription = this.searchSubject.asObservable().pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((searchQuery: string) => {
        this.invoices = this.findInvoices(searchQuery);
        this.pagination?.init();
      })
    ).subscribe()
  }

  changePage(page: number) {
    this.invoices = this.findInvoices(this.search, page - 1);
  }

  createDraftInvoice() {
    this.createDraftSubscription = this.invoiceService.createDraftInvoice()
      .subscribe(invoiceModel => {
        this.publicId = invoiceModel?.publicId;
        this.reference = invoiceModel?.reference;
      })
  }

  refresh() {
    this.search = "";
    this.invoices = this.findInvoices();
    this.pagination?.init();
    this.createDraftSubscription.unsubscribe();
    this.showUpdate = false;
  }

  update(invoice: InvoiceModel) {
    this.invoiceToUpdate = invoice;
    this.showUpdate = true;
    this.readOnly = false;
  }

  readOnlyMode(invoice: InvoiceModel) {
    this.invoiceToUpdate = invoice;
    this.readOnly = true;
    this.showUpdate = true;
  }

  validClose(item: InvoiceModel) {
    this.invoiceService.closeInvoice(item.publicId)
      .subscribe(invoiceModel => {
        this.invoices = this.findInvoices();
        this.toast.showSucess(`La Facture N : ${item.reference} est fermée avec succée`)
      })

  }

  export(invoice: InvoiceModel) {
    this.invoiceService.downloadInvoice(invoice.publicId).subscribe(res => {
        const blob = res.body as Blob;

        let filename =`Facture-${invoice.reference}.xlsx`

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    );
  }
}
