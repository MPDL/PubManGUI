import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'pure-add-remove-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-remove-buttons.component.html',
  styleUrls: ['./add-remove-buttons.component.scss']
})
export class AddRemoveButtonsComponent implements OnInit {

  @Input({ required: true }) index!: number;
  @Input() add_val?: string;
  @Input() del_val?: string;
  @Input() hiddenAddButton?: boolean;
  @Input() disableAdd: boolean = false;
  @Input() disableRemove: boolean = false;
  @Output() notice = new EventEmitter();
  add_value: string | undefined;
  del_value: string | undefined;

  constructor(private translateService: TranslateService) { }
  ngOnInit() {
    this.add_value = this.add_val ? this.add_val : '<i class="bi bi-plus"></i>';
    if(this.add_val && this.add_val === this.translateService.instant("common.add")) {
      //this.add_value = '<span class="material-symbols-outlined">' + this.add_symbol + '</span> ' + this.add_value;
      this.add_value = '<i class="bi bi-plus-lg"></i> ' + this.add_value;
    }
    this.del_value = this.del_val ? this.del_val : '<i class="bi bi-dash"></i>';
  }

  add(i: number) {
    this.notice.emit({ action: 'add', index: i });
  }

  remove(i: number) {
    this.notice.emit({ action: 'remove', index: i });
  }
}
