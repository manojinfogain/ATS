import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CandidateService } from '../../candidate.service';
import { ShareService } from '../../../core/services/share.service';
import { DayOneFormModalComponent } from '../modal/day-one-form-modal/day-one-form-modal.component';
// import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { Day1DisclaimerModalComponent } from '../modal/day1-disclaimer-modal/day1-disclaimer-modal.component';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';

@Component({
  selector: 'app-candidate-day-one-forms',
  templateUrl: './candidate-day-one-forms.component.html',
  styleUrls: ['./candidate-day-one-forms.component.scss']
})
export class CandidateDayOneFormsComponent implements OnInit {
  displayedColumns = ['Name', 'status', 'action'];
  public submitOnboardingForm: UntypedFormGroup = new UntypedFormGroup({});
  public onBoardCandidateList: any = []
  private candidateId =  this._storage.getCandidateId();
  constructor(
    public dialog: MatDialog,
    private _candidateServe: CandidateService,
    private _share: ShareService,
    private _fb: UntypedFormBuilder,
    private _storage: GetSetStorageService
  ) { }

  ngOnInit(): void {
    this.getOnboardingFormDetails();
    this.getCandidatePersonalDetails();
    this.formInit();
  //  this.openFormModal();
  }

  //init form
  formInit() {
    this.submitOnboardingForm = this._fb.group({
      // iConfirmedCheckBox: [null, [Validators.required]]
    })
  }


  public candidatePersonalDetails: any = {};
  public isEditable: boolean = true;
  //get candidate personal details
  getCandidatePersonalDetails() {
    this._candidateServe.getCandidatePersonalDetails(this.candidateId).subscribe(
      res => {
        this.candidatePersonalDetails = res['data'][0];
        if (this.candidatePersonalDetails?.day1FormStatus != null) {
          if (this.candidatePersonalDetails?.day1FormStatus == 100 || this.candidatePersonalDetails?.day1FormStatus == 120) {
            this.isEditable = false;
          }
          else {
            this.isEditable = true;
          }
        } else {
          this.isEditable = true;
        }
      }
    )
  }

  //get onboarding form details
  getOnboardingFormDetails() {
    this._candidateServe.getOnboardingFormDetails(2).subscribe(
      res => {
        this.onBoardCandidateList = res['data']
        this.getIndividualFormStatus();
      }
    )
  }

  public anyFormRef: string = 'N';
  public referredBackForms = [];
  public pendingForms = [];
  getIndividualFormStatus() {
    this.referredBackForms = this.onBoardCandidateList.filter(d => d.Status == 'R');
    if (this.referredBackForms.length) {
      this.anyFormRef = 'Y';
    } else {
      this.anyFormRef = 'N';
    }
    this.pendingForms = this.onBoardCandidateList.filter(d => d.Status == 'P');
  }


  
   /***
  * method for open form/doc
  */
   openFormModal(element: any = {}): void {
    element['title'] =element['Name'] ;
    element['isEditable'] = (this.isEditable && element?.Status != 'V');
    this.openDocDiaolog(element);
    // if (element['formTypeId'] === 13) {
    // //  element['title'] ='Acceptable Use of Asset Policy';
    //   this.openDocDiaolog(element);
    // }
    // if (element['formTypeId'] === 14) {
    // //  element['title'] ='Anti-Corruption & Anti-Bribery Policy';
    //   this.openDocDiaolog(element);
    // }
    // if (element['formTypeId'] === 15) {
    //   this.openDocDiaolog(element);
    // }
  }
  /***
   * open modal 
   */
  openDocDiaolog(element: any = {}): void {
    const dialogRef = this.dialog.open(DayOneFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap','ats-model-full-screen'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getOnboardingFormDetails();
        }
      }
    )

  }


  /***
   * submit day 1 form
   */
  SubmitOnboardingForm(form: UntypedFormGroup) {
    
    let body = form?.value;
    // if (!body['iConfirmedCheckBox']) {
    //   this._share.showAlertErrorMessage.next('Please provide your consent.');
    //   return false;
    // }
    if (this.pendingForms?.length > 0) {
      this._share.showAlertErrorMessage.next('Please fill all pending Day 1 forms first');
      return false;
    }
    if (this.referredBackForms?.length > 0) {
      this._share.showAlertErrorMessage.next('Please fill referred back Day 1 forms first');
      return false;
    }
    form.markAllAsTouched();
    if (this.submitOnboardingForm.valid) {
      this.confirmAlertSubmit();
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  /***
   * confirmation before sumbit
   */

   confirmAlertSubmit() {
    const dialogRef = this.dialog.open(Day1DisclaimerModalComponent, {
      panelClass: 'ats-confirm',
      data: {
        candidatePersonalDetails: this.candidatePersonalDetails,
        headerText: 'Disclaimer',
        type: 'DAY1',
        buttonText: {
          ok: "Agree",
          cancel: "Disagree"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let body = {};
        if (result?.iConfirmedCheck == true) {
          body['consent'] = 'Y';
        }
        this.finalSubmitDay1Forms(body);
      }
    });

  }

  finalSubmitDay1Forms(form: any) {
    // let body = form?.value;
      // if (body['iConfirmedCheckBox']) {
      //   body['consent'] = true ? 'Y' : 'N';
      // }
      this._candidateServe.SubmitDay1FormByCandidate(form).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.getOnboardingFormDetails();
          this.getCandidatePersonalDetails();
        }
      );
  }


}
