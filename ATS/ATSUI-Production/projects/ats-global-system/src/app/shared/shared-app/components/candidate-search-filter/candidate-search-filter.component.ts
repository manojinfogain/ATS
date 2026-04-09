import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Options } from "@angular-slider/ngx-slider";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
@Component({
  selector: 'app-candidate-search-filter',
  templateUrl: './candidate-search-filter.component.html',
  styleUrls: ['./candidate-search-filter.component.scss']
})
export class CandidateSearchFilterComponent implements OnInit, AfterViewInit {
  public optionsExp: Options = {
    floor: 0,
    ceil: 30,
    step: 1,
  //  noSwitching: true,
    minRange: 1,
    translate: (value: number): string => {
      return value + ' Year';
    }
  };
  public optionsRating: Options = {
    floor: 1,
    ceil: 100,
    step: 1,
  //  noSwitching: true,
    minRange: 1,
    translate: (value: number): string => {
      return value + '';
    }
  };

  optionsSal: Options = {
    floor: 0,
    ceil: 60,
    translate: (value: number): string => {
      return value + ' Lakhs';
    }
  };

  public statusList: any = [];
  public searchFilterFormGroup: UntypedFormGroup;
  public candidateName: string = '';
  public candidateEmail: string = '';
  public candidateExp: any = {};
  @Output() sortFilterData = new EventEmitter<string>();
  public selectedDataBody: any = {};
  public resetSkll:boolean = false;
  public selectedFilter:any = [];
  public minDate: any = new Date();
  constructor(
    private _fb: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
    /**form init */
    this.initFormFilter();
    document.body.classList.remove('page-fluid-wrap');
    
    /**default filter  method*/
    // this.setDefaultFilter();
  }

  ngAfterViewInit(): void {}

  

 /**
  * set Default filter
  */
   setDefaultFilter(){
    this.lastUpdatedProfileControl.patchValue('30');
    this.selectedDataBody = {};
    this.transformValueForServer(this.searchFilterFormGroup.value);
    this.lastUpdatedProfileControl.reset('30',{ emitEvent: false})
   }


  /**
   * form Init
   */
  initFormFilter(): void {
    this.searchFilterFormGroup = this._fb.group({
      name: [null],
      email: [null],
      primarySkill: [null],
      candidateSource: [[]],
      interviewStatus: [null],
      candidateExperience: [[0, 30]],
     // expectedSalary: [null],
      telentId: ['all'],
      candidateSkill: [[]],
      intStatus: [[]],
      offerStatusControl: [[]],
      subListTypeInt: [[]],
      subListTypeOff: [[]],
      noticePeriod: ['0'],
      lastUpdatedProfile: ['0'],
      accountId: [[]],
      projectID: [[]],
      recruiterEmpID: ['all'],
      hiringManager: ['all'],
      requisitionType: ['all'],
      partner: ['all'],
      countryTalent: [[]],
      interviewType:[[]],
      dateFrom:[null],
      dateTo:[null],
      orgName: [null],
      RatingScore: [[0, 100]]
    });

    // this.getControlValueOnChange();
  }

  get nameControl() { return this.searchFilterFormGroup.get('name') };
  get emailControl() { return this.searchFilterFormGroup.get('email') }

  get dateFromControl() { return this.searchFilterFormGroup.get('dateFrom') }
  get dateToControl() { return this.searchFilterFormGroup.get('dateTo') }

  get intStatusControl() { return this.searchFilterFormGroup.get('intStatus') };
  get expControl() { return this.searchFilterFormGroup.get('candidateExperience') };
  get talentIdControl() { return this.searchFilterFormGroup.get('telentId') };
  get candidateSkillControl() { return this.searchFilterFormGroup.get('candidateSkill') };
  get candidateSourceControl() { return this.searchFilterFormGroup.get('candidateSource') };

  get countryTalentControl() { return this.searchFilterFormGroup.get('countryTalent') }
  get interviewTypeControl() { return this.searchFilterFormGroup.get('interviewType') }

  get lastUpdatedProfileControl() { return this.searchFilterFormGroup.get('lastUpdatedProfile') };
  get accountIdControl() { return this.searchFilterFormGroup.get('accountId') };
  get ProjectIDControl() { return this.searchFilterFormGroup.get('projectID') };
  get recruiterControl() { return this.searchFilterFormGroup.get('recruiterEmpID') };
  get hiringManagerControl() { return this.searchFilterFormGroup.get('hiringManager') }
  get requisitionTypeControl() { return this.searchFilterFormGroup.get('requisitionType') }
  get noticePeriodControl() { return this.searchFilterFormGroup.get('noticePeriod') }
  get partnerControl() { return this.searchFilterFormGroup.get('partner') }

