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


  protected getCleanUpSubFormGroups(): string[] {
    return [];
  }

  //public abstract getNewInstance(): SearchCriterion;

  public getCleanedForm() {
    if(this.isEmpty()) {
      return undefined;
    }
    else {
      return this.getNewCleanedForm(this, this.getCleanUpSubFormGroups());
      /*
      return this.fb.group({
        "type" : this.fb.control(this.type),
        "content" : this.getNewCleanedForm(this.content, this.getCleanUpSubFormGroups())
      })

       */
    }
  }




  getNewCleanedForm(fg: FormGroup<any>, cleanBooleanControlNames:string[]) {
    const contentForm = this.fb.group({});
    Object.keys(fg.controls).forEach(controlName => {
      const control = fg.get(controlName);
      if(control instanceof FormGroup) {
        if(!(control instanceof SearchCriterion && control.isEmpty())) {
          if(cleanBooleanControlNames.includes(controlName)) {
            //console.log("Clean up boolean form group " + controlName, control)
            const cleanedFormGroup = this.cleanBySelection(control);
            if(cleanedFormGroup)
              contentForm.addControl(controlName, cleanedFormGroup);
          }
          else {
            const cleans = control instanceof SearchCriterion ? control.getCleanUpSubFormGroups() : cleanBooleanControlNames;
            console.log("Clean up form group " + controlName, cleans);
            const newFormGroup = this.getNewCleanedForm(control, cleans);
            contentForm.addControl(controlName, newFormGroup);
          }
        }
      }
      else if (control instanceof FormControl) {
        const newControl = this.fb.control(control.value);
        contentForm.addControl(controlName, newControl);

      }
    })
    return contentForm;
  }

  private cleanBySelection(fg: FormGroup<any>) {
    const cleanedFormGroup = this.fb.group({});
    let empty = true;
    Object.keys(fg.value).forEach(val => {
      //console.log(genre, currentGenreForm.get(genre)?.value);
      if(fg.get(val)?.value === true) {
        cleanedFormGroup.addControl(val, this.fb.control(true));
        empty=false;
      }
    })
    if(!empty)
      return cleanedFormGroup
    else
      return undefined;
  }





}
