import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { ImportsService } from 'src/app/components/imports/services/imports.service';
import { ImportLogItemDbVO, ImportLogItemDetailDbVO } from 'src/app/model/inge';

import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SeparateFilterPipe } from 'src/app/components/imports/pipes/separateFilter.pipe';

import xmlFormat from 'xml-formatter';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { PaginatorComponent } from "src/app/shared/components/paginator/paginator.component";


@Component({
  selector: 'pure-import-log-item-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SeparateFilterPipe,
    NgbCollapseModule,
    PaginatorComponent
  ],
  templateUrl: './details.component.html'
})
export default class DetailsComponent implements OnInit {

  page = 1;
  pageSize = 25;
  collectionSize = 0;
  inPage: ImportLogItemDetailDbVO[] = [];
  logs: ImportLogItemDetailDbVO[] = [];

  item: ImportLogItemDbVO | undefined;
  
  isCollapsed: boolean[] = [];
  isScrolled = false;

  constructor(
    private importsSvc: ImportsService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private fb: FormBuilder,
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.item = history.state.item;
    this.importsSvc.getImportLogItemDetails(Number(this.item?.id))
      .subscribe(importsResponse => {
        if (importsResponse.length === 0) return this.router.navigate(['../'], { relativeTo: this.activatedRoute });

        importsResponse.sort((a, b) => a.id - b.id);
          
        this.logs = importsResponse;
        this.collectionSize = this.logs.length;
        this.isCollapsed = new Array<boolean>(this.logs.length).fill(true);

        this.refreshLogs();
        return;
      }
    );

    //this.loadTranslations(this.locale);
  }

  formatXml(message: string):string {
    return xmlFormat(message, {
      indentation: '    ',
      collapseContent: true,
      throwOnFailure: false
    });
  }

  refreshLogs() {
    this.inPage = this.logs.map((log, i) => ({ _id: i + 1, ...log })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }

}