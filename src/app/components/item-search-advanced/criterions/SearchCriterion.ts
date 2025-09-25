import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";

export abstract class SearchCriterion extends FormGroup<any> {
  //type! : Type;

  protected fb = new FormBuilder();
  level: number = 0;
  type: any;
  content!: FormGroup;
  query: Object | undefined;

  options: any;
  //formGroup!: FormGroup;
  //properties!: any

  protected constructor(type: string, opts:any) {
    super({type : new FormControl(type)});
    this.type = type;
    this.options = opts;
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
