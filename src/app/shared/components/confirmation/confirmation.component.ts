import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
    selector: 'pure-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
    standalone: true
})
export class ConfirmationComponent {

  //title = 'Confirmation required';

  constructor(
    private dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) public message: any
    ) { }

  confirm(): void {
    this.dialogRef.close(true);
  }
  cancel(): void {
    this.dialogRef.close(false);
  }

}
