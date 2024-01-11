import { Component } from "@angular/core";

@Component({
  selector: 'pure-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [],
})
export class HomeComponent {

  welcome = 'welcome 2 pure';

}
