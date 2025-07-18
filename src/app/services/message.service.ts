import { Injectable, signal } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';

import { MessageComponent } from '../components/shared/message/message.component';
import { ConfirmationComponent } from '../components/shared/confirmation/confirmation.component';

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

  displayConfirmation(message?: { title?: string, text: string, confirm: string, cancel: string }) {
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
    let title, msg = null;
    if (message.lastIndexOf('\n')>=0) {
      const multilines = this.splitMessage(message);
      msg = { type: 'success', title: multilines.title, text: multilines.content };
      if (this.lastMessage().title && this.lastMessage().title === title) return;
    } else {
      msg = { type: 'success', text: message };
    }
    //this.displayMessage(msg);
    this.displayOnArea(msg);
  }

  warning(message: string) {
    const msg = { type: 'warning', text: message };
    this.displayMessage(msg);
    //this.displayOnArea(msg);
  }

  error(message: string) {
    let msg = null;
    if (message.lastIndexOf('\n')>=0) {
      const formattedMsg = this.splitRawError(message);
      msg = { type: 'danger', title: formattedMsg.title, text: formattedMsg.content };
      if (this.lastMessage().title && this.lastMessage().title === formattedMsg.title) return;
    } else {
      msg = { type: 'danger', text: message };
    }
    //this.displayMessage(msg);
    this.displayOnArea(msg);
  }

  splitMessage(message: string): { title: string, content: string } {
    const title = message.substring(0,message.indexOf('\n'));
    const content = message.substring(message.indexOf('\n')+1);
    return { title: title, content: content };
  }

  splitRawError(message: string): { title: string, content: string } {
    let title = null;
    if (message.substring(message.lastIndexOf('\n')).length < 3) {
      title = message.substring(0, message.indexOf('\n'));
    } else {
      title = message.substring(message.lastIndexOf('\n'));
    }
    const content = message.substring(0, message.lastIndexOf('\n'));
    return { title: title, content: content };
  }
}
