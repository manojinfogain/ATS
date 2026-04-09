 import { HttpClient } from '@angular/common/http';
 import { AfterContentInit, Component, Inject, OnInit,Input } from '@angular/core';
 import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { ShareService } from '../../../core/services/share.service';
 @Component({
  selector: 'app-common-pdf-viewer-external',
  templateUrl: './common-pdf-viewer-external.component.html',
  styleUrls: ['./common-pdf-viewer-external.component.scss']
})
export class CommonPdfViewerExternalComponent implements OnInit, AfterContentInit {
   public encryptParam: string;
   constructor(
     public dialogRef: MatDialogRef<CommonPdfViewerExternalComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private _globalMethodServe: GlobalCommonMethodService,
     private _share: ShareService,
     private _http: HttpClient,
     private dialog: MatDialog
   ) {
   }
 
   ngOnInit(): void {
    debugger
     if(this.data?.pdfPreviewData){
       this.pdfPreviewData = this.data?.pdfPreviewData;
     }
     if(this.data?.documentName){
       this.documentName = this.data?.documentName;
     }
   }
 
 
   /***
    * preview offer letter method
    */
   @Input() public pdfPreviewData: Blob;
   @Input() public documentName: string = ''
   // previewOfferletter(cid: number) {
   //   this.data['title'] = 'Preview Offer Letter'
   //   let today = new Date();
   //   let todayDate = GlobalMethod.formatDate(today);
   //   this.documentName = 'offer_letter_' + this.data?.Name + '_' + this.data?.talent_id + '_' + todayDate
   //   this._http.get(`${environment.apiMainUrlNet}Offer/DownloadOffer?cid=${cid}`, { responseType: 'blob' }).subscribe(
   //     res => {
   //       this.pdfPreviewData = res
   //     }
   //   )
   // }
 
   ngAfterContentInit(): void {
     // this.previewOfferletter(this.data.cid);
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
   // sendOfferHandler():void{ 
   //   this.confirmOfferSend();
   // }
 
   //send offer letter to bharti
   // sendOfferToBharti():void{    
   //   this._onboardServ.sendOfferToBharti(this.data.cid).subscribe(
   //     res => {
   //       this._share.showAlertSuccessMessage.next(res);
   //       this.dialogRef.close(true);
   //     }
   //   )
   // }
 
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
 
   // chooseSodexoForm(){    
   //   this.data['title'] = 'Preview Sodexo Form'
   //   this._http.get(`${environment.apiMainUrlNet}Offer/DownloadOffer?cid=39190`, { responseType: 'blob' }).subscribe(
   //     res => {
   //       this.pdfPreviewData = res
   //     }
   //   )
   // }
 
   /***
    * confirmation dailog
    */
 
   // confirmOfferSend() {
   //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
   //     panelClass: 'ats-confirm',
   //     data: {
   //       headerText: 'Alert',
   //       message: ` Are you sure you want to send offer letter to <span class='u-name'>${this.data?.Name}</span> ?`,
   //       buttonText: {
   //         ok: "Yes",
   //         cancel: "No"
   //       },
   //     }
   //   });
 
   //   dialogRef.afterClosed().subscribe(result => {
   //     if (result) {
   //       // this.sendOfferFunc();
   //     }
       
   //   });
   // }
   closeModal(): void {
     this.dialogRef.close();
   }
 }
 