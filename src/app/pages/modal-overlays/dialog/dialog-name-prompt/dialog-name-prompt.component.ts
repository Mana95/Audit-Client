import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ConfirmationAlert } from 'app/@core/data/confrimation-alert';

@Component({
  selector: 'ngx-dialog-name-prompt',
  templateUrl: 'dialog-name-prompt.component.html',
  styleUrls: ['dialog-name-prompt.component.scss'],
})
export class DialogNamePromptComponent {

  @Input() dialogObjectData : ConfirmationAlert;
  
  constructor(protected ref: NbDialogRef<DialogNamePromptComponent>) {}

  cancel() {
    this.ref.close();
  }

  submit() {
    this.ref.close(1);
  }
}
