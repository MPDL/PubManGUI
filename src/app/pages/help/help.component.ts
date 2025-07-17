import { ChangeDetectionStrategy, Component, inject, ViewContainerRef } from '@angular/core';
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'en-content',
  templateUrl: './en/help.component.html'
})
export class en { }

@Component({
  selector: 'de-content',
  templateUrl: './de/help.component.html'
})
export class de { }

@Component({
  selector: 'pure-help',
  imports: [],
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpComponent {
  translateSvc = inject(TranslateService);

  private viewContainer = inject(ViewContainerRef);

  ngOnInit() {
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
