import { Component, OnInit, ViewChild } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { HttpClient } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { saveAs } from "file-saver";
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { AtsCommonPrefix, SPECIALACCESSUSER } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { DatePipe } from '@angular/common';
import { ICandidateOfferListDetails } from '../../../core/models/offer-model';
import { OfferGenerationConfirmationModalComponent } from '../../modals/offer-generation-confirmation-modal/offer-generation-confirmation-modal.component';
import { ViewOfferApprovalDetailsComponent } from '../../modals/view-offer-approval-details/view-offer-approval-details.component';
import { UpdateOfferStatusComponent } from '../../modals/update-offer-status/update-offer-status.component';
import { UpdateConfirmShippingAddressComponent } from '../../modals/update-confirm-shipping-address/update-confirm-shipping-address.component';
import { SendPreviewOfferModalComponent } from '../../modals/send-preview-offer-modal/send-preview-offer-modal.component';
import { SelectedCandidateTransferModalComponent } from '../../modals/selected-candidate-transfer-modal/selected-candidate-transfer-modal.component';
import { G5OfferService } from '../g5-offer.service';
import { OfferGenScreenModalComponent } from './offer-gen-screen-modal/offer-gen-screen-modal.component';
import { ManualOfferGenScreenModalComponent } from './manual-offer-gen-screen-modal/manual-offer-gen-screen-modal.component';

@Component({
  selector: 'app-approved-offer-candidate-list',
  templateUrl: './approved-offer-candidate-list.component.html',
  styleUrls: ['./approved-offer-candidate-list.component.scss'],
  providers: [DatePipe]
})
export class ApprovedOfferCandidateListComponent implements OnInit {
  displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'recruiter', 'prmRecruiter', 'primarySkill',
  'offerDate', 'joiningDate','isTidReopened',
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
/** Paginator Reference */
@ViewChild('paginatorRef', { static: true }) paginatorCompRef;
constructor(
  public dialog: MatDialog,
  private _storage: GetSetStorageService,
  private _fb: UntypedFormBuilder,
  private http: HttpClient,
  private _share: ShareService,
  private _globalApiServe: GlobalApisService,
  public datepipe: DatePipe,
  private _offerG5Serve: G5OfferService
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
  this.filterFormInit();
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
    recruiterId: [[]],

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


  this.bodyParam = body;
  this._offerG5Serve.getApprovedG5AboveCandidatesList(body).subscribe(
    res => {
      this.candidateList = res['data'];
      this.paginationData = res['pagination'][0];

    }
  )
}

/***
 * generateOffer by recruiter
 */
generateOffer(elm: ICandidateOfferListDetails) {
  const dialogRef = this.dialog.open(OfferGenScreenModalComponent, {
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
  this._globalApiServe.checkTalentIdStatus(element.th_id).subscribe(
    res => {
      if (res['data'][0].status === 'closed') {
        this._share.showAlertErrorMessage.next(element.talent_id + ' Talent Id is closed.Please transfer candidate to other active talent Id to generate offer.')
      }
      else {
        if (element?.OfferGenerateBy === 'A') {
          this.generateOffer(element);
        }
        else if (element?.OfferGenerateBy === 'M') {
          this.generateOfferManual(element);
        }
        else {
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
        }

      }

    })

}

generateOfferManual(elm: ICandidateOfferListDetails) {
  const dialogRef = this.dialog.open(ManualOfferGenScreenModalComponent, {
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

/**
 * preview and send offer modal
 * @param elm 
 */
previewandSendOffer(elm: ICandidateOfferListDetails) {
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

transferScheduledCandidate(element: any) {
  if (element?.OfferStatusID == 200) {
    this._share.showAlertErrorMessage.next('You can not transfer candidate after Candidate Joined.');
  }
  else {
    element['title'] = "Transfer to Talent ID";
    const dialogRef = this.dialog.open(SelectedCandidateTransferModalComponent, {
      width: '500px',
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
  if (
    elm?.OfferStatusID == 120 ||
    elm?.OfferStatusID == 140 ||
    elm?.OfferStatusID == 160 ||
    elm?.OfferStatusID == 180 ||
    elm?.OfferStatusID == 220) {
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
disableGenOfferCandidtionWise(elm: any) {
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

offerPreviewHideShowButton(elm: any) {
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

isConfirmAddress(element: any) {
  if ((element?.joinDateDiffInDays <= 7 && element?.isShippingAddrConfirm === 0) &&
    (element?.OfferStatusID == 120 ||
      element?.OfferStatusID == 140 ||
      element?.OfferStatusID == 180)) {
    return true
  }
  else {
    return false
  }
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


}