  get subListTypeInt() { return this.searchFilterFormGroup.get('subListTypeInt') };
  get subListTypeOff() { return this.searchFilterFormGroup.get('subListTypeOff') };
  get offerStatusControl() { return this.searchFilterFormGroup.get('offerStatusControl') };
  get orgNameControl() { return this.searchFilterFormGroup.get('orgName') };
  get RatingScoreControl() { return this.searchFilterFormGroup.get('RatingScore') };

  /***
   * reset all form data
   */
  clearAll(): void {
    this.searchFilterFormGroup.reset(
      {
        'name': null,
        'email': null,
        'candidateExperience': [0, 60],
        'telentId': 'all',
        'candidateSkill': [],
        'intStatus': [],
        'offerStatusControl': [],
        'subListTypeInt': [],
        'subListTypeOff': [],
        'candidateSource': [],
        'countryTalent':[],
        'interviewType':[],
        'lastUpdatedProfile': '0',
        'noticePeriod': '0',
        'accountId': [],
        'projectID': [],
        'recruiterEmpID': 'all',
        'hiringManager': 'all',
        'requisitionType': 'all',
        'partner': 'all',
        'RatingScore': [0, 100]
      },
      { emitEvent: false });
    this.selectedDataBody = {};
    this.selectedDataBody['resetAll'];
    this.transformValueForServer(this.searchFilterFormGroup.value);
    this.removeClass();
    this.isIntSubList = false;
    this.isOffSubList = false;
  }
  /**
   * reset one by one
   * @param type 
   */
  resetFilter(type: string): void {
    this.selectedDataBody = {};
    
    if (type == "name") {
      this.nameControl.reset();
    }
    else if (type == "email") {
      this.emailControl.reset();
    }
    else if (type == "dateFrom") {
      this.dateFromControl.reset();
      this.dateToControl.reset();
    }
    // else if (type == "email") {
    //   this.emailControl.reset();
    // }
    else if (type == "exp") {
      this.expControl.patchValue([0, 60]);
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }
    else if (type == "skill") {
      this.candidateSkillControl.reset([]);
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }

    else if (type == "postDate") {
      this.lastUpdatedProfileControl.patchValue('0');
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }
    else if (type == "np") {
      this.noticePeriodControl.patchValue('0');
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }
    else if (type == "talent") {
      this.talentIdControl.patchValue('all');
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }
    else if (type == "source") {
      this.candidateSourceControl.reset([]);
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }
    //
    
    else if (type == "countryTalent") {
      this.countryTalentControl.reset([]);
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }
    else if (type == "interviewType") {
      this.interviewTypeControl.reset([]);
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }
    
    else if (type == "intStatus") {
      this.intStatusControl.reset([]);   
        this.isIntSubList = false;
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }
    else if (type == "offerStatusControl") {
      this.offerStatusControl.reset([]);
      this.isOffSubList = false;
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }
    else if (type == "account") {
      this.accountIdControl.reset([]);
      this.ProjectIDControl.reset([]);
      this.acListId = [];
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }

    else if (type == "rec") {
      this.recruiterControl.patchValue('all');
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }
    else if (type == "hiring") {
      this.hiringManagerControl.patchValue('all');
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }
    else if (type == "partner") {
      this.partnerControl.patchValue('all');
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }
   
    else if (type == "requisition") {
      this.requisitionTypeControl.patchValue('all');
      this.transformValueForServer(this.searchFilterFormGroup.value);
    }
   else if (type == "orgName") {
      this.orgNameControl.reset();
    }
   else if (type == "RatingScore") {
      this.RatingScoreControl.patchValue('all');
    }
    // this.transformValueForServer(this.searchFilterFormGroup.value);
  }

  changeDate(type: string, event: any) {
    this.dateToControl?.reset();
    this.dateToControl?.enable();
    let date = new Date(event.value);
    // date.setDate(date.getDate()+1); 
    this.minDate = new Date(event.value);
  }

