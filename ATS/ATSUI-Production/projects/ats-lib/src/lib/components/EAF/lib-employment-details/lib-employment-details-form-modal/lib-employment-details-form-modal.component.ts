import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { LIBrequiredMsgPrefix } from 'projects/ats-lib/src/lib/core/constant/lib-common.const';
import { LibCandidateService } from 'projects/ats-lib/src/lib/services/lib-candidate.service';
import { LibExternalUserGlobalApiService } from 'projects/ats-lib/src/lib/services/lib-external-user-global-api.service';
import { LibGlobalMethod } from 'projects/ats-lib/src/lib/services/lib-global-method';
import { LibShareService } from 'projects/ats-lib/src/lib/services/lib-share.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'lib-employment-details-form-modal',
  templateUrl: './lib-employment-details-form-modal.component.html',
  styleUrls: ['./lib-employment-details-form-modal.component.scss']
})
export class LibEmploymentDetailsFormModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats'
  public employmentDetailsForm: UntypedFormGroup = new UntypedFormGroup({});
  public designationNamesList: any[];
  public functionList: any = [];
  public industryList: any = [];
  public skillNameList: any = [];
  public countryList: any = [];
  public cityList: any = [];
  public FilterCtrlDesignation: UntypedFormControl = new UntypedFormControl();
  public searchInputDesignation: string;
  public FilterCtrlLocation: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlCity: UntypedFormControl = new UntypedFormControl();
  public searchInputLocation: string
  public searchInputCity: string
  public FilterCtrlSkills: UntypedFormControl = new UntypedFormControl();
  public searchInputSkills: string
  public FilterCtrlIndustry: UntypedFormControl = new UntypedFormControl();
  public searchInputIndustry: string
  public FilterCtrlFunction: UntypedFormControl = new UntypedFormControl();
  public searchInputFunction: string
  public onlyPastDate = new Date()
  public errorPrefix = LIBrequiredMsgPrefix;
  public apiBaseUrlCand:string = '';
  public apiBaseUrlMaster:string = '';
  constructor(
    public dialogRef: MatDialogRef<LibEmploymentDetailsFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _candidateServe: LibCandidateService,
    private _share: LibShareService,
    private _exGlobal: LibExternalUserGlobalApiService
  ) { }

  ngOnInit(): void {
    this.apiBaseUrlCand = this.data?.apiBaseUrlCand;
    this.apiBaseUrlMaster = this.data?.apiBaseUrlMaster;
    this.getDocumentList();
    this.empFormInit();
    if(this.data?.type == 1){
      if(this.data?.isCurrentEmployerAdded == false){
        this.getControl('currentPrevEmployer').patchValue('C');
        this.selectEmployer('C');
      }else{
        this.getControl('currentPrevEmployer').patchValue('P');
        this.selectEmployer('P');    
      }
    }else if(this.data?.type == 2){
      if(this.data?.employerType == 'C'){
        this.getControl('currentPrevEmployer').patchValue('C');
        this.selectEmployer('C');
      }else if(this.data?.employerType == 'P'){
        this.getControl('currentPrevEmployer').patchValue('P');
        this.selectEmployer('P');    
      }
      console.log(this.data)
    }
  }

  /**getting  data api */
  getDocumentList() {
    forkJoin([
      this._exGlobal.getDesignationList(this.apiBaseUrlMaster ),
      this._exGlobal.getFunctionList(this.apiBaseUrlMaster ),
      this._exGlobal.getIndustryList(this.apiBaseUrlMaster ),
      this._exGlobal.GetSkillNames(this.apiBaseUrlMaster ),
      this._exGlobal.GetCountryNames(this.apiBaseUrlMaster )
    ]).subscribe(
      res => {
        this.designationNamesList = res[0]['data'];
        this.functionList = res[1]['data'];
        this.industryList = res[2]['data'];
        this.skillNameList = res[3]['data'];
        let filterById = [201];
        let filterByOther = res[4]['data'].filter(t => {
          return filterById.indexOf(t.COUNTRY_CODE) == -1;
        });
        this.countryList = filterByOther
        // this.countryList = res[4]['data'];
        /**designation search */
        this.FilterCtrlDesignation.valueChanges.subscribe(
          val => {
            this.searchInputDesignation = val;
          }
        )
        /**location search */
        this.FilterCtrlLocation.valueChanges.subscribe(
          val => {
            this.searchInputLocation = val;
          }
        )
        /**city search */
        this.FilterCtrlCity.valueChanges.subscribe(
          val => {
            this.searchInputCity = val;
          }
        )
        /**skills search */
        this.FilterCtrlSkills.valueChanges.subscribe(
          val => {
            this.searchInputSkills = val;
          }
        )
        /**industry search */
        this.FilterCtrlIndustry.valueChanges.subscribe(
          val => {
            this.searchInputIndustry = val;
          }
        )
        /**function search */
        this.FilterCtrlFunction.valueChanges.subscribe(
          val => {
            this.searchInputFunction = val;
          }
        )
      }

    )
  }

  //get city list
  getCityList(countryId:number) {
    this._exGlobal.getCityList(this.apiBaseUrlMaster,countryId).subscribe(
      res => {
        this.cityList = res['data'];
        console.log(this.cityList)
      }
    )
  }

  empFormInit() {
    this.employmentDetailsForm = this._fb.group({
      currentPrevEmployer: [null, [Validators.required]],
      EmployerName: [null, [Validators.required]],
      Designation: [null, [Validators.required]],
      ProjectName: [null],
      location: [null, [Validators.required]],
      cityId: [null],
      durationFrom: [null, [Validators.required]],
      durationTo: [null, [Validators.required]],
      currentEmployerTillDate: [null],
      clientName: [null],
      skil: [null],
      Industry: [null],
      function: [null],
      joiningCtc: [null, [Validators.required,]],
      leavingCtc: [null, [Validators.required]],
      reasonForLeave: [null, [Validators.required]],
      projectDicription: [null],
      ManualDesigName: null,
      ManualLocationName: null,
      ManualSkillName: null
    })
    if (this.data?.type == 2) {
      this.employmentDetailsForm.patchValue({
        currentPrevEmployer: this.data?.employerType,
        EmployerName: this.data?.employerName,
        Designation: this.data?.DesignationId != null ? this.data?.DesignationId : null,
        ProjectName: this.data?.projectName,
        location: this.data?.locationId != null ? this.data?.locationId : null,
        cityId: this.data?.CityId != null ? this.data?.CityId : null,
        durationFrom: this.data?.fromDate,
        durationTo: this.data?.toDate,
        currentEmployerTillDate: this.data?.CurrentEmployeerTillDate,
        clientName: this.data?.clientName,
        skil: this.data?.skill != null ? this.data?.skill : null,
        Industry: this.data?.industryId,
        function: this.data?.functionId,
        joiningCtc: this.data?.joiningCtc,
        leavingCtc: this.data?.leavingCtc,
        reasonForLeave: this.data?.reasonForLeaving,
        projectDicription: this.data?.projectDescription,
        ManualDesigName: this.data?.DesignationId == 0 ? this.data?.Designation : null,
        ManualLocationName: this.data?.locationId == 0 ? this.data?.location : null,
        ManualSkillName: this.data?.skill == 0 ? this.data?.skilName1 : null
      })
      if(this.data?.DesignationId == 0){
        this.getDesignationId(this.data?.DesignationId);
      }
      if(this.data?.locationId == 0 || this.data?.locationId == 331){
        this.getLocationId(this.data?.locationId);
      }
      if(this.data?.skill == 0){
        this.getSkillId(this.data?.skill);
      }
      if(this.data?.CurrentEmployeerTillDate == 1){
        this.durationToControl.disable();
        this.durationToControl.clearValidators();
        this.durationToControl.updateValueAndValidity();
      }
      if(this.data?.employerType == 'C'){
        this.lastCTCLabel = 'Current CTC';
      }else if(this.data?.employerType == 'P'){
        this.lastCTCLabel = 'Last Drawn CTC';
      }else{
        
      }
    }
  }

  getControl(name: string) {
    return this.employmentDetailsForm.get(name);
  }
  get durationFromControl() { return this.employmentDetailsForm.get('durationFrom'); }
  get durationToControl() { return this.employmentDetailsForm.get('durationTo'); }
  get ManualDesignationControl() { return this.employmentDetailsForm.get('ManualDesigName'); }
  get ManualLocationControl() { return this.employmentDetailsForm.get('ManualLocationName'); }
  get ManualSkillControl() { return this.employmentDetailsForm.get('ManualSkillName'); }
  get joiningCtcControl() { return this.employmentDetailsForm.get('joiningCtc'); }
  get leavingCtcControl() { return this.employmentDetailsForm.get('leavingCtc'); }
  get currentEmployerTillDateControl() { return this.employmentDetailsForm.get('currentEmployerTillDate'); }


  public manualDesigReq: boolean = false
  getDesignationId(id) {
    if (id == 0) {
      this.manualDesigReq = true;
      this.ManualDesignationControl.setValidators([Validators.required]);

    } else {
      this.manualDesigReq = false;
      this.ManualDesignationControl.clearValidators();
    }
    this.ManualDesignationControl.updateValueAndValidity();
  }

  public manualLocationReq: boolean = false
  public isCityVisible: boolean = false
  getLocationId(id) {
    if (id == 0) {
      this.manualLocationReq = true;
      this.ManualLocationControl.setValidators([Validators.required]);
      this.isCityVisible = false;
      this.getControl('cityId').clearValidators();
      this.getControl('cityId').reset();
    } else {
      this.manualLocationReq = false;
      this.ManualLocationControl.clearValidators();
      if(id == 331){
        this.isCityVisible = true;
        this.getControl('cityId').setValidators([Validators.required]);
        this.getCityList(101);
      }else{
        this.isCityVisible = false;
        this.getControl('cityId').clearValidators();
        this.getControl('cityId').reset();
      }
    }
    this.ManualLocationControl.updateValueAndValidity();
    this.getControl('cityId').updateValueAndValidity();
  }

  public manualSkillReq: boolean = false
  getSkillId(id) {
    if (id == 0) {
      this.manualSkillReq = true;
      this.ManualSkillControl.setValidators([Validators.required]);

    } else {
      this.manualSkillReq = false;
      this.ManualSkillControl.clearValidators();
    }
    this.ManualSkillControl.updateValueAndValidity();
  }
  

  /***
   * submit form- to server
   */
  submitEmpDetailsForm(form: any) {
    
    form.markAllAsTouched();
    if (this.employmentDetailsForm.valid) {
      let formValue = form.value;

      if (formValue['currentPrevEmployer']) {
        formValue['employerType'] = formValue.currentPrevEmployer;
      }

      if (formValue['durationFrom']) {
        formValue['fromDate'] = LibGlobalMethod.formatDate(formValue['durationFrom']);
      }
      if (formValue['durationTo']) {
        formValue['toDate'] = LibGlobalMethod.formatDate(formValue['durationTo']);
      }
      if (formValue['currentEmployerTillDate']) {
        formValue['CurrentEmployeerTillDate'] = formValue['currentEmployerTillDate']==true?1:0;
      }
      if (formValue['EmployerName']) {
        formValue['employerName'] = formValue.EmployerName;
      }
      if (formValue['location']) {
        formValue['locationId'] = formValue.location;
      }
      if (formValue['cityId']) {
        formValue['CityId'] = formValue.cityId;
      }
      if (formValue['ProjectName']) {
        formValue['projectName'] = formValue.ProjectName;
      }
      if (formValue['clientName']) {
        formValue['clientName'] = formValue.clientName;
      }
      if (formValue['skil']) {
        formValue['skill'] = formValue.skil;
      }
      if (formValue['Industry']) {
        formValue['industryId'] = formValue.Industry;
      }
      if (formValue['function']) {
        formValue['functionId'] = formValue.function;
      }
      if (formValue['projectDicription']) {
        formValue['projectDescription'] = formValue.projectDicription;
      }
      if (formValue['reasonForLeave']) {
        formValue['reasonForLeaving'] = formValue.reasonForLeave;
      }
      if (formValue['joiningCtc']) {
        formValue['joiningCtc'] = formValue.joiningCtc;
      }
      if (formValue['leavingCtc']) {
        formValue['leavingCtc'] = formValue.leavingCtc;
      }
      if (formValue['Designation']) {
        formValue['DesignationId'] = formValue.Designation;
      }
      if (formValue['ManualDesigName']) {
        formValue['DesignationName'] = formValue.ManualDesigName;
      }
      if (formValue['ManualLocationName']) {
        formValue['locationName'] = formValue.ManualLocationName;
      }
      if (formValue['ManualSkillName']) {
        formValue['skillName'] = formValue.ManualSkillName;
      }
      /** type 1 for add / save employment details */
      /** type 2 update / edit employment details */
      if (this.data?.type == 1) {
        this._candidateServe.addEmploymentDetails(this.apiBaseUrlCand,formValue).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res)
            this.dialogRef.close(true);
          }
        )
      } else {
        this._candidateServe.updateEmploymentDetails(this.apiBaseUrlCand,this.data?.id, formValue).subscribe(
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

  public tillDateCtrl: boolean = false;
  public lastCTCLabel: string = 'CTC';
  selectEmployer(val:any){
    if(val == 'C'){
      this.currentEmployerTillDateControl.reset();
      this.tillDateCtrl = true;
      this.lastCTCLabel = 'Current CTC';
    }else{
      this.lastCTCLabel = 'Last Drawn CTC';
      this.tillDateCtrl = false;
      this.currentEmployerTillDateControl.reset();
      this.durationToControl.enable();
      this.durationToControl.addValidators([Validators.required]);
      this.durationToControl.updateValueAndValidity();
    }
  }

  selectTillDate(e:any){
    if(e.checked == true){
      this.durationToControl.disable()
      this.durationToControl.clearValidators();
    }else{
      this.durationToControl.enable()
      this.durationToControl.addValidators([Validators.required]);
    }
    this.durationToControl.updateValueAndValidity();
  }

  /***
   * close modal
   */
  closeModal(): void {
    this.dialogRef.close();
  }

}
