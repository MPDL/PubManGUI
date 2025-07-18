import { Component, Inject, OnInit } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
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
    if (this.message.type === 'info' || this.message.type === 'success') {
      setTimeout(() => {
        this.close();
      }, 15000);
    }
  }

  close(): void {
    this.dialog.close();
  }

  border_color(message_type: string) {
    return `border-${message_type}-subtle`;
  }

  text_color(message_type: string) {
    return `text-${message_type}-emphasis`;
  }

  btn_color(message_type: string) {
    return `btn-outline-${message_type}`;
  }

  bg_color(message_type: string) {
    return `bg-${message_type}-subtle`;
  }
}
