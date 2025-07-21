import { Component, inject } from '@angular/core';
import { TranslatePipe } from "@ngx-translate/core";
import { AaService } from "../../../services/aa.service";

@Component({
  selector: 'pure-toolsnav',
  templateUrl: './toolsnav.component.html',
    standalone: true,
    imports: [TranslatePipe]
})
export class ToolsnavComponent {
    aaService = inject(AaService);
}
