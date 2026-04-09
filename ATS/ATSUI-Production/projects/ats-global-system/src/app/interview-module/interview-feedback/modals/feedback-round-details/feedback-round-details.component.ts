import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { FeedbackDetailsComponent } from '../feedback-details/feedback-details.component';
import { saveAs } from "file-saver";
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { CandidateProfilePicIntComponent } from 'projects/ats-global-system/src/app/common-sharing/interview/candidate-profile-pic-int/candidate-profile-pic-int.component';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { DownloadSalaryDocumentModalComponent } from '../download-salary-document-modal/download-salary-document-modal.component';
import { AtsCommonFuncService } from 'projects/ats-global-system/src/app/core/common/ats-common-func.service';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
@Component({
  selector: 'app-feedback-round-details',
  templateUrl: './feedback-round-details.component.html',
  styleUrls: ['./feedback-round-details.component.scss']
})
export class FeedbackRoundDetailsComponent implements OnInit {
  displayedColumns = ['select', 'Round', 'talentId', 'InterviewType', 'profPic', 'Interviewdate','assDate', 'InterviewMode','InterviewBy', 'InterviewStatus', 'Panel', 'AdditionalPanel', 'recruiter', 'action'];
  public candidateData: any = [];
  public roundDataList: any = [];
  public isloader: boolean = false;
  public userData: any = {};
  public isTlView: boolean = false;
  public talentControl = new UntypedFormControl();
  selection = new SelectionModel<any>(true, []);
  public interviewByLabel:any = CONSTANTS.InterViewByKeyName;
  constructor(
    public dialogRef: MatDialogRef<FeedbackRoundDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _intCommonServe: InterviewCommonService,
    private http: HttpClient,
    private _share: ShareService,
    private getLocInfo: GetLocationInfo
  ) { }

