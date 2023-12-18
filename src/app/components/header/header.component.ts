import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
// TODO when aa is integrated
//import { AaService } from 'src/app/base/services/aa.service';
import { AaComponent } from '../aa/aa.component';
import { Router, RouterLink } from '@angular/router';
import { SwitchThemeComponent } from '../switch-theme/switch-theme.component';
// TODO when TooltipDirective is integrated
//import { TooltipDirective } from 'src/app/shared/directives/tooltip.directive';

@Component({
    selector: 'pure-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [ AaComponent, FormsModule, RouterLink, ReactiveFormsModule, SwitchThemeComponent]
})
export class HeaderComponent {

  user_name = 'pure user'

  search_form = this.form_builder.group({
    text: '',
  });

  constructor(
    private form_builder: FormBuilder,
    // TODO when aa is integrated
    // public aa: AaService,
    private router: Router
    ) { }

  search(): void {
    const search_term = this.search_form.get('text')?.value;
    if (search_term) {
      const query = { query_string: { query: search_term } };
      this.router.navigateByUrl('/', {onSameUrlNavigation: 'reload', state: {query}});
    }
    this.search_form.controls['text'].patchValue('');
  }

}