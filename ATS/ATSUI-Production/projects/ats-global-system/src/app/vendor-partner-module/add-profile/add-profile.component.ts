import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from '../partner.service';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss']
})
export class AddProfileComponent implements OnInit, AfterViewInit {
  public uploadProfileForm: UntypedFormGroup = new UntypedFormGroup({});
  @ViewChild('formRef', { static: true }) formRefCompRef;
  public searchedValue: any;
  constructor(
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _partnerServe: PartnerService,
    private _storage: GetSetStorageService,
    private _router: Router,
    private _globalApiServe: GlobalApisService,
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.formInit();
    //  this.partnerRegistrationForm.get('Name').setErrors({invalid:true});      
    this.searchedValue = this.route.snapshot.queryParams['thid'];
    if(this.searchedValue != null || this.searchedValue != undefined){
      setTimeout(() => {               
        this.uploadProfileForm.get('thid').patchValue(parseInt(this.searchedValue));
      }, 1000);
    }
  }

  ngAfterViewInit() {
    this.formRefCompRef.myInputVariable;

  }

  formInit() {
    this.uploadProfileForm = this._fb.group({
     // Name: [null, [Validators.required]],
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
      eduQualification: [null],
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
    let emailControl = this.uploadProfileForm.get('Email');
    emailControl.valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          if (emailControl.valid) {
            this._partnerServe.checkExistEmail('email=' + get).subscribe(
              res => {
                let status = res['data'][0].exist;
                if (status === 1) {
                  emailControl.setErrors({ 'exist': true });
                  emailControl.markAsTouched();
                }
              }
            )
          }

        }
      )
  }

  get totalExperienceControl() { return this.uploadProfileForm.get('totalExp'); }
  get totalExperienceMonthControl() { return this.uploadProfileForm.get('totalExpMonth'); }
  get releventExperienceControl() { return this.uploadProfileForm.get('releventExp'); }
  get releventExperienceMonthControl() { return this.uploadProfileForm.get('relExpMonth'); }
  public resumeFile: any;

  getResume(e: any) {
    this.resumeFile = e;
  }

  /***
   * register partner
   */
  uploadProfile(form: UntypedFormGroup) {
    
    form.markAllAsTouched();
    if (form.valid) {
      let totalExps = (parseInt(this.totalExperienceControl.value) * 12) + parseInt(this.totalExperienceMonthControl.value);
      let relExps = (parseInt(this.releventExperienceControl.value) * 12) + parseInt(this.releventExperienceMonthControl.value);
      if (relExps > totalExps) {
        this._share.showAlertErrorMessage.next('Total Experience can not be less than Relevant Experience.');
      }
      else {
        let formData = form.value;
        
        formData['id'] = 0;
        formData['StatusId'] = 11;
        formData['ProfileId'] = 5;
        formData['AddedBy'] = this._storage.getUserEmpId();
        formData['Resume'] = this.resumeFile;
        if (formData.curSalary == null || formData.curSalary == '' || formData.curSalary == undefined) {
          delete formData['curSalary']
        }
        if (formData.link == null || formData.link == '' || formData.link == undefined) {
          delete formData['link']
        }
        if (formData.relocation == null || formData.relocation == undefined || formData.relocation == '') {
          delete formData['relocation']
        }
        if (formData.visaExpireDate == null || formData.visaExpireDate == undefined || formData.visaExpireDate == '') {
          delete formData['visaExpireDate']
        }
        if (formData.workVisaStatus == null || formData.workVisaStatus == undefined || formData.workVisaStatus == '') {
          delete formData['workVisaStatus']
        }
        if (formData.StateID == null || formData.StateID == undefined || formData.StateID == 0) {
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
        if (formData.currentOrg == null || formData.currentOrg == '' || formData.currentOrg == undefined) {
          delete formData['currentOrg']
        }
        

        if(formData.candidateGender){
          formData['Gender'] = formData.candidateGender;
        }

        if(formData.candiDob){
          formData['dob'] = GlobalMethod.formatDate(formData.candiDob);
        }
        if (formData.visaExpireDate) {
         formData['visaExpireDate'] = GlobalMethod.formatDate(formData.visaExpireDate);
        }
        // if(formData.middleName){
        //   formData['FirstName'] = formData.middleName;
        // }
        // if(formData.middleName){
        //   formData['MiddleName'] = formData.middleName;
        // }
        // if(formData.lastName){
        //   formData['LastName'] = formData.lastName;
        // }

        // let skillid = form.value.SecondarySkill.filter(n => n);
        // formData['SecondarySkill'] = skillid.toString();
        formData['SecondarySkill'] = form.value.SecondarySkill.toString();
        if (formData['currentOrg'] == 'other') {
          formData['currentOrg'] = formData['companyName'];
        }
        formData['MiddleName'] = formData['MiddleName']?formData['MiddleName']:'';
        formData['LastName'] = formData['LastName']?formData['LastName']:'';
        
        this.uploadProfileToServer(formData);
        // if(formData.currentOrg === 'other'){
        //   this._globalApiServe.addCompany(formData['companyName'].trim()).
        //    pipe(
        //      switchMap (cust => this._globalApiServe.getCompanyList(formData['companyName'].trim()) )
        //    ).subscribe(
        //      res=>{
        //        formData['currentOrg'] = res['data'][0].id;
        //        this.uploadProfileToServer(formData);
        //      }
        //    )
        // }
        // else{
        //   this.uploadProfileToServer(formData);
        // }
      }

    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  uploadProfileToServer(formData) {
    delete formData['companyName'];
    let  userData = this._storage.getSetUserData();
    formData['HiringLocationId'] = userData.LocationID;
 
    let formDataCon = new FormData();
    Object.keys(formData).forEach((key) => { formDataCon.append(key, formData[key]) });
    this._partnerServe.addupdateCandidateByPartner(formDataCon).subscribe(
      res => {

        this._share.showAlertSuccessMessage.next(res);
       this.uploadProfileForm.get('companyName').clearValidators();
       this.uploadProfileForm.get('companyName').updateValueAndValidity();
       this._router.navigate(['candidate-profile-list']);
      }
    )
  }

  resetForm() {
    this.uploadProfileForm.reset();
    this.formRefCompRef.myInputVariable.nativeElement.value = "";
    this.formRefCompRef.isViewBtnDs = true;
  }

  gotPartnerDetailsPage(): void {
    this._router.navigate(['candidate-profile-list'])
  }



}
