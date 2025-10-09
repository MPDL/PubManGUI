import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Message, MessageService } from "src/app/services/message.service";
import { finalize, Observable, repeat, Subject, switchMap, takeUntil, takeWhile, tap, timer } from "rxjs";

@Component({
  selector: 'pure-notification',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  @Input() message?: Message;


  collapsed: boolean = true;
  countdownEnabled = false;

  main_color = 'info';
  severity_icon: string = 'info';

  //countdown$: Observable<number>;

  private readonly _stopCountdown = new Subject<void>();
  private readonly _startCountdown = new Subject<void>();

  protected progress = 100;

  private duration = 5000;


  constructor( private messageSvc: MessageService) {

    const ticks = this.duration/100;
    timer(0, 100)
      .pipe(
        takeUntil(this._stopCountdown),
        takeWhile(n => n<=ticks && this.countdownEnabled),
        tap((n) => {
          this.progress = Math.round((ticks-n)*100 / ticks);
          //console.log('countdown', n, this.progress)
          if(n>=ticks) {
            //console.log('close');
            this.close();
          }
        }),
        repeat({delay: () => this._startCountdown}),
      ).subscribe()
  }

  ngOnDestroy() {
    this._stopCountdown.next();
  }


  /*
  public onAreaMessage = effect(() => {
    this.message = this.messageSvc.lastMessage();
    this.collapsed = this.message?.collapsed;
    this.dress(this.message);
    return true;
  });

   */

  ngOnChanges() {
    if(this.message) {
      this.dress(this.message);
    }
  }

  countdown() {

  }

  dress(content: any): void {
    this._stopCountdown.next();
    this.progress = 100;
    this.countdownEnabled = false;
    this.collapsed = content?.collapsed === undefined ? true : content.collapsed;
    switch (content.type) {
      case 'error':
      case 'danger':
        this.main_color = `danger`;
        this.severity_icon = 'error';
        break;
      case 'warning':
        this.main_color = `warning`;
        this.severity_icon = 'warning';
        break;
      case 'success':
        this.main_color = `success`;
        this.severity_icon = 'task_alt';
        this.countdownEnabled = true;
        this._startCountdown.next();
        break;
      case 'info':
        this.main_color = `info`;
        this.severity_icon = 'info';
        this.countdownEnabled = true;
        this._startCountdown.next();

    }
  }

  close(): void {

    this._stopCountdown.next();

    if(this.message) {
      this.messageSvc.lastMessage().splice(this.messageSvc.lastMessage().indexOf(this.message), 1);
    }
    this.message = undefined;

  }

  slide(): void {
    this.collapsed = this.collapsed ? false : true;
  }
}
