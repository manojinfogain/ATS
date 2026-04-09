import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { OfferService } from 'projects/ats-global-system/src/app/offer-module/offer.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
@Component({
  selector: 'app-download-salary-document-modal',
  templateUrl: './download-salary-document-modal.component.html',
  styleUrls: ['./download-salary-document-modal.component.scss']
})
export class DownloadSalaryDocumentModalComponent implements OnInit {
  bgvDataColum = ['fileName', 'action'];
  public dataSource: any = new MatTableDataSource([{ empty: 'row' }]);
  constructor(
    public dialogRef: MatDialogRef<DownloadSalaryDocumentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _offerService: OfferService,
    private http: HttpClient,
    private _share: ShareService,
    private _GlobCommon: GlobalCommonMethodService
  ) { }

  ngOnInit() {
    this.getDataSource();

  }
  removeAdditionalExtension(fileName: string) {
    return this._GlobCommon.removeLastExtension(fileName);
  }

  //get dataSource
  getDataSource() {
    this.data;

    const flterKey = ['FinalAttachment', 'FinalAttachment1', 'FinalAttachment2', 'FinalAttachmentPathKey', 'FinalAttachment1PathKey', 'FinalAttachment2PathKey'];
    let arr = Object.keys(this.data).filter(ele => flterKey.includes(ele)).reduce((obj, key) => {
      obj[key] = this.data[key];
      return obj
    }, {});
    const arrOfObj = Object.entries(arr).map((e) => ({ [e[0]]: e[1] }));
    const finalArrOfObjes = []
    for (let i = 0; i < arrOfObj.length; i++) {
      if (arrOfObj[i].FinalAttachment) {
        for (let j = 0; j < arrOfObj.length; j++) {
          if (arrOfObj[j].FinalAttachmentPathKey) {
            finalArrOfObjes.push({ 'fileName': arrOfObj[i].FinalAttachment, 'Path': arrOfObj[j].FinalAttachmentPathKey })
          }
        }
      } else
        if (arrOfObj[i].FinalAttachment1) {
          for (let j = 0; j < arrOfObj.length; j++) {
            if (arrOfObj[j].FinalAttachment1PathKey) {
              finalArrOfObjes.push({ 'fileName': arrOfObj[i].FinalAttachment1, 'Path': arrOfObj[j].FinalAttachment1PathKey })
            }
          }
        } else if (arrOfObj[i].FinalAttachment2) {
          for (let j = 0; j < arrOfObj.length; j++) {
            if (arrOfObj[j].FinalAttachment2PathKey) {
              finalArrOfObjes.push({ 'fileName': arrOfObj[i].FinalAttachment2, 'Path': arrOfObj[j].FinalAttachment2PathKey })
            }
          }
        }
    }
    this.dataSource = finalArrOfObjes;
    // this.dataSource['RoundId'] = this.data?.RoundId;
    // this.dataSource['cid'] = this.data?.cid;
    debugger
  }

  //download salary document
  downloadDocument(data) {
    debugger
    let fileName = this._GlobCommon.removeLastExtension(data?.fileName);
    this.http.get(`${environment.apiMainUrlNet}Interview/downloadInterviewDocument?cid=${this.data?.cid}&roundid=${this.data?.RoundId}&docType=${data?.Path}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, fileName);
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }


  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }



}

