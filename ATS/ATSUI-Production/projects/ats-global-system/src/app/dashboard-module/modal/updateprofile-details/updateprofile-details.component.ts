import { Component, Inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { DashboardService } from '../../dashboard.service';
import { GlobalApisService } from '../../../core/services/global-apis.service';
import { HttpClient } from '@angular/common/http';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import { ShareService } from '../../../core/services/share.service';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';
import { InterviewCommonService } from '../../../core/services/interview-common.service';
import { CONSTANTS } from '../../../core/constant/constants';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { CandidateCommonApiService } from '../../../core/services/candidate-common-api.service';
import { GlobalMethod } from '../../../core/common/global-method';

@Component({
  selector: 'app-updateprofile-details',
  templateUrl: './updateprofile-details.component.html',
  styleUrls: ['./updateprofile-details.component.scss'],
})
export class UpdateprofileDetailsComponent implements OnInit {
  public updateProfileForm = new UntypedFormGroup({});
  public FilterCtrl: UntypedFormControl = new UntypedFormControl([]);
  public searchInput: string;
  public FilterCtrlAd: UntypedFormControl = new UntypedFormControl([]);
  public searchInputAd: string;
  public salaryTypeList: any = this.getSalaryTypeListLocationWise();
  public maxDate: Date = new Date();
  public minDate: Date = new Date();
  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateprofileDetailsComponent>,
    private _globalServe: GlobalApisService,
    public _dashServe: DashboardService,
    private http: HttpClient,
    private _storage: GetSetStorageService,
    private _share: ShareService,
    public dialog: MatDialog,
    private getLocInfo: GetLocationInfo,
    private _intCommonServe: InterviewCommonService,
    private _candidateCommon: CandidateCommonApiService
  ) {}
  public isLocationIndia: boolean = true;
  skillDataList: any[] = [];
  public profilesDetails: any = {};
  ngOnInit(): void {
    this.data;
    debugger;
    this.formInit(this.profilesDetails);
    this.isLocationIndia = this.getLocInfo.isLocationIndia();
    this.isLocationIndia = this.getLocInfo.isLocationIndia();
    forkJoin({
      genderList: this._globalServe.getGenderList(),
      currencyList: this._globalServe.getCurrency(),
      candidateTypeList: this._intCommonServe.getCandidateType(),
      companyList: this._globalServe.getCompanyListPaging(''),
      candidateDetails: this._candidateCommon.getProfileDetailsById(
        this.data?.list?.id,
        this.data?.profileId
      ),
    }).subscribe((res) => {
      this.genderType = res['genderList']['data'];
      this.currencyTypeData = res['currencyList'];
      this.getCandTypeByLocation(res['candidateTypeList']);
      this.listData = res['companyList']['data'];
      this.profilesDetails = res['candidateDetails']['data'][0];
      this.setDefaultValues(this.profilesDetails);
    });
    // this.getGender();
    // this.getCurrencyType();
    // this.getEmpType();
    // this.getCompanyListDaata('');
    // this._candidateCommon
    //   .getProfileDetailsById(this.data?.list?.id, this.data?.profileId)
    //   .subscribe((res) => {
    //     this.profilesDetails = res['data'][0];
    //     this.setDefaultValues(this.profilesDetails);
    //   });
    this.FilterCtrl.valueChanges.subscribe((val) => {
      this.searchInput = val;
    });
    this.FilterCtrlAd.valueChanges.subscribe((val) => {
      this.searchInputAd = val;
    });
    this._globalServe.getSkill().subscribe((res) => {
      this.skillDataList = res['data'];
    });
  }

  getCandTypeByLocation(res: any) {
    let filterById: any = [];
    if (environment.locationWise) {
      if (this.getLocInfo.isLocationIndia()) {
        filterById = [1, 2];
      } else {
        filterById = [4, 5, 6, 7, 8, 9];
      }
    } else {
      filterById = [1, 2];
    }
    this.candidateTypeData = res.filter((t) => {
      return filterById.indexOf(t.typeId) !== -1;
    });
  }

  //get Salary Type List LocationWise
  getSalaryTypeListLocationWise() {
    if (this.getLocInfo.isLocationIndia()) {
      return CONSTANTS.salaryType?.filter((d) => d?.id == 1 || d?.id == 2);
    } else {
      return CONSTANTS.salaryType;
    }
  }

  public genderType: any = [];
  getGender() {
    this._globalServe.getGenderList().subscribe((res) => {
      this.genderType = res['data'];
    });
  }
  //  get currencyTypeData
  public currencyTypeData: any = [];
  getCurrencyType() {
    this._globalServe.getCurrency().subscribe((res) => {
      this.currencyTypeData = res;
    });
  }
  public candidateTypeData: any = [];
  getEmpType() {
    //get cand type
    this._intCommonServe.getCandidateType().subscribe((res) => {
      let filterById: any = [];
      if (environment.locationWise) {
        if (this.getLocInfo.isLocationIndia()) {
          filterById = [1, 2];
        } else {
          filterById = [4, 5, 6, 7, 8, 9];
        }
      } else {
        filterById = [1, 2];
      }
      this.candidateTypeData = res.filter((t) => {
        return filterById.indexOf(t.typeId) !== -1;
      });
    });
  }

  public listData: any = [];
  getCompanyListDaata(queryParam: string): void {
    this._globalServe.getCompanyListPaging(queryParam).subscribe((res) => {
      this.listData = res['data'];
    });
  }

  /***
   * set Default Value
   */
  setDefaultValues(profilesDetails: any) {
    debugger;
    this.updateProfileForm.patchValue({
      firstName: profilesDetails?.FirstName ?? null,
      middleName: profilesDetails?.MiddleName ?? null,
      lastName: profilesDetails?.LastName ?? null,
      email: profilesDetails?.email ?? null,
      //  countryCode: profilesDetails?.countryCode ?? null,
      countryCode:
        profilesDetails?.countryCode != null
          ? Number(profilesDetails.countryCode)
          : null,
      phone: profilesDetails?.mobile_number ?? null,
      totalExpYear: profilesDetails?.total_experience ?? null,
      totalExpMonth: profilesDetails?.total_exp_month ?? null,
      releventExpYear: profilesDetails?.relevent_experience ?? null,
      releventExpMonth: profilesDetails?.relevent_exp_month ?? null,
      skill: profilesDetails?.pSkillID ?? null,
      additionalSkill:
        profilesDetails?.secondary_skill != null
          ? Number(profilesDetails.secondary_skill)
          : null,
      dob: profilesDetails?.dob ? new Date(profilesDetails.dob) : null,
      // selected: profilesDetails?.selected ?? null, // Not in response
      gender: profilesDetails?.Gender ?? null,
      qualification: profilesDetails?.eduQualification ?? null,
      //   currCompany: profilesDetails?.currentCompany ?? null,
      currCompany:
        profilesDetails?.currentCompany != null
          ? Number(profilesDetails.currentCompany)
          : null,
      joinDate: profilesDetails?.TentativeJoiningDate
        ? new Date(profilesDetails.TentativeJoiningDate)
        : null,
      countryID: profilesDetails?.countryId ?? null,
      cityID: profilesDetails?.cityId ?? null,
      currencyType: profilesDetails?.currency_type ?? null,
      SalaryType: profilesDetails?.SalaryType ?? null,
      currentSalary: profilesDetails?.current_ctc ?? null,
      expectedSalary: profilesDetails?.expected_ctc ?? null,
      candidateType: profilesDetails?.contract_type ?? null,
    });
  }

  /***
   * form
   */
  formInit(data?: any) {
    this.updateProfileForm = this.fb.group({
      firstName: [null],
      middleName: [null],
      lastName: [null],
      email: [{ value: null, disabled: true }],
      countryCode: [null],
      phone: [null],

      totalExpYear: [null],
      totalExpMonth: [null],
      releventExpYear: [null],
      releventExpMonth: [null],

      skill: [null],
      additionalSkill: [null],

      dob: [null],
      selected: [false],
      gender: [null],
      qualification: [null],
      currCompany: [null],
      joinDate: [null],
      countryID: [null],
      cityID: [null],
      currencyType: [null],
      SalaryType: [null],
      currentSalary: [null],
      expectedSalary: [null],
      candidateType: [null],
    });
    this.validationLocWiseAndTeam();
  }

  getControl(name: string) {
    return this.updateProfileForm.get(name);
  }

  /***
   * location wise validation
   */

  validationLocWiseAndTeam() {
    let resumeGroup = this.updateProfileForm;
    resumeGroup.get('firstName')?.setValidators([Validators.required]);
    resumeGroup
      .get('email')
      ?.setValidators([Validators.required, Validators.email]);
    resumeGroup.get('countryCode')?.setValidators([Validators.required]);
    resumeGroup.get('phone')?.setValidators([Validators.required]);
    resumeGroup.get('totalExpYear')?.setValidators([Validators.required]);
    resumeGroup.get('totalExpMonth')?.setValidators([Validators.required]);
    resumeGroup.get('skill')?.setValidators([Validators.required]);
    resumeGroup.get('additionalSkill')?.setValidators([Validators.required]);
    resumeGroup.get('releventExpYear')?.setValidators([Validators.required]);
    resumeGroup.get('releventExpMonth')?.setValidators([Validators.required]);
    // location specific validation
    if (this.isLocationIndia) {
      resumeGroup.get('dob')?.setValidators([Validators.required]);
    }

    // Update validity after clearing validators
    resumeGroup.get('firstName')?.updateValueAndValidity();
    resumeGroup.get('email')?.updateValueAndValidity();
    resumeGroup.get('countryCode')?.updateValueAndValidity();
    resumeGroup.get('phone')?.updateValueAndValidity();
    resumeGroup.get('totalExpYear')?.updateValueAndValidity();
    resumeGroup.get('totalExpMonth')?.updateValueAndValidity();
    resumeGroup.get('skill')?.updateValueAndValidity();
    resumeGroup.get('additionalSkill')?.updateValueAndValidity();
    resumeGroup.get('releventExpYear')?.updateValueAndValidity();
    resumeGroup.get('releventExpMonth')?.updateValueAndValidity();
    resumeGroup.get('dob')?.updateValueAndValidity();
  }

  resumeFile: File | null = null;
  resumeFileName: string = '';
  fileError: string = '';
  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];

    this.fileError = '';

    if (file) {
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!allowedExtensions.includes(fileExtension!)) {
        this.fileError = 'Only .pdf, .doc, or .docx files are allowed.';
        this.resumeFile = null;
        this.resumeFileName = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.fileError = 'File size should not exceed 5 MB.';
        this.resumeFile = null;
        this.resumeFileName = '';
        return;
      }

      this.resumeFile = file;
      this.resumeFileName = file.name;
    }
  }

  updateProfileFormHandler(updateProfileForm: UntypedFormGroup) {
    this.data;
    debugger;
    if (updateProfileForm.valid) {
      let formDataValues = updateProfileForm.value;
      // Format dob if present
      if (formDataValues.dob) {
        formDataValues.dob = GlobalMethod.formatDate(formDataValues.dob);
      } else {
        delete formDataValues.dob; // remove if empty/null
      }

      // Format joinDate if present
      if (formDataValues.joinDate) {
        formDataValues.joinDate = GlobalMethod.formatDate(
          formDataValues.joinDate
        );
      }

      let formdata = new FormData();
      formdata.append('candidateId', this.data?.list?.id);
      formdata.append('thid', this.profilesDetails?.thid);
      formdata.append('profiles', JSON.stringify(formDataValues));
      // ✅ Append resume file only if it exists
      if (this.resumeFile) {
        formdata.append('resume', this.resumeFile);
      }
      this._dashServe.UpdateProfileDetailsById(formdata).subscribe((res) => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      });
    } else {
      this._share.showAlertErrorMessage.next(
        'Please fill all the required fields.'
      );
    }
  }
  hideModal() {
    this.dialogRef.close();
  }
}
