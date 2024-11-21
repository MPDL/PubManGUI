import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { ImportsService } from 'src/app/components/imports/services/imports.service';
import * as resp from 'src/app/components/imports/interfaces/imports-responses';

import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
//import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StateFilterPipe } from 'src/app/components/imports/pipes/stateFilter.pipe';
import { SeparateFilterPipe } from 'src/app/components/imports/pipes/separateFilter.pipe';

//import { SanitizeHtmlPipe } from "src/app//shared/services/pipes/sanitize-html.pipe";
import xmlFormat from 'xml-formatter';

const FILTER_PAG_REGEX = /[^0-9]/g;


@Component({
  selector: 'pure-import-log-item-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    //RouterLink,
    //NgbTooltip,
    ///StateFilterPipe,
    //SeparateFilterPipe,
    //SanitizeHtmlPipe
  ],
  templateUrl: './details.component.html'
})
export default class DetailsComponent { //implements OnInit {

  page = 1;
  pageSize = 25;
  collectionSize = 0;
  inPage: resp.ImportLogItemDetailDbVO[] = [];
  logs: resp.ImportLogItemDetailDbVO[] = [];

  item: resp.ImportLogItemDbVO | undefined;
  
  isScrolled = false;

  constructor(
    private importsSvc: ImportsService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private fb: FormBuilder,
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    console.log('in DETAILS');
    this.item = history.state.item;
    this.importsSvc.getImportLogItemDetails(Number(this.item?.id))
      .subscribe(importsResponse => {
        if (importsResponse.length === 0) return this.router.navigate(['../'], { relativeTo: this.activatedRoute });

        importsResponse.sort((a, b) => a.id - b.id);
          
        this.logs = importsResponse;
        this.collectionSize = this.logs.length;
        this.refreshLogs();
        return;
      }
    );

    //this.loadTranslations(this.locale);
  }

  formatXml(message: string):string {
    console.log(message);
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

  selectPage(page: string) {
    this.page = parseInt(page, this.pageSize) || 1;
  }

  formatInput(input: HTMLInputElement) {
		input.value = input.value.replace(FILTER_PAG_REGEX, '');
	}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }

}