import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { ViewOfferApprovalDetailsComponent } from 'projects/ats-global-system/src/app/offer-module/modals/view-offer-approval-details/view-offer-approval-details.component';
import { FILE_UPLOAD } from '../../../core/constant/common.const';
import { OnboardService } from '../../onboard.service';
import { OfferService } from '../../../offer-module/offer.service';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-send-preonb-forms-modal',
  templateUrl: './send-preonb-forms-modal.component.html',
  styleUrls: ['./send-preonb-forms-modal.component.scss']
})
export class SendPreonbFormsModalComponent implements OnInit {
  public submitPreOnbForms: UntypedFormGroup = new UntypedFormGroup({});
  public selectedList: any = [];
  public onbFormsList: any = [];

  displayedColumns: string[] = ['SNum', 'name', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild('formsList') InputData;
  constructor(
    public dialogRef: MatDialogRef<SendPreonbFormsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _globalApiServe: GlobalApisService,
    private _onboardServ: OnboardService,
    private _onboard: OnboardService,
    private _share: ShareService,
    private _offerService: OfferService,

  ) { }

  public candidateCallsDetailsList: any = [];
  public offerDetails: any = {};
  ngOnInit(): void {
    this.getOnbFormsList();
    this._onboard.getCandidatePersonalDetails(this.data.candidateId).subscribe(
      res => {
        this.offerDetails = res['data'][0];
        debugger
        if (this.data?.formType == 1) {
          this.getItineraryDoc(this.offerDetails?.divisionid, this.offerDetails?.JoiningLocationID);
        }
      }
    )
    this.updateForm();
  }

  public itineraryObj: any = []
  getItineraryDoc(divId: number, joinLocation: number) {
    if (divId && joinLocation) {
      let body = {};
      body['formId'] = 26;
      body['joiningLocation'] = joinLocation;
      body['divisionId'] = divId;
      body['onboardingMode'] = this.getControl('OnBoardingMode')?.value;
      this._onboardServ.GetOnboardFormDocuments(body).subscribe(
        res => {
          this.itineraryObj = res['data'];
        }
      )

    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }



  //form 
  updateForm() {
    this.submitPreOnbForms = this._fb.group({
      formsList: [null],
      OnBoardingMode: [this.data?.OnBoardingModeFromRec ? this.data?.OnBoardingModeFromRec : null, Validators.required],
      fileControlItnery: [null]
    });
  }


  getControl(name: string) {
    return this.submitPreOnbForms.get(name);
  }



  getOnbFormsList() {
    this._onboardServ.GetOnboardingFormList(this.data.candidateId, this.data?.formType).subscribe((res) => {
      this.onbFormsList = res['data'];
      this.dataSource = new MatTableDataSource<any>(res['data']);
      this.selection.clear();
      this.dataSource.data.forEach(row => {
        if (row.isSelectedForm === 1 && row.IsEnable == null) {
          this.selection.select(row)
        }
      });
    })

  }

  /***
   * active/deactive  conform modal
   */

  confirmAlertActiveDeactive(event: any, data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to ${data.IsEnable == 1 ? 'disable' : 'enable'} <span class='u-name'>${data?.Name}</span> ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.enableDisableOnbForm(data, event)
      }
      else {
        event.source.checked = data?.IsEnable === 1;
      }
    });
  }
  /***
   * 
   */
  enableDisableOnbForm(elm: any, event: any) {
    let body = {};
    if (this.data?.candidateId) {
      body['Candidateid'] = this.data?.candidateId;
    }
    if (elm?.Id) {
      body['formId'] = elm?.Id;
    }
    body['status'] = event.source.checked === true ? 1 : 0;
    this._onboardServ.OnboardFormEnableDisable(body).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.getOnbFormsList();
        // this.dialogRef.close(true);
      }
    )
  }

  ResendDay1FormEmail(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to send day 1 form again <span class='u-name'>${data.OfficialEmailId}</span> ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {


        this._onboard.ResendDay1FormEmail(data?.candidateId).subscribe(
          res => {

            this._share.showAlertSuccessMessage.next(res);
          }
        )
      }
      else {
      }
    });
  }

  submitHandler(form: UntypedFormGroup) {
    this.data
    debugger
    let formData = form.value;
    if (this.itinararyDoc) {
      // let body = new FormData();
      // body.append('Candidateid', this.data?.candidateId);
      // if (this.UploadFileId) {
      //   body.append('Files', this.UploadFileId);
      // }
      let body = new FormData();
      body.append('formId', '26');
      body.append('candidateType', '3');
      if (this.data?.JoiningLocationID) {
        body.append('joiningLocation', this.data?.JoiningLocationID);
      }
      // body.append('onboardingMode', 'V');
      if (this.data?.OnBoardingModeFromRec) {
        body.append('onboardingMode', this.data?.OnBoardingModeFromRec);
      }
      if (this.data?.divisionId) {
        body.append('divisionId', this.data?.divisionId);
      }
      if (this.itinararyDoc) {
        body.append('file', this.itinararyDoc);
      }
      if (this.data.candidateHiringType) {
        body.append('candidateHiringType', this.data.candidateHiringType);
      }

      this._onboardServ.uploadJoiningItinerary(body).subscribe(
        res => {
          debugger
          if (res['result'] == 1) {
            this.submitFinalPreOnbForms(form)
          } else {
            this._share.showAlertErrorMessage.next(res['Message']);
          }

        }
      )
    } else {
      this.submitFinalPreOnbForms(form)
    }

  }
  /***
   * resend pre onb form email
   */
  ResendPreOnbFormEmail(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to send Pre-Onboarding form again ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this._onboard.ResendEnableDisableOnboardingFormMailer(data?.candidateId).subscribe(
          res => {

            this._share.showAlertSuccessMessage.next(res["message"]);
          }
        )
      }
    });
  }

  //submit button
  submitPreOnbFormsHandler(form: UntypedFormGroup) {
    form.markAllAsTouched();
    debugger
    if ((this.itineraryObj?.length === 0 || this.itineraryObj[0]?.documentsPath == null || this.itineraryObj[0]?.documentsPath == '') && this.data?.formType == 1) {
      this._share.showAlertErrorMessage.next('Please upload Itinerary Document First.');
      return false;
    } else {
      if (this.getControl('OnBoardingMode').value == null && this.data?.formType == 1) {
        this._share.showAlertErrorMessage.next('Please select onboarding mode.');
        return false;
      } else {
        let body = form.value;
        let selectedForm = this.selection.selected;
        let getIdList: any = [];
        if (selectedForm.length != 0) {
          for (let i = 0; i < selectedForm.length; i++) {
            getIdList.push(selectedForm[i].Id)
          }
        }
        // body['cid'] = this.data?.cid;
        body['Candidateid'] = this.data?.candidateId;
        body['formId'] = getIdList.toString();
        body['formType'] = this.data?.formType == 1 ? 'O' : 'D';
        this._onboardServ.sendOnboardDocToCandidate(body).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true)
          }
        )
      }
    }
  }
  //submit to server  button
  submitFinalPreOnbForms(form: UntypedFormGroup) {
    form.markAllAsTouched();
    debugger
    if ((this.itineraryObj?.length === 0 || this.itineraryObj[0]?.documentsPath == null || this.itineraryObj[0]?.documentsPath == '') && this.data?.formType == 1) {
      this._share.showAlertErrorMessage.next('Please upload Itinerary Document First.');
      return false;
    } else {
      if (this.getControl('OnBoardingMode').value == null && this.data?.formType == 1) {
        this._share.showAlertErrorMessage.next('Please select onboarding mode.');
        return false;
      } else {
        let body = form.value;
        let selectedForm = this.selection.selected;
        let getIdList: any = [];
        if (selectedForm.length != 0) {
          for (let i = 0; i < selectedForm.length; i++) {
            getIdList.push(selectedForm[i].Id)
          }
        }
        // body['cid'] = this.data?.cid;
        body['Candidateid'] = this.data?.candidateId;
        body['formId'] = getIdList.toString();
        body['formType'] = this.data?.formType == 1 ? 'O' : 'D';
        this._onboardServ.sendOnboardDocToCandidate(body).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true)
          }
        )
      }
    }
  }


  public itinararyDoc: any;

  // Constants for error messages
  private readonly ERROR_INVALID_FILE_TYPE = 'Please upload file type .pdf only.';
  private readonly ERROR_FILE_TOO_LARGE = 'File cannot be greater than 15MB.';

  fileUploadIternery(event: Event): boolean {
    this.itinararyDoc = '';
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    // Ensure file exists
    if (!file) {
      this.showError(this.ERROR_INVALID_FILE_TYPE, input);
      return false;
    }

    const allowedExtensions = /(\.PDF|\.pdf)$/i;

    // Validate file extension
    if (!this.isValidExtension(file.name, allowedExtensions)) {
      this.showError(this.ERROR_INVALID_FILE_TYPE, input);
      return false;
    }

    // Validate file size
    if (!this.isValidFileSize(file.size)) {
      this.showError(this.ERROR_FILE_TOO_LARGE, input);
      return false;
    }

    // If all validations pass, assign the file
    this.itinararyDoc = file;
    return true;
  }

  private isValidExtension(fileName: string, allowedExtensions: RegExp): boolean {
    return allowedExtensions.test(fileName);
  }

  private isValidFileSize(fileSize: number): boolean {
    return fileSize <= FILE_UPLOAD.FILE_SIZE; // Ensure FILE_UPLOAD.FILE_SIZE is defined
  }

  private showError(message: string, input: HTMLInputElement): void {
    this._share.showAlertErrorMessage.next(message);
    input.value = ''; // Clear the file input
    this.itinararyDoc = '';
    this.getControl('fileControlItnery').reset();
  }


  closeModal(): void {
    this.dialogRef.close();
  }
}
