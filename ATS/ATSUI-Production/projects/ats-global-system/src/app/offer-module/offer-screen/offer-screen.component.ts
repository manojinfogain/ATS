import { Component, OnInit, ViewChild } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { OfferService } from '../offer.service';
import { ViewGenerateOfferComponent } from '../modals/view-generate-offer/view-generate-offer.component';
import { saveAs } from "file-saver";
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { ViewOfferApprovalDetailsComponent } from '../modals/view-offer-approval-details/view-offer-approval-details.component';
import { UpdateOfferStatusComponent } from '../modals/update-offer-status/update-offer-status.component';
import { ICandidateOfferListDetails } from 'projects/ats-global-system/src/app/core/models/offer-model';
import { SendPreviewOfferModalComponent } from '../modals/send-preview-offer-modal/send-preview-offer-modal.component';
import { AtsCommonPrefix, SPECIALACCESSUSER } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { SelectedCandidateTransferModalComponent } from '../modals/selected-candidate-transfer-modal/selected-candidate-transfer-modal.component';
import { UpdateConfirmShippingAddressComponent } from '../modals/update-confirm-shipping-address/update-confirm-shipping-address.component';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { UploadManualOfferModalComponent } from '../modals/upload-manual-offer-modal/upload-manual-offer-modal.component';
import { OfferGenerationConfirmationModalComponent } from '../modals/offer-generation-confirmation-modal/offer-generation-confirmation-modal.component';
// import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
import { UsGenerateOfferModalComponent } from '../modals/us-generate-offer-modal/us-generate-offer-modal.component';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { UsSendPreviewOfferModalComponent } from '../modals/us-send-preview-offer-modal/us-send-preview-offer-modal.component';
import { UsUploadManualOfferModalComponent } from '../modals/us-upload-manual-offer-modal/us-upload-manual-offer-modal.component';
import { EmployeeAgreementPreviewUsComponent } from '../modals/employee-agreement-preview-us/employee-agreement-preview-us.component';
import { SelectedCandidateTransferWithTcModalComponent } from '../modals/selected-candidate-transfer-with-tc-modal/selected-candidate-transfer-with-tc-modal.component';
import { SendForApprovalModalComponent } from '../modals/send-for-approval-modal/send-for-approval-modal.component';
import { SendForApprovalModalUsComponent } from '../modals/send-for-approval-modal-us/send-for-approval-modal-us.component';
import { ConfirmationDialogComponent } from '../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { OnboardService } from '../../onboard-module/onboard.service';
@Component({
  selector: 'app-offer-screen',
  templateUrl: './offer-screen.component.html',
  styleUrls: ['./offer-screen.component.scss'],
  providers: [DatePipe]
})
export class OfferScreenComponent implements OnInit {

  displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'recruiter', 'prmRecruiter', 'primarySkill',
    'offerDate', 'joiningDate',
    //'modifiedOn', 
    'isTidReopened', 'dormantStatus', 'approveStatus', 'action'];
  private thId: string;
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: string = '';
  public paginationData: any;
  public candidateList: ICandidateOfferListDetails[] = [];
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public isTransEnableForIndia: boolean = false;
  public isTransEnableForUS: boolean = false;
  public cidColName: string = AtsCommonPrefix.CidColName;
  public cidPrefix: string = AtsCommonPrefix.CidPrefix;
  private refreshSubscription: Subscription;
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
    private getLocInfo: GetLocationInfo,
    private _onboard: OnboardService,
  ) {
  }
  public specialLogin: boolean = false;
  
  public locationIdsForIndia: number[] = this.getLocInfo.getIndiaLocationIds();
  ngOnInit() {
    this.showHideLocWise();
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
    
  this.locationIdsForIndia = this.getLocInfo.getIndiaLocationIds();
    // this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
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

  /**show/hide locationwise */
  public isVisibleForIndia: boolean = false;
  public isVisibleForUS: boolean = false;
  showHideLocWise() {
    if (this.getLocInfo.isLocationIndia()) {
      this.isTransEnableForIndia = true;
      this.isTransEnableForUS = false;
      this.isVisibleForIndia = true;
      this.isVisibleForUS = false;
    } else if (this.getLocInfo.isLocationUS()) {
      this.isVisibleForIndia = false;
      this.isVisibleForUS = true;
      this.isTransEnableForIndia = false;
      //As transfer with tc is currently not applicable for US
      this.isTransEnableForUS = false;
    }
    else {
      this.isVisibleForIndia = false;
      this.isTransEnableForIndia = false;
      this.isTransEnableForUS = false;
      this.isVisibleForUS = false;
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
      recruiterId: [[]],
      practiceId: [[]],
      location: [[]],
    })
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
    if (sortParam.recruiterId && sortParam.recruiterId.length !== 0) {
      let recIds = sortParam.recruiterId.filter(n => n);
      body['recruiterId'] = recIds.toString();
    }

    if (sortParam.primarySkill && sortParam.primarySkill.length !== 0) {
      let Ids = sortParam.primarySkill.filter(n => n);
      body['primarySkill'] = Ids.toString();
    }

    if (sortParam?.practiceId && sortParam?.practiceId.length !== 0) {
      let Ids = sortParam?.practiceId.filter(n => n);
      body['practiceId'] = Ids.toString();
    }
    if (sortParam.location && sortParam.location.length !== 0) {
      let locationIds = sortParam.location.filter(n => n);
      body['location'] = locationIds.toString();
    }

    this.bodyParam = body;
    const locId = this._globalCommonMethod.getSetLocation().locId;
    /**us landing listing api */
    if (this.getLocInfo.isLocationUS()) {
      console.log("US listing api")
      this._offerServe.getSendOfferUS(body).subscribe(
        res => {
          this.candidateList = res['data'];
          this.paginationData = res['pagination'][0];

        }
      )
      /**other india etc landing listing api */
    } else {
      console.log("India listing api")
      this._offerServe.getSendOffer(body).subscribe(
        res => {
          this.candidateList = res['data'];
          this.paginationData = res['pagination'][0];

        }
      )
    }


  }

  /***
   * generateOffer by recruiter
   */
  generateOffer(elm: ICandidateOfferListDetails) {
    const dialogRef = this.dialog.open(ViewGenerateOfferComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.paginatorCompRef.paginator.pageIndex = 0;
          this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    )

  }

  /***
   * generateOffer by recruiter
   */
  generateOfferUS(elm: ICandidateOfferListDetails) {
    const dialogRef = this.dialog.open(UsGenerateOfferModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.paginatorCompRef.paginator.pageIndex = 0;
          this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    )

  }
  //offer generation confirmation modal
  offerGenerationConfirmationModal(element: any) {
    const locId = this._globalCommonMethod.getSetLocation().locId;
    this._globalApiServe.checkTalentIdStatus(element.th_id).subscribe(
      res => {
        if (res['data'][0].status === 'closed') {
          this._share.showAlertErrorMessage.next(element.talent_id + ' Talent Id is closed.Please transfer candidate to other active talent Id to generate offer.')
        }
        else {
          /**opening US offer generation modal */
          if (this.getLocInfo.isLocationUS()) {
            //this.generateOfferUS(element);
            this.USmethodForOpenOfferLetterGeneration(element)
          } else {
            /**opening india offer generation modal */
            this.methodForOpenOfferLetterGeneration(element);
          }
        }

      })

  }
  /** method for india loc */
  methodForOpenOfferLetterGeneration(element: any) {

    // if (element?.OfferGenerateBy === 'A') {
    //   this.generateOffer(element);

    // }
    // else if (element?.OfferGenerateBy === 'M') {
    //   this.generateOfferManual(element);
    // }
    // else {
    const dialogRef = this.dialog.open(OfferGenerationConfirmationModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'confirmation-offer-m'],
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'A') {
          this.generateOffer(element);
        }
        else {
          this.generateOfferManual(element);
        }
      }
    });
    // }
  }

  /** method for US loc */
  USmethodForOpenOfferLetterGeneration(element: any) {
    console.log(element);
    // if (element?.OfferGenerateBy === 'A') {
    //   // this.generateOffer(element);
    //   this.generateOfferUS(element);
    // }
    // else if (element?.OfferGenerateBy === 'M') {
    //   // this.generateOfferManual(element);
    //   this.USgenerateOfferManual(element);
    // }
    // else {
    // if (element?.CandidateTypeID == 14 || element?.CandidateTypeID == 1010) {
    //   this.USgenerateOfferManual(element)
    // } else {
    //   this.generateOfferUS(element);
    // }
    const dialogRef = this.dialog.open(OfferGenerationConfirmationModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'confirmation-offer-m'],
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'A') {
          this.generateOfferUS(element);
        }
        else {
          // this.generateOfferManual(element);
          this.USgenerateOfferManual(element)
        }
      }
    });
    // }
  }
  /**manual offer generat India */
  generateOfferManual(elm: ICandidateOfferListDetails) {
    const dialogRef = this.dialog.open(UploadManualOfferModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.paginatorCompRef.paginator.pageIndex = 0;
          this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    )
  }

  /**manual offer generat US */
  USgenerateOfferManual(elm: ICandidateOfferListDetails) {
    const dialogRef = this.dialog.open(UsUploadManualOfferModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.paginatorCompRef.paginator.pageIndex = 0;
          this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
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
    this.http.get(`${environment.apiMainUrlNet}Offer/DownloadOffer?cid=${elm.cid}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'offer_letter_' + elm?.Name + '_' + elm?.talent_id + '_' + todayDate + '.pdf');
        this._share.showAlertSuccessMessage.next('Offer letter  downloaded successfully.')
      }
    )
  }

  /**
   * update offer status Modal 
   * @param elm 
   */
  updateOffer(elm: ICandidateOfferListDetails) {
    if (this.getLocInfo.isLocationUS()) {
      elm['title'] = 'Update Offer Status';
      const dialogRef = this.dialog.open(UpdateOfferStatusComponent, {
        panelClass: ['ats-model-wrap', 'ats-model-full-screenss'],
        data: elm,
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
    else {
      if (
        (
          elm?.OnboardStatusId == 10 ||
          (elm?.OnboardStatusId == 30 && elm?.IsStatusEnable == 0) ||
          elm?.OnboardStatusId == 20
        ) &&
        elm?.IsObnoardApplicable == 1) {
        this._globalCommonMethod.showMessagedisplay({
          title: 'Offer Status Update',
          autoHide: false,
          msg: `
        <p>Offer status can not be updated before EAF is verified by recruiter.</p>`
        });
      } else {
        elm['title'] = 'Update Offer Status';
        const dialogRef = this.dialog.open(UpdateOfferStatusComponent, {
          panelClass: ['ats-model-wrap', 'ats-model-full-screenss'],
          data: elm,
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
    }

  }

  /**
  * update offer status Modal 
  * @param elm 
  */
  updateAddress(elm: ICandidateOfferListDetails) {
    elm['title'] = 'Update current address for shipping items to candidate';
    const dialogRef = this.dialog.open(UpdateConfirmShippingAddressComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-up-ad'],
      data: elm,
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

  /**showing tooltip accourding to condition */
  totltipOfferPreview(elm: any) {
    //
    let tooltip: string = '';
    if (this.getLocInfo.isLocationIndia()) {
      if (elm.OfferStatusID === 120) {
        tooltip = 'Preview and Send Offer';
      }
      else {
        tooltip = 'Preview Offer';
      }
    }
    else if (this.getLocInfo.isLocationUS()) {
      // if (elm.OfferStatusID === 120) {
      //   tooltip = 'Preview and Send Offer To HR';
      // }
      // else if (elm.OfferStatusID === 130) {
      //   tooltip = 'Preview and Send Offer To Candidate';
      // }
      // else {
      //   tooltip = 'Preview Offer';
      // }

      /**120 offer generated */
      if (elm.OfferStatusID === 120) {
        tooltip = 'Preview and Send Offer To HR';
      }
      /**130 approved by hr */
      else if (elm.OfferStatusID === 130) {
        // note- 1010 direct contractor and 14 corp to corp -hiding send offer to candiddate button
        if (elm?.CandidateTypeID == 1010 || elm?.CandidateTypeID == 14) {
          tooltip = 'Preview Offer';
        } else {
          tooltip = 'Preview and Send Offer To Candidate';
        }
      }
      else {
        tooltip = 'Preview Offer';
      }

    }

    return tooltip;
  }

  /**
   * preview and send offer modal
   * @param elm 
   */
  previewandSendOffer(elm: any) {

    if (this.getLocInfo.isLocationIndia()) {
      this.previewOfferOptionForIndia(elm);
    }
    else if (this.getLocInfo.isLocationUS()) {
      this.previewOfferOptionForUs(elm);
    }
    else {
      this._share.showAlertErrorMessage.next('Location not found.')
    }

  }

  /**preview /send/ pdf offer modal for india */
  previewOfferOptionForIndia(elm: any) {
    if (elm.OfferStatusID === 120) {
      elm['title'] = 'Preview and Send Offer';
    }
    else {
      elm['title'] = 'Preview Offer';
    }

    const dialogRef = this.dialog.open(SendPreviewOfferModalComponent, {
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
          this.paginatorCompRef.paginator.pageIndex = 0;
          this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }

  /**preview /send/ approve pdf offer modal for india */
  previewOfferOptionForUs(elm: any) {
    if (elm.OfferStatusID === 120) {
      elm['title'] = 'Preview and Send Offer To HR';
      elm['actionFor'] = 'H';
    }
    else if (elm.OfferStatusID === 130) {
      // note- 1010 direct contractor and 14 corp to corp -hiding send offer to candiddate button
      if (elm?.CandidateTypeID == 1010 || elm?.CandidateTypeID == 14) {
        elm['title'] = 'Preview Offer';
      } else {
        //tooltip = 'Preview and Send Offer To Candidate';
        elm['title'] = 'Preview and Send Offer To Candidate';
        elm['actionFor'] = 'C';
      }

    }
    else {
      elm['title'] = 'Preview Offer';
    }

    const dialogRef = this.dialog.open(UsSendPreviewOfferModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    // dialogRef.afterClosed().subscribe(
    //   res => {
    //     if (res) {
    //       this.paginatorCompRef.paginator.pageIndex = 0;
    //       this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
    //     }
    //   }
    // );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paginatorCompRef.paginator.pageIndex = 0;
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
      }
    });
  }

  transferScheduledCandidate(element: any) {
    if (element?.OfferStatusID == 200) {
      this._share.showAlertErrorMessage.next('You can not transfer candidate after Candidate Joined.');
    }
    else {
      element['title'] = "Transfer to Other Talent ID";
      // const dialogRef = this.dialog.open(SelectedCandidateTransferModalComponent, {
      //   width: '500px',
      //   panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
      //   data: element,
      //   disableClose: true
      // });

      // const dialogRef = this.dialog.open(SelectedCandidateTransferWithTcModalComponent, {
      //   panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      //   maxWidth: '100vw',
      //   maxHeight: '100vh',
      //   height: '100%',
      //   width: '100%',
      //   // panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
      //   data: element,
      //   disableClose: true
      // });

      // dialogRef.afterClosed().subscribe(result => {
      //   if (result) {
      //     this.paginatorCompRef.paginator.pageIndex = 0;
      //     this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
      //   }
      // });

      if (this.isTransEnableForIndia && element?.isSupportHiring == 'N') {
        // const dialogRef = this.dialog.open(SelectedCandidateTransferModalComponent, {        
        const dialogRef = this.dialog.open(SelectedCandidateTransferWithTcModalComponent, {
          panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%',
          // panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
          data: element,
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result?.flag) {
            this.paginatorCompRef.paginator.pageIndex = 0;
            this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
            if (result?.isReinitiationRequired == 1) {
              this.confirmReinitiationDialogBox(element);
            }
          }
        });
      } else {
        const dialogRef = this.dialog.open(SelectedCandidateTransferModalComponent, {
          panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
          data: element,
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.paginatorCompRef.paginator.pageIndex = 0;
            this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
          }
        });
      }
    }
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
  disableUpdateOfferCandidtionWise(elm: any) {
    /**for India location */

    if (this.getLocInfo.isLocationIndia()) {
      if (
        elm?.OfferStatusID == 120 ||
        elm?.OfferStatusID == 140 ||
        elm?.OfferStatusID == 160 ||
        elm?.OfferStatusID == 180 ||
        elm?.OfferStatusID == 270 ||
        elm?.OfferStatusID == 220) {
        return true
      }
      else {
        return false
      }
    }

    /**for us location */
    else {
      // if (
      //   elm?.OfferStatusID == 130 ||
      //   elm?.OfferStatusID == 140 ||
      //   elm?.OfferStatusID == 160 ||
      //   elm?.OfferStatusID == 180 ||
      //   elm?.OfferStatusID == 270 ||
      //   elm?.OfferStatusID == 220) {
      //   return true
      // }
      // else {
      //   return false
      // }
      /**normal condition for offer status */
      if (
        elm?.OfferStatusID == 130 ||
        elm?.OfferStatusID == 140 ||
        elm?.OfferStatusID == 160 ||
        elm?.OfferStatusID == 180 ||
        elm?.OfferStatusID == 270 ||
        elm?.OfferStatusID == 220) {
        return true
      }
      /** enable for c2c and direct contractor || when status is genereted or offer approved  */
      if (
        (elm?.CandidateTypeID == 14 ||
          elm?.CandidateTypeID == 15) &&
        (elm?.OfferStatusID == 100 ||
          elm?.OfferStatusID == 120)
      ) {
        return true
      }
      else {
        return false
      }


    }

  }
  // else if ((elm?.CandidateTypeID == 14 && elm?.OfferStatusID == 100 || elm?.OfferStatusID == 120 || elm?.OfferStatusID == 180 || elm?.OfferStatusID == 140 || elm?.OfferStatusID == 160)) {
  //   return true
  // }
  // else {
  //   return false
  // }
  /**
  * diable Method
  * @param elm 
  * @returns 
  */
  disableGenOfferCandidtionWise(elm: any) {
    if (this.getLocInfo.isLocationIndia()) {
      if (
        //  elm?.OfferStatusID == 180 ||
        elm?.OfferStatusID == 220 ||
        elm?.OfferStatusID == 200 ||
        elm?.OfferStatusID == 160
      ) {
        return true
      }
      else {
        return false
      }
    }
    /**for US */
    else {
      if (
        //  elm?.OfferStatusID == 180 ||
        elm?.OfferStatusID == 220 ||
        elm?.OfferStatusID == 200 ||
        elm?.OfferStatusID == 160 ||
        elm?.OfferStatusID == 125
      ) {
        return true
      }
      else {
        return false
      }
    }

  }

  offerPreviewHideShowButton(elm: any) {
    // for india
    if (this.getLocInfo.isLocationIndia()) {
      if (
        elm?.OfferStatusID == 120 ||
        elm?.OfferStatusID == 140 ||
        elm?.OfferStatusID == 160 ||
        elm?.OfferStatusID == 180 ||
        elm?.OfferStatusID == 200) {
        return true
      }
      else {
        return false
      }
    }
    /**US */
    else {
      if (
        elm?.OfferStatusID == 120 ||
        elm?.OfferStatusID == 140 ||
        elm?.OfferStatusID == 160 ||
        elm?.OfferStatusID == 180 ||
        elm?.OfferStatusID == 200 ||
        elm?.OfferStatusID == 125 ||
        elm?.OfferStatusID == 130) {
        return true
      }
      else {
        return false
      }
    }

  }

  agreementPreviewHideShowButton(elm: any) {
    // for india
    if (this.getLocInfo.isLocationUS()) {
      if (
        elm?.OfferStatusID == 120 ||
        elm?.OfferStatusID == 140 ||
        elm?.OfferStatusID == 160 ||
        elm?.OfferStatusID == 180 ||
        elm?.OfferStatusID == 200 ||
        elm?.OfferStatusID == 125 ||
        elm?.OfferStatusID == 130) {
        return true
      }
      else {
        return false
      }
    }
    else {
      return false
    }


  }

  /**preview Emp Agreement */
  previewEmpAgr(elm: any = {}) {
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

  isConfirmAddress(element: any) {
    if ((element?.joinDateDiffInDays <= 7 && element?.isShippingAddrConfirm === 0) &&
      (element?.OfferStatusID == 120 ||
        element?.OfferStatusID == 140 ||
        element?.OfferStatusID == 180) && this.getLocInfo.isLocationIndia()) {
      return true
    }
    else {
      return false
    }
  }


  /**send for hr approval */
  hrApprovalOpen(elm: ICandidateOfferListDetails) {
    if (elm.OfferStatusID === 120) {
      elm['title'] = 'Preview and Send Offer';
    }
    else {
      elm['title'] = 'Preview Offer';
    }

    const dialogRef = this.dialog.open(UsSendPreviewOfferModalComponent, {
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
          // this.paginatorCompRef.paginator.pageIndex = 0;
          // this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }



  //export offer generation report in  excel
  exportAsXLSX() {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this.http.post(`${environment.apiMainUrlNet}Offer/ExportToExcelApprovedCandidateList`, bodyData, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'Offer_Generation_Report.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }

  sendForApproval(elm: any) {
    elm['title'] = "Re-Initiate Offer Approval";
    this._globalApiServe.checkTalentIdStatus(elm.th_id).subscribe(
      res => {
        if (res['data'][0].status === 'closed') {
          this._share.showAlertErrorMessage.next(elm.talent_id + ' Talent Id is closed.Please transfer candidate to other active talent Id to create offer.')
        }
        else {
          const locId = this._globalCommonMethod.getSetLocation().locId;
          let dialogRef: any;
          if (locId == 3) {
            dialogRef = this.dialog.open(SendForApprovalModalUsComponent, {
              panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
              data: elm,
              maxWidth: '100vw',
              maxHeight: '100vh',
              height: '100%',
              width: '100%'
            });
          }
          else {
            dialogRef = this.dialog.open(SendForApprovalModalComponent, {
              panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
              data: elm,
              maxWidth: '100vw',
              maxHeight: '100vh',
              height: '100%',
              width: '100%'
            });

          }

          dialogRef.afterClosed().subscribe(
            result => {
              if (result) {
                this.paginatorCompRef.paginator.pageIndex = 0;
                this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
              }
            }
          )

        }
      }
    )


  }

  //confirmation to re-initiate offer right now
  confirmReinitiationDialogBox(elm: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Do you want to Re-Initiate Offer Approval right now ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sendForApproval(elm);
      }
    });
  }
  /***

   * export excel

   */

  exportAsXLSXoffer(): void {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }

    //let queryString = `page=1&pageSize=${this.paginationData?.Total}${this.searchInput ? '&search=' + this.searchInput : ''}${this.sortParam ? this.sortParam : ''}${this.sortTable ? this.sortTable : ''}`;

    //  let queryString = `page=1&pageSize=${this.paginationData?.Total}`;

    this._offerServe.GetApprovedCandidatesListReport(bodyData).subscribe(

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

            'I9 Representative': candidateList[key].I9Representative,

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

            'Total Experience': candidateList[key].TotalExperience + ' ' + 'Years',

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
        this._excelService.exportAsExcelFile(filterDataExcel, 'OfferGenerationReport');

      }

    )
  }

  showActionBtnFrReopened(element: any) {
    if ((element?.OfferStatusID == 100) && element?.IsTidReopened == 1 && this.getLocInfo.isLocationIndia()) {
      return true
    }
    else {
      return false
    }
  }
}

