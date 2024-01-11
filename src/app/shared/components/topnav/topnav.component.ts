import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pure-topnav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss'
})
export class TopnavComponent {

  do_some_navigation(target: string) {
    alert('navigating 2 ' + target);
  }
}
