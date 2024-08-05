import { Component, OnInit, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';

@Component({
    selector: 'pure-message',
    templateUrl: './message.component.html',
    standalone: true,
    imports: [NgClass]
})
export class MessageComponent implements OnInit {

  message: any;

  constructor(
    private dialog: DialogRef<any>,
    @Inject(DIALOG_DATA) private data: any
    ) { }

  ngOnInit(): void {
    this.message = this.data;
  }

  close(): void {
    this.dialog.close();
  }

  border_color(message_type: string) {
    return `border-${message_type}`;
  }

  text_color(message_type: string) {
    return `text-${message_type}`;
  }

  btn_color(message_type: string) {
    return `btn-outline-${message_type}`;
  }
}
