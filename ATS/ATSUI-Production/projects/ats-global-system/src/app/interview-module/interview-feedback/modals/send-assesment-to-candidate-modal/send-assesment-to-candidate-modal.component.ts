import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Validators } from 'ngx-editor';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-send-assesment-to-candidate-modal',
  templateUrl: './send-assesment-to-candidate-modal.component.html',
  styleUrls: ['./send-assesment-to-candidate-modal.component.scss']
})
export class SendAssesmentToCandidateModalComponent implements OnInit {
  public userData: any = {};
  public formSendAssesment: UntypedFormGroup;
  public FilterCtrlCoderBytAssesment: UntypedFormControl = new UntypedFormControl();
  public searchInputCoderBytAssesment: string;
  constructor(
    public dialogRef: MatDialogRef<SendAssesmentToCandidateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _globalServe: GlobalApisService,
    private dialog: MatDialog,
    private _interviewStatus: InterviewStatusService
  ) { }

  ngOnInit() {
    this.formInit();
    this.getCoderbyteAssesmentList();
  }

  formInit() {
    this.formSendAssesment = this._fb.group({
      coderBytesAssesments: [null, [Validators.required]],
      remarks: [null],
      thid: [null]
    })
  }

  public coderByteAssessmentList: any = [];
  /**get Coderbyte ASSESmEMT */
  getCoderbyteAssesmentList() {
    /**coder byte assessment search */
    this.FilterCtrlCoderBytAssesment.valueChanges.subscribe(
      val => {
        this.searchInputCoderBytAssesment = val;
      }
    );
    this._globalServe.getCoderByteAssessments().subscribe(
      res => {
        this.coderByteAssessmentList = res['data'];
      }
    )
  }

  /**getting coderByte assessment on change */
  public selectedCoderByteAssessment: any = [];
  getCoderByteAssesmentID(data: any) {
    let currentAssesment = this.coderByteAssessmentList?.filter(x => x.test_id === data.value);
    this.selectedCoderByteAssessment = currentAssesment[0];
  }

  /**submit */
  sendAssesmentHandler(form: any) {
    if (this.formSendAssesment.valid) {
      let formVal = form.value;
      let formData = new FormData();
      let candidateData = this.data;
      formData.append('cid', this.data.cid);
      formData.append('OnlineAssessmentBy', '1');
      formData.append('interviewBy', 'C');
      // if (this.data.email) {
      //   formData.append('candidateEmail', this.data.email);
      // }
      if (formVal.coderBytesAssesments) {
        formData.append('candidateEmail', this.data?.email);
        formData.append('codeByteTestId', this.selectedCoderByteAssessment?.test_id);
        formData.append('assessment_url', this.selectedCoderByteAssessment?.public_url);
        formData.append('coderByteDisplayName', this.selectedCoderByteAssessment?.display_name);
      }
      candidateData['display_name'] = this.selectedCoderByteAssessment?.display_name;
      this.previewConfirmFunc(formData, candidateData);
    }
    else {
      this._share.showAlertErrorMessage.next('Please select an assessment.');
    }

  }

  previewConfirmFunc(formData: any, data?: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: `Assessment "${data?.display_name}`,
        message: `Are you sure you want to send assessment to "${data.Name}" ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._interviewStatus.ScheduleCoderByteInterviewByPanel(formData).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            // this.isloader = false;
            this.dialogRef.close(true);
          },
          (error) => {
            this._share.showAlertErrorMessage.next(error.error.Message);
            // this.isloader = false;
          }
        )
      }
    });
  }


  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

}
