import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { COMMON_CONST, FILE_UPLOAD } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { DashboardService } from '../../dashboard.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
@Component({
  selector: 'app-add-profile-form',
  templateUrl: './add-profile-form.component.html',
  styleUrls: ['./add-profile-form.component.scss']
})
export class AddProfileFormComponent implements OnInit {
  statius: boolean = true;
  addProfileForm: UntypedFormGroup;
  commonConst = COMMON_CONST;
  public statusList: any = [];
  imgFile: any;
  imgSrc: any;
  public isloader: boolean = false;
  public today = new Date();
  public maxDate = new Date(this.today.getFullYear() - 10, this.today.getMonth(), this.today.getDate());
  constructor(
    public dialogRef: MatDialogRef<AddProfileFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    public _dashServe: DashboardService,
    private _share: ShareService,
    private _intCommonServe: InterviewCommonService,
    private getLocInfo: GetLocationInfo,
    private _storage:GetSetStorageService
  ) { }

  public isRenuteam: boolean = false;
  public locationData: any = {};
  public isReferredBy: boolean = false;
  public isLink: boolean = false;
  public isPartner: boolean = false;
  public isApprover: boolean = false;
  public isremarks: boolean = false;
  ngOnInit() {
    if(this.data?.IsRenuTeam == 'Y'){
      this.isRenuteam = true;
      this.getVenderList(1,1000)
      this.getApproverList();
      
    }
    else{
      this.isRenuteam = false;
    }
    this.formInit();
    this.updateValidatorLocWise();
    this.locationData = this.getLocInfo;
    this.isloader = true;
    //get status list
    this._intCommonServe.getIntStatusList().subscribe(
      res => {
        this.isloader = false;
        let filterById;
        if (this.data.type === 1) {
          filterById = [7];
        }
        else {
          filterById = [5, 6, 7, 11];
        }
        let filterByStatus = res.filter(t => {
          return filterById.indexOf(t.statusId) !== -1;
        });
        this.statusList = filterByStatus;

      },
      (error) => {
        this.isloader = false;
      }
    );
  }

  public partnerList: any = [];
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  getVenderList(page: number, pageSize: number) {
    let body ={
      statusId : '4'
    }
    this._dashServe.getActivePartnerList(body).subscribe(
      res => {
        this.partnerList = res['data'];
        this.FilterCtrl.valueChanges.subscribe(
          val => {
            this.searchInput = val;  
          }
        )
      }
    )
  }

  public approverList: any = [];
  public FilterCtrlApr: UntypedFormControl = new UntypedFormControl();
  public searchInputApr: string;
  public FilterCtrlRef: UntypedFormControl = new UntypedFormControl();
  public searchInputRef: string;
  getApproverList() {
    this._dashServe.getApproverList().subscribe(
      res => {
        this.approverList = res['data'];
        this.FilterCtrlApr.valueChanges.subscribe(
          val => {
            this.searchInputApr = val;  
          }
        )
        this.FilterCtrlRef.valueChanges.subscribe(
          val => {
            this.searchInputRef = val;  
          }
        )
      }
    )
  }

