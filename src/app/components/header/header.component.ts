import { Component, ElementRef, Input, Renderer2, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AaComponent } from '../aa/aa.component';
import { SwitchBsThemeComponent } from 'src/app/shared/components/switch-bs-theme/switch-bs-theme.component';
import { TooltipDirective } from 'src/app/shared/directives/tooltip.directive';
import { DOCUMENT } from '@angular/common';
import { AaService } from 'src/app/services/aa.service';
import { LangSwitchComponent } from 'src/app/shared/components/lang-switch/lang-switch.component';
import { SidenavComponent } from 'src/app/shared/components/sidenav/sidenav.component';

@Component({
    selector: 'pure-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [ RouterLink, FormsModule, ReactiveFormsModule, TooltipDirective, SwitchBsThemeComponent, LangSwitchComponent, AaComponent, SidenavComponent]
})
export class HeaderComponent {

  headerHeight: number = 0;
  header!: HTMLElement;
  private document = inject(DOCUMENT);
  newHeight: any;

  ngOnInit() {
    const nav = this.document.getElementById('header');
    if (nav) {
      this.header = nav;
    }
    this.headerHeight = this.header.offsetHeight as number;
  }

  ngAfterViewInit() {
    this.document.addEventListener('scroll', (ev) => {
      this.resizeHeader(ev);
    });
  }

  search_form = this.form_builder.group({
    text: '',
  });

  constructor(
    private form_builder: FormBuilder,
    public aa: AaService,
    private router: Router
    ) { }

  search(): void {
    const search_term = this.search_form.get('text')?.value;
    if (search_term) {
      const query = { query_string: { query: search_term } };
      this.router.navigateByUrl('/list', {onSameUrlNavigation: 'reload', state: {query}});
    }
    this.search_form.controls['text'].patchValue('');
  }

  resizeHeader(event: any) {
    this.newHeight = this.headerHeight - window.scrollY / 2;

    if (this.newHeight < 50) {
      this.newHeight = 50;
    }

    let fontsize = this.newHeight / this.headerHeight;
    if (fontsize >= 0.5) {
      this.header.style.fontSize = fontsize + 'em';
    }
    // if (this.newHeight >= this.headerHeight) {
      this.header.style.height = this.newHeight + 'px';
    // }

  }

  help() {
    alert('help ya self!');
  }

  tools() {
    alert('select from tools ...');
  }

  switch_lang() {
    const loc = localStorage.getItem('locale');
    if (loc?.localeCompare('de') === 0) {
      localStorage.setItem('locale', 'en');
    } else {
      localStorage.setItem('locale', 'de');
    }
    location.reload();
  }

}
