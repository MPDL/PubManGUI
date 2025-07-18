import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-tools',
  templateUrl: './tools.component.html',
    standalone: true,
    imports: [RouterLink, TranslatePipe]
})
export class ToolsComponent {}
