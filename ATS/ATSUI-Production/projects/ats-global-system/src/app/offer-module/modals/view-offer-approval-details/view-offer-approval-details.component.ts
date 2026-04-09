import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { forkJoin } from 'rxjs';
import { OfferService } from '../../offer.service';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { HttpClient } from '@angular/common/http';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { RecruiApprovDocumentsModalComponent } from '../recrui-approv-documents-modal/recrui-approv-documents-modal.component';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';
import { TalentService } from '../../../talent-module/talent.service';
@Component({
  selector: 'app-view-offer-approval-details',
  templateUrl: './view-offer-approval-details.component.html',
  styleUrls: ['./view-offer-approval-details.component.scss']
})
export class ViewOfferApprovalDetailsComponent implements OnInit {
  public bgvData: any = [];
  public candData: any = [];
  public allRoundList: any = [];
  public selectedList: any = [];
  public gradeList: any = [];
  public offerAprDt: any = [];
  public approvalData: any = [];
  public hrApprovalActivity:any = [];
  public hideforall: boolean = false;
  displayedColumns = ['approverType', 'approverName', 'ActionTaken', 'ActionTakenOn', 'ActionTakenBy', 'justification', 'remarks',];
  displayedColumns1 = ['status', 'updatedBy', 'updatedOn', 'declineCatg', 'remarks'];
  displayedColumnsBgv = ['fileName', 'action'];
  displayedColumnsHr = ['approverName', 'ActionTaken', 'ActionTakenOn', 'ActionTakenBy', 'remarks'];
  public wefNewApprovMatrxDt = new Date('2023-04-22');
  public isVisibleForUs: boolean = false;
  public isVisibleForIndia: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ViewOfferApprovalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _offerService: OfferService,
    public dialog: MatDialog,
    private http: HttpClient,
    private _share: ShareService,
    private getLocInfo: GetLocationInfo,
    private _talentServ: TalentService
  ) { }

  ngOnInit(): void {
    this.getCandidateDetails();
    this.showHideLocationWise();
  }

  /**show/hide for usa and india */
  showHideLocationWise() {
    if (this.getLocInfo.isLocationUS()) {
      this.isVisibleForUs = true;
      this.isVisibleForIndia = false;

    } else {
      /**showing docs for india */
      this.displayedColumns.splice(7, 0, 'documents')
      this.isVisibleForIndia = true;
      this.isVisibleForUs = false;
    }
  }

  public candStatusHistory: any = [];
  public talentDetails: any = {};
  getCandidateDetails() {
    forkJoin([
      this._interviewStatus.getCandidateDetails(this.data.cid),
      this._offerService.getSelectedCandidateDetails(this.data.cid),
      this._offerService.getCandidateOfferAprDetails(this.data.cid),
      this._offerService.getCandidateApprovalDetails(this.data.cid),
      this._offerService.getCandidateStatusHistory(this.data.cid),
      this._offerService.getCandidateHRApprovalDetails(this.data.cid),
      this._talentServ.GetTHIDDetailsByTHID(this.data?.th_id)
    ]).subscribe(
      res => {
        this.allRoundList = res[0];
        this.candData = res[1]['data'][0];
        this.offerAprDt = res[2]['data'][0];
        this.bgvData = res[2]['BGVAtt'];
        this.approvalData = res[3]['data'];
        this.candStatusHistory = res[4]['data'];
        this.hrApprovalActivity = res[5]['data'];
        this.talentDetails = res[6]['data'][0];
        this.selectedList = this.allRoundList.roundList.filter(d => d?.interviewType?.Id === 4 && d?.InterViewStatus?.Id === 4);
      }
    )
  }


  /**
    * show interview round details
    * @param data 
    */
  openfeedbackInfoModal(data: any) {
    const dialogRef = this.dialog.open(FeedbackRoundDetailsComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  /***
  * open documents popup
  */
  documentsDownload(data: any) {
    data['final'] = true;
    data['param'] = `cid=${this.data.cid}&ActionTakenBy=${data?.ApproverType == 0 ? 'R' : 'A'}&ActionId=${data.id}`;
    const dialogRef = this.dialog.open(RecruiApprovDocumentsModalComponent, {
      panelClass: ['ats-model-wrap', 'bgv-modal'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  //to identify approval based on old/ new matrix w.e.f 22-04-2023. 
  getDiff(e: any) {
    let addDt = new Date(e?.AddedOn);
    if (addDt.getTime() < this.wefNewApprovMatrxDt.getTime()) {
      return true;
    } else {
      return false;
    }

  }

  closeModal(): void {
    this.dialogRef.close();
  }


}
