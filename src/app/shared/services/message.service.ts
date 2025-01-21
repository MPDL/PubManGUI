import { Injectable, signal } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';

import { MessageComponent } from '../components/message/message.component';
import { ConfirmationComponent } from '../components/confirmation/confirmation.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  // messageDialogRef!: DialogRef<string>;
  // confirmationDialogRef!: DialogRef<boolean>;
  confirmation = false;

  public lastMessage = signal<any>({});

  constructor(public dialog: Dialog) { }

  displayMessage(message?: { type: string; text: string; }) {
    // this.messageDialogRef = this.dialog.open(MessageComponent, {
      this.dialog.open(MessageComponent, {
      // hasBackdrop: false,
      autoFocus: false,
      data: message,
      panelClass: 'pure-dialog',
    });
  }

  displayConfirmation(message?: { title?: string, text: string, confirm: string, reject: string }) {
    const ref = this.dialog.open(ConfirmationComponent, {
      hasBackdrop: false,
      // autoFocus: false,
      data: message,
      panelClass: 'pure-dialog',
    });
    return ref;
  }

  displayOnArea(message?: { type: string; title?: string, text: string; }) {
    this.lastMessage.set(message);
  }

  info(message: string) {
    const msg = { type: 'info', text: message };
    //this.displayMessage(msg);
    this.displayOnArea(msg);
  }

  success(message: string) {
    const msg = { type: 'success', text: message };
    //this.displayMessage(msg);
    this.displayOnArea(msg);
  }

  warning(message: string) {
    const msg = { type: 'warning', text: message };
    this.displayMessage(msg);
    //this.displayOnArea(msg);
  }

  error(message: string) {
    let title, msg = null;
    if (message.lastIndexOf('\n')>=0) {
      title = message.substring(message.lastIndexOf('\n'));
      const message_filtered = message.substring(0, message.lastIndexOf('\n'));
      msg = { type: 'danger', title: title, text: message_filtered };
      if (this.lastMessage().title && this.lastMessage().title === title) return;
    } else {
      msg = { type: 'danger', text: message };
    }
    //this.displayMessage(msg);
    this.displayOnArea(msg);
  }
}