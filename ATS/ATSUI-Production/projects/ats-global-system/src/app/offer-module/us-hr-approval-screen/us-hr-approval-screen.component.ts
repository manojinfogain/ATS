import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { ICandidateOfferListDetails } from '../../core/models/offer-model';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AtsCommonPrefix, SPECIALACCESSUSER } from '../../core/constant/common.const';
import { Subscription } from 'rxjs';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { OfferService } from '../offer.service';
import { HttpClient } from '@angular/common/http';
import { ShareService } from '../../core/services/share.service';
import { GlobalApisService } from '../../core/services/global-apis.service';
import { ExcelService } from '../../core/common/excel.service';
import { DatePipe } from '@angular/common';
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { CONSTANTS } from '../../core/constant/constants';
import { GlobalMethod } from '../../core/common/global-method';
import { ViewOfferApprovalDetailsComponent } from '../modals/view-offer-approval-details/view-offer-approval-details.component';
import { UsSendPreviewOfferModalComponent } from '../modals/us-send-preview-offer-modal/us-send-preview-offer-modal.component';
import { EmployeeAgreementPreviewUsComponent } from '../modals/employee-agreement-preview-us/employee-agreement-preview-us.component';
@Component({
  selector: 'app-us-hr-approval-screen',
  templateUrl: './us-hr-approval-screen.component.html',
  styleUrls: ['./us-hr-approval-screen.component.scss'],
  providers: [DatePipe]
})
export class UsHrApprovalScreenComponent implements OnInit {


  displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'recruiter', 'prmRecruiter', 'primarySkill',
    'offerDate', 'joiningDate',
    //'modifiedOn', 
    'approveStatus', 'action'];
  private thId: string;
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: string = '';
  public paginationData: any;
  public candidateList: ICandidateOfferListDetails[] = [];
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public cidColName: string = AtsCommonPrefix.CidColName;
  public cidPrefix: string = AtsCommonPrefix.CidPrefix;
  private refreshSubscription: Subscription;
  // private getLocInfo: GetLocationInfo;
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _offerServe: OfferService,
    private http: HttpClient,
    private _share: ShareService,
    private _globalApiServe: GlobalApisService,
    private _excelService: ExcelService,
    public datepipe: DatePipe,
    private _globalCommonMethod: GlobalCommonMethodService,
    private getLocInfo: GetLocationInfo
  ) {
  }
  public specialLogin: boolean = false;
  ngOnInit() {
    let empId = this._storage.getUserEmpId();
    let isUserValid = SPECIALACCESSUSER.offerAccesRight.filter(r => r.empId === parseInt(empId));
    if (isUserValid.length !== 0) {
      this.specialLogin = true;
    }
    else {
      this.specialLogin = false;
    }
    this.userData = this._storage.getSetUserData();
    this.sortParam = '&intStatus=4'
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
    this.filterFormInit();
    this.showHideLocWise();
    // this.generateOfferManual({d:1})

    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        
        this.resetSortFilter();
        // this.talentIdControl.patchValue('all');
        this.thId = null;
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        this.showHideLocWise();
      }
    )
  }

  ngAfterViewInit() {
    //this.sortParam = '&startDate=' + this.getPastdate();
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
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
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }



  /**
   * get selected talent Id
   * @param data 
   */
  getDataTalent(data) {
    this.resetSortFilter();
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
    this.isResetFilter = true;
    this.isResetSearch = false;
    this.sortParam = '';
    this.searchInput = e;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
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
      offerstatus: [[]],
      primarySkill: [[]],
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }],
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }],
      // recruiterId: [[]],

    })
  }

  /**show/hide locationwise */
  public isVisibleForIndia: boolean = false;
  public isVisibleForUS: boolean = false;
  showHideLocWise() {
    if (this.getLocInfo.isLocationIndia()) {
      this.isVisibleForIndia = true;
      this.isVisibleForUS= false;
    } 
    else {
      this.isVisibleForIndia = false;
      this.isVisibleForUS= true;
    }
  }

  public bodyParam: any = {};
  getCandidateListByTalentId(page: number, pageSize: number, search: any, sortParam: any) {
    //let queryString = `${this.thId ? 'thid=' + this.thId + '&' : ''}page=${page}&pageSize=${pageSize}&search=${search ? search.trim() : ''}${sortParam ? sortParam : ''}`;
    this.bodyParam = {};
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
    if (this.thId) {
      body['thid'] = this.thId
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam.offerstatus && sortParam.offerstatus.length !== 0) {
      let offerstatusIds = sortParam.offerstatus.filter(n => n);
      body['offerStatus'] = offerstatusIds.toString();
    }
    // if (sortParam.recruiterId && sortParam.recruiterId.length !== 0) {
    //   let recIds = sortParam.recruiterId.filter(n => n);
    //   body['recruiterId'] = recIds.toString();
    // }

    if (sortParam.primarySkill && sortParam.primarySkill.length !== 0) {
      let Ids = sortParam.primarySkill.filter(n => n);
      body['primarySkill'] = Ids.toString();
    }


    this.bodyParam = body;
    /**us landing listing api */
    console.log("US listing api")
    this._offerServe.GetCandidateListForHR(body).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];

      }
    )

  }
  /***
   * view offer/approval Details
   */

  openofferApprovalDetailsModal(elm: ICandidateOfferListDetails) {
    elm['title'] = 'View Offer / Approver Details';
    const dialogRef = this.dialog.open(ViewOfferApprovalDetailsComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

  /***
   * downloadOfferletter
   */
  downloadOfferletter(elm: ICandidateOfferListDetails) {
    
    let today = new Date();
    let todayDate = GlobalMethod.formatDate(today);
    this.http.get(`${environment.apiMainUrlNet}USOffer/DownloadUSOffer?cid=${elm.cid}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'offer_letter_' + elm?.Name + '_' + elm?.talent_id + '_' + todayDate + '.pdf');
        this._share.showAlertSuccessMessage.next('Offer letter  downloaded successfully.')
      }
    )
  }


  tooltiphint(elm: any) {
    
    let tooltip: string = '';
    if (elm.OfferStatusID === 125) {
      tooltip = 'Preview and Approve Offer';
    }
    else if (elm.OfferStatusID === 130) {
      // tooltip = 'Preview and Send Offer To Candidate';
      // note- 1010 direct contractor and 14 corp to corp -hiding send offer to candiddate button
      if (elm?.CandidateTypeID === 1010 || elm?.CandidateTypeID === 14) {
        tooltip = 'Preview Offer';
      } else {
        tooltip = 'Preview and Send Offer To Candidate';
      }
    }
    else {
      tooltip = 'Preview Offer';
    }
    return tooltip;
  }
  /**
   * preview and send offer modal
   * @param elm 
   */

  previewandSendOffer(elm: any) {
    
    let panelClass = ['ats-model-wrap', 'ats-model-full-screen'];
    if (elm.OfferStatusID === 125) {
      elm['title'] = 'Preview and Approve Offer';
      elm['actionFor'] = 'A';
      // panelClass = ['ats-model-wrap', 'ats-model-full-screen-forms'];
    }
    else if (elm.OfferStatusID === 130) {
      // note- 1010 direct contractor and 14 corp to corp -hiding send offer to candiddate button
      if (elm?.CandidateTypeID == 1010 || elm?.CandidateTypeID == 14) {
        elm['title'] = 'Preview Offer';
      } else {
        elm['title'] = 'Preview and Send Offer To Candidate';
        elm['actionFor'] = 'C';
      }
    }
    else {
      elm['title'] = 'Preview Offer';
    }

    const dialogRef = this.dialog.open(UsSendPreviewOfferModalComponent, {
      panelClass: panelClass,
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.paginatorCompRef.paginator.pageIndex = 0;
          this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }



  /**
   * diable Method
   * @param elm 
   * @returns 
   */
  disableDowbloadOfferCandidtionWise(elm: any) {
    if (
      elm?.OfferStatusID == 100) {
      return true
    }
    else {
      return false
    }
  }

  /**
     * diable Method
     * @param elm 
     * @returns 
     */
  // disableUpdateOfferCandidtionWise(elm: any) {
  //   if (
  //     elm?.OfferStatusID == 120 ||
  //     elm?.OfferStatusID == 140 ||
  //     elm?.OfferStatusID == 160 ||
  //     elm?.OfferStatusID == 180 ||
  //     elm?.OfferStatusID == 220) {
  //     return true
  //   }
  //   else {
  //     return false
  //   }
  // }

  /**
  * diable Method
  * @param elm 
  * @returns 
  */
  // disableGenOfferCandidtionWise(elm: any) {
  //   if (
  //     //  elm?.OfferStatusID == 180 ||
  //     elm?.OfferStatusID == 220 ||
  //     elm?.OfferStatusID == 200 ||
  //     elm?.OfferStatusID == 160
  //   ) {
  //     return true
  //   }
  //   else {
  //     return false
  //   }
  // }

  offerPreviewHideShowButton(elm: any) {
    // if (
    //   elm?.OfferStatusID == 125 
    //   || elm?.OfferStatusID == 130 &&
    //   elm?.HRApprovalId == this.userData?.EmpNewId
    //   // elm?.OfferStatusID == 160 ||
    //   // elm?.OfferStatusID == 180 ||
    //   // elm?.OfferStatusID == 200
    //   ) {
    //   return true
    // }
    // else {
    //   return false
    // }
    return true
  }

  /**send for hr approval button show */
  sendForHrApprovalHideShowButton(elm: any) {
    // if (
    //   elm?.OfferStatusID == 120 ||
    //   elm?.OfferStatusID == 140 ||
    //   elm?.OfferStatusID == 160 ||
    //   elm?.OfferStatusID == 180 ||
    //   elm?.OfferStatusID == 200) {
    //   return true
    // }
    // else {
    //   return false
    // }
    return true
  }

  // isConfirmAddress(element: any) {
  //   if ((element?.joinDateDiffInDays <= 7 && element?.isShippingAddrConfirm === 0) &&
  //     (element?.OfferStatusID == 120 ||
  //       element?.OfferStatusID == 140 ||
  //       element?.OfferStatusID == 180)) {
  //     return true
  //   }
  //   else {
  //     return false
  //   }
  // }





  //export offer generation report in  excel
  // exportAsXLSX() {
  //   let bodyData = {
  //     ...this.bodyParam,
  //     page: 1,
  //     pageSize: this.paginationData?.Total,
  //   }
  //   this.http.post(`${environment.apiMainUrlNet}Offer/ExportToExcelApprovedCandidateList`, bodyData, { responseType: 'blob' }).subscribe(
  //     res => {
  //       saveAs(res, 'Offer_Generation_Report.xls');
  //     },
  //     (error) => {
  //       this._share.showAlertErrorMessage.next('Something went wrong');
  //     }
  //   )
  // }
 /**preview Emp Agreement */
 previewEmpAgr(elm: any ={}) {
  elm['title'] = 'Preview Employee Agreement';
  const dialogRef = this.dialog.open(EmployeeAgreementPreviewUsComponent, {
    panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
    data: elm,
    maxWidth: '100vw',
    maxHeight: '100vh',
    height: '100%',
    width: '100%'
  });

}

exportAsXLSXHR(): void {
  let bodyData = {
    ...this.bodyParam,
    page: 1,
    pageSize: this.paginationData?.Total,
  }



  this._offerServe.GetHRApprovedCandidatesListReport(bodyData).subscribe(

    res => {

      let candidateList = res['data'];

      let filterDataExcel = [];

      for (var key in candidateList) {

        let selectedData = {

          'Talent ID': candidateList[key].TalentID,

          'Requirement Type': candidateList[key].RequirementType,

          'Legal First Name': candidateList[key].FirstName,

          'Legal Last Name': candidateList[key].LastName,

          'Preferred Name(if different)': candidateList[key].PreferredName,

          'Phone': candidateList[key].CPhone,

          'Address': candidateList[key].Address,

          'Email': candidateList[key].CEmail,

          'Work/Visa Status': candidateList[key].Visa,

          'I9 Representative': candidateList[key].I9Representative ,

          'Legal Entity': candidateList[key].LegalEntity,

          'Division': candidateList[key].Division,

          'Employment Type': candidateList[key].EmployementType,

          'Department Code': candidateList[key].DepartmentCode,

          'Employee Unit': candidateList[key].EmployeeUnit,

          'Resource Find': candidateList[key].ResourceFind,

          'Title(internal)': candidateList[key].TitleInternal,

          'Grade': candidateList[key].Grade,

          'New Hire v. Rehire': candidateList[key].NewHire,

          'Working Remote Status': candidateList[key].WorkingRemote,

          'Relocation': candidateList[key].Relocation,

          'Total Experience': candidateList[key].TotalExperience + ' ' +'Years',

          'Primary Skill': candidateList[key].candidatePrimarySkill,

          'Sub Skill': candidateList[key].candidateSkill,

          'Years of experience in Primaryskill': candidateList[key].RelevantExperience + ' ' + 'Years',

          'Base Pay': candidateList[key].BasePay,

          'Annual Variable Pay': candidateList[key].AnnualVariablePay,

          'Joining Bonus Pay': candidateList[key].joiningBonus,

          'Relocation Pay': candidateList[key].RelocationPay,

          'Travel Expense': candidateList[key].ApprovedTravelexpense,

          'Retention Bonus': candidateList[key].ApprovedRetentionBonus,

          'Medical Benefit Eligible': candidateList[key].Medical,

          'FLSA job Classification': candidateList[key].FLSA,

          'Account Name': candidateList[key].AccountName,

          'Recruiter Name': candidateList[key].PrimaryRecuiterName,

          'Reporting Manager': candidateList[key].ReportingManager,

          'Start Date': candidateList[key].Dateofjoining,
          
          'Bill Rate (If Billable)': candidateList[key].BillRate,
          
          'Per Hour Cost Rate': candidateList[key].billableHoursperDay

        };

        filterDataExcel.push(selectedData);

      }
      this._excelService.exportAsExcelFile(filterDataExcel, 'OfferHRReport');

    }

  )
}

}
