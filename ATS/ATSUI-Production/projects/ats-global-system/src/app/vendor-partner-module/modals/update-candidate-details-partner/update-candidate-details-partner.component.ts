import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from '../../partner.service';
@Component({
  selector: 'app-update-candidate-details-partner',
  templateUrl: './update-candidate-details-partner.component.html',
  styleUrls: ['./update-candidate-details-partner.component.scss']
})
export class UpdateCandidateDetailsPartnerComponent implements OnInit {
  public updateProfileForm: UntypedFormGroup = new UntypedFormGroup({});
  public candData: any = [];
  @ViewChild('formRef', { static: true }) formRefCompRef;
  public CountryId: number = 0;
  constructor(
    public dialogRef: MatDialogRef<UpdateCandidateDetailsPartnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _partnerServe: PartnerService,
    private _storage: GetSetStorageService
  ) { }

  ngOnInit(): void {
    this.formInit();
    
    this._partnerServe.getcandDetails(`id=${this.data.id}`).subscribe(
      res => {
        this.candData = res['data'][0];
        this.setValueDefault(this.candData)
      }
    )
  }

  public StartDate: any = {};
  formInit() {
    this.StartDate = new Date(this.data?.StartDate);
    this.updateProfileForm = this._fb.group({
      //Name:[null,[Validators.required]],
      FirstName: [null, [Validators.required]],
      MiddleName: [null],
      LastName: [null],
       Email: [null, [Validators.required, Validators.pattern(COMMON_CONST.emailregex)]],
       MobileNumber: [null, [Validators.required]],
       PrimarySkill: [null, [Validators.required]],
       SecondarySkill: [null, [Validators.required]],
       totalExp: [null, [Validators.required]],
       totalExpMonth: [null, [Validators.required]],
       releventExp: [null, [Validators.required]],
       relExpMonth: [null, [Validators.required]],
       thid: [null, [Validators.required]],
       CountryCode: [null, [Validators.required]],
       Resume: [null, [Validators.required]],
       contractTypeId: [null, [Validators.required]],
       currencyTypeId: [null, [Validators.required]],
       noticePeriod: [null, [Validators.required]],
       expSalary: [null, [Validators.required]],
       curSalary: [null, [Validators.required]],
       currentOrg: [null],
       eduQualification: [null, [Validators.required]],
       CountryId: [null],
       CityId: [null, [Validators.required]],
       companyName: [null],
       candidateGender:[null, [Validators.required]],
       candiDob:[null],
       SalaryType: [null, [Validators.required]],
       StateID:[null],
       workVisaStatus:[null],
       visaExpireDate:[null],
       relocation:[null],
       link:[null]
    })
    this._share.isSkillUpdated.next(true);
  }
  public CurrentSalReq: boolean = true;
  setValueDefault(data) {
    if (data?.contractID == 2) {
      this.CurrentSalReq = false;
    }
    if(data?.HiringLocationId ==3){
      this.CountryId = data?.Stateid;
    }
    else{
      this.CountryId = data?.CountryID;
    }
    
    
    this.updateProfileForm.patchValue(
      {
        // Name:data?.name,
        FirstName:  data?.FirstName,
        MiddleName: data?.MiddleName,
        LastName: data?.LastName,
        Email: data?.email,
        MobileNumber: data?.mobile_number,
        PrimarySkill: parseInt(data?.primary_skill),
        SecondarySkill: data?.secondary_skill.split(',').map(i => Number(i)),
        totalExp: data?.total_experience,
        totalExpMonth: data?.total_exp_month,
        releventExp: data?.relevent_experience,
        relExpMonth: data?.relevent_exp_month,
        thid: data?.thid,
        CountryCode: data?.CountryCode,
        contractTypeId: data?.contractID,
        currencyTypeId: data?.currency_type,
        SalaryType: data?.SalaryType,
        noticePeriod: data?.notice_period,
        expSalary: data?.expected_ctc,
        curSalary: data?.current_ctc,
        currentOrg: parseInt(data?.currentCompany),
        eduQualification: data?.eduQualificationId,
        CountryId: data?.CountryID,
        CityId: data?.CityID,
        candidateGender: data?.GenderId ? parseInt(data?.GenderId) : null,
        candiDob: data?.dob ? data?.dob : null,
        StateID:data?.Stateid ? data?.Stateid : null,
        workVisaStatus:data?.workVisaType ? data?.workVisaType : null,
        visaExpireDate:data?.visaExpireDate ? data?.visaExpireDate : null,
        relocation:data?.Relocation ? data?.Relocation.toString() : '0',
        link:data?.Link ? data?.Link : null
      }
    )
  }
  get totalExperienceControl() { return this.updateProfileForm.get('totalExp'); }
  get totalExperienceMonthControl() { return this.updateProfileForm.get('totalExpMonth'); }
  get releventExperienceControl() { return this.updateProfileForm.get('releventExp'); }
  get releventExperienceMonthControl() { return this.updateProfileForm.get('relExpMonth'); }
  public resumeFile: any;

