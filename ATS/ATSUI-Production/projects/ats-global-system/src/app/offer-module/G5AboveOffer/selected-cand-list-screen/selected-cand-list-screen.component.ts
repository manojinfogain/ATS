import { Component, OnInit, ViewChild } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { AtsCommonPrefix, SPECIALACCESSUSER } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { saveAs } from "file-saver";
import { OfferService } from '../../offer.service';
import { InterviewCommonService } from '../../../core/services/interview-common.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { SendForApprovalModalComponent } from '../../modals/send-for-approval-modal/send-for-approval-modal.component';
import { ApprovalActionModalComponent } from '../../modals/approval-action-modal/approval-action-modal.component';
import { ViewOfferApprovalDetailsComponent } from '../../modals/view-offer-approval-details/view-offer-approval-details.component';
import { SelectedCandidateTransferModalComponent } from '../../modals/selected-candidate-transfer-modal/selected-candidate-transfer-modal.component';
import { OfferReasonForDropComponent } from '../../modals/offer-reason-for-drop/offer-reason-for-drop.component';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { G5OfferService } from '../g5-offer.service';
import { CandidateOfferApprovalModalComponent } from './candidate-offer-approval-modal/candidate-offer-approval-modal.component';
import { OfferApproveActionModalComponent } from './offer-approve-action-modal/offer-approve-action-modal.component';
import { OnboardingSendCredConfirmationDialogComponent } from '../../../shared/shared-app/components/onboarding-send-cred-confirmation-dialog/onboarding-send-cred-confirmation-dialog.component';
import { CandidateCommonApiService } from '../../../core/services/candidate-common-api.service';



@Component({
  selector: 'app-selected-cand-list-screen',
  templateUrl: './selected-cand-list-screen.component.html',
  styleUrls: ['./selected-cand-list-screen.component.scss']
})
export class SelectedCandListScreenComponent implements OnInit {
  displayedColumns = ['talentId', 'Cid', 'CandidateName', 'primarySkill', 'EmailID', 'PhoneNo', 'recruiter','isTidReopened',
  'approveStatus', 'action'];
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
  private _offerServe: OfferService,
  private _offerG5Serve: G5OfferService,
  private _globalApiServe: GlobalApisService,
  private _share: ShareService,
  private _http: HttpClient,
  private _interCommon: InterviewCommonService,
  private _candCommServe: CandidateCommonApiService,
  private _globalCommonMethod: GlobalCommonMethodService
) {
}
// if(getTokenRole == "4" && user?.otherRoles?.IsApprover === 'Y')
public specialLogin: boolean = false;
ngOnInit() {
  this.userData = this._storage.getSetUserData();
  let empId = this._storage.getUserEmpId();
  let isUserValid = SPECIALACCESSUSER.offerAccesRight.filter(r => r.empId === parseInt(empId));
  if (isUserValid.length !== 0) {
    this.specialLogin = true;
  }
  else {
    this.specialLogin = false;
  }

  if (this.userData) {
    if (this.userData.RoleId === 0 && this.userData?.otherRoles?.IsApprover === 'Y' || this.userData.RoleId === 4 && this.userData?.otherRoles?.IsApprover === 'Y') {
      this.displayedColumns = ['talentId', 'Cid', 'CandidateName', 'accountName', 'projectName', 'recruiter', 'primarySkill',
        'offerDate', 'joiningDate','isTidReopened',
        'approveStatus', 'dropReason', 'action'];
    }
    else {
      this.displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'recruiter', 'prmRecruiter', 'primarySkill',
        'offerDate', 'joiningDate','isTidReopened',
        'approveStatus', 'dropReason', 'action'];
    }
  }
  this.sortParam = '&intStatus=4'
  // this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null,this.sortParam);
  this.filterFormInit();
  //  this.sendForApproval(null)
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
    pendingWithMe: [null],
    dateFrom: [null],
    dateTo: [{ value: null, disabled: true }],
    dateStart: [null],
    dateEnd: [{ value: null, disabled: true }],
    recruiterId: [[]],
    subListType: [[]],
  })
}


