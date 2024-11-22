import { CommonModule } from '@angular/common';
import { OnInit, Component, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ImportsService } from '../services/imports.service';
import * as resp from '../interfaces/imports-responses';

import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";

import { PaginatorComponent } from "src/app/shared/components/paginator/paginator.component";

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'pure-import-logs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbPaginationModule,
    PaginatorComponent
  ],
  templateUrl: './import-logs.component.html'
})
export default class ListComponent implements OnInit { 

  page = 1;
  pageSize = 25;
  collectionSize = 0;
  inPage: resp.ImportLogDbVO[] = [];
  logs: resp.ImportLogDbVO[] = [];

  status = resp.ImportStatus;

  isScrolled = false;

  constructor(
    private importsSvc: ImportsService,
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.importsSvc.getImportLogs()
      .subscribe(importsResponse => {
        this.logs = importsResponse.sort((b, a) => a.id - b.id);
        this.collectionSize = this.logs.length;
        this.refreshLogs();
        return;
      }
    );

    //this.loadTranslations(this.locale);
  }

  async loadTranslations(lang: string) {
    // TO-DO ...
  }

  refreshLogs() {
    this.inPage = this.logs.map((log, i) => ({ _id: i + 1, ...log })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + (this.pageSize),
    );
  }

  selectPage(page: string) {
    this.page = parseInt(page, this.pageSize) || 1;
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  calculateProcessedStep(numberOfItems: number): number {
    return Math.floor(100 / numberOfItems);
  };

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }
}
