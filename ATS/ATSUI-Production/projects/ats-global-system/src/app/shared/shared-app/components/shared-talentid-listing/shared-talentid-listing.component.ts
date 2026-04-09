import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { DashboardService } from 'projects/ats-global-system/src/app/dashboard-module/dashboard.service';
import { JobDetailsPopupComponent } from 'projects/ats-global-system/src/app/dashboard-module/modal/job-details-popup/job-details-popup.component';
import { UpdateTalentidStatusComponent } from 'projects/ats-global-system/src/app/dashboard-module/modal/update-talentid-status/update-talentid-status.component';
import { ViewInfoTalentidComponent } from 'projects/ats-global-system/src/app/dashboard-module/modal/view-info-talentid/view-info-talentid.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { ViewAllProfilesModalComponent } from 'projects/ats-global-system/src/app/dashboard-module/modal/view-all-profiles-modal/view-all-profiles-modal.component';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-shared-talentid-listing',
  templateUrl: './shared-talentid-listing.component.html',
  styleUrls: ['./shared-talentid-listing.component.scss'],
  providers: [DatePipe],
})
export class SharedTalentidListingComponent implements OnInit,OnDestroy {
  talentIdListData: any = [];
  talentIdAllListData: any = [];
  public paginationData: any;
  @Input() public offshore: boolean = true;
  @Input() public totalPosition: boolean = false;
  @Input() public assignedTalent: boolean = false;
  @Input() public filter: boolean = false;
  public searchInput: string = '';
  public selectedItem: string = 'a';
  public datepipe: DatePipe;
  @ViewChild('scrollMe', { static: true })
  private myScrollContainer: ElementRef;
  public pazeOption: any = [12, 25, 50, 100];
  public pazeSize: any = 12;
  public jumpFirstPage: boolean = false;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: any = '';
    private refreshSubscription: Subscription;
  constructor(
    public dialog: MatDialog,
    private _share: ShareService,
    private _dashServe: DashboardService,
    private _fb: UntypedFormBuilder,
    private _storage: GetSetStorageService,
    private _excelService: ExcelService,
    private http: HttpClient,
     private getLocInfo:GetLocationInfo
  ) {}
  public isUsLocation: boolean = false;
  public isIndiaLocation: boolean = false;
  ngOnInit(): void {
    this.locationInfo();
     this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
          get => {
            this.locationInfo();
          }
        )
     
    /***
     * init Call  API
     */
    if (this.assignedTalent === true) {
      this.getTalentIdList(this.offshore, 1, this.pazeSize, null, 'load', null);
    } else {
      this.getAllTalentIdList(
        this.offshore,
        1,
        this.pazeSize,
        null,
        'load',
        this.selectedItem,
        null
      );
    }

    this.filterFormInit();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  locationInfo() {
    if (this.getLocInfo.isLocationIndia()) {
       this.isIndiaLocation = true;
        this.isUsLocation = false;
     }
      else {
        this.isUsLocation = true;
        this.isIndiaLocation = false;
      }
  }

  /**
   *
   * @param data action right
   * @returns
   */
  RequisionActionRight(data: any) {
    let userData = this._storage.getSetUserData();
    if (
      data?.recruiter1EmpId == userData?.EmpNewId ||
      data?.recruiter2EmpId == userData?.EmpNewId ||
      userData?.RoleId == 6 ||
      userData?.RoleId == 5
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * reset filter and search
   */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = '';
  }
  /**
   * get filter value
   * @param data
   */
  getSortData(data: any) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    if (!this.totalPosition) {
      this.getTalentIdList(
        this.offshore,
        1,
        this.pazeSize,
        this.searchInput,
        'load',
        data
      );
    }
  }

