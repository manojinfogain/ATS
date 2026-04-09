import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { OnboardService } from '../../../onboard.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-onboard-form-modal',
  templateUrl: './onboard-form-modal.component.html',
  styleUrls: ['./onboard-form-modal.component.scss']
})
export class OnboardFormModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<OnboardFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _onboardServ: OnboardService,
    private _share: ShareService
  ) { }

  ngOnInit(): void {
    this.data;
    
  }

  printForm(){
    document.title= this.data?.Name
    window.print();
  }

  sendIDcardDetailsToAdmin(){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to send ID card details to Admin?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._onboardServ.sendIdCardDetailsToAdmin(this.data?.candidateId).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true)
          }
        )
      }
      
    });
    
  }

     /***
   * close modal
   */
     closeModal(): void {
      this.dialogRef.close();
    }

}
