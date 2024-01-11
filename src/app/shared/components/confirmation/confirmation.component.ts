import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
    selector: 'pure-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
    standalone: true
})
export class ConfirmationComponent {

  title = 'CONFIRMATION REQUIRED';

  constructor(
    private dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) public message: string
    ) { }

  yes(): void {
    this.dialogRef.close(true);
  }
  no(): void {
    this.dialogRef.close(false);
  }

}
