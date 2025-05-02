import {Component, Input} from '@angular/core';
import {ItemViewMetadataElementComponent} from "../item-view-metadata-element/item-view-metadata-element.component";
import {AffiliationDbVO, CreatorVO, OrganizationVO} from "../../../../model/inge";
import {NgClass} from "@angular/common";
import { environment } from 'src/environments/environment';
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import {OrganizationsService} from "../../../../services/pubman-rest-client/organizations.service";
import {EmptyPipe} from "../../../../shared/services/pipes/empty.pipe";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'pure-item-view-creators',
  standalone: true,
  imports: [
    ItemViewMetadataElementComponent,
    NgClass,
    NgbPopover,
    EmptyPipe,
    TranslatePipe
  ],
  templateUrl: './item-view-creators.component.html',
  styleUrl: './item-view-creators.component.scss'
})
export class ItemViewCreatorsComponent {
  @Input() creators: CreatorVO[] | undefined = [];

  affiliations: OrganizationVO[] = [];
  affiliationMap: Map<string, OrganizationVO> = new Map();
  creatorMap: Map<CreatorVO, number[]> = new Map();

  currentAffiliationHighlights: number[] = [];

  maxDisplay = 20;

  coneUrl = environment.cone_instance_uri;

  selectedAffiliationForPopover: AffiliationDbVO | undefined;

  constructor(private ouService: OrganizationsService) {

  }


  ngOnInit() {
    this.sortCreatorsAndAffiliations()
  }

  sortCreatorsAndAffiliations() {

    if (this.creators) {

    this.creators.forEach(c => {
      this.creatorMap.set(c, []);
      if (c.person) {
        //console.log("Handling Person " + c.person.familyName);

        if (c.person.organizations) {
          c.person.organizations.forEach(creatorOu => {
            //console.log("Handling aff " + creatorOu.name);

            let index = 0;
            if (this.affiliationMap.has(creatorOu.name)) {

              index = this.affiliations.indexOf(this.affiliationMap.get(creatorOu.name)!) + 1;


            } else {
              this.affiliationMap.set(creatorOu.name, creatorOu);
              this.affiliations.push(creatorOu);
              index = this.affiliations.length;
            }
            const currentIndexes = this.creatorMap.get(c)!;
            currentIndexes.push(index);
            this.creatorMap.set(c, currentIndexes);

          })
        }
      }

    })

  }

}

  highlightAffiliations(param: number[] | undefined) {
    this.currentAffiliationHighlights = param ? param : [];
  }

  unhighlightAffiliations() {
    this.currentAffiliationHighlights= [];
  }

  isIncludedInCurrrentHighlights(param: number[] | undefined) {
    if(param)
      return this.currentAffiliationHighlights.some(affIndex => param.includes(affIndex))
    return false;
  }

  showMore(amount: number) {
    this.maxDisplay = this.maxDisplay + amount
    if (this.maxDisplay > this.creatorMap.size) {
      this.maxDisplay = this.creatorMap.size;
    }
  }

  showLess() {
    /*
    if(number) {
      this.maxDisplay = this.maxDisplay - number;
      if(number<1) {
        this.maxDisplay = 20;
      }
    }
    else
      this.maxDisplay = 20;
  }

     */
    this.maxDisplay = 20;
  }

  toggleAffPopover(popover: NgbPopover, aff: OrganizationVO) {
    if (popover.isOpen()) {
      popover.close();
    } else {
      this.selectedAffiliationForPopover = undefined;
      this.ouService.retrieve(aff.identifier).subscribe(ou => {
        this.selectedAffiliationForPopover = ou;
      })
      popover.open();
    }

  }
}
