import { Component, inject } from '@angular/core';
import { TranslatePipe } from "@ngx-translate/core";
import { AaService } from "../../../services/aa.service";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'pure-toolsnav',
  templateUrl: './toolsnav.component.html',
    standalone: true,
  imports: [TranslatePipe, NgbTooltip]
})
export class ToolsnavComponent {
    aaService = inject(AaService);
}
