import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GlobalMethod } from '../../core/common/global-method';
import { AtsCommonPrefix, SPECIALACCESSUSER } from '../../core/constant/common.const';
import { CONSTANTS } from '../../core/constant/constants';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { BgvServiceService } from '../bgv-service.service';
import { ExcelService } from '../../core/common/excel.service';
import { UpdateOtherBgvDetailsModalComponent } from '../modals/update-other-bgv-details-modal/update-other-bgv-details-modal.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { CommonPdfViewerInternalComponent } from '../../common-sharing/modals/common-pdf-viewer-internal/common-pdf-viewer-internal.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detailed-bgv-report',
  templateUrl: './detailed-bgv-report.component.html',
  styleUrls: ['./detailed-bgv-report.component.scss']
})
export class DetailedBgvReportComponent implements OnInit {
  public displayedColumns: string[] = [];
  //  displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'primarySkill', 'priRecruiter',
  //    'secondRecruiter', 'offerDate', 'joiningDate', 'joiningLocation', 'cifStatus', 'candiSubStatus', 'day1Status', 'appStatusProg',
  //    //'recVerification','hrVerification',
  //    'approveStatus', 'dormantStatus', 'action'];
  private thId: string;
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public cidColName: string = AtsCommonPrefix.CidColName;
  public cidPrefix: string = AtsCommonPrefix.CidPrefix;
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _bgvServ: BgvServiceService,
    private _excelService: ExcelService,
    private _http: HttpClient,

  ) {
  }

  ngOnInit() {
    this.userData = this._storage.getSetUserData();
    this.filterFormInit();
    this.displayedColumns = [
      'employeeCode',
      'typeOfOffer',
      'doj',
      'interimReport1Received',
      'interimReport1Status',
      'slaInterim1FromDoj',
      'slaInterim2FromInitiation',
      'walsonId',
      'offerNo',
      'candidateName',
      'joiningLocation',
      'dateOfOffer',
      'dateOfInitiation',
      'expectedDateForInterimReport',
      'interimReport2Received',
      'interimReport2Status',
      'ytrInitiationDate',
      'expectedFinalCloserDate',
      'dateOfFinalReportReceived',
      'statusOfFinalReport',
      'slaCalculation',
      'joiningStatus',
      'remarks',
      'penaltyMonth',
      'insuffDocument',
      'extraCostAppr',
      'drugTest',
      'drugTestStatus',
      'drugTestCost',
      'ytrAmount',
      'paidMonth1',
      'statusPaidUnpaidAmount',
      'paidMonth2',
      'action'
    ];

  }

  ngAfterViewInit() {
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
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
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }


  /**
   * get selected talent Id
   * @param data 
   */
  getDataTalent(data) {
    this.resetSortFilter();
    this.thId = data.TH_ID;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam)
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getOnboardingCandidateList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
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
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
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
      location: [[]],
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }],
      offerstatus: [[]],
      bgvFinalStatus: [[]]
    })
  }


  public bodyParam: any = {};
  getOnboardingCandidateList(page: number, pageSize: number, search: any, sortParam: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize
    }
    if (sortParam?.dateStart) {
      body['StartDOJ'] = GlobalMethod.formatDate(sortParam?.dateStart);
    }
    if (sortParam?.dateEnd) {
      body['EndDOJ'] = GlobalMethod.formatDate(sortParam?.dateEnd);
    }

    if (sortParam?.offerstatus && sortParam?.offerstatus.length !== 0) {
      let offerstatusIds = sortParam.offerstatus.filter(n => n);
      body['OfferStatusId'] = offerstatusIds.toString();
    }
    if (sortParam?.bgvFinalStatus && sortParam?.bgvFinalStatus.length !== 0) {
      body['FinalBGVStatus'] = sortParam?.bgvFinalStatus.toString();
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam.location && sortParam.location.length !== 0) {
      let locationIds = sortParam.location.filter(n => n);
      body['JoiningLocation'] = locationIds.toString();
    }
    this.bodyParam = body;
    this._bgvServ.GetBGVeDetailedReport(body).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['Paging'][0];
      }
    )
  }
  /***
* export excel
*/
  exportAsXLSX(): void {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this._bgvServ.GetBGVeDetailedReport(bodyData).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        for (var key in candidateList) {
          let selectedData = {
            'Sr. No.': (parseInt(key, 10) + 1),
            'Employee Code': candidateList[key].EmployeeCode,
            'Type Of Offer': candidateList[key].TypeOfOffer,
            'DOJ': candidateList[key].DOJ ? GlobalMethod?.formatDate(candidateList[key].DOJ) : '-',
            'Interim Report 1 Received': candidateList[key].InterimReport1Received ? GlobalMethod?.formatDate(candidateList[key].InterimReport1Received) : '-',
            'Interim Report 1 Status': candidateList[key].InterimReport1Status,
            'SLA_Interim 1 (From Date of Joining)': candidateList[key].SLA_Interim1_FromDOJ,
            'SLA_Interim 2 (From Date of Initiation)': candidateList[key].SLA_Interim2_FromInitiation,
            'Walson ID': candidateList[key].WalsonID,
            'Offer No.': candidateList[key].OfferNo,
            'Candidate Name': candidateList[key].CandidateName,
            'Date of Offer': candidateList[key].DateOfOffer ? GlobalMethod?.formatDate(candidateList[key].DateOfOffer) : '-',
            'Date of Initiation': candidateList[key].DateOfInitiation ? GlobalMethod?.formatDate(candidateList[key].DateOfInitiation) : '-',
            'Expected Date For Interim Report 2': candidateList[key].ExpectedDateForInterimReport ? GlobalMethod?.formatDate(candidateList[key].ExpectedDateForInterimReport) : '-',
            'Interim Report 2 Received': candidateList[key].InterimReport2Received ? GlobalMethod?.formatDate(candidateList[key].InterimReport2Received) : '-',
            'Interim Report 2 Status': candidateList[key].InterimReport2Status,
            'YTR Initiation Date': candidateList[key].YTRInitiationDate ? GlobalMethod?.formatDate(candidateList[key].YTRInitiationDate) : '-',
            'Expected Final Closer date': candidateList[key].ExpectedFinalCloserDate ? GlobalMethod?.formatDate(candidateList[key].ExpectedFinalCloserDate) : '-',
            'Date of Final Report Received': candidateList[key].DateOfFinalReportReceived ? GlobalMethod?.formatDate(candidateList[key].DateOfFinalReportReceived) : '-',
            'Status of Final Report': candidateList[key].StatusOfFinalReport,
            'SLA Calculation': candidateList[key].SLACalculation,
            'Joining Status': candidateList[key].JoiningStatus,
            'Final Report Remarks': candidateList[key].Remarks,
            'Penalty Month (If any)': candidateList[key].PenaltyMonth,
            'Insuff Document': candidateList[key].InsuffDocument,
            'Extra Cost Approval': candidateList[key].extraCostApproval,
            'Drug Test Required': candidateList[key].DTRequired,
            'Drug Test Status': candidateList[key].DTStatus,
            'Drug Test Cost': candidateList[key].DTAmount,
            'YTR (Amount)': candidateList[key].YTRAmount,
            'YTR Paid Month': candidateList[key].YTRPaidMonth,
            'Status (Paid /Unpaid) Amount': candidateList[key].StatusPaidUnpaidAmount,
            'Final Report Paid Month': candidateList[key].FinalReportPaidMonth
          };
          filterDataExcel.push(selectedData);
        }
        this._excelService.exportAsExcelFile(filterDataExcel, 'Detailed-BGV-Report');
      }
    )

  }
  /**updateOtherBGVDetailsModal  */
  updateOtherBGVDetailsModal(elm: any) {
    elm['title'] = 'Update Other BGV  Details';
    const dialogRef = this.dialog.open(UpdateOtherBgvDetailsModalComponent, {
      //width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate'],
      data: elm,
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          // this.paginatorCompRef.paginator.pageIndex = 0;
          // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }

  viewDownloadInterimReport1(element: any, type: string) {
    this._http.get(`${environment.apiMainUrlNet}BGV/DownloadBGVReportsById?Id=${encodeURIComponent(element?.Id)}&Type=${type}`, { responseType: 'blob' }).subscribe(
      res => {
        let elm = {};
        elm['title'] = 'Preview Document';
        elm['documentName'] = element.DocumentName;
        if (res?.type == 'application/pdf') {
          elm['pdfPreviewData'] = res;
          const dialogRef = this.dialog.open(CommonPdfViewerInternalComponent, {
            panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
            data: elm,
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%'
          });
          dialogRef.afterClosed().subscribe(
            res => {
            }
          );
        }
      });
  }
}
