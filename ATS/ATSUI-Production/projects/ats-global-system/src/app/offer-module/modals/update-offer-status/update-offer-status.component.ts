import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { forkJoin } from 'rxjs';
import { OfferService } from '../../offer.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { ViewOfferApprovalDetailsComponent } from '../view-offer-approval-details/view-offer-approval-details.component';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { TransferCandidateFormComponent } from 'projects/ats-global-system/src/app/interview-module/transfer-candidates/modal/transfer-candidate-form/transfer-candidate-form.component';
import { SelectedCandidateTransferModalComponent } from '../selected-candidate-transfer-modal/selected-candidate-transfer-modal.component';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { FILE_UPLOAD } from '../../../core/constant/common.const';

@Component({
  selector: 'app-update-offer-status',
  templateUrl: './update-offer-status.component.html',
  styleUrls: ['./update-offer-status.component.scss']
})
export class UpdateOfferStatusComponent implements OnInit {
  public updateOfferForm: UntypedFormGroup = new UntypedFormGroup({});
  public statusList: any;
  public declineCategoryList: any;
  public gradeList: any = [];
  public offerAprDt: any = [];
  public isHideDeclinCateg: boolean = false;
  public dcRequi: boolean = false;
  public isCandidateJoinee: boolean = false;
  public candidateJoinedList: any = [];
  public searchJoinedCandidate: string = '';
  public FilterCtrlCandidateJoined: UntypedFormControl = new UntypedFormControl();
  public joinedCandidateDetails: any = [];
  public isSubmitBtnDisabled: boolean = false;
  public userData: any = {};
  public maxDateResche: any = new Date(new Date().setDate(new Date().getDate() + 10));
  public minDateResche: any = new Date(new Date().setDate(new Date().getDate() - 10));
  // public minDate: any = new Date(new Date().setDate(new Date().getDate() - 6));
  displayedColumnsJoinedCandidate = ['candidateName', 'candidateEmail', 'candidatePhone', 'candidatestatus', 'action'];
  displayedColumns = ['approverType', 'approverName', 'ActionTaken', 'ActionTakenOn', 'ActionTakenBy', 'FromStatus', 'ToStatus', 'remarks'];
  constructor(
    public dialogRef: MatDialogRef<ViewOfferApprovalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _offerService: OfferService,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _globalApiServe: GlobalApisService,
    public _globalApi: GlobalApisService,
    public _share: ShareService,
    private _storage: GetSetStorageService,
    private getLocInfo: GetLocationInfo
  ) { }

  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    const today = new Date()
    let pastDate = new Date()
    this.offerStatusId = this.data?.OfferStatusID;
    debugger
    pastDate.setDate(today.getDate() - 7);
    this.minDate = pastDate;
    this.maxDate = today;
    this.getCandidateDetails();
    this.updateForm();
    this.GetInterviewStatus();
    this.getDeclineCategoryList();
    this.getJoinedCandidateList();
    // this.getCandidateListByTalentId();
  }



  //get Decline CategoryList
  getDeclineCategoryList() {
    this._offerService.getDeclineCategory().subscribe(
      res => {
        this.declineCategoryList = res.data;
      }
    )
  }

  /**get joined candidate list */
  getJoinedCandidateList() {
    this._globalApi.getJoinedCandidateList().subscribe(
      res => {
        this.candidateJoinedList = res['data']
      }
    )
    this.FilterCtrlCandidateJoined.valueChanges.subscribe(
      get => {
        this.searchJoinedCandidate = get;
        // this.allSelcount = false;   
      }
    )
  }

  /**get  candidate list by talent id*/
  public candidateListByTalent: any = [];
  public candidateListByTalentFiltered: any = [];
  getCandidateListByTalentId(type: boolean = false) {
    this._globalApi.getCandidateListByTalentId(this.data?.th_id).subscribe(
      res => {
        this.candidateListByTalent = res['data'];
        var filterCandidate = res['data'].filter(user => user.cid != this.data?.cid);
        this.candidateListByTalentFiltered = filterCandidate;
        let candidateJoineedControl = this.getControl('JoinedEmpId');
        let DateOfJoiningControl = this.getControl('DateOfJoining');
        if (type) {
          if (this.candidateListByTalent.length > 1) {
            this.isSubmitBtnDisabled = true;
            this.isTransferedCandidateList = true;

          } else {
            this.isCandidateJoinee = true;
            this.isSubmitBtnDisabled = false;
            this.isTransferedCandidateList = false;
            candidateJoineedControl.setValidators([Validators.required]);
            DateOfJoiningControl.setValidators([Validators.required]);
            candidateJoineedControl.updateValueAndValidity();
            DateOfJoiningControl.updateValueAndValidity();
          }

        }
      }

    )

  }


  public minDate: any = new Date();
  public maxDate: any = new Date();
  //form control
  updateForm() {
    this.updateOfferForm = this._fb.group({
      offerStatus: [null, [Validators.required]],
      DateOfDecline: [null],
      declineCateg: [null],
      remarks: [null],
      JoinedEmpId: [null],
      DateOfJoining: [null],
      fileOffer: [null],
      fileEmploymentAgreement: [null],
      contractEmpOfferedDateUS: [null],
      contractEmpOffereGenerationDateUS: [null]
    })
  }

  //onchange offer status dropdown
  public isTransferedCandidateList: boolean = false;
  public isReqJoiningDate: boolean = true;
  public offerStatusId: number;
  offerStatusChange(elm: any) {
    this.offerStatusId = elm.value;
    let declineCtrControl = this.getControl('declineCateg');
    let remarkCtrControl = this.getControl('remarks');
    let declineDateControl = this.getControl('DateOfDecline');
    let candidateJoineedControl = this.getControl('JoinedEmpId');
    let DateOfJoiningControl = this.getControl('DateOfJoining');

    this.isTransferedCandidateList = false;
    this.isCandidateJoinee = false;
    this.isSubmitBtnDisabled = false;
    candidateJoineedControl.reset();
    declineCtrControl.reset();
    candidateJoineedControl.clearValidators();
    DateOfJoiningControl.clearValidators();
    DateOfJoiningControl.reset();
    this.isImpNoteForAllocate = false;
    debugger
    /**upload offer ltter and agreement method for manual US Offer */
    if (this.getLocInfo?.isLocationUS()) {
      this.uploadOfferAndEmployeAgreementMethodUS(elm?.value);
      this.showHideOfferDateForContractUS(elm?.value);
    }

    if (elm.value == 160) {
      this.isHideDeclinCateg = true;
      declineCtrControl.setValidators([Validators.required]);
      declineCtrControl.clearValidators();
      declineDateControl.setValidators([Validators.required]);
      declineDateControl.setValue(new Date());
      remarkCtrControl.setValue(this.offerAprDt.reasonfor_decline ? this.offerAprDt.reasonfor_decline : '');
      this.dcRequi = true;
      this.isCandidateJoinee = false;
    }
    /**candidate joined 200 id */
    else if (elm.value == 200) {
      /**showing doj and emp list in canddiate joine */
      this.isCandidateJoinee = true;
      candidateJoineedControl.setValidators([Validators.required]);
      DateOfJoiningControl.setValidators([Validators.required])
      // if (this.candidateListByTalent.length > 1) {
      //   this.isSubmitBtnDisabled = true;
      //   /**hinding transfer section for now */
      // //  this.isTransferedCandidateList = true;
      // this.isTransferedCandidateList = false;

      // } else {
      //   this.isCandidateJoinee = true;
      //   candidateJoineedControl.setValidators([Validators.required]);
      //   DateOfJoiningControl.setValidators([Validators.required])
      // }

      declineCtrControl.clearValidators();
      remarkCtrControl.clearValidators();
      declineDateControl.clearValidators();
      this.dcRequi = false;
      this.isHideDeclinCateg = false;
      this.isRequiRemark = false;
      remarkCtrControl.setValue(this.offerAprDt?.Remarks || '');
      this.getEmployeeAllotmentDetails();
    }
    else {
      declineCtrControl.clearValidators();
      remarkCtrControl.clearValidators();
      declineDateControl.clearValidators();
      this.dcRequi = false;
      this.isHideDeclinCateg = false;
      this.isRequiRemark = false;
      remarkCtrControl.setValue(this.offerAprDt?.Remarks || '');

    }
    declineCtrControl.updateValueAndValidity();
    remarkCtrControl.updateValueAndValidity();
    declineDateControl.updateValueAndValidity();
    candidateJoineedControl.updateValueAndValidity();
    DateOfJoiningControl.updateValueAndValidity();
  }

  /**capture offer and offeraccepted date for contract employe */
  // accepted 140 / offered 180
  public isOffereDateVisibleForUSc2c: boolean = false;
  public labelC2cOfferDate: string = '';
  public isOfferGeneratedDate: boolean = false;
  public minOfferedDate: any = new Date();
  public maxOfferGeneratDate: any = new Date();
  showHideOfferDateForContractUS(statusId: number) {
    // CandidateTypeID == 14 - c2c / 15 direct contractor
    if (this.data?.CandidateTypeID == 14 || this.data?.CandidateTypeID == 15) {
      this.getControl('contractEmpOfferedDateUS').reset();
      this.getControl('contractEmpOffereGenerationDateUS').reset();
      /* 
     offer accepted 140-
     offered 180  */
      debugger
      if (statusId == 140) {
        this.isOffereDateVisibleForUSc2c = true;
        this.labelC2cOfferDate = 'Offer Accepted Date';
        this.minOfferedDate = new Date(this.data?.CandOfferedDate);
        this.getControl('contractEmpOfferedDateUS').setValidators([Validators.required]);
        // this.getControl('contractEmpOfferedDateUS').patchValue(new Date());
        this.getControl('contractEmpOffereGenerationDateUS').clearValidators();
        this.isOfferGeneratedDate = false;

        if (this.data?.CandOfferAcceptDate && this.data?.CandOfferedDate) {
          const offerAcceptDate = new Date(this.data?.CandOfferAcceptDate);
          const offeredDate = new Date(this.data?.CandOfferedDate);
          debugger
          // Offer accept date is after the offered date
          /**we are not patching old passed date -if offere accepted date is from past date by offered date*/
          if (offerAcceptDate >= offeredDate) {
            this.getControl('contractEmpOfferedDateUS').setValue(this.data?.CandOfferAcceptDate ? GlobalMethod.formatDate(this.data?.CandOfferAcceptDate) : null);
          }
          // else {
          //   console.log('Offer accept date is not after the offered date.');
          // }
        }

      } else if (statusId == 180) {
        this.isOffereDateVisibleForUSc2c = true;
        this.labelC2cOfferDate = 'Offered Date';
        this.getControl('contractEmpOfferedDateUS').setValidators([Validators.required]);
        this.getControl('contractEmpOfferedDateUS').setValue(this.data?.CandOfferedDate ? GlobalMethod.formatDate(this.data?.CandOfferedDate) : null);

        this.getControl('contractEmpOffereGenerationDateUS').setValidators([Validators.required]);
        this.getControl('contractEmpOffereGenerationDateUS').setValue(this.data?.CandidateOfferGeneratedDate ? GlobalMethod.formatDate(this.data?.CandidateOfferGeneratedDate) : null);
        this.isOfferGeneratedDate = true;
        this.minOfferedDate = new Date(this.data?.CandidateOfferGeneratedDate);
        this.maxOfferGeneratDate = new Date();
      } else {
        this.getControl('contractEmpOfferedDateUS').clearValidators();
        this.getControl('contractEmpOffereGenerationDateUS').clearValidators();
        this.isOffereDateVisibleForUSc2c = false;
        this.isOfferGeneratedDate = false;
      }
      this.getControl('contractEmpOfferedDateUS').updateValueAndValidity();
      this.getControl('contractEmpOffereGenerationDateUS').updateValueAndValidity();
    }

  }

  // offerAcceptDateReset() {
  //   debugger

  // }


  /***
* change date offer generation
*/
  changeDateGeneration(event: any) {
    this.getControl('contractEmpOfferedDateUS').reset();
    this.minOfferedDate = new Date(event.value);
  }


  /**candidate joined employee  joined method*/
  public currentJoinedEmpDoj: any = [];
  public filteredEmpList: any = {};
  JoinedEmployeeListChange(elm: any) {
    this.currentJoinedEmpDoj = elm?.value?.EMP_DATEOFJOINING;
    //   let ar = this.candidateJoinedList.filter((a) =>{ 
    //     a.EmplyeeID == elm.value?.EmplyeeID
    // })

    let ar = this.candidateJoinedList.filter(x => x.EmplyeeID === elm.value);

    this.filteredEmpList = ar;
    this.getControl('DateOfJoining').setValue(this.filteredEmpList[0].EMP_DATEOFJOINING || '');

  }

  hideJoinDate(elm: any) {
    let DateOfJoining = this.getControl('DateOfJoining');
    // widthrawn/join/declined
    if (elm.value == 14 || elm.value == 8 || elm.value == 13) {
      DateOfJoining.clearValidators();
      this.isReqJoiningDate = false;
    }
    else {
      this.isReqJoiningDate = true;
      DateOfJoining.setValidators([Validators.required]);

    }

    DateOfJoining.updateValueAndValidity();
  }

  //onchange  remark required
  public isRequiRemark: boolean = false;
  remarkRequireChange(elm: any) {
    let remarkCtrControl = this.getControl('remarks');
    if (elm.value == 6) {
      remarkCtrControl.setValidators([Validators.required]);
      this.isRequiRemark = true;
    } else {
      remarkCtrControl.clearValidators();
      this.isRequiRemark = false;
    }
    remarkCtrControl.updateValueAndValidity();
  }

  //control for form
  getControl(name: string) {
    return this.updateOfferForm.get(name);
  }

  //get dropdown
  getGrade() {
    this._globalApiServe.getGradeList().subscribe(
      res => {
        this.gradeList = res['data']
      }
    );
  }

  //get joined candidate details
  public allowcateJoinedEmpDetails: any = [];
  public isEmpAllowcated: boolean = true;
  public isImpNoteForAllocate: boolean = false;
  getEmployeeAllotmentDetails() {
    this._globalApiServe.getEmployeeAllotmentDetails(this.data?.th_id).subscribe(
      res => {
        this.allowcateJoinedEmpDetails = res['data'][0]
        this.getControl('JoinedEmpId').patchValue(this.allowcateJoinedEmpDetails?.EMPID);
        this.getControl('DateOfJoining').patchValue(this.allowcateJoinedEmpDetails?.AllocationDate);
        if (this.allowcateJoinedEmpDetails) {
          this.isEmpAllowcated = true;
          this.isImpNoteForAllocate = false;
        } else {
          this.isEmpAllowcated = false;
          this.isImpNoteForAllocate = true;
        }
      }
    );
  }

  public joiningDate: any;
  getCandidateDetails() {
    forkJoin([
      this._offerService.getCandidateOfferAprDetails(this.data.cid)
    ]).subscribe(
      res => {
        this.offerAprDt = res[0]['data'][0];

        if (this.offerAprDt.StatusID === 140 ||
          this.offerAprDt.StatusID === 160 ||
          this.offerAprDt.StatusID === 180 ||
          this.offerAprDt.StatusID === 200 ||
          this.offerAprDt.StatusID === 220) {
          this.getControl('offerStatus').patchValue(this.offerAprDt.StatusID);
          /**upload offer ltter and agreement method for manual US Offer */
          if (this.getLocInfo?.isLocationUS()) {
            this.uploadOfferAndEmployeAgreementMethodUS(this.offerAprDt.StatusID);
            this.showHideOfferDateForContractUS(this.offerAprDt.StatusID);
          }
          if (this.offerAprDt.StatusID === 160) {
            this.isHideDeclinCateg = true;
            this.dcRequi = true;
            let declineCtrControl = this.getControl('declineCateg');
            let remarkCtrControl = this.getControl('remarks');
            let declineDateControl = this.getControl('DateOfDecline');
            declineCtrControl.setValidators([Validators.required]);
            declineCtrControl.clearValidators();
            declineDateControl.setValidators([Validators.required]);
            if (this.offerAprDt.declineCategoryID === 6) {
              remarkCtrControl.setValidators([Validators.required]);
              this.isRequiRemark = true;
            }
            declineDateControl.setValue(this.offerAprDt.offer_decline_date);
            declineCtrControl.setValue(this.offerAprDt.declineCategoryID);
            remarkCtrControl.setValue(this.offerAprDt.reasonfor_decline ? this.offerAprDt.reasonfor_decline : '');
            declineCtrControl.updateValueAndValidity();
            remarkCtrControl.updateValueAndValidity();
            declineDateControl.updateValueAndValidity();
          }
          else {
            this.getControl('remarks').setValue(this.offerAprDt?.Remarks || '');
          }
        }
        if (this.offerAprDt.tentativeJoiningDate) {
          this.joiningDate = this.offerAprDt.tentativeJoiningDate;
        }
        else {
          this.joiningDate = this.offerAprDt.DateOfJoining;
        }


      }
    )
  }

  /***
  * get Int Status
  */
  GetInterviewStatus(): void {
    this._globalApi.getAllOfferStatus().subscribe(
      res => {

        let filterById = [140, 160, 200, 180, 220]
        let filterByStatus = res['data'].filter(t => {
          return filterById.indexOf(t.statusId) !== -1;
        });

        debugger

        if ((this.data?.CandidateTypeID == 14 || this.data?.CandidateTypeID == 15) && this.getLocInfo?.isLocationUS()) {
          let allStatus = filterByStatus;
          // 100 approved,      
          // if (this.data?.OfferStatusID == 100) {
          //   let filterStatus = filterByStatus.filter(t => t.statusId == 180).map(t => {
          //     this.statusList = filterStatus;
          //   })
          // }
          // offered 180, 
          // 140, 160, 200, 180, 220
          //else
          if (this.data?.OfferStatusID == 180) {
            const filterIds = [180, 140, 160, 220];
            this.statusList = filterByStatus.filter(item => filterIds.includes(item.statusId));
          }
          // genereted 120 / approved 100/ approved by hr 130
          else if (this.data?.OfferStatusID == 120 || this.data?.OfferStatusID == 100 || this.data?.OfferStatusID == 130) {
            const filterIds = [180, 160, 220];
            this.statusList = filterByStatus.filter(item => filterIds.includes(item.statusId));
          }
          // offere accepted 140, 
          else if (this.data?.OfferStatusID == 140) {
            const filterIds = [180, 140, 160, 200, 220];
            this.statusList = filterByStatus.filter(item => filterIds.includes(item.statusId));
          }
          /** for dicline 160 / withrown 220 */
          else if (this.data?.OfferStatusID == 160 || this.data?.OfferStatusID == 220) {
            const filterIds = [180, 160, 220];
            this.statusList = filterByStatus.filter(item => filterIds.includes(item.statusId));
          }
        } else {
          this.statusList = filterByStatus;
        }
      }
    );
  }



  //update  submit 
  updateOfferHandler(form: UntypedFormGroup, updateOfferHandler: boolean) {
    if (form.valid) {
      debugger
      let formData = form.value;
      formData['cid'] = this.data.cid;
      formData['candidateId'] = this.data?.candidateid;

      if (formData.DateOfJoining) {
        formData.DateOfJoining = GlobalMethod.formatDate(formData.DateOfJoining);
      }
      if (formData.DateOfDecline) {
        formData.DateOfDecline = GlobalMethod.formatDate(formData.DateOfDecline);
      }

      // if (formData.candidateJoined) {
      //   formData.candidateJoined = formData.candidateJoined
      // }

      /**new offer date field for c2c */
      // offered 180
      debugger
      if (this.getControl('offerStatus').value == 180) {
        formData.offereddate = GlobalMethod.formatDate(formData.contractEmpOfferedDateUS);
        formData.offeredGenerationDate = GlobalMethod.formatDate(formData.contractEmpOffereGenerationDateUS);
      }
      // offer aceepted 140
      if (this.getControl('offerStatus').value == 140) {
        formData.offerAcceptanceDate = GlobalMethod.formatDate(formData.contractEmpOfferedDateUS);
      }

      /**c2c ends */
      /**candidate joined 200 */
      if (formData?.offerStatus == 200) {
        this.confirmOfferCandidateJoined(formData);
      } else {
        this.updateOfferStatusApiCall(formData, updateOfferHandler);
      }




    } else {
      form.markAllAsTouched();
      this._share.showAlertErrorMessage.next("Please fill all mandatory fields.");
    }
  }

  /**update offer api call */

  updateOfferStatusApiCall(formData: any, updateOfferHandler) {
    /**api call for India */
    if (this.getLocInfo?.isLocationIndia()) {
      this._offerService.updateOfferStatus(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    }
    /**api call for US */
    else {

      /**updateOfferHandler true is only for offer accepted for US location */
      debugger
      if (updateOfferHandler) {
        let formManual = new FormData();
        formManual.append('cid', this.data.cid);
        formManual.append('OfferLetter', this.offerLtterFile);
        formManual.append('fileAgr', this.employmentAgreementFile);
        formManual.append('ModifiedOnUTC', GlobalMethod.convertToUTCDate(new Date()));
        formManual.append('ModifiedOnTimeZone', GlobalMethod.getTimezone());
        formManual.append('ModifiedOnOffsetDate', GlobalMethod.getOffset().toString());
        this._offerService.UploadSignOfferUS(formManual).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
      }
      else {

        // formData.append('ModifiedOnUTC', GlobalMethod.convertToUTCDate(new Date()));
        // formData.append('ModifiedOnTimeZone', GlobalMethod.getTimezone());
        // formData.append('ModifiedOnOffsetDate', GlobalMethod.getOffset().toString());
        this._offerService.updateOfferStatusUS(formData).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
      }
    }
  }
  /***
     * confirmation dailog
     */

  confirmOfferCandidateJoined(formData: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Important Alert',
        message: `Are you sure the candidate and employee for allocation is same?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateOfferStatusApiCall(formData, false);
      }
    });
  }
  closeModal(): void {
    this.dialogRef.close();
  }

  /**show hide transfer button */
  transferButtonEnable(element: any) {
    if (
      this.userData?.RoleId == 5 ||
      element?.primaryrecruiter == this.userData?.EmpNewId ||
      element?.secondaryrecruiter == this.userData?.EmpNewId) {
      // this.displayedColumnsJoinedCandidate.push ('action')

      return true
    }
    else {
      return false
    }
  }

  /**upload offer ltter and agreement method for manual US Offer 
 when offer accepted selected calling this method */
  public isManualOfferUS: boolean = false;
  public isUSofferAcceptedSelected: boolean = false;
  uploadOfferAndEmployeAgreementMethodUS(offerStatusId: number) {
    debugger
    let offerLetter = this.getControl('fileOffer');
    let empAgreement = this.getControl('fileEmploymentAgreement');
    offerLetter.reset();
    empAgreement.reset();
    // this.getControl('fileOffer')
    /**140 offer accepted and OfferGenerateBy 'M' for manual generate
     * visible option to add files with 3 conditions
     * 1 for US location
     * 2 For manual offer 
     * 3 offer status - offer accepted 140 
     */

    if (offerStatusId == 140 && this.data?.OfferGenerateBy == "M" && this.data?.CandidateTypeID !== 14 && this.data?.CandidateTypeID !== 15) {
      this.isManualOfferUS = true;
      this.isUSofferAcceptedSelected = true;
      offerLetter.addValidators([Validators.required]);
      empAgreement.addValidators([Validators.required]);
    } else {
      offerLetter.clearValidators();
      empAgreement.clearValidators();
      this.isManualOfferUS = false;
      this.isUSofferAcceptedSelected = false;
    }
    offerLetter.updateValueAndValidity();
    empAgreement.updateValueAndValidity();
  }
  /**transfer method and modal open*/
  transferScheduledCandidate(element: any) {
    element['title'] = "Transfer to Talent ID";
    const dialogRef = this.dialog.open(SelectedCandidateTransferModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.paginatorCompRef.paginator.pageIndex = 0;
        // this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        this.getCandidateListByTalentId(true);
      }
    });
  }
  public offerLtterFile: any = {};
  selectOfferletter(event: any) {
    this.getControl('fileOffer').reset();
    this.offerLtterFile = null;
    let allowedExtensions = /(\.pdf)$/i;
    let files = event.target.files[0];
    let fileName = files.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type pdf only.');
      event.target.value = "";
      this.getControl('fileOffer').reset();
      return false;
    }
    else if (files.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
      event.target.value = "";
      this.getControl('fileOffer').reset();
      return false;

    }
    else {
      this.offerLtterFile = files;
      this.getControl('fileOffer').patchValue('files');
    }

  }
  //selectEmploymentAgreement
  public employmentAgreementFile: any = {};
  // @ViewChild('fileEmploymentAgreement') fileEmploymentAgreement: ElementRef;
  selectEmploymentAgreement(event: any) {
    this.getControl('fileEmploymentAgreement').reset();
    this.employmentAgreementFile = null;
    let allowedExtensions = /(\.pdf)$/i;
    let files = event.target.files[0];
    let fileName = files.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type pdf only.');
      event.target.value = "";
      this.getControl('fileEmploymentAgreement').reset();
      return false;
    }
    else if (files.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('File uploaded cannot be greater than 15MB.');
      event.target.value = "";
      this.getControl('fileEmploymentAgreement').reset();
      return false;

    }
    else {
      this.employmentAgreementFile = files;
      this.getControl('fileEmploymentAgreement').patchValue('files');
    }

  }

}
