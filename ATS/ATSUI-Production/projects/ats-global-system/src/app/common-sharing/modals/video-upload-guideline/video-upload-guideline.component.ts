import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit,AfterContentInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
@Component({
  selector: 'app-video-upload-guideline',
  templateUrl: './video-upload-guideline.component.html',
  styleUrls: ['./video-upload-guideline.component.scss']
})
export class VideoUploadGuidelineComponent implements OnInit,AfterContentInit {
  public encryptParam: string;
  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  public height: string = '';
  public zoomLevels = ['auto', 'page-actual', 'page-width', 0.25, 0.50, 1, 1.2, 1.4, 1.6, 1.8, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 
  constructor(
    public dialogRef: MatDialogRef<VideoUploadGuidelineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _http: HttpClient

  ) { }


  /***
   * preview doc
   */
  public pdfPreviewData: Blob;
  public documentName: string = ''
  previewOfferletter(cid: number) {
    this.documentName = this.data?.docName;
    this._http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${this.data?.path}`, { responseType: 'blob' }).subscribe(
      res => {
        this.pdfPreviewData = res
      }
    )
  }
  ngOnInit(): void {
   
  }

  ngAfterContentInit(): void {
    this.previewOfferletter(this.data.cid);
  }

 
  /***/

  closeModal(): void {
    this.dialogRef.close();
  }

}
