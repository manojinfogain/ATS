import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { saveAs } from "file-saver";
import { HttpClient } from '@angular/common/http';
import  { environment } from 'projects/ats-global-system/src/environments/environment';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TransferCandidateFormComponent } from '../transfer-candidates/modal/transfer-candidate-form/transfer-candidate-form.component';
import { RequestTransferCandidateComponent } from '../transfer-candidates/modal/request-transfer-candidate/request-transfer-candidate.component';
import { ApproveTransferedCandidateComponent } from '../transfer-candidates/modal/approve-transfered-candidate/approve-transfered-candidate.component';
import { FeedbackRoundDetailsComponent } from '../interview-feedback/modals/feedback-round-details/feedback-round-details.component';


@Component({
  selector: 'app-transfer-candidates-new2',
  templateUrl: './transfer-candidates-new2.component.html',
  styleUrls: ['./transfer-candidates-new2.component.scss']
})
export class TransferCandidatesNew2Component implements OnInit {
  displayedColumns = ['talentId','CandidateName','primarySkill', 'EmailID', 'PhoneNo','intDate','recruiter','primaryInterviewer','additionalInterviewers', 'InterviewType', 'CandidateStatus', 'UpdateCurrentStatus', 'transfer'];
  private thId: string;
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public jumpFirstPage: boolean = false;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch:boolean = false;
  public isResetFilter:boolean = false;
  constructor(
    private _interviewStatus: InterviewStatusService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private http:HttpClient,
    private _share:ShareService,
    private _fb:UntypedFormBuilder
  ) {
  }

  ngOnInit() {
    /**remove transfer option */
    this.displayedColumns.pop();
    this.userData = this._storage.getSetUserData();
    if (this.userData) {
      if (this.userData.RoleId === 4) {
      //  this.displayedColumns.pop();
      }
    }
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null,null);
    this.filterFormInit();
  }

 /**
  * reset filter and search
  */
   resetSortFilter(){
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = '';
   }
  /**
* get filter value
* @param data
*/
getSortData(data: string) {
  this.isResetSearch = true;
  this.isResetFilter = false;
  this.searchInput = '';
  this.sortParam = data;
  this.jumpFirstPage = false;
  this.jumpFirstPage = true;
  this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput,data);
}

  /***
 * filter form Init
 */
filterFormInit() {
  this.sortFormFilter = this._fb.group({
    statusId: ['all'],
    InterviewTypeId: ['all'],
    primarySkill: ['all'],
    dateFrom: [null],
    dateTo: [{value:null,disabled:true}]
  })
}

  /**
   * get selected talent Id
   * @param data 
   */
  getDataTalent(data) {
    this.resetSortFilter();
    this.thId = data.TH_ID;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null,null)
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getCandidateListByTalentId(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null,this.sortParam);
  }

  /***
   * search
   */
  getSearchValueKey(e: any) {
    this.isResetFilter = true;
    this.isResetSearch = false;
    this.sortParam = '';
     this.searchInput = e;
     this.jumpFirstPage = false;
     this.jumpFirstPage = true;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE,e,this.sortParam);
  }
/**
 * get candidate list
 * @param page 
 * @param pageSize 
 * @param search 
 */
  getCandidateListByTalentId(page: number, pageSize: number, search: any,sortParam: any) {
    let queryString = `page=${page}&pageSize=${pageSize}&search=${search ? search.trim():''}${sortParam?sortParam:''}`;
    let q = 'page=1&pageSize=10&search=%20&startDate=2021-10-26'
    this._interviewStatus.transferCandidateList(this.thId, queryString).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }

  /**
   * transfer talent Id Method
   * @param element 
   */

  transferCandidateToTalent(element: any) {
    this.jumpFirstPage = false;
    element['title'] = "Transfer to Talent ID";
    const dialogRef = this.dialog.open(TransferCandidateFormComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback',  'talent-transfers','talent-transfers-mod'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput,this.sortParam);
      }
    });
  }

  //request to transfer candidate
  requestTransferCandidate(element: any) {
    this.jumpFirstPage = false;
    element['title'] = "Request for Transfer Candidate";
    const dialogRef = this.dialog.open(RequestTransferCandidateComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput,this.sortParam);
      }
    });
  }

    //request to transfer candidate
    approveTransferedCandidate(element: any) {
      this.jumpFirstPage = false;
      element['title'] = "Approve Transfered Candidate";
      const dialogRef = this.dialog.open(ApproveTransferedCandidateComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
        data: element,
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.jumpFirstPage = true;
          this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput,this.sortParam);
        }
      });
    }
  


  downloadPDF(elm:any){
    let today = new Date();
    let todayDate = GlobalMethod.formatDate(today);
    this.http.get(`${environment.apiMainUrlNet}Interview/InterviewFeedbackpdf?cid=${elm.cid}`,{responseType: 'blob'}).subscribe(
      res=>{
       saveAs(res, 'interview feedback ('+elm?.Name+') '+elm?.talent_id+'.pdf'); 
       this._share.showAlertSuccessMessage.next('Interview Feedback downloaded successfully.') 
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

}
