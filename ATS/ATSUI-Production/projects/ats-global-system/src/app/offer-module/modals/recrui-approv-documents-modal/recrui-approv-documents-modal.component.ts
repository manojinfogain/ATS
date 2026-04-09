import { Component, Inject, OnInit } from '@angular/core';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { OfferService } from '../../offer.service';
import { HttpClient } from '@angular/common/http';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
@Component({
  selector: 'app-recrui-approv-documents-modal',
  templateUrl: './recrui-approv-documents-modal.component.html',
  styleUrls: ['./recrui-approv-documents-modal.component.scss']
})
export class RecruiApprovDocumentsModalComponent implements OnInit {

  bgvDataColum = ['fileName', 'action'];

  public bgvData: any = [];
  constructor(
    public dialogRef: MatDialogRef<RecruiApprovDocumentsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _offerService: OfferService,
    private http: HttpClient,
    private _share: ShareService,
    private _GlobCommon:GlobalCommonMethodService
  ) { }

  ngOnInit() {
    console.log("check", this.data)
    this.getDetails();
  }

  //getting details
  getDetails() {
    this._offerService.getOfferApprovalAttachaments(this.data.param).subscribe(
      res => {
        this.bgvData = res['data'];
      }
    )
    // forkJoin([
    //   this._offerService.GetOfferApprovalAttachaments(1),
    // ]).subscribe(
    //   res => {
    //     this.bgvData = res[0]['BGVAtt'];
    //   }
    // )
  }

  removeAdditionalExtension(fileName: string) {
    return this._GlobCommon.removeLastExtension(fileName);
  }

  //download 
  dwnloadBgv(data:any) {
    let resumeName = this._GlobCommon.removeLastExtension(data?.FileName);
    this.http.get(`${environment.apiMainUrlNet}Offer/DownloadApprovalDocumet?Id=${data.AttachamentId}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, resumeName);
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
