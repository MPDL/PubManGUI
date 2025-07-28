import { Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
    selector: 'pure-confirmation',
    templateUrl: './confirmation.component.html',
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
