import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  @Output() notice = new EventEmitter();
  add_value: string | undefined;
  del_value: string | undefined;

  ngOnInit() {
    this.add_value = this.add_val ? this.add_val : '+';
    this.del_value = this.del_val ? this.del_val : '-';
  }

  add(i: number) {
    this.notice.emit({ action: 'add', index: i });
  }

  remove(i: number) {
    this.notice.emit({ action: 'remove', index: i });
  }
}
