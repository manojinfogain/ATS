import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AtsCommonPrefix } from '../../core/constant/common.const';
import { CONSTANTS } from '../../core/constant/constants';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { TalentService } from '../talent.service';
import { ShareService } from '../../core/services/share.service';
import { ViewTalentFullDetailsModalComponent } from '../job-requisition-list/modals/view-talent-full-details-modal/view-talent-full-details-modal.component';
import { ExcelService } from '../../core/common/excel.service';
import { DatePipe } from '@angular/common';
import { ViewReferedEmpModalComponent } from '../job-requisition-list/modals/view-refered-emp-modal/view-refered-emp-modal.component';

@Component({
  selector: 'app-view-all-job-requisition-list',
  templateUrl: './view-all-job-requisition-list.component.html',
  styleUrls: ['./view-all-job-requisition-list.component.scss'],
  providers: [DatePipe]
})
export class ViewAllJobRequisitionListComponent implements OnInit {

  displayedColumns = ['RequisitionId', 'RequisitionType', 'PrimarySkill', 'account', 'Designation', 'Location', 'CreatedDate', 'CreatedBy',
  'approverName', 'THIDAge', 
   'wmgCommitDate', 'fulfillmentDate', 
    'isTidReopened','dormantStatus','status',
    'action'
  ];
  private thId: string;
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public raisedTHIDList: any = [];
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _talentServ: TalentService,
    private _storage: GetSetStorageService,
    private _share: ShareService,
    private _excelService: ExcelService,
    public datepipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.userData = this._storage.getSetUserData();
    this.filterFormInit();
    /**showing  for tag */
    if (this.userData?.otherRoles?.IsTAG == 'Y') {
      this.displayedColumns.splice(10, 0, 'priRecruiter','secRecruiter');
      this.displayedColumns.splice(9, 0, 'tagAge');
      // this.displayedColumns.splice(3, 0, 'account');
    }
  }

  ngAfterViewInit() {
    this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
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
  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    // this.paginatorCompRef.paginator.pageIndex = 0;
    this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }


  /**
   * get selected talent Id
   * @param data 
   */
  // getDataTalent(data) {
  //   this.resetSortFilter();
  //   this.thId = data.TH_ID;
  //   this.paginatorCompRef.paginator.pageIndex = 0;
  //   this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam)
  // }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.GetRaisedTHIDDetails(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
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
    this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, e, this.sortParam,);
  }
  /**
   * get candidate list
   * @param page 
   * @param pageSize 
   * @param search 
   */

  /***
 * filter form Init
 */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      talentStatusID: [[]],
      accountType: [[]],
      location:[[]],
      practiceId: [[]],
    })
  }

  public bodyParam: any = {};
  //public bodyParam: any = {};
  GetRaisedTHIDDetails(page: number, pageSize: number, search: any, sortParam: any) {

    this.bodyParam = {};
    let body = {
      Page: page,
      PageSize: pageSize,
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam?.talentStatusID && sortParam?.talentStatusID.length !== 0) {
      let Ids = sortParam?.talentStatusID.filter(n => n);
      body['StatusID'] = Ids.toString();
    }

    if (sortParam?.accountType && sortParam?.accountType.length !== 0) {
      let Ids = sortParam?.accountType.filter(n => n);
      body['AccountIDs'] = Ids.toString();
    }

    if (sortParam?.location&& sortParam?.location.length !== 0) {
      let Ids = sortParam?.location.filter(n => n);
      body['Locations'] = Ids.toString();
    }
    if (sortParam?.practiceId && sortParam?.practiceId.length !== 0) {
      let Ids = sortParam?.practiceId.filter(n => n);
      body['practiceId'] = Ids.toString();
    }
    this.bodyParam = body;
    this._talentServ.GetAllRaisedTHIDDetails(body).subscribe(
      res => {
        this.raisedTHIDList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }



  /**view candidate full details modal open */
  viweTalentFullDetailsModal(elm: any) {
    elm['title'] = 'View Talent ID Details'
    const dialogRef = this.dialog.open(ViewTalentFullDetailsModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        }
      }
    );
  }

 

  /***
   * export excel
   */
  exportAsXLSX(): void {
    this.bodyParam['Page']=1;
    this.bodyParam['PageSize']=this.paginationData?.Total;
    this._talentServ.GetAllRaisedTHIDDetails(this.bodyParam).subscribe(
      res => {
        let requisitionList = res['data'];
        let filterDataExcel = [];
        for (var key in requisitionList) {
          let selectedData = {
            'Requisition ID': requisitionList[key].CTHID,
            'Requisition Type': requisitionList[key].ReqType,
            'Primary Skill': requisitionList[key].PriSkill,
            'Account Name': requisitionList[key].AccountName,
            'Designation': requisitionList[key].DesigName,
            'Location': requisitionList[key].JoiningLocation,
             'Created Date': this.datepipe.transform(requisitionList[key].CreatedOn, 'yyyy/M/dd'),
          //  'Created Date': requisitionList[key].CreatedOn,
            'Created By': requisitionList[key].CreatedByName,
            'Age': requisitionList[key].THIDAge,
            'Tag Age': requisitionList[key].TAGAge,
            'DP / PDL / SDP': requisitionList[key].ApproverDP,
             'Commit Date (TAG)':this.datepipe.transform(requisitionList[key].fulfilmentDate, 'yyyy/MM/dd'),
            //'Commit Date <br> (TAG)':requisitionList[key].fulfilmentDate,
            'Primary Recruiter': requisitionList[key].PrimaryRecruiter,
            'Secondary Recruiter': requisitionList[key].SecondaryRecruiter,
            'Commit Date (WMG)': this.datepipe.transform(requisitionList[key].wmgFulfilmentDate, 'yyyy/MM/dd'),
           // 'Commit Date <br> (WMG)': requisitionList[key].wmgFulfilmentDate,
            'Status': requisitionList[key].element?.SubStatus
            };
          filterDataExcel.push(selectedData);

        }
        this._excelService.exportAsExcelFile(filterDataExcel, 'Job-Requisitions');
      }
    );
  }

  // viewReferredEmployeeModalDummy(elm: any) {
  //   elm['title'] = "Proposed Employees Details"
  //   const dialogRef = this.dialog.open(ViewReferedEmpModalComponent, {
  //     width: '500px',
  //     panelClass: ['ats-model-wrap', 'view-proposed-candidate'],
  //     data: elm,
     
  //   });
  //   dialogRef.afterClosed().subscribe(
  //     res => {
  //       if (res) {
  //         this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
  //       }
  //     }
  //   );
  // }


}
