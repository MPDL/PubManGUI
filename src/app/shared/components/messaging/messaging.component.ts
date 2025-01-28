import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { MessageService } from "src/app/shared/services/message.service";

@Component({
  selector: 'pure-messaging',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './messaging.component.html',
})
export class MessagingComponent {
  message: any = {};
  collapsed: boolean = true; 

  fg_color = 'text-info-emphasis';
  bg_color = 'bg-info-subtle';
  severity_icon: string = 'info';

  constructor( private messageSvc: MessageService) { }

  public onAreaMessage = effect(() => {
    this.message = this.messageSvc.lastMessage();
    this.dress(this.message);
    return true;
  });

  dress(content: any): void {
    switch (content.type) {
      case 'error':
      case 'danger':
        this.fg_color = `text-danger-emphasis`;
        this.bg_color = `bg-danger-subtle`;
        this.severity_icon = 'error';
        break;
      case 'warning':
        this.fg_color = `text-warning-emphasis`;
        this.bg_color = `bg-warning-subtle`;
        this.severity_icon = 'warning';
        break;
      case 'success':
        this.fg_color = `text-success-emphasis`;
        this.bg_color = `bg-success-subtle`;
        this.severity_icon = 'task_alt';
        setTimeout(() => {
          this.close();
        }, 15000);
        break;
      case 'info':
        this.fg_color = 'text-info-emphasis';
        this.bg_color = 'bg-info-subtle';
        this.severity_icon = 'info';
        setTimeout(() => {
          this.close();
        }, 10000);
    }
  }

  close(): void {
    this.message = {};
  }

  slide(): void {
    this.collapsed = this.collapsed ? false : true;
  }
}