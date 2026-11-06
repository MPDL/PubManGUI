import { Component, inject, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslatePipe } from "@ngx-translate/core";
import { AaService } from "../../../services/aa.service";
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { JusReportComponent } from "../jus-report/jus-report.component";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'pure-toolsnav',
  templateUrl: './toolsnav.component.html',
    standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe, NgbTooltip, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgTemplateOutlet]
})
export class ToolsnavComponent {
    aaService = inject(AaService);
    modalService = inject(NgbModal);
  protected readonly JusReportComponent = JusReportComponent;
  readonly env = environment;

  /** Render as an expandable inline section (mobile drawer) instead of a dropdown. */
  @Input() inline = false;
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  // Rendered in the desktop header and in the mobile drawer at the same time,
  // so the dropdown id has to be unique per instance.
  private static nextId = 0;
  readonly dropdownId = `toolsDropdown${ToolsnavComponent.nextId++}`;
}
