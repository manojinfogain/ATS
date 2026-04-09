import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { OnboardService } from '../../../onboard.service';
import { OfferService } from 'projects/ats-global-system/src/app/offer-module/offer.service';

@Component({
  selector: 'app-preview-leadership-offer-modal',
  templateUrl: './preview-leadership-offer-modal.component.html',
  styleUrls: ['./preview-leadership-offer-modal.component.scss']
})
export class PreviewLeadershipOfferModalComponent implements OnInit {

  public encryptParam: string;
  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  public height: string = '';
  public zoomLevels = ['auto', 'page-actual', 'page-width', 0.25, 0.50, 1, 1.2, 1.4, 1.6, 1.8, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  constructor(
    public dialogRef: MatDialogRef<PreviewLeadershipOfferModalComponent>,
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
    debugger

  }


  /***
   * preview offer letter method
   */
  public pdfPreviewData: Blob;
  public documentName: string = ''
  previewOfferletter(Candidateid: string) {
    this.data['title'] = 'Preview Offer Letter'
    let today = new Date();
    let todayDate = GlobalMethod.formatDate(today);
    this.documentName = 'offer_letter_' + this.data?.Name + '_' + this.data?.talent_id + '_' + todayDate
    this._http.get(`${environment.apiMainUrlNet}LeadershipOnboard/DownloadOfferDocument?candidateId=${Candidateid}&documentType=${'OL'}`, { responseType: 'blob' }).subscribe(
      res => {
        this.pdfPreviewData = res
      }
    )
  }

  ngAfterContentInit(): void {
    this.previewOfferletter(this.data.CandidateId);
  }

  /**
   * generate enctypt daata
   * @returns 
   */
  // generateEncryptData(): string {
  //   let candidateData: any = {
  //     cid: this.data.cid,
  //     name: this.data.Name,
  //     email: this.data.email
  //   }
  //   let encryptData = this._globalMethodServe.encryptData(candidateData);
  //   return encryptData
  // }


  /***
   * send offer
   */
  sendOfferHandler():void{ 
    this.confirmOfferSend();
  }

  //send offer letter to bharti
  sendOfferToBharti():void{    
    this._onboardServ.sendOfferToBharti(this.data.candidateId).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      }
    )
  }

  /**
   * send offer api call
   */
  // sendOfferFunc():void{
  //   let body = {
  //     cid: this.data.cid,
  //     link: this.generateEncryptData()
  //   }
  //   this._offerService.sendOffer(body).subscribe(
  //     res => {
  //       this._share.showAlertSuccessMessage.next(res);
  //       this.dialogRef.close(true);
  //     }
  //   )
  // }

  chooseSodexoForm(candidateId:string){    
    this._http.get(`${environment.apiMainUrlNet}OnBoard/DownloadSodexoForm?Candidateid=${candidateId}`, { responseType: 'blob' }).subscribe(
      res => {
        this.pdfPreviewData = res;
        
        this.data['title'] = 'Preview Sodexo Form'
        let today = new Date();
        let todayDate = GlobalMethod.formatDate(today);
        this.documentName = 'Sodexo_Form_' + this.data?.Name + '_' + this.data?.talent_id + '_' + todayDate
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }

  /***
   * confirmation dailog
   */

  confirmOfferSend() {
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   panelClass: 'ats-confirm',
    //   data: {
    //     headerText: 'Alert',
    //     message: ` Are you sure you want to send offer letter to <span class='u-name'>${this.data?.Name}</span> ?`,
    //     buttonText: {
    //       ok: "Yes",
    //       cancel: "No"
    //     },
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.sendOfferFunc();
    //   }
      
    // });
  }
  closeModal(): void {
    this.dialogRef.close();
  }
}


