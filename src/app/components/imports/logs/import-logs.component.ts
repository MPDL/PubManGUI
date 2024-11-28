import { CommonModule } from '@angular/common';
import { OnInit, Component, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { RouterModule, Router, NavigationExtras  } from '@angular/router';

import { ImportsService } from '../services/imports.service';
import { ImportLogDbVO, ImportStatus } from 'src/app/model/inge';

import { FormsModule } from '@angular/forms';

import { PaginatorComponent } from "src/app/shared/components/paginator/paginator.component";


@Component({
  selector: 'pure-import-logs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PaginatorComponent
  ],
  templateUrl: './import-logs.component.html'
})
export default class ListComponent implements OnInit { 

  currentPage = 1;
  pageSize = 25;
  collectionSize = 0;
  inPage: ImportLogDbVO[] = [];
  logs: ImportLogDbVO[] = [];

  isScrolled = false;

  constructor(
    private importsSvc: ImportsService,
    private router: Router, 
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
      (this.currentPage - 1) * this.pageSize,
      (this.currentPage - 1) * this.pageSize + (this.pageSize),
    );
  }

  calculateProcessedStep(numberOfItems: number): number {
    return Math.floor(100 / numberOfItems);
  };

  isFinished(status: ImportStatus):boolean {
    if( status === ImportStatus.FINISHED) {
        return true;
      }
    return false;
  } 

  toDatasets(id: any): void {
    let items: string[] = [];
    this.importsSvc.getImportLogItems(id).subscribe(importsResponse => {
      if (importsResponse.length === 0) return;
      
      importsResponse.sort((a, b) => a.id - b.id)
        .forEach(element => { 
          if (element.itemId) {
            items.push(element.itemId);
          }
        });
      if (items.length === 0) return;              
      this.router.navigate(['/imports/myimports/' + id + '/datasets'], { state:{ itemList: items }});
    }) 
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }
}
