import { HttpClient } from '@angular/common/http';
import {Component, Inject, OnInit} from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { OnboardService } from '../../../onboard-module/onboard.service';

@Component({
  selector: 'app-send-preview-appointment-letter',
  templateUrl: './send-preview-appointment-letter.component.html',
  styleUrls: ['./send-preview-appointment-letter.component.scss']
})
export class SendPreviewAppointmentLetterComponent implements OnInit {
  public encryptParam: string;
  public height: string = '';
  public zoomLevels = ['auto', 'page-actual', 'page-width', 0.25, 0.50, 1, 1.2, 1.4, 1.6, 1.8, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  constructor(
    public dialogRef: MatDialogRef<SendPreviewAppointmentLetterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _onboardServ: OnboardService,
    private _share: ShareService,
    private _http: HttpClient,
    private dialog: MatDialog
  ) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
  }

  ngOnInit(): void {

  }


  /***
   * preview offer letter method
   */
  public pdfPreviewData: Blob;
  public documentName: string = ''
  previewAppoimentLetter(Candidateid: string) {
    let today = new Date();
    let todayDate = GlobalMethod.formatDate(today);
    this.documentName = 'AppoinmentLetter_' + this.data?.Name + '_' + this.data?.talent_id + '_' + todayDate
    this._http.get(`${environment.apiMainUrlNet}OnBoard/DownloadAppoinmentLetter?Candidateid=${Candidateid}`, { responseType: 'blob' }).subscribe(
      res => {
        this.pdfPreviewData = res
      }
    )
  }

  ngAfterContentInit(): void {
    this.previewAppoimentLetter(this.data?.Candidate_Id);
  }

  


  /***
   * send Appoiment Letter
   */
  SendAppoimentLetterHandler():void{ 
    this.confirmOfferSend();
  }

  /**
   * send  Appoiment Letter api call
   */
  SendAppoimentLetterFunc():void{
    this._onboardServ.SendAppoimentLetter(this.data?.Candidate_Id).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      }
    )
  }

  /***
   * confirmation dailog
   */

  confirmOfferSend() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to send Appointment Letter to <span class='u-name'>${this.data?.Name}</span> ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.SendAppoimentLetterFunc();
      }
      
    });
  }
  closeModal(): void {
    this.dialogRef.close();
  }

}