  getResume(e: any) {
    this.resumeFile = e;
  }


  /**
   * update partner profile
   * @param form 
   */
  UpdateProfile(form: UntypedFormGroup) {
    debugger
    form.markAllAsTouched();
    if (form.valid) {
      let totalExps = (parseInt(this.totalExperienceControl.value) * 12) + parseInt(this.totalExperienceMonthControl.value);
      let relExps = (parseInt(this.releventExperienceControl.value) * 12) + parseInt(this.releventExperienceMonthControl.value);
      if (relExps > totalExps) {
        this._share.showAlertErrorMessage.next('Total Experience can not be less than Relevant Experience.');
      }
      else {
        let formData = form.value;
        formData['id'] = this.data.id;
        formData['AddedBy'] = this._storage.getUserEmpId();
        debugger
        if (this.resumeFile) {
          formData['Resume'] = this.resumeFile;
        }
        if (formData.curSalary === null) {
          delete formData['curSalary']
        }
        if (formData.link === null) {
          delete formData['link']
        }
        if (formData.relocation == null || formData.relocation == undefined) {
          delete formData['relocation']
        }
        if (formData.visaExpireDate == null || formData.visaExpireDate == undefined) {
          delete formData['visaExpireDate']
        }
        if (formData.workVisaStatus == null || formData.workVisaStatus == undefined) {
          delete formData['workVisaStatus']
        }
        if (formData.StateID == null || formData.StateID == undefined) {
          delete formData['StateID']
        }
        if (formData.CountryId == null || formData.CountryId == undefined || formData.CountryId == 0) {
          delete formData['CountryId']
        }
        if (formData.MiddleName == null || formData.MiddleName == '' || formData.MiddleName == undefined) {
          delete formData['MiddleName']
        }
        if (formData.LastName == null || formData.LastName == '' || formData.LastName == undefined) {
          delete formData['LastName']
        }
        if (formData.eduQualification == null || formData.eduQualification == undefined || formData.eduQualification == 0) {
          delete formData['eduQualification']
        }
        if (formData.currentOrg == null || formData.currentOrg == undefined || formData.currentOrg == 0) {
          delete formData['currentOrg']
        }

        //new
        if (formData.candidateGender) {
          formData['Gender'] = formData.candidateGender;
        }
        if (formData.candiDob) {
          formData['dob'] = GlobalMethod.formatDate(formData.candiDob);
        }
        if (formData.visaExpireDate) {
          formData['visaExpireDate'] = GlobalMethod.formatDate(formData.visaExpireDate);
         }

        // let skillid = form.value.SecondarySkill.filter(n => n);
        // formData['SecondarySkill']= skillid.toString();
        formData['SecondarySkill'] = form.value.SecondarySkill.toString();
        let  userData = this._storage.getSetUserData();
        formData['HiringLocationId'] = userData.LocationID;
        let formDataCon = new FormData();
        Object.keys(formData).forEach((key) => { formDataCon.append(key, formData[key]) });
        this._partnerServe.addupdateCandidateByPartner(formDataCon).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
      }

    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