  ngOnInit() {
    this.isloader = true;
    this.userData = this._storage.getSetUserData();
    if(this.getLocInfo.isLocationIndia(null)){
      if(this.userData?.RoleId == 5){
        this.displayedColumns = ['select', 'Round', 'talentId', 'InterviewType', 'profPic', 'Interviewdate','assDate', 'InterviewMode','InterviewLoc','InterviewAdd' , 'InterviewBy', 'InterviewStatus', 'Panel', 'AdditionalPanel', 'recruiter', 'action'];
      }else{
        this.displayedColumns = ['select', 'Round', 'talentId', 'InterviewType', 'profPic', 'Interviewdate','assDate', 'InterviewMode','InterviewLoc','InterviewAdd' , 'InterviewBy', 'InterviewStatus', 'Panel', 'AdditionalPanel', 'recruiter', 'action'];
      }
    }else{
      this.displayedColumns = ['select', 'Round', 'talentId', 'InterviewType', 'profPic', 'Interviewdate','assDate', 'InterviewMode','InterviewBy', 'InterviewStatus', 'Panel', 'recruiter', 'action'];
    }
    this.getLinkedTalentIdByCid(this.data.cid);
    // this.talentControl.setValue('all');
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRowsMinusExcluded = this.roundDataList
      .filter(row => !row.excluded)
      .length;
    return numSelected === numRowsMinusExcluded;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.roundDataList.forEach(row => {
      if (!row.excluded) {
        this.selection.select(row);
      }
    });
  }



  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'Deselect' : 'Select'} all Round`;
    }
    return `${this.selection.isSelected(row) ? 'Deselect' : 'Select'}  ${row.interviewType?.Type}`;
  }

  /***
     * download feedback
     */
  downloadPDF() {
    let selectedRound = this.selection.selected;
    if (selectedRound.length === 0) {
      this._share.showAlertErrorMessage.next('Please select atleast one round to download feedback.')
    }
    else {
      let getRoundList: any = [];
      for (let i = 0; i < selectedRound.length; i++) {
        getRoundList.push(selectedRound[i].RoundId)
      }

      let body = {
        "cid": this.candidateData.cid,
        "roundListId": getRoundList
      }

      this.http.post(`${environment.apiMainUrlNet}Interview/downloadPdfFeedBackByRoundId`, body, { responseType: 'blob' }).subscribe(
        res => {
          saveAs(res, 'interview feedback (' + this.candidateData?.Name + ') ' + this.candidateData?.THID + '.pdf');
          this._share.showAlertSuccessMessage.next('Interview Feedback downloaded successfully.')
        }
      )
    }
  }


  /***
   * interview  Round
   */
  public IsTechRoundVisible:boolean = true;
  getInterviewRound() {
    this._interviewStatus.getCandidateDetails(this.data.cid).subscribe(

      res => {
        this.selection.clear();
        this.candidateData = res;
        let crrRound = res.roundList.filter(list => list.IsCurrentRound == 'Y')[0];
        if((crrRound?.interviewer?.Id == this.userData?.EmpNewId && crrRound?.interviewType?.Id == 2) && ( crrRound?.InterViewStatus?.Id == 1 || crrRound?.InterViewStatus?.Id == 3)){
           this.IsTechRoundVisible = false;
        }
        else{
          this.IsTechRoundVisible = true;
        }
        // this.roundDataList = res.roundList.filter(list => list.thId == crrRound.thId);
        this.roundDataList = this.roundAddkeyToJson(res.roundList.filter(list => list.thId == crrRound.thId));
        this.talentControl.setValue(crrRound?.thId);

        if (this.userData?.RoleId === 4 && this.userData?.otherRoles?.IsApprover == 'N') {
          this.talentControl.disable();
        }

        this.getFilteredRoundList();
      }

    )
    
  }

  /***
   * add key
   */
  roundAddkeyToJson(data: any) {
    let roundList: any = [];
    data.forEach(elm => {
      let intStatus = elm.InterViewStatus?.Id;
      let intType = elm.interviewType?.Id;
      if (intStatus === 1 || intStatus === 2 || intStatus === 3 || intStatus === 4 || intType == 4) {
        elm['excluded'] = true;
      }
      else {
        elm['excluded'] = false;
      }

      roundList.push(elm);
    });

    return roundList;
  }


  public talentIdList = [];
  /***
    * get Int Status
    */
  getLinkedTalentIdByCid(cid: number): void {
    this._intCommonServe.getLinkedTalentIdByCid(cid).subscribe(
      res => {
        this.talentIdList = res['data'];
        if (this.talentIdList.length === 0) {
          this.isTlView = true;
        }
        else {
          this.isTlView = false;
        }
        this.getInterviewRound();
      }
    );
  }

  getFilteredRoundList() {
    if (this.data?.isPanelView) {
      this.roundDataListFinal = this.roundDataList.filter(row => row?.RoundId == this.data?.RoundId);
    }
    else{
      this.roundDataListFinal = this.roundDataList;
    }
    
  }

  /***
   * get Talent on selection
   */
  public roundDataListFinal: any = [];
  getTalentId(e) {
    let val = e.value;
    this.selection.clear();
    if (val == 'all') {
      // this.roundDataList = this.candidateData.roundList;
      this.roundDataList = this.roundAddkeyToJson(this.candidateData.roundList);
    }
    else {
      if (this.userData?.RoleId != 4) {
        //  this.roundDataList = this.candidateData.roundList.filter(list => list.thId == val);
        this.roundDataList = this.roundAddkeyToJson(this.candidateData.roundList.filter(list => list.thId == val));
      }
      else {
        this.talentControl.disable();
      }
    }

    this.getFilteredRoundList();
  }
  /***
   * open feedback details modal
   */
  penfeedbackInfoModal(data: any) {
    let body = {
      roundList: data,
      candidateData: this.candidateData,
      IsTechRoundVisible:this.IsTechRoundVisible
    }
    const dialogRef = this.dialog.open(FeedbackDetailsComponent, {
    //  width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback','ats-model-full-screen'],
      data: body,
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  /***
   * open candidate pic popup
   */
  viewCandidatePictureModal(elm: any) {
    const dialogRef = this.dialog.open(CandidateProfilePicIntComponent, {
      panelClass: ['ats-model-wrap', 'canidate-profil-picture-modal', 'canidate-profil-picture-multi'],
      data: {
        roundId: elm?.RoundId,
        name: this.candidateData?.Name,
        roundList: elm,
        cid: this.candidateData.cid,
        // isMultiProfile:false
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  /***
     * download salary doc of candidate 
     */
   downloadSalaryDocumentModal(data) {
    data['title']= 'Download Salary Supporting Documents'
    data['cid'] = this.candidateData.cid;
   const dialogRef = this.dialog.open(DownloadSalaryDocumentModalComponent, {
     panelClass: ['ats-model-wrap','bgv-modal'],
     data: data,
     disableClose: true
   });

   dialogRef.afterClosed().subscribe(result => {
     if (result) {
     }
   });
  }

  //Get interview status for if video is uploaded
  getInterviewStatus(StatusId:number,StatusName:string, IsExceptionVideo:string, fileNameVideo:string){
    return (AtsCommonFuncService.getInterviewStatus(StatusId,StatusName, IsExceptionVideo, fileNameVideo));
  }

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }


}
