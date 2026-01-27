import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination-component',
  imports: [],
  templateUrl: './c-pagination.html',
  styleUrl: './c-pagination.scss',
})
export class PaginationComponent {
  @Input() currentPageNumber: number = 1;
  @Input() totalPages: number = 1;
  @Input() visiblePages: number = 5;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const pages: number[] = [];

    let start = Math.max(this.currentPageNumber - Math.floor(this.visiblePages / 2), 1);
    let end = start + this.visiblePages - 1;

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(end - this.visiblePages + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.pageChange.emit(pageNumber);
    }
  }

  nextPage() {
    this.goToPage(this.currentPageNumber + 1);
  }

  previousPage() {
    this.goToPage(this.currentPageNumber - 1);
  }
}