  public isDobVisible: boolean = false;
  updateValidatorLocWise() {
    if (this.getLocInfo.isLocationIndia()) {
      this.mobileNumberControl.addValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)])
      this.isDobVisible = true;
      if (this.data?.type == 1 ) {
        this.candiDobControl.addValidators([Validators.required]);
      }else if (this.data?.type == 2 && !this.data?.list?.dob ) {
        this.candiDobControl.addValidators([Validators.required]);
      }
      else if (this.data?.type == 2) {
        this.candiDobControl.clearValidators();
      }

    } else if (this.getLocInfo.isLocationUS()) {
      this.mobileNumberControl.addValidators([Validators.required])
      this.isDobVisible = false;
      this.candiDobControl.clearValidators();
    }
    else {

    }
    this.mobileNumberControl.updateValueAndValidity();
    this.candiDobControl.updateValueAndValidity();
  }


  //control for form
  getControl(name: string) {
    return this.addProfileForm.get(name);
  }
  /***
   * formInit
   */

  public isSubmitEnable: boolean = true;
  formInit() {
    let totalYear = 40;
    let maxExpInMonth = 40 * 12;
    this.addProfileForm = this._fb.group({
   //   name: [null, [Validators.required, Validators.pattern(this.commonConst.nameRegex)]],
      firstName: [null, [Validators.required, Validators.pattern(this.commonConst.nameRegex)]],
      middleName: [null, [Validators.pattern(this.commonConst.nameRegex)]],
      lastName: [null, [ Validators.pattern(this.commonConst.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(this.commonConst.emailregex)]],
      mobileNumber: [null, [Validators.required]],
      countryCode: [null, [Validators.required]],
      primarySkill: [null, [Validators.required]],
      secondarySkill: [null, [Validators.required]],
      totalExperience: [null, [Validators.required, Validators.max(maxExpInMonth)]],
      totalExpMonth: [null, [Validators.required]],
      releventExperience: [null, [Validators.required, Validators.max(maxExpInMonth)]],
      relExpMonth: [null, [Validators.required]],
      statusid: [null, [Validators.required]],
      resume: [null, [Validators.required]],
      candiDob: [null, [Validators.required]],
      ReferredBy: [null],
      Partner: [null],
      Link: [null],
      Approver: [null],
      remarks: [null]
    })
    if (this.data.type == 1) {
      this.statusidControl.patchValue(7)
    }
    else {
      this.emailControl.disable();
      this.resumeControl.clearValidators();
      this.resumeControl.updateValueAndValidity();
      this.nameControl.patchValue(this.data.list.FirstName);
      this.middlenameControl.patchValue(this.data.list.MiddleName);
      this.lastnameControl.patchValue(this.data.list.LastName);
      this.emailControl.patchValue(this.data.list.email);
      this.mobileNumberControl.patchValue(this.data.list.mobile_number);
      this.countryCodeControl.patchValue(this.data.list.CountryID);
      this.primarySkillControl.patchValue(this.data?.list?.pSkillID ? parseInt(this.data?.list?.pSkillID) : null);
      let secSkill = this.data?.list?.sSkillID?.split(",")?.map(Number);
      this.secondarySkillControl.patchValue(secSkill);
      this.totalExperienceControl.patchValue(this.data.list.totalExpInYear);
      this.totalExperienceMonthControl.patchValue(this.data.list.totalExpInMonth);
      this.releventExperienceControl.patchValue(this.data.list.releventExpInYear);
      this.releventExperienceMonthControl.patchValue(this.data.list.releventExpInMonth);
      this.statusidControl.patchValue(this.data.list.statusid);
      this.candiDobControl.patchValue(this.data.list.dob);

      if(this.data?.list?.StatusApr == 'R'){
        this.getControl('Approver').patchValue( this.data.list.ApproverId?this.data.list.ApproverId.toString():null);
        
        this.isSubmitEnable = true;
        
      }
      else{
        this.getControl('Approver').patchValue( this.data.list.ApproverId?this.data.list.ApproverId.toString():null);
      //  this.getControl('Approver').disable();
        this.getControl('remarks').patchValue(this.data.list.ApprovelRemark || null);
      //  this.getControl('remarks').disable();
        if(this.isRenuteam && this.data.type == 2){
          this.isSubmitEnable = false;
        }
      }
     
    }

    if(this.isRenuteam && this.getLocInfo.isLocationIndia()){
      //Emp Referral
      this.isApprover = true;
      this.getControl('Approver').setValidators([Validators.required]);
      this.isremarks = true;
      this.getControl('remarks').setValidators([Validators.required]);
      this.isLink = true;
      if(this.data?.profileId == 4){
        this.isReferredBy = true;
        this.getControl('ReferredBy').setValidators([Validators.required]);
        if (this.data.type == 2) {
          setTimeout(() => {
            this.getControl('ReferredBy').patchValue(this.data.list.ReferredByR || null);
          }, 1000);
        }
      }
      //Linkedin / Nakuri
      else if(this.data?.profileId == 1 ){
        this.isLink = true;
        this.getControl('Link').setValidators([Validators.required]);
        if (this.data.type == 2) {
          this.getControl('Link').patchValue(this.data.list.Link || null);
        }
      }
   //partner
      else if(this.data?.profileId == 5){
        this.isPartner = true;
        this.getControl('Partner').setValidators([Validators.required]);
        if (this.data.type == 2) {
          this.getControl('Partner').patchValue(this.data.list.PartnerRenu || null);
        }
      }

      this.getControl('Approver').updateValueAndValidity();
      this.getControl('remarks').updateValueAndValidity();
      this.getControl('ReferredBy').updateValueAndValidity();
      this.getControl('Link').updateValueAndValidity();
      this.getControl('Partner').updateValueAndValidity();
    
    }

  }

  get nameControl() { return this.addProfileForm.get('firstName'); }
  get middlenameControl() { return this.addProfileForm.get('middleName'); }
  get lastnameControl() { return this.addProfileForm.get('lastName'); }
  get emailControl() { return this.addProfileForm.get('email'); }
  get countryCodeControl() { return this.addProfileForm.get('countryCode'); }
  get mobileNumberControl() { return this.addProfileForm.get('mobileNumber'); }
  get primarySkillControl() { return this.addProfileForm.get('primarySkill'); }
  get secondarySkillControl() { return this.addProfileForm.get('secondarySkill'); }
  get totalExperienceControl() { return this.addProfileForm.get('totalExperience'); }
  get totalExperienceMonthControl() { return this.addProfileForm.get('totalExpMonth'); }
  get releventExperienceControl() { return this.addProfileForm.get('releventExperience'); }
  get releventExperienceMonthControl() { return this.addProfileForm.get('relExpMonth'); }
  get statusidControl() { return this.addProfileForm.get('statusid'); }
  get resumeControl() { return this.addProfileForm.get('resume'); }
  get candiDobControl() { return this.addProfileForm.get('candiDob'); }

  // compareFn: ((f1: any, f2: any) => boolean)|null = this.compareByValue;

  // compareByValue(f1: any, f2: any) { 
  //   return f1 && f2 && f1.SkillId === f2.SkillId; 
  // }
  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }


  fileUp(event) {
    // let allowedExtensions = /(\.jpg|\.jpeg|\.tiff)$/i;
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf)$/i;
    let file = event.target.files[0];
    this.imgFile = file;
    let fileName = file.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf only.');
      event.target.value = "";
      this.imgFile = '';
      this.imgSrc = '';
      this.resumeControl.patchValue(null);
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
      event.target.value = "";
      this.imgFile = '';
      this.imgSrc = '';
      this.resumeControl.patchValue(null);
      return false;
    }
    else {
      this.resumeControl.patchValue(this.imgFile);

    }
  }
  /***
   * submit form Data
   */
  submitProfile(form: any) {
    this.addProfileForm.markAsTouched();
    this.resumeControl.markAsTouched();
    if (this.addProfileForm.valid) {
      let totalExps = (parseInt(this.totalExperienceControl.value) * 12) + parseInt(this.totalExperienceMonthControl.value);
      let relExps = (parseInt(this.releventExperienceControl.value) * 12) + parseInt(this.releventExperienceMonthControl.value);
      if (relExps > totalExps) {
        this._share.showAlertErrorMessage.next('Total Experience can not be less than Relevant Experience.');
      }
      else if (this.resumeControl.invalid) {
        this._share.showAlertErrorMessage.next('Please upload resume.');
      }
      else {
        this.isloader = true;
        this.daatSendToserver(form);
      }

    }
    else {
      if (this.nameControl.invalid) {
        this._share.showAlertErrorMessage.next('Please enter Name.');
      }
      else if (this.emailControl.invalid) {
        this._share.showAlertErrorMessage.next('Please enter Email ID.');
      }else if (this.countryCodeControl.invalid) {
        this._share.showAlertErrorMessage.next('Please enter Country Code.');
      }
      else if (this.mobileNumberControl.invalid) {
        this._share.showAlertErrorMessage.next('Please enter Mobile Number.');
      }
      else if (this.candiDobControl.invalid) {
        this._share.showAlertErrorMessage.next('Please enter Date of Birth.');
      }
      else if (this.primarySkillControl.invalid) {
        this._share.showAlertErrorMessage.next('Please select  Skill.');
      }
      else if (this.secondarySkillControl.invalid) {
        this._share.showAlertErrorMessage.next('Please select Additional Skill.');
      }
      else if (this.totalExperienceControl.invalid) {
        this._share.showAlertErrorMessage.next('Please enter Total Experience in Year.');
      }
      else if (this.totalExperienceMonthControl.invalid) {
        this._share.showAlertErrorMessage.next('Please enter Total Experience in Month.');
      }
      else if (this.releventExperienceControl.invalid) {
        this._share.showAlertErrorMessage.next('Please enter Relevent Experience in Year.');
      }
      else if (this.releventExperienceMonthControl.invalid) {
        this._share.showAlertErrorMessage.next('Please enter Relevent Experience in Month.');
      }
      else if (this.statusidControl.invalid) {
        this._share.showAlertErrorMessage.next('Please select Status.');
      }
      else if (this.resumeControl.invalid) {
        this._share.showAlertErrorMessage.next('Please upload resume.');
      }
    }
  }

  /***
   * data send to server
   */
  daatSendToserver(form: any) {
    let formData = form.value;
    let empId = this._storage.getUserEmpId();
    formData['AddedBy'] = empId;

    if (this.data.type === 1) {
      formData['thid'] = this.data.thIds.th_id;

      formData['ProfileId'] = this.data.list.id;
    }
    else {
      formData['thid'] = this.data.thIds.thIds.th_id;

      formData['ProfileId'] = this.data.thIds.list.id;
    }
    formData['IsFromNaukriAPI'] = this.data.list.IsFromNaukriAPI ? this.data.list.IsFromNaukriAPI : 'N';

    this._dashServe.addProfile(formData, this.imgFile, this.data).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.addProfileForm.reset();
        this.dialogRef.close(true);
      },
      (error) => {
        this.isloader = false;
        this._share.showAlertErrorMessage.next(error.error.Message);
      }

    )
  }
  showSkillReference() {
    // You can use a dialog, alert, or tooltip as per your UI library
    // Example: Show skill names in an alert (replace with dialog for production)
    alert('Skill Reference:\n' + (this.data?.sSkillName || []).join(', '));
  }
  
    public dtData: any = '';
    public title: string = '';
    openPop(data: any, title: string): void {
      if (data) {
        this.title = title;
        this.dtData = data;
      }

    }
}
