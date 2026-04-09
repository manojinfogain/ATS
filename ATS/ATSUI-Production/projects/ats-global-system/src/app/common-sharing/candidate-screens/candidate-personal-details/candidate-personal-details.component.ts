import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyRadioChange as MatRadioChange } from '@angular/material/legacy-radio';
import { forkJoin } from 'rxjs';
import { CandidateService } from 'projects/ats-global-system/src/app/candidate-module/candidate.service';
import { CANDIDATE_COMMON } from 'projects/ats-global-system/src/app/core/constant/candidate-common.const';
import { ExternalUserGlobalApiService } from 'projects/ats-global-system/src/app/core/services/external-user-global-api.service';
import { UpdateAddressCandidateModalComponent } from './update-address-candidate-modal/update-address-candidate-modal.component';

@Component({
  selector: 'app-candidate-personal-details',
  templateUrl: './candidate-personal-details.component.html',
  styleUrls: ['./candidate-personal-details.component.scss']
})
export class CandidatePersonalDetailsComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  public isRequired: boolean = true;
  @Input() public personalDetailsForm: UntypedFormGroup = new UntypedFormGroup({});
  @Input() public candidatePersonalDetails: any = {};
  public bloodGroupList: any = CANDIDATE_COMMON.bloodGroup;
  public bloodGroupListRh: any = CANDIDATE_COMMON.bloodGroupRh;
  constructor(
    private _fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private _candidateServe: CandidateService,
    private _exGlobal: ExternalUserGlobalApiService
  ) { }

  ngOnInit(): void {
    this.callMasterAPI();
    this.InitPersonalForm();
    this._candidateServe.getCandidatePersonalDetails().subscribe(
      res => {
        this.candidatePersonalDetails = res['data'][0];
        this.setValueToForm(this.candidatePersonalDetails)
      }
    )

  }

  /***
   *  call master API
   */
  public nationalityList: any = [];
  public maritalStatusList: any = [];
  callMasterAPI() {
    forkJoin([
      this._exGlobal.getNationalityMaster(),
      this._exGlobal.getMaritalStatusMaster()
    ]).subscribe(
      res => {
        this.nationalityList = res[0]['data'];
        this.maritalStatusList = res[1]['data'];
      }
    )
  }


  /***
   * 
   */
  validVisa(e: MatRadioChange) {
    let val = e.value;
    if (val == 'Y') {
      this.getControl('VisaValidUpto').setValidators([Validators.required])
    }
    else {
      this.getControl('VisaValidUpto').clearValidators();
      this.getControl('VisaValidUpto').reset();
    }

    this.getControl('VisaValidUpto').updateValueAndValidity();
  }
  /***
   * set value form 
   */
  setValueToForm(data: any) {
    this.personalDetailsForm.patchValue({
      "FirstName": data?.FirstName ? data?.FirstName : null,
      "MiddleName": data?.MiddleName ? data?.MiddleName : null,
      "LastName": data?.LastName ? data?.LastName : null,
      "FatherName": data?.FatherName ? data?.FatherName : null,
      "MobileNumber": data?.phone ? data?.phone : null,
      "LandlineNumber": data?.LandlineNumber ? data?.LandlineNumber : null,
      "dob": data?.dob ? new Date(data?.dob) : null,
      "MaritalStatus": data?.maritalStatus ? data?.maritalStatus : null,
      "Nationality": data?.Nationality ? data?.Nationality : null,
      "TotalExpYear": data?.totalExp ? data?.totalExp : null,
      "TotalExpMonth": data?.totalExpMonth ? data?.totalExpMonth : null,
      "RelevantExpyear": data?.releventExp ? data?.releventExp : null,
      "RelevantExpMonth": data?.releventExpMonth ? data?.releventExpMonth : null,
      "BloodGroup": data?.BloodGroup ? data?.BloodGroup : null,
      "BloodGroupRh": data?.BloodGroupRh ? data?.BloodGroupRh : null,
      "PassportNo": data?.PassportNo ? data?.PassportNo : null,
      "ValidVisa": data?.ValidVisa ? data?.ValidVisa : 'N',
      "VisaValidUpto": data?.VisaValidUpto ? new Date(data?.VisaValidUpto) : null,
      "Hobbies": data?.Hobbies ? data?.Hobbies : null,
      "Email": data?.Hobbies ? data?.Hobbies : null,
      "PresentAddress": 'sdsdf'
    });
    if (data?.ValidVisa == 'Y') {
      this.getControl('VisaValidUpto').setValidators([Validators.required]);
      this.getControl('VisaValidUpto').updateValueAndValidity();
    }
  }
  /***
   * Personal Form
   */

  InitPersonalForm() {
    this.personalDetailsForm = this._fb.group({
      FirstName: [null, Validators.required],
      MiddleName: [null],
      LastName: [null, Validators.required],
      FatherName: [null, Validators.required],
      Email: [null, Validators.required],
      MobileNumber: [null, Validators.required],
      LandlineNumber: [null],
      dob: [null, Validators.required],
      MaritalStatus: [null, Validators.required],
      Nationality: [null, Validators.required],
      TotalExpYear: [null, Validators.required],
      TotalExpMonth: [null, Validators.required],
      RelevantExpyear: [null, Validators.required],
      RelevantExpMonth: [null, Validators.required],
      BloodGroup: [null, Validators.required],
      BloodGroupRh: [null, Validators.required],
      PassportNo: [null],
      ValidVisa: ['0', Validators.required],
      VisaValidUpto: [null],
      Hobbies: [null, Validators.required],
      PresentAddress: [null, Validators.required],
      PermanentAddress: [null, Validators.required],
     // ContactAddressEmr: [null, Validators.required]
    })
  }

  getControl(name: string) {
    return this.personalDetailsForm.get(name);
  }

  /***
   * add address
   */
  addUpdateAddress(type: string = ''): void {
    let element: any = { title: '' };
    if (type === 'C') {
      element['title'] = "Current Address";
    }
    if (type === 'P') {
      element['title'] = " Permanent Address";
    }
    if (type === 'E') {
      element['title'] = "Emergency Contact Address";
    }

    const dialogRef = this.dialog.open(UpdateAddressCandidateModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal', 'add-edu-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
        }
      }
    )
  }

}
