import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { ReportService } from '../report.service';
import { saveAs } from "file-saver";
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-candidate-offer-report',
  templateUrl: './candidate-offer-report.component.html',
  styleUrls: ['./candidate-offer-report.component.scss'],
  providers: [DatePipe]
})
export class CandidateOfferReportComponent implements OnInit {
  displayedColumns = ['tId', 'Cid', 'candName',
    'candiEmail', 'contactNumber',
    'positype','SourceType', 'empType', 'priSkill', 'candCurrLoc', 'joiningLoct','DateOfOffer','DateOfJoining', 'education','PrimaryRecruiter'
    ,'AccountName','DeliveryUnit','status','dropReason'
  ];
  public userData: any = {};
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public candidateList: any = [];
  public searchInput: string;
  public paginationData: any;
  public pazeOption: any = [10, 20, 50, 100];
  public pazeSize: any = 10;
  public thId: string = '';
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: any = '';
  public cidColName:string = AtsCommonPrefix.CidColName;
  public cidPrefix:string = AtsCommonPrefix.CidPrefix;
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  public isSubList:boolean = true;
  constructor(
    private _storage: GetSetStorageService,
    private _reportServe: ReportService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public _excelService: ExcelService,
    private _fb: UntypedFormBuilder,
    private http: HttpClient,
    private _share: ShareService,
    private _act:ActivatedRoute

  ) { }

  ngOnInit() {
    /**remove transfer option */
    this.userData = this._storage.getSetUserData();
    this.filterFormInit();
  }
  ngAfterViewInit() {
    // this.sortParam = '&startDate=' + this.getPastdate();
    this.getCandidateOffer(1, this.pazeSize, null, { startDate: null });
  }

  /***
   * reset paging
   */
  resetPagination() {
    this.paginatorCompRef.paginator.pageIndex = 0;
  }


  /* filter form Init
  */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      location: [[]],
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }],
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }],
      offerstatus: [[]],
      deliveryUnit: [[]],
      requisitionType: [[]],
      accountType: [[]],
      recruiterId: [[]],
      ContractType: [[]],
      source: [[]],
      subListType: [[]],
      practiceId: [[]],
    })

  }


  //getting data
  public bodyParam: any = {};
  getCandidateOffer(page: number, pageSize: number, search: string, sortParam: any) {
    // console.log(sortParam);
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
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
      body['search'] = search
    }

    if (sortParam.deliveryUnit && sortParam.deliveryUnit.length !== 0) {
      let Ids = sortParam.deliveryUnit.filter(n => n);
      body['DUIDs'] = Ids.toString();
    }
    if (sortParam.recruiterId && sortParam.recruiterId.length !== 0) {
      let recIds = sortParam.recruiterId.filter(n => n);
      body['recruiterId'] = recIds.toString();
    }
    if (sortParam.accountType && sortParam.accountType.length !== 0) {
      let accountTypeIds = sortParam.accountType.filter(n => n);
      body['accountId'] = accountTypeIds.toString();
    }
    if (sortParam.location && sortParam.location.length !== 0) {
      let locationIds = sortParam.location.filter(n => n);
      body['location'] = locationIds.toString();
    }

    if (sortParam.requisitionType && sortParam.requisitionType.length !== 0) {
      let reqisitionIds = sortParam.requisitionType.filter(n => n);
      body['requisitionType'] = reqisitionIds.toString();
    }
    if (sortParam.ContractType && sortParam.ContractType.length !== 0) {
      let contractIds = sortParam.ContractType.filter(n => n);
      body['ContractType'] = contractIds.toString();
    }
    if (sortParam.offerstatus && sortParam.offerstatus.length !== 0) {
      let offerstatusIds = sortParam.offerstatus.filter(n => n);
      body['offerstatus'] = offerstatusIds.toString();
    }
    if (sortParam.source && sortParam.source.length !== 0) {
      let sourceIds = sortParam.source.filter(n => n);
      body['source'] = sourceIds.toString();
    }
    if (sortParam.subListType && sortParam.subListType.length !== 0) {
      let dropReasonId = sortParam.subListType.filter(n => n);
      body['dropReasonId'] = dropReasonId.toString();
    }
    if (sortParam?.practiceId && sortParam?.practiceId.length !== 0) {
      let Ids = sortParam?.practiceId.filter(n => n);
      body['practiceId'] = Ids.toString();
    }
    this.bodyParam = body;
    //let queryString = `page=${page}&pageSize=${pageSize}&search=${search ? search : ''}${sortParam ? sortParam : ''}`;
    const _url= this._act?.snapshot?.url[1]?.path;
    let _apiUrl:string = 'Report/GetCandidateOfferReport';
    if(_url == "candidate-offer-report-uat"){
      _apiUrl = 'UAT/GetCandidateOfferReport_UAT';
    }
    this._reportServe.getCandidateOfferReport(body,_apiUrl).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['Paging'][0];
        this.candidateList.sort = this.sort;
      }
    )
  }


  /**
  * pagination method
  * @param pageEvent 
  */
  getPagingData(pageEvent: any) {
    this.getCandidateOffer(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput, this.sortParam);
  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    //this.isResetFilter = true;
    this.isResetSearch = false;
    //  this.sortParam = '';
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getCandidateOffer(1, this.pazeSize, e, this.sortParam);
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
    this.resetPagination();
    this.getCandidateOffer(1, this.pazeSize, this.searchInput, data);
  }


  /***
   * get PAst Date
   */
  getPastdate() {
    let currentDate = new Date();
    // let pastDate = new Date(currentDate);
    /**
     * 8 days before
     */
    // pastDate.setDate(pastDate.getDate() - 7);
    let firstDayMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let dateParse = GlobalMethod.formatDate(firstDayMonth);
    return dateParse;
  }

  /***
* download report excel
*/
  downloadReportAsExel() {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    const _url= this._act?.snapshot?.url[1]?.path;
    let _apiUrl:string = 'Report/ExportToExcelCandidateOfferReport';
    if(_url == "candidate-offer-report-uat"){
      _apiUrl = 'UAT/ExportToExcelCandidateOfferReportint_UAT';
    }
    this.http.post(`${environment.apiMainUrlNet}${_apiUrl}`,bodyData, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'Candidate_Offer_Report.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }
}


