import { Component, OnInit,ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { OnboardService } from '../../onboard.service';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import { ShareService } from '../../../core/services/share.service';
import { GlobalMethod } from '../../../core/common/global-method';
import { ViewAllCandidateDetailsOnboardComponent } from '../../modals/view-all-candidate-details-onboard/view-all-candidate-details-onboard.component';
import { CONSTANTS } from '../../../core/constant/constants';
import { AddEmpEmailDomainComponent } from '../../modals/add-emp-email-domain/add-emp-email-domain.component';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { UpdateLeadershipStatusModalComponent } from '../modals/update-leadership-status-modal/update-leadership-status-modal.component';
import { AssignIssDelegatorModalComponent } from '../modals/assign-iss-delegator-modal/assign-iss-delegator-modal.component';
import { UpdateLeadershipDay1StatusComponent } from '../modals/update-leadership-day1-status/update-leadership-day1-status.component';



@Component({
  selector: 'app-pipeline-leadership-joinee',
  templateUrl: './pipeline-leadership-joinee.component.html',
  styleUrls: ['./pipeline-leadership-joinee.component.scss']
})
export class PipelineLeadershipJoineeComponent implements OnInit {

  
  displayedColumns = [];
  public thId: string;
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: any = '';
  public paginationData: any;
 // public candidateList: any = new MatTableDataSource<any>();
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public searhByTitle: string = 'Search By Name/ Email';

  candidateList = [
  ];
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _onboardserve: OnboardService,
    private _storage: GetSetStorageService,
    public _share: ShareService
  ) {
  }
  public specialLogin: boolean = false;
  public topFirstDateStart: string;
  public topFirstDateEnd: string;
  
  ngOnInit() {
    this.userData = this._storage.getSetUserData();
    if(this.userData){
      if(this.userData.RoleId === 7){
        this.displayedColumns = ['CandidateName', 'EmailID','joiningLoc', 'doj','cDoj','isEmpCreated', 'emailIdOrg','domainId', 'assignedIssDelegatorName','offerStatus', 'action'];
      }
      else if(this.userData.RoleId === 1 || this.userData?.otherRoles?.IsHRAccess == 'Y'){
        this.displayedColumns = ['CandidateName', 'EmailID','joiningLoc', 'PhoneNo', 'doj','cDoj','isEmpCreated','emailIdOrg','domainId','assignedIssDelegatorName', 'offerStatus', 'action' ];
      }
      else{
        this.displayedColumns = ['CandidateName', 'EmailID','joiningLoc', 'PhoneNo', 'doj','cDoj','isEmpCreated','emailIdOrg','domainId', 'assignedIssDelegatorName', 'offerStatus','action'];
      }
    }
    const today = new Date()
    let tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 3);
    this.topFirstDateStart = GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(tomorrow) + ' ' + '00:00:00');
    this.topFirstDateEnd = GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(tomorrow) + ' ' + '23:59:00')
    this.filterFormInit();
    // this.viewAllDetailsOnboard(null)
  }


  // viewAllDetailsOnboard(elm: any) {

  //   const dialogRef = this.dialog.open(ViewAllCandidateDetailsOnboardComponent, {
  //     panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
  //     data: elm,
  //     maxWidth: '100vw',
  //     maxHeight: '100vh',
  //     height: '100%',
  //     width: '100%'
  //   });
  //   dialogRef.afterClosed().subscribe(
  //     res => {
  //       if (res) {
  //       }
  //     }
  //   );
  // }

  ngAfterViewInit(): void {
    this.sortParam = {}
    this.GetLeadershipPipelineJoineeCandidateListApi(1, 50, null, this.sortParam);
  }

  /**
   * reset filter and search
   */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = null;
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
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.GetLeadershipPipelineJoineeCandidateListApi(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }

  /***
 * filter form Init
 */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      offerstatus: ['all'],
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }],
      location: [[]]
    })
  }

  /**
   * get selected talent Id
   * @param data 
   */
  getDataTalent(data) {
    this.resetSortFilter();
    this.thId = data.TH_ID;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.GetLeadershipPipelineJoineeCandidateListApi(1, CONSTANTS.PAGE_SIZE, null, null)
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.GetLeadershipPipelineJoineeCandidateListApi(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
  }

  isShowIssDelegationAction(element: any): boolean {
  return this.userData?.otherRoles.IsLeadershipDelegationISS =='Y'
    && element?.offerStatus == 140
    && element?.IsEmployeeIdCreated != 1
    && element?.isConfidential == 1;
}

  /***
   * search
   */
  getSearchValueKey(e: any) {
    this.isResetFilter = true;
    this.isResetSearch = false;
    this.sortParam = '';
    this.searchInput = e;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.GetLeadershipPipelineJoineeCandidateListApi(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }
  /**
   * get candidate list
   * @param page 
   * @param pageSize 
   * @param search 
   */
  GetLeadershipPipelineJoineeCandidateListApi(page: number, pageSize: number, search: any, sortParam: any) {
    let Body = {
      PageNo: page,
      PageSize: pageSize
    }
    if (search) {
      Body['search'] = search;
    }
    if (sortParam['dateFrom'] == null) {
      Body['startDateFirstUTC'] = this.topFirstDateStart;
      Body['endDateFirstUTC'] = this.topFirstDateEnd;
    }
    if (sortParam['dateFrom']) {
     // Body['startDate'] = GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(sortParam['dateFrom']) + ' ' + '00:00:00')
     Body['startDate'] = GlobalMethod.formatDate(sortParam['dateFrom']);
    }
    if (sortParam['dateTo']) {
      // Body['endDate'] = GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(sortParam['dateTo']) + ' ' + '23:59:00')
      Body['endDate'] = GlobalMethod.formatDate(sortParam['dateTo']);
    }
    if (sortParam['offerstatus']) {
      Body['offerStatusId'] = sortParam['offerstatus'];
    }
    if (sortParam.location && sortParam.location.length !== 0) {
      let locationIds = sortParam.location.filter(n => n);
      Body['location'] = locationIds.toString();
    }

    this._onboardserve.GetLeadershipPipelineJoineeCandidateListApi(Body).subscribe(
      res => {
       this.candidateList = res['data'];
        this.paginationData = res['Paging'][0];

      }
    )

  }

  /**updating joining status  */
  updateCandidateJoinStatus(element:any, type:string):void{
    element['title'] = "Confirm Leadership Joining Status ";
    element['candidateType'] = type;
    const dialogRef = this.dialog.open(UpdateLeadershipStatusModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap','request-transfers-candidate','ats-header-text-cap',],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result=>{
        if(result){
          this.GetLeadershipPipelineJoineeCandidateListApi(1,CONSTANTS.PAGE_SIZE,null,this.sortParam);
        }
      }
    )
  }

  /**creating domain / email id */
  createEmpEmailDomain(element:any, type:string):void{
    element['title'] = "Update Candidate Email/Domain ID";
    if(element?.orgEmail){
      element['key'] = 1;
    }
    element['candidateId'] = element.candidateId;
    element['candidateType'] = type;
    const dialogRef = this.dialog.open(AddEmpEmailDomainComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap','request-transfers-candidate','ats-header-text-cap'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result=>{
        if(result){
          this.GetLeadershipPipelineJoineeCandidateListApi(1,CONSTANTS.PAGE_SIZE,null,this.sortParam);
        }
      }
    )
  }

  /**deleteing email domain id */
  deleteEmpEmailDomain(element:any):void{
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to delete <span class='u-name'>${element?.Name}</span> Email/Domain ID?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._onboardserve.deleteJoineeCandidateDetails(element.candidateId).subscribe(
          res=>{
            this._share.showAlertSuccessMessage.next(res);
            this.GetLeadershipPipelineJoineeCandidateListApi(1,CONSTANTS.PAGE_SIZE,null,this.sortParam);
          }
        )
      }
    });
  }
  /***
   * confirmation before sumbit
   */

   
  /**delegat assign modal iss */
  openDelegateToIssModal(element: any) {
    element['title'] = element?.isDelegatorIssAssigned == 'Y' ? 'Update ISS Spoc' : 'Assign ISS Spoc';
    element['isUpdate'] = element?.isDelegatorIssAssigned == 'Y' ? 'Y' : 'N';
    const dialogRef = this.dialog.open(AssignIssDelegatorModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      this.GetLeadershipPipelineJoineeCandidateListApi(1,CONSTANTS.PAGE_SIZE,null,this.sortParam);
      }
    });
  }

  /**
   * Check if Day1 update action is allowed for the user
   */
  isActionAllowed(userData: any, element: any): boolean {
    // Role 5 or 10 and pipelineStatus not 4
    if ((userData.RoleId === 10) && element?.pipelineStatus !== 4) {
      return true;
    }

    // Role 2, pipelineStatus not 4, and user is primary or secondary recruiter
    if (
      userData.RoleId === 2 &&
      element?.pipelineStatus !== 4 &&
      (element?.primaryrecruiterEmp === userData?.EmpNewId ||
       element?.secondaryrecruiterEmp === userData?.EmpNewId)
    ) {
      return true;
    }

    return false; // Otherwise, action not allowed
  }

  /**
   * Update Day1 status for leadership candidate
   */
  updateDay1CandidateJoinStatus(element: any): void {
    element['title'] = 'Update Day1 Status';
    const dialogRef = this.dialog.open(UpdateLeadershipDay1StatusComponent, {
      width: '500px',
      panelClass: [
        'ats-model-wrap',
        'request-transfers-candidate',
        'ats-header-text-cap',
      ],
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.GetLeadershipPipelineJoineeCandidateListApi(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
      }
    });
  }

}
