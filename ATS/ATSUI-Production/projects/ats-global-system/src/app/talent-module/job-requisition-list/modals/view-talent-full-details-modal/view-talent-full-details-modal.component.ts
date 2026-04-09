import { Component, OnInit, Input, Inject, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';

@Component({
  selector: 'app-view-talent-full-details-modal',
  templateUrl: './view-talent-full-details-modal.component.html',
  styleUrls: ['./view-talent-full-details-modal.component.scss']
})
export class ViewTalentFullDetailsModalComponent implements OnInit {
  public ApprovalActionForm: UntypedFormGroup = new UntypedFormGroup({});
  public labelInterviewBiling: string = 'Interviewer Details'
  public userData: any = {};

  public interviewer1NameIds: string = '';
  public interviewer2NameIds: string = '';
  public interviewer3NameIds: string = '';


  //public displayedColumns = ['Category','ApprovedBy', 'ApprovedOver', 'ApprovedOn', 'wmgRemarks', 'attachments'];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewTalentFullDetailsModalComponent>,
    private _share: ShareService,
    private _talentServ: TalentService,
    private _GlobCommon: GlobalCommonMethodService,
    private _fb: UntypedFormBuilder,
    private _storage: GetSetStorageService,
    private _getLocInfo: GetLocationInfo
  ) { }

  public isIJPView: boolean = false;
  ngOnInit(): void {
    if (this.data?.isIJPView) {
      this.isIJPView = true;
    }
    this.userData = this._storage.getSetUserData();
    this.GetAllowcatedEmployeeForTalent();
    this.ApprovalActionSubmitForm();
    this.GetTHIDDetailsByTHID();

    this.showHideLocWise();
  }

  ngAfterViewInit(): void {
    //  this.GetRaisedTHIDDetails();
  }
  /**show/hide locationwise */
  public isVisibleForIndia: boolean = false;
  public isVisibleForUS: boolean = false;
  showHideLocWise() {
    if (this._getLocInfo.isLocationIndia()) {
      this.isVisibleForIndia = true;
    } else {
      this.isVisibleForIndia = false;
    }
  }

  /**getting talent  full details  */
  public isJoiningLocIndia: boolean = false;
  public talentDetailsList: any = [];
  public isTalentCubeVisible: boolean = false;
  public isLocationIndia: boolean = false;
  public jobDescHtml: string = '';
  public IsRenuTeam: boolean = false;
  public MandatorySkills: any = [];
  public GoodToHaveSkills: any = [];
  public interviewersListOfThId: any = [];
  GetTHIDDetailsByTHID() {
    this._talentServ.GetTHIDDetailsByTHID(this.data?.TH_ID).subscribe(
      res => {
        this.talentDetailsList = res['data'][0];
        this.MandatorySkills = res['MandatorySkills'];
        this.GoodToHaveSkills = res['GoodToHaveSkills'];
        this.interviewersListOfThId = res['InterviewDetails'];
        if (this.talentDetailsList?.JobDesc) {
          this.jobDescHtml = GlobalMethod.htmlUnescape(this.talentDetailsList?.JobDesc);
        }

        if (this.talentDetailsList?.TalentIdCreatedBy == 'TC') {
          this.isTalentCubeVisible = true;
        }
        else {
          this.isTalentCubeVisible = false;
        }

        if (this._getLocInfo.isLocationIndiaById(this.talentDetailsList?.JoiningLocID)) {
          this.isLocationIndia = true;
        }
        else {
          this.isLocationIndia = false;
        }

        if (this.talentDetailsList?.JoiningLocID == 1 || this.talentDetailsList?.JoiningLocID == 4
          || this.talentDetailsList?.JoiningLocID == 11
          || this.talentDetailsList?.JoiningLocID == 16
          || this.talentDetailsList?.JoiningLocID == 10
          || this.talentDetailsList?.JoiningLocID == 5
          || this.talentDetailsList?.JoiningLocID == 2
          || this.talentDetailsList?.JoiningLocID == 21) {
          this.isJoiningLocIndia = true;
        }
        else {
          this.isJoiningLocIndia = false;
        }

        if (this.talentDetailsList?.ReqTypeID == 6) {
          this.labelInterviewBiling = 'Billing Details'
        } else {
          this.labelInterviewBiling = 'Interviewer Details'
        }
        this.getCancelTalentReasonCateg();
        //  this.interviewer1Names = this.interviewersListOfThId.filter(x => x.IntType === 1).map(x => x.EmpName).join(", ");
        this.interviewer1NameIds = this.interviewersListOfThId.filter(x => x.IntType === 1).map(x => `${x.EmpName} (${x.EmpId})`).join(", ");
        this.interviewer2NameIds = this.interviewersListOfThId.filter(x => x.IntType === 2).map(x => `${x.EmpName} (${x.EmpId})`).join(", ");
        this.interviewer3NameIds = this.interviewersListOfThId.filter(x => x.IntType === 3).map(x => `${x.EmpName} (${x.EmpId})`).join(", ");

      }
    )

  }

  //form setup for approve
  ApprovalActionSubmitForm() {
    this.ApprovalActionForm = this._fb.group({
      status: [null, [Validators.required]],
      reasonCategory: [null],
      subReason: [null],
      remarks: [null]
    })
  }

  getControl(name: string) {
    return this.ApprovalActionForm.get(name);
  }

  //   view/download document
  viewDocument(data: any) {
    this._GlobCommon.downloadTalentFile(data.TH_ID, 'T', data.ATTACHMENT)
    //this._GlobCommon.downloadFileCommon(data?.AttachmentPath, data?.ATTACHMENT);
  }

  //   view/download document
  viewDocumentApr(data: any) {
    this._GlobCommon.downloadTalentFile(data.TH_ID, 'A', data.THIDApprovalAttachment)
    // this._GlobCommon.downloadFileCommon(data?.AttachmentPathApr, data?.THIDApprovalAttachment);
  }
  //  wmg  view/download document
  viewDocumentWmg(data: any) {
    this._GlobCommon.downloadTalentFile(data.TH_ID, 'W', data.WmgAttachmentName)
    // this._GlobCommon.downloadFileCommon(data?.WmgAttachmentPath, data?.WmgAttachmentName);
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

  /**Get Allowcated Employee For Talent  */
  public allowcatedEmpDetails: any = [];
  GetAllowcatedEmployeeForTalent() {
    this._talentServ.GetAllocationDetailsByTid(this.data?.TH_ID).subscribe(
      res => {
        this.allowcatedEmpDetails = res['data'][0];
        debugger

      }
    )
  }
  /**code starts for approval part for GDL/Finance */
  /**remark field required on select of Approve */
  // public isRemarkRequired: boolean = false;
  // statusChange(e) {
  //   if (e.value == 'A') {
  //     this.getControl('remarks').clearValidators();
  //     this.getControl('remarks').updateValueAndValidity();
  //     this.isRemarkRequired = false;
  //   }
  //   else {
  //     this.getControl('remarks').setValidators([, Validators.required]);
  //     this.getControl('remarks').updateValueAndValidity();
  //     this.isRemarkRequired = true;
  //   }
  // }

  public isRemarkRequired: boolean = false;
  public isRejectTalent: boolean = false;
  statusChange(e) {
    this.getControl('reasonCategory').reset();
    this.getControl('subReason').reset();
    if (e.value == 'A') {
      this.clearValidators('reasonCategory')
      this.clearValidators('subReason');
      this.isRejectTalent = false;
    }
    else {
      this.isRejectTalent = true;
      this.addValidator('reasonCategory');
      this.addValidator('subReason');
    }
  }

  /**get cancel reason category */
  public reasonCategList: any = [];
  getCancelTalentReasonCateg() {
    this._talentServ.cancelTalentReasonCateg().subscribe(
      res => {
        // this.reasonCategList = res['data'];
        this.talentDetailsList
        debugger
        if (this.talentDetailsList?.ReqTypeID == 3) {
          let filterById = [1, 2, 3];
          let dataRes = res['data'];
          /**showing category Opportunity Lost - 1, Opportunity Scaled Down -2,  Requirement/Scope Change- 3
           * for replacement type*/
          let filterByStatus = dataRes.filter(t => {
            return filterById.indexOf(t.CateID) === -1;
          });
          this.reasonCategList = filterByStatus;
        } else {
          //this.reasonCategList = res['data'];
          let filterById = [5];
          let dataRes = res['data'];
          let filterByStatus = dataRes.filter(t => {
            return filterById.indexOf(t.CateID) === -1;
          });
          this.reasonCategList = filterByStatus
        }
      }
    )
  }

  /**getting current id of dropdown on selection */
  // public projData: any = [];
  getReasonCategId(data: any) {
    //let reasonCategFilteredData = this.reasonCategList.filter(x => x.ProjectID === data.value);
    //this.projData = reasonCategFilteredData[0];
    this.getCancelTalentReason(data?.value);
  }
  /**get cancel reason */
  public reasonList: any = [];
  getCancelTalentReason(id) {
    this._talentServ.cancelTalentReason(id).subscribe(
      res => {
        //  this.reasonList = res['data'];
        let filterById = [6];
        let dataRes = res['data'];
        let filterByStatus = dataRes.filter(t => {
          return filterById.indexOf(t.SubCateID) === -1;
        });
        this.reasonList = filterByStatus;
      }
    )
  }
  /*submit approval by gdl*/
  submitApprove(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      /**for GDL Approve */
      if (this.userData?.otherRoles?.IsGDL == 'Y') {
        this._talentServ.approveRequestGDL(this.data.TH_ID, form.value.status, form.value.subReason ? form.value.subReason : null, form.value.remarks ? form.value.remarks : null).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
      }
      /**else - for finance approve  */
      else {
        this._talentServ.approveRequestFinance(this.data.TH_ID, form.value.status, form.value.subReason ? form.value.subReason : null, form.value.remarks ? form.value.remarks : null).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
      }
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }
  closeModal(): void {
    this.dialogRef.close();
  }

  htmlUnescape(str) {
    return GlobalMethod.htmlUnescape(str)
  }
}
