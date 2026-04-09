import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { DashboardService } from '../../../dashboard-module/dashboard.service';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import { UntypedFormBuilder } from '@angular/forms';
import { InterviewCommonService } from '../../../core/services/interview-common.service';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { UpdateTalentStatusModalComponent } from '../../../talent-module/job-requisition-list/modals/update-talent-status-modal/update-talent-status-modal.component';
import { UpdateTalentIdDetailsTagModalComponent } from '../../../talent-module/job-requisition-list/modals/update-talent-id-details-tag/update-talent-id-details-tag.component';
import { UserAuthService } from '../../../core/authentication/user-auth.service';
import { Router } from '@angular/router';
import { ShareService } from '../../../core/services/share.service';
import { FullfillmentdataUpdateModalComponent } from '../../../talent-module/job-requisition-list/modals/fullfillmentdata-update-modal/fullfillmentdata-update-modal.component';
import { UpdateTalentAssigneeModalComponent } from '../../../talent-module/job-requisition-list/modals/update-talent-assignee-modal/update-talent-assignee-modal.component';

@Component({
  selector: 'app-fullfillmentdatelapse-talent-modal',
  templateUrl: './fullfillmentdatelapse-talent-modal.component.html',
  styleUrls: ['./fullfillmentdatelapse-talent-modal.component.scss']
})
export class FullfillmentdatelapseTalentModalComponent implements OnInit {
  displayedColumns = ['talentID', 'AccountName', 'JoiningLocation', 'ReqType','FullfillmentDate', 'PrimaryRecruiter', 'SecondaryRecruiter','fullfillmentAge', 'Status',  'action'];
  dataSource: MatTableDataSource<any>;
  public candidateList: any = [];
  public searchInput: string;
  //@ViewChild(MatSort) sort: MatSort;
  public paginationData: any;
  public pazeOption: any = [10, 25, 50, 100];
  public pazeSize: any = 10;
  /** Paginator Reference */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public _dashServe: DashboardService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FullfillmentdatelapseTalentModalComponent>,
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _interCommon: InterviewCommonService,
    private _userAuth:UserAuthService,
    private _share:ShareService,
    private router: Router
  ) { }
  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
  public userDetails: any = {};
  ngOnInit() {
   this.userDetails = this._storage.getSetUserData();
  }
  ngAfterViewInit() {
    /**
         * get List Profile
         */
      this.getListTalent();

  }

  public authFullFillmentDateLapse: any = {};
  getListTalent(){
    this._interCommon.getOpenRequisitionListByDateLapse().subscribe(
      res=>{
        if(res){
          this.dataSource = new MatTableDataSource(res['data']);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.authFullFillmentDateLapse = res['auth'][0];
          if(this.authFullFillmentDateLapse?.isLoginTalentDate == 'Y'){
            this.dialogRef.close();
          }
        }
      }
    )
  }
  /***
     * search
     */
  public isResetSearch: boolean = false;
  getSearchValueKey(e: any) {
    this.searchInput = e;
    this.dataSource.filter = this.searchInput.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

   /**update talent status modal  */
   updateTalentStatus(elm: any) {
    elm['title'] = 'Update Talent ID Status';
    const dialogRef = this.dialog.open(UpdateTalentStatusModalComponent, {
      //width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate'],
      data: elm,
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getListTalent();
          // this._userAuth.getUserDetails();
          // if(this.userDetails?.TalentDateLapseCount == 0){
          //   this._userAuth.redirectToPage();
          // }
        }
      }
    );
  }

   /**update details pf  talent id  modal tag  */
   updateTalentDetailsTag(elm: any) {
    elm['title'] = 'Update Details of Talent ID';
    const dialogRef = this.dialog.open(UpdateTalentIdDetailsTagModalComponent, {
      //width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate'],
      data: elm,
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          // this.paginatorCompRef.paginator.pageIndex = 0;
          this.getListTalent();
          // this._userAuth.getUserDetails();
          // if(this.userDetails?.TalentDateLapseCount == 0){
          //   this._userAuth.redirectToPage();
          // }
        }
      }
    );
  }

  updateTalentAssigneeModal(elm: any) {
    elm['title'] = 'Update Primary  And Secondary Recruiter.';
    const dialogRef = this.dialog.open(UpdateTalentAssigneeModalComponent, {
      //width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate'],
      data: elm,
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
        }
      }
    );
  }


  /**update fullfillment date modal */
  updateFullfillmentDateModal(elm: any) {
    elm['title'] = 'Update Commitment Details';
    const dialogRef = this.dialog.open(FullfillmentdataUpdateModalComponent, {
      //width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate','tc-fullfillment-modal'],
      data: elm,
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
        }
      }
    );
  }

  onNoClick() {
    this.dialogRef.close(true);
  }

  logOut() {
    this._storage.destroyAllStorage();
    this._share.sessionExp.next(false);
    this.router.navigate(['/login']);
  }

  
}


