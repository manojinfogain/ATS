import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { CandidateCommonApiService } from 'projects/ats-global-system/src/app/core/services/candidate-common-api.service';
import { forkJoin } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { FILE_UPLOAD } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { OfferService } from '../../../offer.service';
import { G5OfferService } from '../../g5-offer.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';

@Component({
  selector: 'app-offer-approve-action-modal',
  templateUrl: './offer-approve-action-modal.component.html',
  styleUrls: ['./offer-approve-action-modal.component.scss']
})
export class OfferApproveActionModalComponent implements OnInit {


  //form
  public ApprovalActionForm: UntypedFormGroup = new UntypedFormGroup({});
  //
  public candData: any = [];
  public allRoundList: any = [];
  public selectedList: any = [];
  public gradeList: any = [];
  public offerAprDt: any = [];
  constructor(
    public dialogRef: MatDialogRef<OfferApproveActionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _fb: UntypedFormBuilder,
    private _offerService: OfferService,
    private _share: ShareService,
    public dialog: MatDialog,
    private _offerServiceG5Above: G5OfferService,
        private _globalCommonMethod: GlobalCommonMethodService,
  ) { }

  ngOnInit(): void {
    //
    this.ApprovalActionSubmitForm()
    this.getCandidateDetails();
  }


  getCandidateDetails() {
    forkJoin([
      this._interviewStatus.getCandidateDetails(this.data.cid),
      this._offerService.getSelectedCandidateDetails(this.data.cid),
      this._offerService.getCandidateOfferAprDetails(this.data.cid)
    ]).subscribe(
      res => {
        this.allRoundList = res[0];
        this.candData = res[1]['data'][0];
        this.offerAprDt = res[2]['data'][0];
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

  //submit approval
  submitApprove(form: UntypedFormGroup) {
    
    form.markAllAsTouched();
    if (form.valid) {
      let formData = new FormData();
      if (this.allFilesBGV.length != 0) {
        formData.append('cid', this.data.cid);
        formData.append('ActionTakenBy', 'A');
        formData.append('ActionId', this.offerAprDt.ActionId);
        for (let i = 0; i < this.allFilesBGV.length; i++) {
          formData.append('File', this.allFiles[i]);
        }
        this._offerService.uploadDocumnetByRecApprover(formData).subscribe(
          doc => {
            this.approveRejectSubmission(form);
          }
        )
      } else {
        this.approveRejectSubmission(form);
      }
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  approveRejectSubmission(form: UntypedFormGroup) {
    this._offerServiceG5Above.updateOfferApprovalStatusg5Above(this.data.cid, form.value.status, form.value.remarks ? form.value.remarks : null,this.data.IsDelegator).subscribe(
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
    if (e.value == 'A') {
      let gradeLevelAboveG4 = this._globalCommonMethod.validationGradeAboveG4AndAbove(this.offerAprDt?.gradeId);
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

    this.allFiles = [...this.allFiles, ...this.existFilesBgv];
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
