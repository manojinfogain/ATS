import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Form, UntypedFormGroup } from '@angular/forms';
import { MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
import { forkJoin } from 'rxjs';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { CandidateService } from '../candidate.service';

@Component({
  selector: 'app-candidate-details-onboard',
  templateUrl: './candidate-details-onboard.component.html',
  styleUrls: ['./candidate-details-onboard.component.scss']
})
export class CandidateDetailsOnboardComponent implements OnInit, AfterViewInit {
  public formAppearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  public selectedTabIndex: number = 0;
  public isPrevBtnShow: boolean = false;
  public isNextBtnShow: boolean = true;
  @ViewChild("atsOnTab", { static: false }) matTabAts: MatTabGroup;
  @ViewChild("personalDetailsCom", { static: false }) personalDetailsCom;
  public personalDetailsForm: UntypedFormGroup;
  constructor(
    private _candidateServe: CandidateService,
    private _share:ShareService
  ) { }

  public uploadedDocumentLists: any = [];
  public candidatePersonalDetails: any = {};
  ngOnInit(): void {
    forkJoin([
      this._candidateServe.getCanddiateDocumentList(),
      //this._candidateServe.getCandidatePersonalDetails()
    ]).subscribe(
      res => {
        this.uploadedDocumentLists = res[0]['data'];
        //  this.candidatePersonalDetails = res[1]['data'][0];
      }
    )
  }

  public getAllTab: any = [];
  ngAfterViewInit(): void {
    this.getAllTab = this.matTabAts?._allTabs['_results'];
  }

  /** tab switch */
  onTabChanged(event: any): void {
    this.selectedTabIndex = event.index;
    if (this.selectedTabIndex === 0) {
      this.isPrevBtnShow = false;
      this.isNextBtnShow = true;
    }
    else {
      this.isPrevBtnShow = true;
      this.isNextBtnShow = true;
    }

    let getNextTabInfo = this.getAllTab[this.selectedTabIndex + 1];
    if (getNextTabInfo['disabled']) {
      this.isNextBtnShow = false;
    }
  }

  /**
   * Next
   */
  nextTab(): void {
    let personalDetailsForm = this.personalDetailsCom?.personalDetailsForm;
    /***
     * personal details
     */
    if (this.selectedTabIndex === 0) {
      if (personalDetailsForm.valid) {
        this.updatePersonaldt(personalDetailsForm);
        // this.switchToNext();
      }
      else {
        this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
        personalDetailsForm.markAllAsTouched();
      }
    }



    // if(this.selectedTabIndex >= 1){
    //   this.isPrevBtnShow = true;
    //  }
  }


  /***
   * update personal details
   */

  updatePersonaldt(form: UntypedFormGroup) {
    let formValue = form.value;
    if (formValue['dob']) {
      formValue['dob'] = GlobalMethod.formatDate(formValue['dob']);
    }
    if (formValue['VisaValidUpto']) {
      formValue['VisaValidUpto'] = GlobalMethod.formatDate(formValue['VisaValidUpto']);
    }
    delete formValue['PermanentAddress'];
    delete formValue['PresentAddress'];
    delete formValue['ContactAddressEmr'];
    this._candidateServe.updatePersonalDetails(formValue).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.switchToNext();
      }
    )

  }
  /***
   * Switch Next Tab
   */
  switchToNext() {
    let getNextTabInfo = this.getAllTab[this.selectedTabIndex + 2];
    if (getNextTabInfo['disabled']) {
      this.isNextBtnShow = false;
      this.selectedTabIndex = this.selectedTabIndex + 1;
    }
    else {
      this.selectedTabIndex = this.selectedTabIndex + 1;
    }
  }

  /**
  * Next
  */
  prevTab(): void {
    this.selectedTabIndex = this.selectedTabIndex - 1;
    // if(this.selectedTabIndex >= 1){
    //   this.isPrevBtnShow = true;
    //  }
  }

}
