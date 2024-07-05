import { Component } from "@angular/core";
import {ItemListComponent} from "../item-list/item-list.component";
import {baseElasticSearchQueryBuilder} from "../../shared/services/search-utils";
import {of} from "rxjs";

@Component({
  selector: 'pure-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    ItemListComponent
  ],
})
export class HomeComponent {

  welcome = 'welcome 2 pure';


  searchQuery = of({
    bool: {
      must: baseElasticSearchQueryBuilder("versionState", "RELEASED")
    }
  })

}