public bodyParam: any = {};
getCandidateListByTalentId(page: number, pageSize: number, search: any, sortParam: any) {
  // let queryString = `${this.thId?'thid='+this.thId+'&':''}page=${page}&pageSize=${pageSize}&search=${search ? search.trim():''}${sortParam?sortParam:''}`;
  this.bodyParam = {};
  let body = {
    page: page,
    pageSize: pageSize
  }
  if (sortParam?.dateFrom) {
    body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
  }
  if (sortParam.pendingWithMe == true) {
    body['pendingWithMe'] = '1';
    //console.log("arrarrr", sortParam.pendingWithMe.toString())
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

  //sub status
  if (sortParam.subListType && sortParam.subListType.length !== 0) {
    let offerstatusIds = sortParam.subListType.filter(n => n);
    body['dropResonId'] = offerstatusIds.toString();
  }

  this.bodyParam = body;
  this._offerG5Serve.getSelectedG5AboveCandidateList(body).subscribe(
    res => {
      this.candidateList = res['data'];
      this.paginationData = res['pagination'][0];
    }
  )
}

/***
 * evidoe match check before offer
 */
approvalSend(elm: any) {
  this._interCommon.getCandidateFeebackEnableStatusByCid(elm.cid).subscribe(
    vidRes => {
      let vidData = vidRes['VideoInt'][0];
      let statusData = vidRes['data'][0];
      if (statusData?.IsExceptionVideo == 'Y') {
        this.sendForApproval(elm);
      } else {
        if (vidData?.IsVideoMatchExist == 'N') {
          this._globalCommonMethod.showMessagedisplay({
            title: 'Video image  comparison processing in progress',
            autoHide: false,
            msg: `
           <p>Video comparison HR final round is in progress.Please check after sometime.</p>`
          });
          
        }
        else if (vidData?.IsIntScheduleEnable == 'Y' && vidData?.IsVideoMatchExist == 'Y') {
          this.sendForApproval(elm);
        }
        else {
          this._globalCommonMethod.showMessagedisplay({
            title: 'Alert',
            autoHide: false,
            msg: `
           <p>Candidate HR final round video not aligned with previous round video.</p>`
          });
        }
      }
    }
  )
}

/***
 * send approval by recruiter
 */
sendForApproval(elm: any) {
  elm['title'] = "Send For Approval";
  if (elm.OfferStatusID === 120 ||
    elm.OfferStatusID === 140 ||
    elm.OfferStatusID === 160 ||
    elm.OfferStatusID === 180) {
    elm['title'] = "Revised offer letter";
  }
  this._globalApiServe.checkTalentIdStatus(elm.th_id).subscribe(
    res => {
      if (res['data'][0].status === 'closed') {
        this._share.showAlertErrorMessage.next(elm.talent_id + ' Talent Id is closed.Please transfer candidate to other active talent Id to create offer.')
      }
      else {
        elm['IsAppeoveEdit'] = 'N';
        const dialogRef = this.dialog.open(CandidateOfferApprovalModalComponent, {
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
    }
  )


}

/***
 * action by approver
 */
approvalAction(elm: any) {
  
  let empId = this._storage.getUserEmpId();
  // check If renu for approval with change in offer details 
   if(empId == '106996' && elm.OfferStatusID === 20){
      elm['IsApproveEdit'] = 'Y';
      elm['title'] = "Update and Approve Offer";
      const dialogRef = this.dialog.open(CandidateOfferApprovalModalComponent, {
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
   else{
    const dialogRef = this.dialog.open(OfferApproveActionModalComponent, {
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
 
}

tooltipCandidtionWise(elm: any) {
  if (elm.OfferStatusID === 120 ||
    elm.OfferStatusID === 140 ||
    elm.OfferStatusID === 160 ||
    elm.OfferStatusID === 180 ||
    elm.OfferStatusID === 100 ||
    elm.OfferStatusID === 220)  {
    return 'Revised offer letter'
  }
  else {
    return 'Send for Approval'
  }
}

disableSendOfferBtnCandidtionWise(elm: any) {
  if (elm?.OfferStatusID == 20 ||
    elm?.OfferStatusID == 40 ||
    elm?.OfferStatusID == 45 ||
    elm?.OfferStatusID == 60 ||
    elm?.OfferStatusID == 65 ||
    elm?.OfferStatusID == 80 ||
    elm?.OfferStatusID == 150 ||
    elm?.OfferStatusID == 200) {
    return true
  }
  else {
    return false
  }
}

/**
 * transfer talent Id Method
 * @param element 
 */

transferCandidateToTalent(element: any) {

}

downloadPDF(elm: any) {

}
/***
 * view offer/approval Details
 */

openofferApprovalDetailsModal(elm: any) {
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

/**
* show interview round details
* @param data 
*/
openfeedbackInfoModal(data: any) {
  const dialogRef = this.dialog.open(FeedbackRoundDetailsComponent, {
    width: '500px',
    panelClass: ['ats-model-wrap', 'update-interview-feedback'],
    data: data,
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
    }
  });
}

transferScheduledCandidate(element: any) {
  // condition wise transfer
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

//export offer generation report in  excel
exportAsXLSX() {
  let bodyData = {
    ...this.bodyParam,
    page: 1,
    pageSize: this.paginationData?.Total,
  }
  this._http.post(`${environment.apiMainUrlNet}Offer/ExportToExcelSelectedCandidatesList`, bodyData, { responseType: 'blob' }).subscribe(
    res => {
      saveAs(res, 'Candidate_Records.xls');
    },
    (error) => {
      this._share.showAlertErrorMessage.next('Something went wrong');
    }
  )
}

//offer reason for drop
openOfferReasonForDropModal(element: any, type: number) {
  //this.jumpFirstPage = false;
  element['title'] = "Reason for Drop";
  element['type'] = type;
  const dialogRef = this.dialog.open(OfferReasonForDropComponent, {
    width: '500px',
    panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
    data: element,
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
    }
  });
}

/***
 * Credentials SendTo Candidate
 */
public candiData: any = {};
confirmCredentialsSendToCandidate(element: any) {
  // // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //   const dialogRef = this.dialog.open(OnboardingSendCredConfirmationDialogComponent, {
  //   panelClass: 'ats-confirm',
  //   data: {
  //     joiningLocationId: element?.JoiningLocationID,
  //     divisionId: element?.DivisionId,
  //     headerText: 'Alert',
  //     message: ` Please choose the joining location and confirm if you want to send credentials to <span class='u-name'>${element?.Name}</span> ?`,
  //     buttonText: {
  //       ok: "Yes",
  //       cancel: "No"
  //     },
  //   }
  // });

  // dialogRef.afterClosed().subscribe(result => {
  //   if (result?.flag) {
  //     let body: any = {
  //       cid: element.cid,
  //       JoiningLocationId: result?.locationId,
  //       DivisionId: result?.divisionId
  //     }
  //     this._offerServe.CreateCandidateUser(body).subscribe(
  //       res => {
  //         this._share.showAlertSuccessMessage.next(res);
  //         this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
  //       }
  //     )
  //   }

  // });

  this._candCommServe.getCandidateDetailsProfile(element?.cid).subscribe(
    res => {
      this.candiData = res['data'][0];
      console.log(this.candiData);
      
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      const dialogRef = this.dialog.open(OnboardingSendCredConfirmationDialogComponent, {
        panelClass: 'ats-confirm',
        data: {
          joiningLocationId: this.candiData?.JoiningLocationId, 
          packageId: this.candiData?.packageId,
          BGVVender: this.candiData?.BGVVender,
           freezeVendor: this.candiData?.freezeVendor,
          // divisionId: this.candiData?.DivisionIdOffer,
          headerText: 'Send Credentials',
            message: ` Please select joining location and BGV package for <span class='u-name'>${element?.Name}</span> and click send`,
            buttonText: {
              ok: "Send",
              cancel: "Cancel"
            },
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        debugger
        if (result?.flag) {
          let body: any = {
            //cid: element.cid,
            Candidateid: element.candidateId,
            JoiningLocationId: result?.locationId,
            PackageId: result?.packageId,
            BGVVenderId: result?.vendorId,
          }
          debugger
          this._offerServe.CreateCandidateUser(body).subscribe(
            res => {
              this._share.showAlertSuccessMessage.next(res);
              this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
            }
          )
        }
  
      });
    }
  )
}

/***
 * export excel
 */
//    exportAsXLSX():void {
//     let queryString = `${this.thId?'thid='+this.thId+'&':''}page=1&pageSize=${this.paginationData?.Total}&search=${this.searchInput ? this.searchInput.trim():''}${this.sortParam?this.sortParam:''}`;
//     this._offerServe.getSelectedCandidateList(queryString).subscribe(
//       res => {
//         let candidateList = res['data'];
//         let filterDataExcel = [];
//         for (var key in candidateList) {
//           let selectedData = {
//             'Talent ID': candidateList[key].talent_id,
//             'Skill': candidateList[key].primaryskill,
//             'Candidate Name': candidateList[key].Name,
//             'Phone No.': candidateList[key].phone,
//             'Email ID': candidateList[key].email,
//             'Recruiter': candidateList[key].recruiter,
//             'Offer Status': candidateList[key].OfferStatusName,
//           };
//           filterDataExcel.push(selectedData);

//         }
//         this._excelService.exportAsExcelFile(filterDataExcel,'CandidateRecords');
//       }
//     );
//  }

}
