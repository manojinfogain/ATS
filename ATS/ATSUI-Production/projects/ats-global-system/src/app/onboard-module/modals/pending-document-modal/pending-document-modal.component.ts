
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OnboardService } from '../../onboard.service';
import { OfferService } from '../../../offer-module/offer.service';
import { OnbVerificationModalComponent } from '../onb-verification-modal/onb-verification-modal.component';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { HttpClient } from '@angular/common/http';
import { CommonPdfViewerInternalComponent } from '../../../common-sharing/modals/common-pdf-viewer-internal/common-pdf-viewer-internal.component';
import { CommonImagePreviewModalComponent } from '../../../common-sharing/modals/common-image-preview-modal/common-image-preview-modal.component';
import { AtsOfferCommonMethodService } from '../../../core/common/ats-offer-common-method.service';
import { GlobalMethod } from '../../../core/common/global-method';
import { OnboardCommonMethod } from '../../../core/common/onboard-common-method';

@Component({
  selector: 'app-pending-document-modal',
  templateUrl: './pending-document-modal.component.html',
  styleUrls: ['./pending-document-modal.component.scss']
})
export class PendingDocumentModalComponent implements OnInit {
  public selectedList: any = [];
  public onbFormsList: any = [];

  displayedColumns: string[] = ['SNum', 'docName', 'orgName', 'submissionDate', 'status', 'action'];
  dataSource = [];
  constructor(
    public dialogRef: MatDialogRef<PendingDocumentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _globalApiServe: GlobalApisService,
    private _onboardServ: OnboardService,
    private _share: ShareService,
    private _offerService: OfferService,
    private _GlobCommon: GlobalCommonMethodService,
    private _Gl: AtsOfferCommonMethodService,
    private _http: HttpClient,
    private _onboard: OnboardService

  ) { }

  public candidateCallsDetailsList: any = [];
  public offerDetails: any = {};
  ngOnInit(): void {
    this.getPendingDocList();
  this.apiCallLeaderNormal();
   
  }
/**just to get details for candidate - leadership and normal regular */
  apiCallLeaderNormal(){
    if(this.data?.candicandidateTypeLead =='LS'){
      this._onboard.getCandidatePersonalDetails(this.data.candidateId).subscribe(
        res => {
          this.offerDetails = res['data'][0]; 
        }
      )
    }else{
      this._offerService.getCandidateOfferAprDetails(this.data.cid).subscribe(
        res => {
          this.offerDetails = res['data'][0]; 
        }
      )
    }
   
  }
  public pendingDocList: any = [];
  getPendingDocList() {
    this._onboardServ.getOnboardingFormDetails(this.data?.candidateId, 1).subscribe(
      res => {
        this.pendingDocList = res['pendingdocs'];
      }
    )

  }


  downloadFile(data: any) {
    
    this._GlobCommon.downloadFileCommon(data?.filePath, data?.filename)
  }


  //download  bgv 
  // viewAndDwnloadFile(data) {
  //   
  //   let elm = {};
  //   elm['documentName'] = data.DocumentName;
  //   elm['filePath'] = data.filePath;
  //   elm['fileName'] = data.filename;
  //  // this._Gl.downloadPrevDocuments(elm);
  //   OnboardCommonMethod.downloadPrevDocuments(elm,this._http,this.dialog,this._share);

  // }

  viewAndDwnloadFile(data) {
    let elm = {};
    elm['documentName'] = data.DocumentName;
    elm['filePath'] = data.filePath;
    elm['fileName'] = data.filename;
    elm['type'] = 'path';
    elm['cid'] = data.cid;
    elm['id'] = data.id;
    elm['docID'] = data.DocId;
    // this._Gl.downloadPrevDocuments(elm);
    OnboardCommonMethod.downloadPrevDocuments(elm, this._http, this.dialog, this._share);

  }

  /*** 
   * verficstion modal
   */

  openVerificationModal(element: any) {
    // element['cid'] = this.data.cid;
    element['Candidateid'] = this.data.candidateId;
    element['srcType'] = 'PEN';
    debugger
    element['title'] = "Pending document Verification";
    const dialogRef = this.dialog.open(OnbVerificationModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'onb-verification-modal', 'ats-header-text-cap',],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      get => {
        if (get) {
          this.getPendingDocList();
        }
      }
    )
  }






  closeModal(): void {
    this.dialogRef.close();
  }

}
