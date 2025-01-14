import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvitationStatus } from 'src/app/model/inge';
import { MiscellaneousService } from 'src/app/services/pubman-rest-client/miscellaneous.service';

@Component({
  selector: 'pure-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})
export class EventFormComponent {
  @Input() event_form!: FormGroup;

  miscellaneousService = inject(MiscellaneousService);

  invitationBoolean= new FormControl(true);

  ngOnInit() {
    this.invitationBoolean.setValue (this.event_form.get('invitationStatus')?.value == InvitationStatus.INVITED ? true : false);
  }
  
  get genreSpecificProperties() {
    return this.miscellaneousService.genreSpecficProperties();
  }

  change_invitation_status(event: any) {
    console.log('')
    this.event_form.get('invitationStatus')?.setValue(this.invitationBoolean.value ? InvitationStatus.INVITED : null);
  }
}
