import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { MessageService } from "../../../services/message.service";
import { AaService } from "../../../services/aa.service";
import { Subscription } from "rxjs";
import { SavedSearchVO } from "../../../model/inge";
import { SavedSearchService } from "../../../services/pubman-rest-client/saved-search.service";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Clipboard } from "@angular/cdk/clipboard";
import { DatePipe } from "@angular/common";
import { LoadingComponent } from "../loading/loading.component";
import { CopyButtonDirective } from "../../../directives/copy-button.directive";

@Component({
  selector: 'pure-saved-searches-modal',
  imports: [
    FormsModule,
    DatePipe,
    ReactiveFormsModule,
    NgbTooltip,
    LoadingComponent,
    CopyButtonDirective
  ],
  templateUrl: './saved-searches-modal.component.html',
  styleUrl: './saved-searches-modal.component.scss'
})
export class SavedSearchesModalComponent {

  @Input() searchFormJson!: string;
  @Output() applySearchForm: EventEmitter<string> = new EventEmitter();

  principalSubscription: Subscription;
  savedSearches: SavedSearchVO[] = [];
  savedSearchNameForm: FormControl = new FormControl("", Validators.required);
  savedSearchesLoading: boolean = false;
  errorMessage: string = '';

  constructor(protected activeModal: NgbActiveModal,
              private savedSearchService: SavedSearchService,
              private messageService: MessageService,
              private aaService: AaService,
              private clipboard: Clipboard) {

    this.principalSubscription = this.aaService.principal.subscribe(p => {
      this.updateSavedSearchList()
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
      //console.log("Destroying advanced search");
      this.principalSubscription?.unsubscribe();
  }

  private updateSavedSearchList() {
    this.savedSearchesLoading = true;
    if (this.aaService.principal.getValue().loggedIn) {
      this.savedSearchService.getAllSearch()
        .subscribe({
          next : savedSearches => {this.savedSearches = savedSearches},
          error : (err) => {this.errorMessage = err}
        })
        .add(
          () => {this.savedSearchesLoading = false}
        );


    }

  }

  getSavedSearchLink(savedSearchId: string) {
    const urlString = window.location.toString();
    const url = new URL(urlString);
    url.searchParams.set('searchId', savedSearchId);
    //this.clipboard.copy(url.toString());
    return url.toString();
    //console.log(`${url}`);
  }

  saveCurrentSearchForm() {

    this.savedSearchesLoading = true;
    const savedSearch: SavedSearchVO = {
      objectId: "",
      name: this.savedSearchNameForm.value,
      searchForm: this.searchFormJson
    }
    this.savedSearchService.create(savedSearch).subscribe(
      {
        next : search => {
          this.updateSavedSearchList();
          this.savedSearchNameForm.setValue("");
          },
        error : (err) => {this.errorMessage = err}
      })
      .add(
        () => {this.savedSearchesLoading = false}
      );

  }


  applySearchFromHistory(value: number) {
    this.applySearchForm.emit(this.savedSearches[value].searchForm);
    this.activeModal.close();
    //this.parseFormJson(this.savedSearches[value].searchForm);

  }

  deleteSavedSearch(value: number) {
    this.savedSearchesLoading = true;
    this.savedSearchService.delete(this.savedSearches[value].objectId!, undefined).subscribe(
      {
        next : search => {this.updateSavedSearchList();},
        error : (err) => {this.errorMessage = err}
      })
      .add(
        () => {this.savedSearchesLoading = false}
      );
  }
}
