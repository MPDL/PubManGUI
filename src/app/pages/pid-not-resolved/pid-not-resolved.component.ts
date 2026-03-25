import { ChangeDetectionStrategy, Component, inject, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'en-content',
  templateUrl: './en/pid-not-resolved.component.html'
})
export class en { }

@Component({
  selector: 'de-content',
  templateUrl: './de/pid-not-resolved.component.html'
})
export class de { }

@Component({
  selector: 'pure-pid-not-resolved',
  imports: [],
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PidNotResolvedComponent {
  translateSvc = inject(TranslateService);
  //private route = inject(ActivatedRoute);

  private viewContainer = inject(ViewContainerRef);

  ngOnInit() {
    /* Insert this, if u want to access the id parameter
    this.route.params.subscribe(params => {
      const id = params['id']; // This will be undefined if not provided
      if (id) {
        // Handle case where ID is provided
      } else {
        // Handle case where ID is not provided
      }
    });
    */
    this.loadContent(this.translateSvc.currentLang);
    this.translateSvc.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log(event.lang);
      this.loadContent(this.translateSvc.currentLang);
    });
  }

  loadContent(lang: string) {
    this.viewContainer.clear();
    switch (lang) {
      case 'de':
        this.viewContainer.createComponent(de);
        break;
      default:
        this.viewContainer.createComponent(en);
    }
  }
}