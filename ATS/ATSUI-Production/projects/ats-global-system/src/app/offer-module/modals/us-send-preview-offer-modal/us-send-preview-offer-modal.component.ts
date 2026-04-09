import { Component, OnInit, Inject } from '@angular/core';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { GlobalMethod } from '../../../core/common/global-method';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { OfferService } from '../../offer.service';
import { OnboardService } from '../../../onboard-module/onboard.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { ShareService } from '../../../core/services/share.service';
import { HttpClient } from '@angular/common/http';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { ApproveRejectUsModalComponent } from '../approve-reject-us-modal/approve-reject-us-modal.component';
import { UsSendOfferToHrModalComponent } from '../us-send-offer-to-hr-modal/us-send-offer-to-hr-modal.component';

@Component({
  selector: 'app-us-send-preview-offer-modal',
  templateUrl: './us-send-preview-offer-modal.component.html',
  styleUrls: ['./us-send-preview-offer-modal.component.scss']
})
export class UsSendPreviewOfferModalComponent implements OnInit {
  public encryptParam: string;
  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  public height: string = '';
  public zoomLevels = ['auto', 'page-actual', 'page-width', 0.25, 0.50, 1, 1.2, 1.4, 1.6, 1.8, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  constructor(
    public dialogRef: MatDialogRef<UsSendPreviewOfferModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _offerService: OfferService,
    private _onboardServ: OnboardService,
    private _globalMethodServe: GlobalCommonMethodService,
    private _share: ShareService,
    private _http: HttpClient,
    private dialog: MatDialog
  ) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
  }

  ngOnInit(): void {
    this.data;
    

  }


  /***
   * preview offer letter method
   */
  public pdfPreviewData: Blob;
  public documentName: string = ''
  previewOfferletter(cid: number) {
    let today = new Date();
    let todayDate = GlobalMethod.formatDate(today);
    this.documentName = 'offer_letter_' + this.data?.Name + '_' + this.data?.talent_id + '_' + todayDate
    this._http.get(`${environment.apiMainUrlNet}Offer/DownloadOffer?cid=${cid}`, { responseType: 'blob' }).subscribe(
      res => {
        this.pdfPreviewData = res
      }
    )
  }

  ngAfterContentInit(): void {
    this.previewOfferletter(this.data.cid);
  }

  /**
   * generate enctypt daata
   * @returns 
   */
  generateEncryptData(): string {
    let candidateData: any = {
      cid: this.data.cid,
      name: this.data.Name,
      email: this.data.email
    }
    let encryptData = this._globalMethodServe.encryptData(candidateData);
    return encryptData
  }


  /***
   * send offer
   */
  sendOfferHandler(e: string): void {
   
    if (e == 'H') {
      this.openSendOfferToHrModal();
    }
    else{
      this.confirmOfferSend();
      // this.sendOfferFunc();
    }
  }


  //send offer letter to bharti
  sendOfferToBharti(): void {
    this._onboardServ.sendOfferToBharti(this.data.cid).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      }
    )
  }

  /**
   * send offer api call
   */
  sendOfferFunc(): void {
    let OfferAcceptDate = new Date();
    let OfferAcceptTime = OfferAcceptDate.getHours() + ':'+ OfferAcceptDate.getMinutes()+ ':'+ OfferAcceptDate.getSeconds();
    let body = {
      cid: this.data.cid,
      link: this.generateEncryptData(),
      /*by ar 18jul-2024*/ 
      OfferedOnUTC: GlobalMethod.convertToUTCDate(OfferAcceptDate),
      OfferedOnTimeZone: GlobalMethod.getTimezone(),
      OfferedOnOffsetDate: GlobalMethod.getOffset().toString(),
      ModifiedOnUTC: GlobalMethod.convertToUTCDate(OfferAcceptDate),
      ModifiedOnTimeZone: GlobalMethod.getTimezone(),
      ModifiedOnOffsetDate: GlobalMethod.getOffset().toString(),
    }
    this._offerService.usSendOfferToCandidate(body).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      }
    )
  }

  /**send offer to hr */
  openSendOfferToHrModal() {
    
    //element['title'] = "Approve/ Reject Offer";
    const dialogRef = this.dialog.open(UsSendOfferToHrModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
      data: this.data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        if(result?.type == 'A'){
          this.dialogRef.close({type:'A'});
        }
        else{
          this.dialogRef.close(true);
        }
        // this.paginatorCompRef.paginator.pageIndex = 0;
        // this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        // this.previewOfferletter(this.data.cid);
      }
    });

  }

  approveRejectOfferModal(element: any) {
    
    //element['title'] = "Approve/ Reject Offer";
    const dialogRef = this.dialog.open(ApproveRejectUsModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
      data: this.data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(result?.type == 'A'){
          this.dialogRef.close(true);
        }
        
        // this.paginatorCompRef.paginator.pageIndex = 0;
        // this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
      }
    });

  }

  /***
   * confirmation dailog
   */

  confirmOfferSend() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to send offer letter to <span class='u-name'>${this.data?.Name}</span> ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sendOfferFunc();
      }

    });
  }
  closeModal(): void {
    this.dialogRef.close();
  }

}