  getSortDataBody(data: any) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    if (this.totalPosition) {
      this.getAllTalentIdList(
        this.offshore,
        1,
        this.pazeSize,
        this.searchInput,
        'load',
        this.selectedItem,
        data
      );
    }
  }

  public HMList: boolean = false;
  public recruiterCtrl: boolean = false;
  public isMultiple: boolean = false;
  public accountHead: boolean = false;
  public companyLocation: boolean = false;
  public designation: boolean = false;
  public recMulti: boolean = false;
  public requisitionFilter: boolean = false;
  public requsiMulti: boolean = false;
  /***
   * filter form Init
   */
  filterFormInit() {
    if (this.totalPosition) {
      this.HMList = true;
      this.recruiterCtrl = true;
      this.isMultiple = true;
      this.accountHead = true;
      this.companyLocation = true;
      this.designation = true;
      this.recMulti = true;
      this.requsiMulti = true;
      this.requisitionFilter = true;
      this.sortFormFilter = this._fb.group({
        accountType: [[]],
        primarySkill: [[]],
        HMId: [[]],
        recruiterId: [[]],
        accountHeadId: ['all'],
        location: ['all'],
        designationId: ['all'],
        requisitionType: [[]],
      });
    } else {
      this.sortFormFilter = this._fb.group({
        accountType: ['all'],
        primarySkill: ['all'],
      });
    }
  }
  /**
   * radio button get val
   * @param e
   */
  getFilterVal(e) {
    let val = e.value;
    this.isResetFilter = true;
    this.sortParam = '';
    this.resetSortFilter();
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    if (this.assignedTalent === true) {
      // this.getTalentIdList(this.offshore,1,15,e,'load');
    } else {
      this.getAllTalentIdList(
        this.offshore,
        1,
        15,
        this.searchInput,
        'load',
        val,
        this.sortParam
      );
    }
    this.myScrollContainer.nativeElement.scrollTop = 0;
  }

  /**
   * get assigned talent id lists
   * @param offShore
   * @param page
   * @param pageSize
   */
  getTalentIdList(offShore, page, pageSize, search, type, sortParam: any) {
    let queryString = `&offShore=${offShore}&page=${page}&pageSize=${pageSize}${
      search ? '&search=' + search : ''
    }${sortParam ? sortParam : ''}`;

    this._dashServe.getAssignedTalentIdList(queryString).subscribe((res) => {
      this.paginationData = res['pagination'][0];
      if (type === 'load') {
        this.talentIdAllListData = res['data'];
        this.talentIdListData = this.mapDataByCategory(res['data']);
        console.log('load' + this.talentIdAllListData.length);
      } else {
        // this.talentIdAllListData =  this.talentIdAllListData.concat(res['data']);
        // this.talentIdListData = this.mapDataByCategory(this.talentIdAllListData);
        this.talentIdListData = this.mapDataByCategory(res['data']);
      }
    });
  }

  public bodyParam: any = {};
  /**
   * get all talent id lists
   * @param offShore
   * @param page
   * @param pageSize
   */
  getAllTalentIdList(
    offShore,
    page,
    pageSize,
    search,
    type,
    filterBy,
    sortParam: any
  ) {
    let Body = {
      page: page,
      pageSize: pageSize,
      Filter: filterBy,
      Offshore: offShore,
    };
    if (search) {
      Body['search'] = search;
    }
    if (sortParam) {
      if (sortParam.recruiterId && sortParam.recruiterId.length !== 0) {
        let recIds = sortParam.recruiterId.filter((n) => n);
        Body['recruiterId'] = recIds.toString();
      }
      if (sortParam.accountType && sortParam.accountType.length !== 0) {
        let accountTypeIds = sortParam.accountType.filter((n) => n);
        Body['accountId'] = accountTypeIds.toString();
      }
      if (sortParam.primarySkill && sortParam.primarySkill.length !== 0) {
        let primarySkill = sortParam.primarySkill.filter((n) => n);
        Body['skillId'] = primarySkill.toString();
      }
      if (sortParam.HMId && sortParam.HMId.length !== 0) {
        let HMIds = sortParam.HMId.filter((n) => n);
        Body['HMId'] = HMIds.toString();
      }
      if (sortParam.accountHeadId != 'all') {
        Body['accountHeadId'] = sortParam.accountHeadId;
      }
      if (sortParam.location != 'all') {
        Body['location'] = sortParam.location;
      }
      if (sortParam.designationId != 'all') {
        Body['designationId'] = sortParam.designationId;
      }
      // if (sortParam.requisitionType  != 'all') {
      //   Body['requisitionType'] = sortParam.requisitionType;
      // }

      if (sortParam.requisitionType && sortParam.requisitionType.length !== 0) {
        let reqisitionIds = sortParam.requisitionType.filter((n) => n);
        Body['requisitionType'] = reqisitionIds.toString();
      }
    }

    this.bodyParam = Body;

    this._dashServe.getAllTalentIdList(Body).subscribe((res) => {
      this.paginationData = res['pagination'][0];

      if (type === 'load') {
        // this.talentIdAllListData = res['data'];
        // this.talentIdListData =  res['data'];
        this.talentIdListData = this.mapDataByCategory(res['data']);
      } else {
        // this.talentIdAllListData =  this.talentIdAllListData.concat(res['data']);
        // this.talentIdListData = this.talentIdListData.concat(res['data']);
        //   this.myScrollContainer.nativeElement.scrollTop = 0;
        this.talentIdListData = this.mapDataByCategory(res['data']);
      }
    });
  }

  trackByFn(index: number, movie: any): number {
    return movie;
  }
  /**
   * map data by category
   * @param listData
   */
  mapDataByCategory(listData) {
    let dateNotAvailable = listData.filter(
      (data) => data.initial_fullfilment_date === null
    );
    console.log('NA-' + dateNotAvailable.length);
    let reqTypeNaNew = dateNotAvailable.filter(
      (data) => data.REQUIREMENT_TYPE_ID === 2
    );
    let reqTypeNaRep = dateNotAvailable.filter(
      (data) => data.REQUIREMENT_TYPE_ID === 3
    );
    let reqTypeNaPip = dateNotAvailable.filter(
      (data) => data.REQUIREMENT_TYPE_ID === 1
    );
    let reqTypeNaApprove = dateNotAvailable.filter(
      (data) => data.REQUIREMENT_TYPE_ID === 4
    );
    let reqTypeNaPro = dateNotAvailable.filter(
      (data) => data.REQUIREMENT_TYPE_ID === 5
    );
    let reqTypeC2HConversion = dateNotAvailable.filter(
      (data) => data.REQUIREMENT_TYPE_ID === 6
    );
    let reqTypeNot = dateNotAvailable.filter(
      (data) => data.REQUIREMENT_TYPE_ID === null
    );

    let totalDateNa = [
      ...reqTypeNaNew,
      ...reqTypeNaRep,
      ...reqTypeNaPip,
      ...reqTypeNaApprove,
      ...reqTypeNaPro,
      ...reqTypeC2HConversion,
      ...reqTypeNot,
    ];
    let dateAvailable = listData.filter(
      (data) => data.initial_fullfilment_date !== null
    );
    console.log('AV-' + dateAvailable.length);
    let reqTypeAvNew = dateAvailable.filter(
      (data) => data.REQUIREMENT_TYPE_ID === 2
    );
    let reqTypeAvRep = dateAvailable.filter(
      (data) => data.REQUIREMENT_TYPE_ID === 3
    );
    let reqTypeAvPip = dateAvailable.filter(
      (data) => data.REQUIREMENT_TYPE_ID === 1
    );
    let reqTypeAvApprove = dateAvailable.filter(
      (data) => data.REQUIREMENT_TYPE_ID === 4
    );
    let reqTypeAvPro = dateAvailable.filter(
      (data) => data.REQUIREMENT_TYPE_ID === 5
    );
    let reqTypeC2HConversionF = dateAvailable.filter(
      (data) => data.REQUIREMENT_TYPE_ID === 6
    );
    let reqTypeAvNull = dateAvailable.filter(
      (data) => data.REQUIREMENT_TYPE_ID === null
    );

    let totalDateAv = [
      ...reqTypeAvNew,
      ...reqTypeAvRep,
      ...reqTypeAvPip,
      ...reqTypeAvApprove,
      ...reqTypeAvPro,
      ...reqTypeC2HConversionF,
      ...reqTypeAvNull,
    ];
    let talentIdListData = [...totalDateNa, ...totalDateAv];
    return talentIdListData;
  }

  /**
   * pagination method
   * @param pageEvent
   */
  getPagingData(pageEvent: any) {
    console.log(pageEvent);
    //this.getProfileCandList(pageEvent.pageIndex+1,pageEvent.pageSize,this.searchInput?this.searchInput:null);
    if (this.assignedTalent === true) {
      this.getTalentIdList(
        this.offshore,
        pageEvent.pageIndex + 1,
        pageEvent.pageSize,
        this.searchInput ? this.searchInput : null,
        'paging',
        this.sortParam
      );
    } else {
      this.getAllTalentIdList(
        this.offshore,
        pageEvent.pageIndex + 1,
        pageEvent.pageSize,
        this.searchInput ? this.searchInput : null,
        'paging',
        this.selectedItem,
        this.sortParam
      );
    }
  }

  /**
   * on scroll  pagination / load more data
   */
  onScroll() {
    if (this.talentIdListData.length < this.paginationData.Total) {
      if (this.assignedTalent === true) {
        // this.getTalentIdList(this.offshore,this.paginationData.Page+1,this.paginationData.PageSize,this.searchInput?this.searchInput:null,'paging');
      } else {
        // this.getAllTalentIdList(this.offshore,this.paginationData.Page+1,this.paginationData.PageSize,this.searchInput?this.searchInput:null,'paging',this.selectedItem)
      }
    }
  }

  /***
   * search
   */
  getSearchValueKey(e: any) {
    this.searchInput = e;
    this.sortParam = '';
    this.isResetFilter = true;
    this.isResetSearch = false;
    //  this.getTalentIdList(true,1,15,e,'load');
    if (this.assignedTalent === true) {
      this.getTalentIdList(this.offshore, 1, this.pazeSize, e, 'load', null);
    } else {
      this.getAllTalentIdList(
        this.offshore,
        1,
        this.pazeSize,
        e,
        'load',
        this.selectedItem,
        null
      );
    }
  }

  /***
   * open popup for job details
   */
  ViewJobDetails(telentId): void {
    this._dashServe.getFulfillmentDateBasedOnTalentID(telentId).subscribe(
      (res) => {
        if (res.length != 0) {
          this.openModalJobDetails(res[0]);
        } else {
          this._share.showAlertErrorMessage.next('No record Found');
        }
      },
      (error) => {
        console.warn(error.error.message);
      }
    );
  }
  /***
   * open modal method for job
   */

  openModalJobDetails(data: any) {
    data['assign'] = this.assignedTalent;
    const dialogRef = this.dialog.open(JobDetailsPopupComponent, {
      //   width: '500px',
      //panelClass: 'ats-model-wrap',
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: data,
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
    });
  }

  openModalAllProfileDetails(data: any) {
    debugger
    data['assign'] = this.assignedTalent;
    data['title'] = 'Total Profiles - '+data?.talent_id;
    const dialogRef = this.dialog.open(ViewAllProfilesModalComponent, {
      // width: '650px',
      panelClass: [
        'ats-model-wrap',
        'ats-model-full-screen',
        'view-profile-all-modal',
      ],
      data: data,
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
    });
  }

  /***
   * view Talend ID Details
   */

  viewTalentIdDetails(data) {
    const dialogRef = this.dialog.open(ViewInfoTalentidComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-talent'],
      data: data,
      disableClose: true,
    });
  }

  /* update Talend ID Details  df*/

  updateTalentIdDetails(data: any) {
    data['title'] = 'Update Talent Id Details';
    const dialogRef = this.dialog.open(UpdateTalentidStatusComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-talent-update'],
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (this.assignedTalent === true) {
          this.getTalentIdList(
            this.offshore,
            1,
            this.pazeSize,
            this.searchInput ? this.searchInput : null,
            'paging',
            this.sortParam
          );
        } else {
          this.getAllTalentIdList(
            this.offshore,
            1,
            this.pazeSize,
            this.searchInput ? this.searchInput : null,
            'paging',
            this.selectedItem,
            this.sortParam
          );
        }
      }
    });
  }

  //common method for export excel
  getDataForExport(candidateList) {
    let filterDataExcel = [];
    for (var key in candidateList) {
      let selectedData = {
        'Talent Id': candidateList[key].talent_id,
        'Initial Fullfilment Date': candidateList[key].initial_fullfilment_date
          ? new Date(candidateList[key].initial_fullfilment_date)
          : 'NA',
        'A/C': candidateList[key].account_name
          ? candidateList[key].account_name
          : 'NA',
        'Requirement Type': candidateList[key].REQUIREMENT_TYPE
          ? candidateList[key].REQUIREMENT_TYPE
          : 'NA',
        Skill: candidateList[key].primarySkillName,
        'Billing Loss Days': candidateList[key].BillingLossDays
          ? candidateList[key].BillingLossDays
          : '0',
        'CSkill Profile not used': candidateList[key].CountCskill,
        'Employee Referrals Profile not used': candidateList[key].CountEmpRef,
      };
      filterDataExcel.push(selectedData);
    }
    this._excelService.exportAsExcelFile(
      filterDataExcel,
      'Talent Ids Assign To Me Report'
    );
  }

  //download export excel method
  exportAsXLSX(): void {
    let queryString = `&Offshore=${this.offshore}&page=1&pageSize=${this.paginationData?.Total}`;
    this._dashServe.getAssignedTalentIdList(queryString).subscribe((res) => {
      this.getDataForExport(res['data']);
    });
  }

  exportAsXLSXTotal(): void {
    (this.bodyParam['page'] = 1),
      (this.bodyParam['pageSize'] = this.paginationData?.Total);
    // this._dashServe.getAllTalentIdList(this.bodyParam).subscribe(
    //   res => {
    //     this.getDataForExportTotal(res['data']);

    //   }
    // )
    this.http
      .post(
        `${environment.apiMainUrlNet}Dashboard/getExportToExcelForAllOpenRequisitionDetails`,
        this.bodyParam,
        { responseType: 'blob' }
      )
      .subscribe(
        (res) => {
          saveAs(res, 'Total-Open-Position-Report.xls');
        },
        (error) => {
          this._share.showAlertErrorMessage.next('Something went wrong');
        }
      );
  }

  getDataForExportTotal(candidateList) {
    let filterDataExcel = [];
    for (var key in candidateList) {
      let selectedData = {
        'Talent Id': candidateList[key].talent_id,
        'Initial Fullfilment Date': candidateList[key].initial_fullfilment_date
          ? new Date(candidateList[key].initial_fullfilment_date)
          : 'NA',
        'A/C': candidateList[key].account_name
          ? candidateList[key].account_name
          : 'NA',
        'Requirement Type': candidateList[key].REQUIREMENT_TYPE
          ? candidateList[key].REQUIREMENT_TYPE
          : 'NA',
        Skill: candidateList[key].primarySkillName,
        'Billing Loss Days': candidateList[key].BillingLossDays
          ? candidateList[key].BillingLossDays
          : '0',
        'CSkill Profile not used': candidateList[key].CountCskill,
        'Employee Referrals Profile not used': candidateList[key].CountEmpRef,
        'Created On': candidateList[key].createdOn
          ? new Date(candidateList[key].createdOn)
          : 'NA',
      };
      filterDataExcel.push(selectedData);
    }

    this._excelService.exportAsExcelFile(
      filterDataExcel,
      'total-open-position-report-dashboard'
    );
  }
}
