import { Injectable, signal } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';

import { MessageComponent } from '../components/shared/message/message.component';
import { ConfirmationComponent } from '../components/shared/confirmation/confirmation.component';
import { PubManHttpErrorResponse } from "./interceptors/http-error.interceptor";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  // messageDialogRef!: DialogRef<string>;
  // confirmationDialogRef!: DialogRef<boolean>;
  confirmation = false;

  public lastMessage = signal<any>({});

  constructor(public dialog: Dialog, private translateService: TranslateService) { }

  displayMessage(message?: { type: string; text: string; }) {
    // this.messageDialogRef = this.dialog.open(MessageComponent, {
      this.dialog.open(MessageComponent, {
      // hasBackdrop: false,
      autoFocus: false,
      data: message,
      panelClass: 'pure-dialog',
    });
  }

  displayConfirmation(message?: { title?: string, text?: string, confirm: string, cancel: string }) {
    const ref = this.dialog.open(ConfirmationComponent, {
      hasBackdrop: false,
      // autoFocus: false,
      data: message,
      panelClass: 'pure-dialog',
    });
    return ref;
  }

  displayOnArea(message?: { type: string; title?: string, text: string; collapsed?: boolean }) {
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
    //this.displayMessage(msg);
    this.displayOnArea(msg);
  }

  error(message: string) {
    let msg = null;
    if (message.lastIndexOf('\n')>=0) {
      const formattedMsg = this.splitRawError(message);
      msg = { type: 'danger', title: formattedMsg.title, text: formattedMsg.content };
      //if (this.lastMessage().title && this.lastMessage().title === formattedMsg.title) return;
    } else {
      msg = { type: 'danger', text: message };
    }
    //this.displayMessage(msg);
    this.displayOnArea(msg);
  }

  httpError(error: PubManHttpErrorResponse) {
    let title = error.userMessage;
    let text = `
        ${(error.url || '')}<br/>
        ${error.status}: ${error.statusText}<br/>
        `
    let collapsed = true;

    if(error.status===404) {
      title = this.translateService.instant('common.notFound');
    }
    else if(error.status===401 || error.status===403) {
      title = this.translateService.instant('common.notAuthorized');
    }

    if(error.jsonMessage?.['validation-report']) {
      title = this.translateService.instant('validation.validationError')
      let validations = '<ul class="list-group list-group-flush bg-transparent">';
      error.jsonMessage?.['validation-report']?.items?.forEach((valrep: any) => {
        validations = validations +
          `<li class="list-group-item bg-transparent">
            <span class="bi bi-info-circle-fill me-2"></span>
             ${this.translateService.instant('backendValidation.' + valrep.content)}
            </li>`;
      });
      text = validations + '</ul>';
      collapsed = false;
    }
    else if(error.jsonMessage?.timestamp) {
      text = text +
        `${error.jsonMessage.message || '-'}<br/>
         ${error.jsonMessage.exception}<br/>
         ${error.jsonMessage.timestamp}
        `
    }
    else {

      if(error.jsonMessage) {
        text = text + JSON.stringify(error.jsonMessage);
      }
      else {
        text = text + error.error;
      }

    }
    this.displayOnArea({type: 'danger', title: title, text: text, collapsed: collapsed});
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