  /***
   * submit form 
   */
  transformValueForServer(formData: any) {
    formData.name ? this.selectedDataBody['name'] = formData.name : delete this.selectedDataBody['name'];
    if (formData.candidateExperience) {
        this.selectedDataBody['expMin'] = formData.candidateExperience[0] * 12;
        this.selectedDataBody['expMax'] = formData.candidateExperience[1] * 12;
    }
    if (formData.candidateSkill && formData.candidateSkill.length !== 0) {
      let skillIds = formData.candidateSkill.filter(n => n);
      this.selectedDataBody['skillId'] = skillIds.toString();
    }
    if (formData.intStatus && formData.intStatus.length !== 0) {
      let intStatusId = formData.intStatus.filter(n => n);
      this.selectedDataBody['interviewStatusID'] = intStatusId.toString();
    }
    if (formData.offerStatusControl && formData.offerStatusControl.length !== 0) {
      let offerStatusId = formData.offerStatusControl.filter(n => n);
      this.selectedDataBody['offerStatus'] = offerStatusId.toString();
    }
    if (formData.subListTypeInt && formData.subListTypeInt.length !== 0) {
      let reasonForDropId = formData.subListTypeInt.filter(n => n);
      this.selectedDataBody['interviewDropReasonId'] = reasonForDropId.toString();
    }
    if (formData.subListTypeOff && formData.subListTypeOff.length !== 0) {
      let reasonForDropId = formData.subListTypeOff.filter(n => n);
      this.selectedDataBody['offerDropReasonId'] = reasonForDropId.toString();
    }
    if (formData.candidateSource && formData.candidateSource.length !== 0) {
      let candidateSourceId = formData.candidateSource.filter(n => n);
      this.selectedDataBody['SourceId'] = candidateSourceId.toString();
    }
    //
    if (formData.countryTalent && formData.countryTalent.length !== 0) {
      let countryTalentId = formData.countryTalent.filter(n => n);
      this.selectedDataBody['TrLocationId'] = countryTalentId.toString();
    }

    if (formData.interviewType && formData.interviewType.length !== 0) {
      let interviewTypeId = formData.interviewType.filter(n => n);
      this.selectedDataBody['InterviewType'] = interviewTypeId.toString();
    }

    if (formData.accountId && formData.accountId.length !== 0) {

      if (formData.projectID == null || formData.projectID == 'undefined' || formData.projectID.length === 0) {
        let accountId = formData.accountId.filter(n => n);
        this.selectedDataBody['AccountId'] = accountId.toString();
      }
    }
    if (formData.projectID && formData.projectID.length !== 0) {
      let projectID = formData.projectID.filter(n => n);
      this.selectedDataBody['ProjectID'] = projectID.toString();
    }
    if (formData.name) {
      this.selectedDataBody['name'] = formData.name
    }
    if (formData.email) {
      this.selectedDataBody['email'] = formData.email
    }
   
    if (formData.dateFrom) {
     // this.selectedDataBody['dateFrom'] = formData.dateFrom
      this.selectedDataBody['ProfileAdditionStartDate'] = GlobalMethod.formatDate(formData.dateFrom);
    }
    if (formData.dateTo) {
     // this.selectedDataBody['dateTo'] = formData.dateTo
      this.selectedDataBody['ProfileAdditionEnddate'] = GlobalMethod.formatDate(formData.dateTo);
    }

    if (formData.telentId != "all") {
      this.selectedDataBody['TalentId'] = formData.telentId
    }
    if (formData.recruiterEmpID != "all") {
      this.selectedDataBody['RecruiterEmpID'] = formData.recruiterEmpID
    }
    if (formData.hiringManager != "all") {
      this.selectedDataBody['HiringManager'] = formData.hiringManager;
    }

    if (formData.partner != "all") {
      this.selectedDataBody['partner'] = formData.partner;
    }
  
    if (formData.requisitionType != "all") {
      this.selectedDataBody['RequisitionType'] = formData.requisitionType
    }
    if (formData.lastUpdatedProfile != "0" || formData.lastUpdatedProfile != 0) {
      this.selectedDataBody['NoOfPastDays'] = parseInt(formData.lastUpdatedProfile);
    }
    if (formData.noticePeriod != "0" || formData.noticePeriod != 0) {
      this.selectedDataBody['NPMax'] = parseInt(formData.noticePeriod);
    }
    if (formData.orgName) {
      this.selectedDataBody['orgName'] = formData.orgName
    }
    if (formData.RatingScore) {
      this.selectedDataBody['RatingScoreMin'] = formData.RatingScore[0];
      this.selectedDataBody['RatingScoreMax'] = formData.RatingScore[1];
    }
    this.sortFilterData.emit(this.selectedDataBody);
  }
  /***
   * get value on change
   */
  // getControlValueOnChange() {
  //   /***
  //    * if name changes
  //    */
  //   this.nameControl.valueChanges.
  //     pipe(
  //       distinctUntilChanged(),
  //       debounceTime(500)
  //     ).subscribe(
  //       val => {
  //         this.candidateName = val;
  //         this.transformValueForServer(this.searchFilterFormGroup.value);
  //       }
  //     );

