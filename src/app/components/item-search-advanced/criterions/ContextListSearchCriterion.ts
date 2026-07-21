import {SearchCriterion} from "./SearchCriterion";
import {Observable, of} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";
import {ContextDbVO, ContextState} from "../../../model/inge";
import {AaService} from "../../../services/aa.service";
import {baseElasticSearchQueryBuilder} from "../../../utils/search-utils";

export class ContextListSearchCriterion extends SearchCriterion {



  contextOptions: {[key:string]: string} = {};


  constructor(checkAll: boolean, opts?:any) {
    super("contextList", opts);

    this.content.addControl("contexts", new FormGroup({}));

    const aaService: AaService = opts.aaService;
    aaService.principal.subscribe(p => {
      const moderatorContexts = p.moderatorContexts ? p.moderatorContexts : [];
      const depositorContexts  = p.depositorContexts ? p.depositorContexts : [];
      //Merge both arrays and de-duplicate
      moderatorContexts.concat(depositorContexts)
        //filter closed contexts
        .filter(c => c.state === ContextState.OPENED)
        //filter duplicates
        .filter((val, pos, arr) => arr.indexOf(val)===pos)
        .forEach(c => {
          this.contextOptions[c.objectId!] = c.name || "n/a";
        })

      Object.keys(this.contextOptions).forEach(itemState => this.contextListFormGroup.addControl(itemState, new FormControl(checkAll)));
    })




  }

  selectAll(event: Event) {
    const target = event.target as HTMLInputElement;
    Object.keys(this.contextListFormGroup.controls)
      .forEach(genre => this.contextListFormGroup.get(genre)?.setValue(target.checked));
  }

  override isEmpty(): boolean {
    const isEmpty = !Object.keys(this.contextListFormGroup.controls).some(pubState => this.contextListFormGroup.get(pubState)?.value);
    return isEmpty;
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {

    const contexts: string[] = Object.keys(this.contextListFormGroup.controls)
      .filter(context => this.contextListFormGroup.get(context)?.value);

    if (contexts.length > 0) {
      return of(baseElasticSearchQueryBuilder({index :"context.objectId", type: "keyword"}, contexts));
    }
    return of(undefined)


  }


  getElasticSearchNestedPath(): string | undefined {
    return undefined;
  }

  get contextListFormGroup() {
    return this.content.get("contexts") as FormGroup;
  }

  /**
   * Apply the saved search context list to the current context list form group, if the context is not already present.
   * @param contextList The saved search context list to apply.
   */
  applyFromSavedSearch(contextList: any) {
    if(contextList?.content?.contexts) {
      Object.keys(contextList?.content?.contexts).forEach(contextId => {
        if ((!this.contextListFormGroup.get(contextId)) && contextList.content.contexts[contextId]) {
          this.contextOptions[contextId] = contextId;
          this.contextListFormGroup.addControl(contextId, new FormControl(contextList.content.contexts[contextId]));
        }
      });
    }

  }


}
