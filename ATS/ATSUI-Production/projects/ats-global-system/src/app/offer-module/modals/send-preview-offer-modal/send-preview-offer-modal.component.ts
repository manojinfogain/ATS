import { HttpClient } from '@angular/common/http';
import { AfterContentInit, Component, Inject, OnInit,Input } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { OfferService } from '../../offer.service';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { OnboardService } from '../../../onboard-module/onboard.service';
@Component({
  selector: 'app-send-preview-offer-modal',
  templateUrl: './send-preview-offer-modal.component.html',
  styleUrls: ['./send-preview-offer-modal.component.scss']
})
export class SendPreviewOfferModalComponent implements OnInit, AfterContentInit {
  public encryptParam: string;
  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  public height: string = '';
  public zoomLevels = ['auto', 'page-actual', 'page-width', 0.25, 0.50, 1, 1.2, 1.4, 1.6, 1.8, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  constructor(
    public dialogRef: MatDialogRef<SendPreviewOfferModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _offerService: OfferService,
    private _onboardServ: OnboardService,
    private _globalMethodServe: GlobalCommonMethodService,
    private _share: ShareService,
    private _http: HttpClient,
    private dialog: MatDialog
  ) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    //  pdfDefaultOptions.assetsFolder = 'assets/ngx-extended-pdf-viewer';
  }
pdfNonce = '';
  ngOnInit(): void {
   const meta = document.querySelector('meta[name="csp-nonce"]') as HTMLMetaElement;
  if (meta) {
    this.pdfNonce = meta.content;
  }
    

  }


  /***
   * preview pdf doc method
   */
  public pdfPreviewData: Blob;
  public documentName: string = ''
  previewOfferletter(cid: number) {
    this.data['title'] = 'Preview Offer Letter'
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
  sendOfferHandler():void{ 
    this.confirmOfferSend();
  }

  //send offer letter to bharti
  sendOfferToBharti():void{    
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
  sendOfferFunc():void{
    let body = {
      cid: this.data.cid,
      link: this.generateEncryptData()
    }
    this._offerService.sendOffer(body).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      }
    )
  }

  chooseSodexoForm(Candidateid:string){    
    this._http.get(`${environment.apiMainUrlNet}OnBoard/DownloadSodexoForm?Candidateid=${Candidateid}`, { responseType: 'blob' }).subscribe(
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
