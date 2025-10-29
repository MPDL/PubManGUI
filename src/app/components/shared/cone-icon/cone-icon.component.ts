import { Component, Input } from '@angular/core';
import { NgClass } from "@angular/common";
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'pure-cone-icon',
  imports: [
    NgClass
  ],
  templateUrl: './cone-icon.component.html',
  styleUrl: './cone-icon.component.scss'
})
export class ConeIconComponent {

  @Input() coneId?: string;
  @Input() orcid?: string;
  @Input() button = false;

  coneLink? : string;

  ngOnInit(): void {
    this.coneLink = environment.cone_instance_uri + '/view.jsp?model=persons&uri=' + this.coneId?.substring(1);
  }

}
