import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { PartnerService } from '../../vendor-partner-module/partner.service';
import { HttpClient } from '@angular/common/http';
import { ShareService } from '../../core/services/share.service';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { CONSTANTS } from '../../core/constant/constants';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { UpdateBuddyComponent } from '../update-buddy/update-buddy.component';
import { BuddyService } from '../buddy.service';
import { GlobalMethod } from '../../core/common/global-method';

@Component({
  selector: 'app-buddy-screen',
  templateUrl: './buddy-screen.component.html',
  styleUrls: ['./buddy-screen.component.scss']
})
export class BuddyScreenComponent implements OnInit {
  displayedColumns = ['Tid', 'cid', 'name','candi_grade', 'LOCATION_ID', 'ACCOUNT_NAME', 'email', 'DateOfJoining', 'reportingManager', 'Buddy','BuddyDesignation','buddy_grade','action'];
  public userData: any = {};
  public searchInput: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public sortTable: any = [];
  @ViewChild(MatSort) sort: MatSort;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});

  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _buddyserve: BuddyService,
    private _router: Router,
    private _fb: UntypedFormBuilder,

  ) {
  }

  ngOnInit() {

    this.filterFormInit();
    this.getCandidateListForBuddyAssign(1, CONSTANTS.PAGE_SIZE, null, null);

  }

  ngOnDestroy(): void {

  }

  /**
   * reset filter and search
   */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getCandidateListForBuddyAssign(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);

  }

  /***
   * search
   */

  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    console.log(data);
    this.getCandidateListForBuddyAssign(1, CONSTANTS.PAGE_SIZE, this.searchInput ? this.searchInput : null, data);

  }
  /***
* filter form Init
*/
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      search: [[]],
      accountType: [[]],
      location: [[]],
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }],
      PendingCases: [true],
    })
  }
  getCandidateListForBuddyAssign(page: number, pageSize: number, search: string, sortParam: any) {

    let body = {
      page: page,
      pageSize: pageSize,
       PendingCases: 1
      // AccountId: "string",
      // locationId: "string",
      // StartDate: "string",
      // EndDate: "string"
    }

    if (search) {
      body['search'] = search;
    }

    if (sortParam?.accountType && sortParam?.accountType.length !== 0) {
      let Ids = sortParam?.accountType.filter(n => n);
      body['AccountId'] = Ids.toString();
    }

    if (sortParam?.location && sortParam?.location.length !== 0) {
      let Ids = sortParam?.location.filter(n => n);
      body['LocationId'] = Ids.toString();
    }
    if (sortParam?.dateFrom) {
      body['StartDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }
    if (sortParam?.dateTo) {
      body['EndDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }
    debugger
     if (sortParam) {
      
      body['PendingCases'] = sortParam?.PendingCases== true ? 1 : 0;
     }
    this._buddyserve.GetCandidateListForBuddyAssign(body).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }


  // elm={};
  // openAssignBuddy(elm: any) {
  //   // elm['title'] = `Candidate Pending Documents- ${elm?.Name}`;
  //   // elm['formType'] = 2;
  //   const dialogRef = this.dialog.open(AssignBuddyComponent, {
  //     width: '500px',
  //     panelClass: ['ats-model-wrap', 'candidate-connect-view-modal'],
  //     data: elm,
  //   });
  //   dialogRef.afterClosed().subscribe(
  //     res => {
  //       if (res) {
  //         // this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
  //       }
  //     }
  //   );
  // }


  element = {};
  openAddUpdateBuddy(element: any, type: string) {
    debugger
    // elm['title'] = `Candidate Pending Documents- ${elm?.Name}`;
    element['type'] = type;
    const dialogRef = this.dialog.open(UpdateBuddyComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal'],
      data: element,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getCandidateListForBuddyAssign(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
          this.jumpFirstPage = true;
          this.paginatorCompRef.paginator.pageIndex = 0;

        }
      }
    );
  }

  isActionVisible(element: any) {
    let today = new Date();
    let DoJ = new Date(element?.DateOfJoining);
    if (DoJ > today) {
      return true;
    }

    else {
      return false;

    }
  }

  getSearchValueKey(e: any) {
    this.isResetFilter = true;
    this.isResetSearch = false;
    this.sortParam = '';
    this.searchInput = e;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getCandidateListForBuddyAssign(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }

  // edit/update info
  // editUpdate(elm: any,  type:string): void {

  //   elm['title'] = "Update Partner"
  //   elm['type'] = type
  //   const dialogRef = this.dialog.open(UpdatePartnerDetailsComponent, {
  //     width: '500px',
  //     panelClass: ['ats-model-wrap', 'update-interview-feedback', 'partner-update-modal'],
  //     data: elm,
  //     disableClose: true
  //   });
  //   dialogRef.afterClosed().subscribe(result => {

  //     if (result) {
  //       this.jumpFirstPage = true;
  //       this.paginatorCompRef.paginator.pageIndex = 0;
  //      // this.getVenderList(1, CONSTANTS.PAGE_SIZE, this.searchInput,  this.sortParam, '');
  //       this.getVenderList(1, CONSTANTS.PAGE_SIZE, '', this.sortParam);
  //     }
  //   });
  // }


  // edit/update info
  // updatePartnerStatus(elm: any): void {
  //   elm['title'] = "Update Partner Status"
  //   const dialogRef = this.dialog.open(ParnerStatusFormModalComponent, {
  //     width: '500px',
  //     panelClass: ['ats-model-wrap', 'update-interview-feedback', 'partner-update-modal', 'partner-status-modal'],
  //     data: elm,
  //     disableClose: true
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.jumpFirstPage = true;
  //       this.paginatorCompRef.paginator.pageIndex = 0;
  //       //this.getVenderList(1, CONSTANTS.PAGE_SIZE, this.searchInput);
  //       this.getVenderList(1, CONSTANTS.PAGE_SIZE, '', this.sortParam);
  //     }
  //   });
  // }

  /***
   * active/deactive  conform modal
   */


  /***
   * open modal for status remark
   */



  // gotPartnerPage(): void {
  //   this._router.navigate(['partner-registration'])
  // }


  /***
   * export excel
   */
  // exportAsXLSX(): void {
  //   //let queryString = `page=1&pageSize=10000&search=`;
  //   let queryString = `EmpID=${this._storage.getUserEmpId()}&page=1&pageSize=10000&search=`;
  //   this._partnerserve.getVenderList(queryString).subscribe(
  //     res => {
  //       let candidateList = res['data'];
  //       let filterDataExcel = [];
  //       for (var key in candidateList) {
  //         let selectedData = {
  //           'Partner Name': candidateList[key].PartnerName,
  //           'Contact No. ': candidateList[key].ContactNo,
  //           'Email Id': candidateList[key].Email,
  //           'Contract Type': candidateList[key].ContractType
  //         }
  //         filterDataExcel.push(selectedData);
  //       }
  //       this._excelService.exportAsExcelFile(filterDataExcel, 'partner-records');
  //     }
  //   )

  // }

  /**export to excel by API  */

}