  //   /***
  // * if email changes
  // */
  //   this.emailControl.valueChanges.
  //     pipe(
  //       distinctUntilChanged(),
  //       debounceTime(500)
  //     ).subscribe(
  //       val => {
  //         if (COMMON_CONST.emailregex.test(val)) {
  //           this.candidateEmail = val;
  //           this.transformValueForServer(this.searchFilterFormGroup.value);

  //         }
  //         else {
  //           this.transformValueForServer(this.searchFilterFormGroup.value);
  //         }
  //       }
  //     );

  // }

  apply(){
    this.transformValueForServer(this.searchFilterFormGroup.value);
  }
 
  /***
   * get Skill
   */
  getSkillId(e) {
    this.selectedDataBody = {};
   // this.transformValueForServer(this.searchFilterFormGroup.value);
  }

  /***
 * get Sources
 */
  getSource(e) {
    this.selectedDataBody = {};
   // this.transformValueForServer(this.searchFilterFormGroup.value);
  }

  /***
   * int type
   */
  getSelectedIntTypeId(e) {
    this.selectedDataBody = {};
   // this.transformValueForServer(this.searchFilterFormGroup.value);
  }
 /***
   * TalentId
   */
  getTalentId(e) {
    this.selectedDataBody = {};
  //  this.transformValueForServer(this.searchFilterFormGroup.value);
  }

   /***
   * Recruiter Emp ID
   */
  getRecEmpId(e) {
    this.selectedDataBody = {};
   // this.transformValueForServer(this.searchFilterFormGroup.value);
  }
/**
 * Hirring Manager id
 * @param e 
 */
  getHiringMEmpId(e) {
    this.selectedDataBody = {};
   // this.transformValueForServer(this.searchFilterFormGroup.value);
  }

 /**
  * experience 
  */
  expControlUpdate() {
    this.selectedDataBody = {};
   // this.transformValueForServer(this.searchFilterFormGroup.value);
  }

  /**
   * last updated profile
   * @param e 
   */
  lastUpdateProf(e) {
    this.selectedDataBody = {};
   // this.transformValueForServer(this.searchFilterFormGroup.value);
  }

  /**
   * notice period
   * @param e 
   */
  noticperiod(e){
    this.selectedDataBody = {};
   // this.transformValueForServer(this.searchFilterFormGroup.value);
  }

  /***
   * get Account id
   */
  public acListId: any = [];
  getAccount(e) {
    this.acListId = e;
    this.selectedDataBody = {};
   // this.transformValueForServer(this.searchFilterFormGroup.value);
  }
  /****
   * get Project id
   */
  getProject(e) {
    this.selectedDataBody = {};
  //  this.transformValueForServer(this.searchFilterFormGroup.value);
  }

   /**
    * Requisition Type
    * @param e 
    */
  getReqType(e) {
    this.selectedDataBody = {};
   // this.transformValueForServer(this.searchFilterFormGroup.value);
  }

  /***
   * hide show filter box
   */
  hideShow(e) {
    let domBody = e.currentTarget.parentNode.parentNode.parentNode.parentNode.nextSibling;
    let domHead = e.currentTarget.parentNode.parentNode.parentNode.parentNode;
    domBody.classList.toggle("frmHide");
    domHead.classList.toggle("frmHideHd");
  }
  /***
   * left bar filter hide show
   */
  toggleClass(): void {
    document.body.classList.toggle('page-fluid-wrap');
  }

  /***
   * hide all
   */
  removeClass() {
    let header = document.querySelectorAll('.search-form-box-header');
    let body = document.querySelectorAll('.search-form-box-body');
    for (let i = 0; i < header.length; i++) {
      header[i].classList.remove('frmHideHd')
    }
    for (let i = 0; i < body.length; i++) {
      body[i].classList.remove('frmHide')
    }
  }

   //sub list id for Interview status
   public intSubListIds:any= [];
   public isIntSubList:boolean = false;
   getIdForIntSubList(data:any){
       if(data.length != 0){
         this.subListTypeInt.reset();
         this.isIntSubList = true;
         this.intSubListIds = data;
       }
       else{
             this.isIntSubList = false;
             this.subListTypeInt.reset();
           }
   }

   //sub list id for offer status
   public offSubListIds:any= [];
   public isOffSubList:boolean = false;
   getIdForOffSubList(data:any){
       if(data.length != 0){
         this.subListTypeOff.reset();
         this.isOffSubList = true;
         this.offSubListIds = data;
       }
       else{
             this.isOffSubList = false;
             this.subListTypeOff.reset();
           }
   }
}
