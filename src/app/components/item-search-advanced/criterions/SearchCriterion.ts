import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {searchTypes} from "./search_config";
import {Observable} from "rxjs";

export abstract class SearchCriterion extends FormGroup<any> {
  //type! : Type;

  protected fb = new FormBuilder();
  level: number = 0;
  type: any;
  content!: FormGroup;
  query: Object | undefined;
  //formGroup!: FormGroup;
  //properties!: any

  protected constructor(type: string) {
    super({type : new FormControl(type)});
    this.type = type;
    //this.properties = (searchTypes as any)[type];
    this.content = this.fb.group({});
    this.addControl("content", this.content);
  }

  public parseContentIn(content: Object) {
    Object.entries(content).forEach(([key, val]) => {
      this.content.get(key)?.setValue(val);
    })
  }


  public abstract getElasticSearchNestedPath(): string | undefined;

  //public abstract getQueryStringContent(): string;

  public abstract isEmpty(): boolean;

  //public abstract parseQueryStringContent(content: string): void;

  public abstract toElasticSearchQuery(): Observable<Object | undefined>;

  //public abstract getNewInstance(): SearchCriterion;






}
