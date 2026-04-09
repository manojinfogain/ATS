import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { CandidateCommonApiService } from 'projects/ats-global-system/src/app/core/services/candidate-common-api.service';
import { forkJoin } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OfferService } from '../../offer.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { FILE_UPLOAD } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { G5OfferService } from '../../G5AboveOffer/g5-offer.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';
import { TalentService } from '../../../talent-module/talent.service';
import { GlobalMethod } from '../../../core/common/global-method';
@Component({
  selector: 'app-approval-action-modal',
  templateUrl: './approval-action-modal.component.html',
  styleUrls: ['./approval-action-modal.component.scss']
})
export class ApprovalActionModalComponent implements OnInit {

  //form
  public ApprovalActionForm: UntypedFormGroup = new UntypedFormGroup({});
  //
  public candData: any = [];
  public allRoundList: any = [];
  public selectedList: any = [];
  public gradeList: any = [];
  public offerAprDt: any = [];
  public userData: any = {};
  public isVisibleForIndia: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ApprovalActionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _candidateCommon: CandidateCommonApiService,
    private _fb: UntypedFormBuilder,
    private _offerService: OfferService,
    private _offerServiceG5Above: G5OfferService,
    private _globalApiServe: GlobalApisService,
    private _share: ShareService,
    public dialog: MatDialog,
    private _globalCommonMethod: GlobalCommonMethodService,
    private getLocInfo: GetLocationInfo,
    private _talentServ: TalentService,
  ) { }

  ngOnInit(): void {
    if (this.getLocInfo.isLocationIndia()) {
      this.isVisibleForIndia = true;
    } else {
      this.isVisibleForIndia = false;
    }
    this.ApprovalActionSubmitForm()
    this.getCandidateDetails();
    
  }

  public talentDetails: any = {};
  getCandidateDetails() {
    forkJoin([
      this._interviewStatus.getCandidateDetails(this.data.cid),
      this._offerService.getSelectedCandidateDetails(this.data.cid),
      this._offerService.getCandidateOfferAprDetails(this.data.cid),
      this._talentServ.GetTHIDDetailsByTHID(this.data?.th_id)
    ]).subscribe(
      res => {
        this.allRoundList = res[0];
        this.candData = res[1]['data'][0];
        this.offerAprDt = res[2]['data'][0];
        this.talentDetails = res[3]['data'][0];
        this.selectedList = this.allRoundList.roundList.filter(d => d?.interviewType?.Id === 4 && d?.InterViewStatus?.Id === 4);
        if(this.data?.isDirectApprScr){
          this.getControl('status').patchValue(this.data?.Action);
          setTimeout(() => {        
            this.statusChange({value: this.data?.Action});
          }, 500);          
        }
      }
    )
  }

  //form setup for approve
  ApprovalActionSubmitForm() {
    this.ApprovalActionForm = this._fb.group({
      status: [null, [Validators.required]],
      remarks: [null],
      fileBGV: [null]
    })
  }

  //
  getControl(name: string) {
    return this.ApprovalActionForm.get(name);
  }

  submitApprove(form: UntypedFormGroup) {
    // const locId = this._globalCommonMethod.getSetLocation().locId;
    form.markAllAsTouched();
    if (form.valid) {
      let formData = new FormData();

      if (this.allFiles.length != 0) {
        formData.append('cid', this.data.cid);
        formData.append('ActionTakenBy', 'A');
        formData.append('ActionId', this.offerAprDt.ActionId);
        for (let i = 0; i < this.allFiles.length; i++) {
          formData.append('File', this.allFiles[i]);
        }
        /** usa  3*/
        if (this.getLocInfo?.isLocationUS()) {

          this._offerService.AddOfferApprovalAttachmentForUS(formData).subscribe(
            doc => {
              this.approveRejectSubmissionForUS(form)
            }
          )
        } else {
          this._offerService.uploadDocumnetByRecApprover(formData).subscribe(
            doc => {
              this.approveRejectSubmission(form);
            }
          )
        }

      } else {
        /** usa */
        if (this.getLocInfo?.isLocationUS()) {
          this.approveRejectSubmissionForUS(form)
        } else {
          this.approveRejectSubmission(form);
        }
      }

    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  approveRejectSubmission(form: UntypedFormGroup) {
    if (this.candData?.IsRenuTeam == 'Y') {
      this._offerServiceG5Above.updateOfferApprovalStatusg5Above(this.data.cid, form.value.status, form.value.remarks ? form.value.remarks : null, this.data.IsDelegator).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          // this.dialogRef.close(true);
          let result = {
            flag: true,
            msg: res
          }
          if(this.data?.isDirectApprScr){
            this.dialogRef.close(result);
          }else{
            this.dialogRef.close(true);
          }

        }
      )
    }
    else {
      this._offerService.approveOffer(this.data.cid, form.value.status, form.value.remarks ? form.value.remarks : null, this.data.IsDelegator).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          let result = {
            flag: true,
            msg: res
          }
          if(this.data?.isDirectApprScr){
            this.dialogRef.close(result);
          }else{
            this.dialogRef.close(true);
          }
        }
      )
    }

  }

  /**US approval api meth */
  approveRejectSubmissionForUS(form: UntypedFormGroup) {
    let OfferAcceptDate = new Date();
    let OfferAcceptTime = OfferAcceptDate.getHours() + ':' + OfferAcceptDate.getMinutes() + ':' + OfferAcceptDate.getSeconds();
    let body = {
      cid: this.data.cid,
      ActionTaken: form.value.status,
      Remark: form.value.remarks,
      IsDelegator: this.data.IsDelegator,
      /*by ar 18jul-2024*/
      ModifiedOnUTC: GlobalMethod.convertToUTCDate(OfferAcceptDate),
      ModifiedOnTimeZone: GlobalMethod.getTimezone(),
      ModifiedOnOffsetDate: GlobalMethod.getOffset().toString(),
    }
    this._offerService.approveOfferForUS(body).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        // this.dialogRef.close(true);
        let result = {
          flag: true,
          msg: res
        }
        if(this.data?.isDirectApprScr){
          this.dialogRef.close(result);
        }else{
          this.dialogRef.close(true);
        }

      }
    )
  }
  //status on change

  public isRemarkRequired: boolean = false;
  public remarksLabel: string = 'Remarks';
  public remarksErrorLabel: string = 'Remarks is required';
  statusChange(e) {
    let gradeLevelAboveG4 = this._globalCommonMethod.validationGradeAboveG4AndAbove(this.offerAprDt?.gradeId);
    if (e.value == 'A') {
      // this.offerAprDt?.gradeLevel >= 5
      if(gradeLevelAboveG4){  
      this.remarksLabel = 'Justification for the Approval';      
      this.remarksErrorLabel = 'Please provide justification for the Approval';      
      this.getControl('remarks').setValidators([Validators.required]);
      this.getControl('remarks').updateValueAndValidity();
      this.isRemarkRequired = true;
      }else{
        this.remarksLabel = 'Remarks';      
        this.getControl('remarks').clearValidators();
        this.getControl('remarks').updateValueAndValidity();
        this.isRemarkRequired = false;
      }
    }
    else {
      this.remarksLabel = 'Reason for referring back'; 
      this.remarksErrorLabel = 'Please provide reasons for referring back';
      this.getControl('remarks').setValidators([, Validators.required]);
      this.getControl('remarks').updateValueAndValidity();
      this.isRemarkRequired = true;
    }
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

  public allFiles: any = [];
  public allFilesBGV: any = [];
  @ViewChild('fileBGV') fileBGV: ElementRef;
  fileUp(event: any) {
    this.getControl('fileBGV').reset();
    this.allFiles = [];
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf|\.msg|\.xlsx)$/i;
    let files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let fileName = files[i].name;
      if (!allowedExtensions.exec(fileName)) {
        this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf/msg/xlsx only.');
        event.target.value = "";
        this.allFiles = [];
        this.getControl('fileBGV').reset();
        return false;
      }
      else if (files[i].size > FILE_UPLOAD.FILE_SIZE) {
        this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
        event.target.value = "";
        this.allFiles = [];
        this.getControl('fileBGV').reset();
        return false;

      }
      else {
        this.getControl('fileBGV').patchValue('files');
        this.allFiles.push(files[i]);
        this.allFilesBGV.push(files[i]);
      }

    }

    this.allFiles = [...this.allFiles];
  }

  // upload multiple  documents 
  public isFileReq: boolean = false;
  uploadButtonValidation(bgvDocList: any) {
    let fileControl = this.getControl('fileBGV');
    if (bgvDocList.length === 0) {
      fileControl.setValidators(Validators.required);
      this.isFileReq = true;
    }
    else {
      this.previewFileExist(bgvDocList);
      fileControl.clearValidators();
      this.isFileReq = false;
    }

    fileControl.updateValueAndValidity();

  }
  public existFilesBgv: any = [];
  previewFileExist(files: any) {

    for (let x in files) {
      this.existFilesBgv.push({ name: files[x].fileName, type: 'e' })
    }
    this.allFiles = this.existFilesBgv;
  }


  closeModal(): void {
    this.dialogRef.close();
  }

}