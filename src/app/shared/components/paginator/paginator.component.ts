import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Form, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Route, Router} from "@angular/router";

@Component({
  selector: 'pure-paginator',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {


  @Input() totalNumberOfItems:number = 0

  @Input() size!:number
  @Input() pageNumber!:number
  @Output() sizeChange = new EventEmitter<number>();
  @Output() pageNumberChange = new EventEmitter<number>();

  @Output() paginatorChanged = new EventEmitter<any>();


  sizeField: FormControl<number | null> = new FormControl(25);
  pageNumberField: FormControl<number | null> = new FormControl(1, [Validators.nullValidator, Validators.min(1)]);

  itemPerPageOptions = [
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 250, label: '250' },
  ];


  //protected selectedItemsPerPage = 25;
  protected totalNumberOfPages = 1;
  //protected currentPageNumber = 1;

  /*
  protected jumptoField!: FormControl
  protected selectedItemsPerPageField! : FormControl
*/

  constructor(private router: Router, private route: ActivatedRoute) {
    //this.readQueryParams()
  }

ngOnInit() {
  //this.pageNumberField.setValidators([Validators.nullValidator, Validators.min(1), Validators.max(this.totalNumberOfPages)]);
  if(!this.pageNumber) {
    this.pageNumber = 1;
  }
  this.pageNumberField.setValue(this.pageNumber)
  this.pageNumberField.valueChanges.subscribe(val => {
    if(val && this.sizeField.valid) {
      this.pageNumber = val
    }
  })

  if(!this.size) {
    this.size = 25;
  }
  this.sizeField.setValue(this.size);
  this.sizeField.valueChanges.subscribe(val => {
    if(val && this.sizeField.valid) {
      this.size = val;
    }


  })
  //this.emitEvent();
}

  ngOnChanges() {
    this.calculateValues();
    this.pageNumberField.setValue(this.pageNumber)
    this.sizeField.setValue(this.size)
    //this.updateQueryParams();
  }

/*
  private updateQueryParams() {
    const queryParams: Params = {
      p: this.pageNumber,
      s: this.selectedItemsPerPageField.value
    };
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }

  private readQueryParams() {
    const page = this.route.snapshot.queryParamMap.get('p');
    if(page) {
      this.pageNumber = Number(page);
      this.jumptoField.setValue(this.pageNumber)
    }
    const size = this.route.snapshot.queryParamMap.get('s');
    if(size) {
      this.selectedItemsPerPageField.setValue(Number(size))
    }
  }

 */

  private calculateValues() {
    //const relocate = this.currentPageNumber * this.selectedItemsPerPage;
    //this.selectedItemsPerPage = Number.parseInt(event.target.value);
    this.totalNumberOfPages = this.totalNumberOfItems ? Math.ceil(this.totalNumberOfItems / this.size) : 0;
    this.pageNumberField.setValidators([Validators.nullValidator, Validators.min(1), Validators.max(this.totalNumberOfPages)]);
    /*
    if (relocate < this.selectedItemsPerPage || relocate > this.totalNumberOfPages) {
      this.currentPageNumber = 1;
    } else {
      this.currentPageNumber = Math.floor(relocate / this.selectedItemsPerPage);
    }

     */
  }

  private emitEvent() {
    //this.updateQueryParams();
    this.pageNumberChange.emit(this.pageNumber)
    this.sizeChange.emit(this.size)
    this.paginatorChanged.emit();
    //this.paginatorChanged.emit(this.fromToValues())
  }

  /*
  public fromToValues(): PaginatorChangeEvent {
    const from = (this.pageNumber - 1) * this.selectedItemsPerPage;
    const size = this.selectedItemsPerPage;
    return {from: from, size: size};
  }
*/
  public changePage(val: number) {
    this.pageNumberField.setValue(val);
    //this.jumptoField.setValue(val);
    this.emitEvent()
  }

  protected jumpToPage() {
    this.pageNumberField.errors? alert("value must be between 1 and " + this.totalNumberOfPages) : this.changePage(this.pageNumberField.value as number);
  }

  protected get isFirst(): boolean {
    return this.pageNumber === 1;
  }

  protected get isLast(): boolean {
    return this.pageNumber === this.totalNumberOfPages;
  }

  first() {
    this.changePage(1);
  }

  prev() {
    this.changePage(Math.max(1, this.pageNumber - 1));
  }

  next() {
    this.changePage(Math.min(this.totalNumberOfPages, this.pageNumber + 1));
  }

  last() {
    this.changePage(this.totalNumberOfPages);
  }

  protected itemPerPageChange(event: any) {
    //this.selectedItemsPerPage = Number.parseInt(event.target.value);
    this.calculateValues();
    this.changePage(1);
    //this.emitEvent();
  }

  /*
  get selectedItemsPerPage(){
    return this.selectedItemsPerPageField.value;
  }

   */

}

export interface PaginatorChangeEvent {
  from: number,
  size: number
}
