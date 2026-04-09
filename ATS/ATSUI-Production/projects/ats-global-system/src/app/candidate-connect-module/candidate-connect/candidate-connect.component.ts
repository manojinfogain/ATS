import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { CandidateConnectService } from '../candidate-connect.service';
import { CandidateConnectViewComponent } from '../modals/candidate-connect-view/candidate-connect-view.component';
import { UpdateConnectHistoryComponent } from '../modals/update-connect-history/update-connect-history.component';
import { saveAs } from "file-saver";
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { AtsCommonPrefix, SPECIALACCESSUSER } from 'projects/ats-global-system/src/app/core/constant/common.const';
@Component({
  selector: 'app-candidate-connect',
  templateUrl: './candidate-connect.component.html',
  styleUrls: ['./candidate-connect.component.scss']
})
export class CandidateConnectComponent implements OnInit {


  //public candidateConnectForm:FormGroup = new FormGroup({});

  displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'primarySkill', 'SubSkill', 'Primaryrecruiter', 'Secondaryrecruiter', 'accountName', 'offerDate', 'joiningDate', 'approveStatus', 'action'];
  private thId: string;
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public cidColName:string = AtsCommonPrefix.CidColName;
  public cidPrefix:string = AtsCommonPrefix.CidPrefix;
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(private _fb: UntypedFormBuilder,
    private _CandidateConnectService: CandidateConnectService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _http: HttpClient,
    private _share: ShareService
    ) { }


    public specialLogin:boolean = false;
  ngOnInit(): void {
    this.filterFormInit();

    this.userData = this._storage.getSetUserData();
    this.sortParam = '';
  //  this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, '');
  
  let empId = this._storage.getUserEmpId();
  let isUserValid = SPECIALACCESSUSER.offerAccesRight.filter(r => r.empId === parseInt(empId));
  if (isUserValid.length !== 0) {
    this.specialLogin = true;
  }
  else {
    this.specialLogin = false;
  }
  }

  ngAfterViewInit() {
    // this.sortParam = '&startDate=' + this.getPastdate();
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
  }

  // resetSortFilter() {
  //   this.isResetSearch = true;
  //   this.isResetFilter = true;
  //   this.searchInput = '';
  //   this.sortParam = '';
  // }
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
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }



  /**
   * get selected talent Id
   * @param data 
   */
  getDataTalent(data) {
   // this.resetSortFilter();
    this.thId = data.TH_ID;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam)
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getCandidateListByTalentId(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
  }

  /***
   * search
   */
  getSearchValueKey(e: any) {
    //this.isResetFilter = true;
    this.isResetSearch = false;
   // this.sortParam = '';
    this.searchInput = e;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }


    /***
 * filter form Init
 */
     filterFormInit() {
      this.sortFormFilter = this._fb.group({
        primarySkill: [[]],
        accountType: [[]],
        recruiterId: [[]],
        dateFrom: [null],
        dateTo: [{ value: null, disabled: true }],
        dateStart: [null],
        dateEnd: [{ value: null, disabled: true }],
      })
    }

  /**
   * get candidate list
   * @param page 
   * @param pageSize 
   * @param search 
   */

  public bodyParam: any = {};
  getCandidateListByTalentId(page: number, pageSize: number, search: any, sortParam: any) {
    //console.log("Test2")
    // let queryString = `${this.thId ? 'thid=' + this.thId + '&' : ''}page=${page}&pageSize=${pageSize}&search=${search ? search.trim() : ''}${sortParam ? sortParam : ''}`;
    this.bodyParam = {}

    let body = {
      page: page,
      pageSize: pageSize
    }

    if (sortParam?.dateFrom) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }
  
    if (sortParam?.dateTo) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }
    //
    if (sortParam?.dateStart) {
      body['startDate2'] = GlobalMethod.formatDate(sortParam?.dateStart);
    }
 
    if (sortParam?.dateEnd) {
      body['endDate2'] = GlobalMethod.formatDate(sortParam?.dateEnd);
    }

    if (search) {
      body['search'] = search;
    }
    if (this.thId) {
      body['thid'] = this.thId
    }
    if (sortParam.recruiterId && sortParam.recruiterId.length !== 0) {
      let recIds = sortParam.recruiterId.filter(n => n);
      body['recruiterId'] = recIds.toString();
    }
    if (sortParam.accountType && sortParam.accountType.length !== 0) {
      let accountTypeIds = sortParam.accountType.filter(n => n);
      body['accountId'] = accountTypeIds.toString();
    }

    if (sortParam.primarySkill && sortParam.primarySkill.length !== 0) {
      let Ids = sortParam.primarySkill.filter(n => n);
      body['primarySkill'] = Ids.toString();
    }

    this.bodyParam = body;

    this._CandidateConnectService.GetOfferedCandidatesList(body).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }

  /*update Connect History
  */
  updateConnectHistory(elm: any) {
    elm['title'] = 'Update Candidate Connect Status';
    const dialogRef = this.dialog.open(UpdateConnectHistoryComponent, {
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
      }
    });
  }

  //candidate connect view
  CandidateConnectView(elm: any) {
    elm['title'] = 'Candidate Connect History';
    const dialogRef = this.dialog.open(CandidateConnectViewComponent, {
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal', 'ats-model-lg'],
      data: elm,
    });
  }

  //export report in  excel
  exportAsXLSX(): void { 
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this._http.post(`${environment.apiMainUrlNet}CandidateConnect/ExportToExcelCandidateConnect`,bodyData, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'Candidate_Connect.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
   }

}
