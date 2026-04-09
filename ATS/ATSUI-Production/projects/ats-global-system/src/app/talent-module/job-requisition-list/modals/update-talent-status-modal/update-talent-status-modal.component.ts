import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { TalentCONSTANTS } from 'projects/ats-global-system/src/app/core/constant/talent.const';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { FILE_UPLOAD } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { OfferedCandidateListModalComponent } from '../offered-candidate-list-modal/offered-candidate-list-modal.component';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { AlertMsgModalComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/alert-msg-modal/alert-msg-modal.component';

@Component({
  selector: 'app-update-talent-status-modal',
  templateUrl: './update-talent-status-modal.component.html',
  styleUrls: ['./update-talent-status-modal.component.scss']
})
export class UpdateTalentStatusModalComponent implements OnInit {

  public updateTalentForm: UntypedFormGroup = new UntypedFormGroup({});
  public talentStatusList: any;
  public userData: any = {};
  public formAppearance: string = 'outline';
  public isVisibleForTag: boolean = false;
  public subReason: any = TalentCONSTANTS?.subReason;
  public backToWmgReasonList: any = [];
  public referBackReasonByWmgList: any = [];
  public minDateEnd: any = new Date();
  public FilterCtrlUSEmployee: UntypedFormControl = new UntypedFormControl();
  public searchInputUSEmployee: string;
  public talentStatusCategories: any = TalentCONSTANTS?.talentStatusCategList;
  public approvedOverList: any = TalentCONSTANTS?.approvedOverList;
  public sendToTagByWMGCategList: any = [];
  public sendToTagApprovedOverList: any = [];
  public approveByList: any = [];
  public externalPortalList: any = [];
  public isVisibleRefName: boolean = false;
  public isVisibleExtPortal: boolean = false;
  public isDisabled; boolean = false;
  constructor(
    public dialogRef: MatDialogRef<UpdateTalentStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _talentAPi: TalentService,
    private _storage: GetSetStorageService,
    private _globalCommonMethod: GlobalCommonMethodService,
    private _intCommonServe: InterviewCommonService,
  ) { }

  ngOnInit(): void {
    this.GetReferBackReasonForWMG();
    this.userData = this._storage.getSetUserData();
    this.GetSendToTagReasonCateg();
    this.GetApprovedOverList();
    this.GetApprovedByList();
    this.GetApprovedOverList();
    this.updateForm();
    this.isVisibleRefName = false;
    this.isVisibleExtPortal = false;
    if (this.userData?.otherRoles?.IsWMG == 'Y') {
      this.getStatusList('W');
      this.isVisibleForTag = false;
    } else {
      this.isVisibleForTag = true;
      this.getStatusList('T');
    }
    this.isDisabled = false;
    this.GetSentBackToWMGReason();
    // const locId = this.data?.LocationID;
    // if (locId == 3) {
    this.getEmployeeListForUS();
    this.getProfileSourceList();
    // }
  }
  //form control
  updateForm() {
    this.updateTalentForm = this._fb.group({
      Status: [null, [Validators.required]],
      remarks: [null],
      reason: [null],
      subReason: [null],
      employeeName: [null],
      wmgReferReason: [null],
      SelectEmployee: [null],
      USEmployeeId: [null],
      DateOfOffer: [null],
      DateOfJoining: [null],
      profileSource: [null],
      talentStatusCategory: [null],
      wmgRemarks: [null],
      ApprovedBy: [null],
      ApprovedOver: [null],
      ApprovedOnDate: [null],
      attechmentFile: [null],
      referrerName: [null],
      externalPortal: [null],
    })
  }

  //control for form
  getControl(name: string) {
    return this.updateTalentForm.get(name);
  }

  //get dropdown for status
  getStatusList(id: string) {
    const locId = this.data?.LocationID;
    this._talentAPi.getStatusList(id).subscribe(
      res => {
        let filterByLocId = [1, 2, 4, 5, 10, 11, 16]
        /**status list ''send to tag'' wil not visible to wmg  if internal movement yes */
        if (this.data?.IsInternalMovment == 'Y') {
          var filterCandidate = res['data'].filter(user => user.id != 7);
          this.talentStatusList = filterCandidate;
        } else {
          if (locId == 4 || locId == 11 || locId == 16 || locId == 10 || locId == 5 || locId == 1 || locId == 2) {
            this.talentStatusList = res['data'].filter(user => user.id != 8);
          } else {
            this.talentStatusList = res['data'];
          }
        }
      }
    );
  }

  //get employee list to mark externally fulfilled
  public USEmployeeList: any = [];
  getEmployeeListForUS() {
    this._talentAPi.getEmployeeListForUS().subscribe(
      res => {
        this.USEmployeeList = res['data'];
        this.FilterCtrlUSEmployee.valueChanges.subscribe(
          val => {
            this.searchInputUSEmployee = val;
          }
        )
      }
    );
  }

  //get profile source list to mark externally fulfilled
  public ProfileSourceList: any = [];
  getProfileSourceList() {
    // this._intCommonServe.getProfileName().subscribe(
    //   res => {
    //     this.ProfileSourceList = this._globalCommonMethod.getProfileUsTalentStatus(null, res);
    //     console.log(this.ProfileSourceList);
    //   }
    // );
    let thId = this.data.TH_ID;
    this._talentAPi.getProfileListByLocation(thId).subscribe(
      res => {
        this.ProfileSourceList = res['data'];
        console.log(this.ProfileSourceList);
      }
    );
  }

  profileSourceChange(event: any) {
    console.log(this.data);
    console.log(this.data.LocationID);
    // location id for Singapore - 6 
    // location id for Poland - 13 
    // location id for Middle East - 9 
    var location_id = [6, 9, 13];
    this.isVisibleRefName = false;
    this.isVisibleExtPortal = false;
    this.resetControl('referrerName');
    this.resetControl('externalPortal');
    this.clearValidators('referrerName');
    this.clearValidators('externalPortal');

    // if(location_id.includes(this.data.LocationID)){
    if (event.value == '4') {
      //  this.addValidator('referrerName');
      this.isVisibleRefName = true;
    }
    if (event.value == '13') {
      //  this.addValidator('externalPortal');
      this.isVisibleExtPortal = true;
      this.getExternalPortal(event.value);
    }
    // }
  }

  getExternalPortal(id: number) {
    this._talentAPi.getExternalPortal(id).subscribe(
      res => {
        this.externalPortalList = res['data'];
        console.log(this.externalPortalList);
      }
    );
  }

  /**getting reason for send back to wmg */
  GetSentBackToWMGReason() {
    this._talentAPi.GetSentBackToWMGReason().subscribe(
      res => {
        this.backToWmgReasonList = res['data']
      }
    )
  }
  /**getting reason for send back to wmg */
  GetReferBackReasonForWMG() {
    this._talentAPi.GetReferBackReasonForWMG().subscribe(
      res => {
        this.referBackReasonByWmgList = res['data']
      }
    )
  }

  /*send to tag  by wmg api call */
  /**category list */
  GetSendToTagReasonCateg() {
    this._talentAPi.GetSendToTagReason().subscribe(
      res => {
        this.sendToTagByWMGCategList = res['data']
      }
    )
  }


  /**get approved over list */
  GetApprovedOverList() {
    this._talentAPi.GetApprovedBy().subscribe(
      res => {
        this.approveByList = res['data']
      }
    )
  }


  /**get approved by list */
  GetApprovedByList() {
    this._talentAPi.GetApprovedOver().subscribe(
      res => {
        this.sendToTagApprovedOverList = res['data']
      }
    )
  }


  /**control to show hide on condition */

  public reasonCTRL: boolean = false;
  public USEmployeeIdCTRL: boolean = false;
  public employeeCTRL: boolean = false;
  public subReasonCTRL: boolean = false;
  public onlyForWMg: boolean = false;
  public isFUllFIlmentWMg: boolean = false;
  /**remark field required on select on refered back for wmg */
  public isRemarkRequired: boolean = false;
  statusChange(e) {
    debugger
    this.resetControl('reason');
    this.resetControl('subReason');
    this.resetControl('employeeName');
    this.resetControl('wmgReferReason');
    this.clearValidators('employeeName');
    this.clearValidators('reason');
    this.employeeCTRL = false;
    this.reasonCTRL = false;
    this.clearValidators('subReason');
    this.subReasonCTRL = false;
    this.resetControl('SelectEmployee');
    this.isFUllFIlmentWMg = false;
    this.USEmployeeIdCTRL = false;
    this.resetControl('USEmployeeId');
    this.clearValidators('USEmployeeId');
    this.resetControl('DateOfOffer');
    this.clearValidators('DateOfOffer');
    this.resetControl('DateOfJoining');
    this.clearValidators('DateOfJoining');
    this.resetControl('profileSource');
    this.clearValidators('profileSource');
    if (e.value == 24) {
      /**24 reffred back - wmg */
      this.clearValidators('reason');
      this.reasonCTRL = false;
      this.onlyForWMg = true;
      this.addValidator('wmgReferReason');
      this.clearValidators('SelectEmployee');
      this.isFUllFIlmentWMg = false;
      this.showHideFieldsForSendToTagByWmg(e.value)
    }
    /**13 for send to wmg - tag */
    else if (e.value == 13) {
      this.reasonCTRL = true;
      this.isDisabled = false;
      this.addValidator('reason');
      this.showHideFieldsForSendToTagByWmg(e.value);
      this.checkOfferInitiationOnThisTalentIdMethod();
    }
    /**8 for mark externally fulfilled for US*/
    else if (e.value == 8) {
      this.USEmployeeIdCTRL = true;
      this.addValidator('USEmployeeId');
      this.addValidator('DateOfOffer');
      this.addValidator('DateOfJoining');
      this.addValidator('profileSource');
      this.showHideFieldsForSendToTagByWmg(e.value);
      this.viewOfferedCandidateList(this.data);
      this.dialogRef.close(true);
    }
    /**internally fullfillment -  wmg */
    else if (e.value == 6) {
      this.isFUllFIlmentWMg = true;
      this.addValidator('SelectEmployee');
      this.showHideFieldsForSendToTagByWmg(e.value)
    }
    // send to tag by wmg
    else if (e.value == 7) {
      this.clearValidators('reason');
      this.reasonCTRL = false;
      this.clearValidators('wmgReferReason')
      this.onlyForWMg = false;
      this.clearValidators('SelectEmployee');
      this.isFUllFIlmentWMg = false;
      this.showHideFieldsForSendToTagByWmg(e.value)
    }
    else {
      this.clearValidators('reason');
      this.reasonCTRL = false;
      this.clearValidators('wmgReferReason')
      this.onlyForWMg = false;
      this.clearValidators('SelectEmployee');
      this.isFUllFIlmentWMg = false;
      this.showHideFieldsForSendToTagByWmg(e.value)
    }
  }

  checkOfferInitiationOnThisTalentIdMethod() {
    this.data;
    debugger
    this._talentAPi.GetNumberOfOffersOnTid(this.data?.TH_ID).subscribe(
      res => {
        debugger
        let countData = res['data'][0];
        if (countData.OfferCount > 0) {
          this.openAlertModal('');
        } else {
          // this.isLocChangeAllowForWmg = false;
        }
      }
    )
  }

  viewOfferedCandidateList(ele: any) {
    this.isDisabled = false;
    this.addValidator('USEmployeeId');
    this.addValidator('profileSource');
    // this.dialogRef.close(true);
    ele['title'] = 'Offered Candidate';
    const dialogRef = this.dialog.open(OfferedCandidateListModalComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'view-offered-candidate-popup',],
      data: ele,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        console.log(res)
        // if (res) {
        this.isDisabled = true;
        this.clearValidators('USEmployeeId');
        this.clearValidators('profileSource');
        ele['title'] = 'Update Talent ID Status';
        // }else{
        //   this.isDisabled = false;
        // }
      }
    );
  }



  /**show hide fields for send to tag by wmg  */
  public issendToTagSelected: boolean = false;
  showHideFieldsForSendToTagByWmg(id: number) {
    debugger
    this.resetControl('talentStatusCategory');
    this.resetControl('wmgRemarks');
    this.resetControl('ApprovedBy');
    this.resetControl('ApprovedOver');
    this.resetControl('ApprovedOnDate');
    this.clearValidators('attechmentFile');
    this.resetControl('attechmentFile');

    /** 7 for c2h */
    if (id && id == 7) {
      this.issendToTagSelected = true;
      this.addValidator('talentStatusCategory');
      this.addValidator('wmgRemarks');
      this.addValidator('ApprovedBy');
      // this.addValidator('ApprovedOver');
      // this.addValidator('ApprovedOnDate');
      // this.addValidator('attechmentFile');

      this.resetControl('remarks');
    } else {
      this.clearValidators('talentStatusCategory');
      this.clearValidators('wmgRemarks');
      this.clearValidators('ApprovedBy');
      this.clearValidators('ApprovedOver');
      this.clearValidators('ApprovedOnDate');
      //   this.clearValidators('attechmentFile');
      this.issendToTagSelected = false;
    }
  }

  /**talent category change id */
  public isAttachmentRequired: boolean = false;
  talentCategoryChangeID(e: any) {
    debugger
    if (e.value == 6) {
      this.clearValidators('attechmentFile');
      this.isAttachmentRequired = true;
    }
    else {
      this.isAttachmentRequired = false;
      this.addValidator('attechmentFile');
    }
  }
  /**change wmg approved by dropdown */
  approvedByChangeId(e: any) {

    /**if approved by not applicable  id 6*/
    if (e.value == 6) {
      this.clearValidators('ApprovedOver');
      this.clearValidators('ApprovedOnDate');
    } else {

      this.addValidator('ApprovedOver');
      this.addValidator('ApprovedOnDate');
    }
  }
  /**get reason id on selection change */
  getReasonId(e: any) {
    let reasonId = e.value;
    this.resetControl('subReason');
    this.resetControl('employeeName');
    /** 1 for  Fulfilled  internally - show employe name dropdown */
    if (reasonId == 1) {
      this.employeeCTRL = true;
      //this.addValidator('employeeName');
      this.clearValidators('subReason');
      this.subReasonCTRL = false;
    }
    /* id 8 for Requirement Modification - show sub reason dropdown */
    else if (reasonId == 8) {
      this.subReasonCTRL = true;
      this.addValidator('subReason');
      //this.clearValidators('employeeName');
      this.employeeCTRL = false;
    }
    else {
      //this.clearValidators('employeeName');
      this.employeeCTRL = false;
      this.clearValidators('subReason');
      this.subReasonCTRL = false;
    }

  }


  /***
* change date
*/
  changeDate(type: string, event: any) {
    this.minDateEnd = new Date(event.value);
  }

  /**get interviewer  data on change */
  public currentEmpFullName: string;
  getDataInt(data: any, type: number) {

    /**sending name end emp in string */
    this.currentEmpFullName = data?.fullName + ',' + data?.empnewid;
  }

  /**get employee data on change for wmg- fulfilment */
  public currentEmpIdFulfilment: string;
  getDataEmployeeWmg(data: any) {

    /**sending name end emp in string */
    this.currentEmpIdFulfilment = data?.fullName + ',' + data?.empnewid;
  }
  /**method for add validators */
  addValidator(name: string) {
    let ctrl = this.getControl(name);
    //  ctrl.setValidators([Validators.required]);
    ctrl.setValidators([Validators.required]);
    ctrl.updateValueAndValidity();
  }
  /**method for clear validators */
  clearValidators(name: string) {
    let ctrl = this.getControl(name);
    ctrl.clearValidators();
    ctrl.updateValueAndValidity();
  }

  /**method for reset value */
  resetControl(name: string) {
    let ctrl = this.getControl(name);
    ctrl.reset();
  }

  /***
    * attechment 
    */
  public fileAttechment: any = '';
  fileUpAttachement(event) {
    this.fileAttechment = '';
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf|\.msg|\.xlsx)$/i;
    let files = event.target.files[0];

    let fileName = files.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf/msg/xlsx only.');
      event.target.value = "";
      this.fileAttechment = '';
      return false;
    }
    else if (files.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('File cannot be greater than 15MB.');
      event.target.value = "";
      this.fileAttechment = '';
      return false;

    }
    else {
      this.fileAttechment = files;
    }
  }

  //update  status submit 
  updateTalentHandler(form: UntypedFormGroup) {

    if (form.valid) {
      let formData = form.value;
      let data = {};
      let formDataWmg = new FormData();
      // const locId = this.data?.LocationID;
      data['THID'] = this.data?.TH_ID;
      if (formData?.Status) {
        data['StatusId'] = formData?.Status
      }
      if (this.userData?.otherRoles?.IsWMG == 'Y') {
        if (formData?.wmgReferReason) {
          data['ReasonId'] = formData?.wmgReferReason
        }
      }
      if (this.userData?.otherRoles?.IsWMG == 'Y') {
        if (formData?.SelectEmployee) {
          data['ProposedEmpId'] = formData?.SelectEmployee
        }
      }
      if (this.userData?.otherRoles?.IsTAG == 'Y') {
        if (formData?.reason) {
          data['ReasonId'] = formData?.reason
        }
        // if(locId == 3){
        if (formData?.USEmployeeId) {
          data['ExfulfiledEmpId'] = formData?.USEmployeeId
        }
        if (formData?.profileSource) {
          data['sourceId'] = formData?.profileSource
        }
        if (formData?.referrerName) {
          data['ReferrerName'] = formData?.referrerName
        }
        if (formData?.externalPortal) {
          data['SubProfileId'] = formData?.externalPortal
        }
        if (formData?.DateOfOffer) {
          data['offerdate'] = GlobalMethod.formatDate(formData?.DateOfOffer)
        }
        if (formData?.DateOfJoining) {
          data['Dateofjoining'] = GlobalMethod.formatDate(formData?.DateOfJoining)
        }
        // }
      }
      if (formData?.employeeName) {
        data['EmpName'] = this.currentEmpFullName.toString();
      }
      if (formData?.subReason) {
        data['subReason'] = formData?.subReason
      }
      if (formData?.remarks) {
        data['Remark'] = formData?.remarks
      }
      console.log(formData);
      // return false;
      /**send to tag by wmg */
      debugger
      formDataWmg.append('THID', this.data?.TH_ID);
      if (formData?.Status) {
        formDataWmg.append('StatusId', formData?.Status);
      }

      // if (this.employeeUnitCont?.value) {
      //   formData.append('EmployeeUnitID', this.employeeUnitCont?.value);
      // }
      if (formData?.talentStatusCategory) {
        formDataWmg.append('CategoryId', formData?.talentStatusCategory);
      }

      if (formData?.wmgRemarks) {
        formDataWmg.append('Remarks', formData?.wmgRemarks);
      }
      if (formData?.ApprovedBy) {
        formDataWmg.append('ApprovedBy', formData?.ApprovedBy);
      }
      if (formData?.ApprovedOver) {
        formDataWmg.append('ApprovedOver', formData?.ApprovedOver);
      }
      if (formData?.ApprovedOnDate) {
        formDataWmg.append('ApprovedOn', GlobalMethod.formatDate(formData?.ApprovedOnDate));
      }
      if (this.fileAttechment) {
        //formData.append('THIDApprovalAttachment', this.fileAttechmentAppr);
        formDataWmg.append('file', this.fileAttechment);

      }

      /**api calls based on rolewise */
      debugger
      if (this.userData?.otherRoles?.IsWMG == 'Y' && this.getControl('Status').value == 7) {
        this._talentAPi.UpdateTalentIdStatusByWmg(formDataWmg).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
      } else {
        this._talentAPi.UpdateTalentIdStatus(data).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
      }


    } else {
      form.markAllAsTouched();
      this._share.showAlertErrorMessage.next("Please fill all mandatory fields.");
    }
  }
  /***
    * alert msg modal
    */
  openAlertModal(form: any) {
    const dialogRef = this.dialog.open(AlertMsgModalComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: `This Talent ID already has an offer initiated or is currently running. <br> Please review before proceeding.`,
        buttonText: {
          // ok: "Yes",
          cancel: "Ok"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //this.validationCheckBeforeSubmit(form);
      }
    });
  }
  closeModal(): void {
    this.dialogRef.close();
  }

}
