import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  pageSize: number = 10;
  pages: number[] = [];
  currentPage: number = 1;
  @Output() selectPage = new EventEmitter<number>();
  @Input() set count(c: number) {
    const total = Math.ceil(c/this.pageSize);
    this.pages = Array.from({length: total}, (_,index) => index + 1)
  };


  select(page: number) {
    this.currentPage = page;
    this.selectPage.emit(page);
  }
}
