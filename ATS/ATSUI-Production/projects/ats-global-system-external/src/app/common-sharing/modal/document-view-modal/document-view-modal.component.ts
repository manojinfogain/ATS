
import { AfterContentInit, AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
@Component({
  selector: 'app-document-view-modal',
  templateUrl: './document-view-modal.component.html',
  styleUrls: ['./document-view-modal.component.scss']
})
export class DocumentViewModalComponent implements OnInit,AfterContentInit {
  public encryptParam: string;
  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  public height: string = '';
  public zoomLevels = ['auto', 'page-actual', 'page-width', 0.25, 0.50, 1, 1.2, 1.4, 1.6, 1.8, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  constructor(
    public dialogRef: MatDialogRef<DocumentViewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
   previewOfferletter(cid: number) {
    //  let today = new Date();
    //  let todayDate = GlobalMethod.formatDate(today);
    //  this.documentName = 'offer_letter_' + this.data?.Name + '_' + this.data?.talent_id + '_' + todayDate
    //  this._http.get(`${environment.apiMainUrlNet}Offer/DownloadOffer?cid=${cid}`, { responseType: 'blob' }).subscribe(
    //    res => {
    //      this.pdfPreviewData = res
    //    }
    //  )
   }
 
   ngAfterContentInit(): void {
     this.previewOfferletter(this.data.cid);
   }

   closeModal(): void {
    this.dialogRef.close();
  }

}
