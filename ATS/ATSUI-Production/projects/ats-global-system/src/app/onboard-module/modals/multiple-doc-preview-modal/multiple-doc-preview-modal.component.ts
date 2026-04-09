 import { HttpClient } from '@angular/common/http';
 import { Component, Inject, OnInit } from '@angular/core';
 import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
 import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
 import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { OnboardCommonMethod } from '../../../core/common/onboard-common-method';
 @Component({
  selector: 'app-multiple-doc-preview-modal',
  templateUrl: './multiple-doc-preview-modal.component.html',
  styleUrls: ['./multiple-doc-preview-modal.component.scss']
})
export class MultipleDocPreviewModalComponent implements OnInit {
   bgvDataColum = ['fileName', 'action'];
 
   public bgvData: any = [];
   constructor(
     public dialogRef: MatDialogRef<MultipleDocPreviewModalComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     public dialog: MatDialog,
     private _share: ShareService,
     private _globalMethod: GlobalCommonMethodService,
     private _http: HttpClient
   ) { }
 
   ngOnInit() {
     this.bgvData = this.data?.docList;
   }
 
   //download bgv
   dwnloadBgv(data) {
 
     let elm = {};
     elm['documentName'] = data.DocumentName
     elm['filePath'] = data?.DocumentPath;
     elm['fileName'] = data?.DocumentName;
     elm['type'] = 'path';
     elm['cid'] = data?.cid;
     OnboardCommonMethod.downloadPrevDocumentsOld(elm, this._http, this.dialog, this._share);
   }
 
 
   /***
   * close dialog
   */
   closeModal(): void {
     this.dialogRef.close();
   }
 
 
 
 }
 