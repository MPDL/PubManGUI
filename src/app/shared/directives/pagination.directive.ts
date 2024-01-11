import { Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive({
    selector: '[purePagination]',
    exportAs: 'purePagination',
    standalone: true
})
export class PaginationDirective {

  @Input() pageNo = 1;
  @Input() totalPages = 1;

  @Output() pageChange = new EventEmitter<number>();

  private setPage(val: number) {
    this.pageNo = val;
    this.pageChange.emit(this.pageNo);
  }

  get isFirst(): boolean {
    return this.pageNo === 1;
  }

  get isLast(): boolean {
    return this.pageNo === this.totalPages;
  }

  first() {
    this.setPage(1);
  }

  prev() {
    this.setPage(Math.max(1, this.pageNo - 1));
  }

  next() {
    this.setPage(Math.min(this.totalPages, this.pageNo + 1));
  }

  last() {
    this.setPage(this.totalPages);
  }

}
