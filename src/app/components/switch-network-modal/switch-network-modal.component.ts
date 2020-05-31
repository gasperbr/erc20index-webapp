import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-switch-network-modal',
  templateUrl: './switch-network-modal.component.html',
  styleUrls: ['./switch-network-modal.component.scss']
})
export class SwitchNetworkModalComponent {

  text;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.text = `to ${environment.networkName}`;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
