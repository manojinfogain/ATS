import { Options } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';

@Component({
  selector: 'app-filter-sort',
  templateUrl: './filter-sort.component.html',
  styleUrls: ['./filter-sort.component.scss']
})
export class FilterSortComponent implements OnInit, OnChanges {
  @ViewChild(MatMenuTrigger) trigger?: MatMenuTrigger;
  @Input() public FilterTitle: string = 'Filter By';
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  public statusList: any = [];
  public accountList: any = [];
  public listData: any = [];
  public recruiterList: any = [];
  @Output() sendSortData = new EventEmitter<string>();
  @Output() getDateOutput = new EventEmitter<any>();
  @Output() getSortFormData = new EventEmitter<string>();
  @Output() resetForm = new EventEmitter<boolean>();
  @Input() public minDate: any = new Date();
  public minDate2: any = new Date();
  public minDate3: any = new Date();
  @Input() public maxDate: any = '';
  @Input() public maxDate2: any = '';
  @Input() public maxDate3: any = '';
  @Input() public minDateFrom: any = '';
  @Input() public minDateFrom2: any = '';
  @Input() public minDateFrom3: any = '';
  @Input() isResetForm?: boolean = false;
  @Input() candidateStatus: boolean = false;
  @Input() candidateStatusTitle: string = 'Candidate Status';
  @Input() partnerStatusTitle: string = 'Partner Status';
  @Input() partnerContractStatusTitle: string = 'Contract Status';
  @Input() interviewType: boolean = false;
  @Input() interviewBy: boolean = false;
  @Input() dateRange: boolean = false;
  @Input() dateRangeStartToEnd: boolean = false;

  @Input() dateRangeTitle: string = 'Date';
  @Input() dateRangeTitle2: string = 'Date';
  @Input() dateRangeThird: boolean = false;
  @Input() dateRangeThirdTitle: string = 'Date';
  @Input() account: boolean = false;
  @Input() prSkill: boolean = false;
  @Input() deliveryUnits: boolean = false;
  @Input() PartnerID: boolean = false;
  @Input() PartnerMulti: boolean = false;
  @Input() pageType?: string;
  @Input() requiredDateStart: boolean = false;
  @Input() DateStartDefaultValue: any = '';
  @Input() skillMulti: boolean = false;
  @Input() HMList: boolean = false;
  @Input() HMMulti: boolean = false;
  @Input() recMulti: boolean = false;
  @Input() requisitionMulti: boolean = false;
  @Input() accountMulti: boolean = false;
  @Input() accountHead: boolean = false;
  @Input() accountHeadMulti: boolean = false;
  @Input() duMulti: boolean = false;
  @Input() recruiter: boolean = false;
  @Input() companyLocation: boolean = false; //
  @Input() Division: boolean = false; //
  @Input() LocationMulti: boolean = false;
  @Input() DivisionMulti: boolean = false;
  @Input() talentSubMulti: boolean = false;
  @Input() ContractType: boolean = false;
  @Input() contractTypeMulti: boolean = false;
  @Input() ContractTypeUS: boolean = false;
  @Input() contractTypeMultiUS: boolean = false;
  @Input() profileSoure: boolean = false;
  @Input() profileSourMulti: boolean = false;
  @Input() candidateStatusNew: boolean = false;
  @Input() candidateStatusMultiNew: boolean = false;
  @Input() candidateStatusMulti: boolean = false;
  @Input() interviewByNewControl: boolean = false;
  @Input() registeredPartnerStatusControl: boolean = false;

  @Input() interviewByMulti: boolean = false;
  @Input() interviewTypeNew: boolean = false;
  @Input() regisPartnerStatusMulti: boolean = false;
  @Input() PartnerContractsStatus: boolean = false;
  @Input() partnerContractStatusMulti: boolean = false;
  @Input() interviewTypeMulti: boolean = false;
  @Input() offrStatusMulti: boolean = false;
  @Input() bgvFinalStatusMulti: boolean = false;
  @Input() talentSubStatus: boolean = false;
  @Input() profileSourceTitle: string = 'Profile Source';
  @Input() recruiterTitle: string = 'Recruiter';
  @Input() statusAssign: boolean = false;
  @Input() statusAssignTitle: string = 'Status';
  @Input() isBillableVisible: boolean = false;
  @Input() noticePeriod: boolean = false;
  @Input() snoticePeriodTitle: string = 'Notice Period';
  @Input() companyLocationTitle: string = 'Location';
  @Input() DivisionTitle: string = 'Division';
  @Input() ContractTypeTitle: string = 'Contract Type';
  @Input() employementTypeTitle: string = 'Employment Type';
  @Input() partnerTitle: string = 'Partner';
  @Input() subStatusTitle: string = 'Sub Status';
  @Input() offerStatus: boolean = false;
  @Input() bgvFinalStatus: boolean = false;
  @Input() onboardStatus: boolean = false;
  @Input() onboardStatusMulti: boolean = false;
  @Input() onboardStatusTitle: string = 'Candidate Status';
  @Input() onboardSubStatus: boolean = false;
  @Input() onboardSubStatusMulti: boolean = false;
  @Input() onboardSubStatusTitle: string = 'Pre Onboarding Forms Status';
  @Input() day1SubStatus: boolean = false;
  @Input() day1SubStatusMulti: boolean = false;
  @Input() day1SubStatusTitle: string = 'Day 1 Forms Status';
  @Input() offerStatusIds: any = [];
  @Input() bgvFinalStatusIds: any = [];
  @Input() dropPendingWithMeOfferApr: boolean = false;
  @Input() offerStatusTitle: string = 'Status';
  @Input() bgvFinalStatusTitle: string = 'BGV Final Status';
  @Input() requisitionType: boolean = false;
  @Input() requisitionTypeTitle: string = 'Select Requisition Type';
  @Input() isPractice: boolean = false;
  @Input() isCountryCskill: boolean = false;
  @Input() isExperinceSlider: boolean = false;
  @Input() isTalentStatus: boolean = false;
  @Input() isTalentStatusTitle: string = 'Status';
  @Input() talentStatusMulti: boolean = false;
  @Input() practiceMulti: boolean = false;
  @Input() countryCskilldMulti: boolean = false;
  public practiceDataList: any = [];
  @Input() isPrCommunity: boolean = false;
  @Input() prCommunityMulti: boolean = false;
  @Input() isSubPractice: boolean = false;
  @Input() subPracticeMulti: boolean = false;

  @Input() grade: boolean = false; //
  @Input() gradeTitle: string = 'Grade';
  @Input() gradeMulti: boolean = false;

  @Input() ijpStatus: boolean = false; //
  @Input() ijpStatusTitle: string = 'IJP Status';
  @Input() ijpStatusMulti: boolean = false;
  @Input() companyLocationIds: any = [];
  @Input() gradeIds: any = [];
  @Input() screenType: string = '';
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlAccount: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlRecruiter: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public searchInputAccount: string;
  public searchInputRecruiter: string;
  public skillDataList: any = [];
  public deliveryUnitList: any = [];
  @Input() checkboxFun: boolean = false;
  @Input() checkboxPendingWithMe: boolean = false;
  @Input() checkboxPendingForBuddyAssign: boolean = false;
  @Input() isByDefaultPendingChecked: boolean = false;
  @Input() AppliedListCheckBoxIjp: boolean = false;
  @Input() CheckBoxFilter: boolean = false;
  @Input() CheckBoxFilterTitle: string = 'Show Salary Details';
  @Input() appliedIjpTitle: string = 'Applied Employees';
  @Input() public statusData: any = CONSTANTS.statusAs;
  public FilterCtrlOfferStatus: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlCandiStatus: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlBgvFinalStatus: UntypedFormControl = new UntypedFormControl();
  public searchInputOffer: string = '';

  @Input() designation: boolean = false;
  @Input() DesignationTitle: string = 'Designation';
  @Input() IsAccountByDu: boolean = false;
  @Input() public contractIds: any = [];
  @Input() public contractIdsUS: any = [];
  @Input() subList: boolean = false;
  @Input() subListMulti: boolean = false;
  @Input() subListTitle: string = '';
  @Input() isTextBoxCtrl: boolean = false;
  @Input() textBoxTitle: string = 'Company  Name ';
  @Input() textBoxPlacHolder: string = 'Enter Company  Name';
  @Input() panelMulti: boolean = false;
  @Input() panelCtrl: boolean = false;
  @Input() panelCtrlTitle: string = 'Panel';
  @Input() public PanelList: any = [];
  public interviewByList: any = CONSTANTS.InterViewByListData;
  public Time24HrsList: any = CONSTANTS.time24Hours;
  @Input() timeCtrl: boolean = false;
  @Input() isRangeSlider: boolean = false;
  @Input() rangeSliderLabel: string = 'Experience Range';
  @Input() rangeSliderToolTip: string = 'Select Experience Range';
  @Input() rangeSliderLabelHover: string = 'Year';
  @Input() isRangeSliderNP: boolean = false;
  @Input() rangeSliderLabelNP: string = 'Experience Range';
  @Input() rangeSliderToolTipNP: string = 'Select Experience Range';
  @Input() rangeSliderLabelHoverNP: string = 'Year';
  @Input() isNumberSliderRange: boolean = false;
  @Input() numberSliderLabel: string = 'Profile Match (%)';
  @Input() numberSliderTooltip: string = '';
  @Input() numberSliderLabelHover: string = '';
  @Input() oppMulti: boolean = false;
  @Input() isOppVisbile: boolean = false;
  @Input() oppIdTitle: string = 'Opportunity';
  @Input() isBizOpsVisible: boolean = false;
  @Input() bizOpsMulti: boolean = false;
  @Input() bizOpsTitle: string = 'Opportunity';

 @Input() isMuAllocationVisible: boolean = false;
  constructor(
    private _intCommonServe: InterviewCommonService,
    private _globalServe: GlobalApisService
  ) { }

  public optionsRange: Options;
  public optionsNumberRange: Options;
  @Input() rangeSliderfloor: number = 0;
  @Input() rangeSliderceil: number = 50;
  @Input() rangeSliderstep: number = 1;
  @Input() rangeSliderminRange: number = 1;
  public optionsRangeNP: Options;
  @Input() rangeSliderfloorNP: number = 0;
  @Input() rangeSliderceilNP: number = 50;
  @Input() rangeSliderstepNP: number = 1;
  @Input() rangeSliderminRangeNP: number = 1;
  valueijp: number = 20;        // starting thumb
  highValueijp: number = 100;
  ngOnInit(): void {

    this.optionsRange = {
      floor: this.rangeSliderfloor,
      ceil: this.rangeSliderceil,
      step: this.rangeSliderstep,
      minRange: this.rangeSliderminRange,
      translate: (value: number): string => {
        return value + (this.rangeSliderLabelHover || '');
      }
    };
    this.optionsRangeNP = {
      floor: this.rangeSliderfloorNP,
      ceil: this.rangeSliderceilNP,
      step: this.rangeSliderstepNP,
      minRange: this.rangeSliderminRangeNP,
      translate: (value: number): string => {
        return value + (this.rangeSliderLabelHoverNP || '');
      }
    };
    this.optionsNumberRange = {
      floor: 1,
      ceil: 100,
      step: 1,
      minRange: 1,
      //hideLimitLabels: true,    // min aur max labels (0, 100)remove
      showTicksValues: false,   // ticks aur unke values hata dega
       showTicks: false,
      translate: (value: number): string => {
        return value + (this.numberSliderLabelHover || '');
      }
    };
    if (this.candidateStatus) {
      this.GetInterviewStatus();
    }
    if (this.interviewType) {
      this.getIntType();
    }
    // if(this.companyLocation){
    //   this.getLocation();
    // }
    if (this.offerStatus) {
      // this.getOfferStatus();
    }
    if (this.ContractType) {
      // this.getContractList();
    }




    // this.getAllRecruiter();
  }



  // public contactList: any = [];
  // getContractList() {
  //   this._globalServe.GetContractTypes().subscribe(
  //     res => {
  //       this.contactList = res['data'];
  //     }
  //   )
  // }
  // public locationData:any = [];
  // getLocation(){
  //   this._globalServe.getLocationList().subscribe(
  //    res=>{
  //      this.locationData = res['data']
  //    }
  //   )
  // }

  /***
 * get Int Status
 */
  //  public offerStatusList: any = [];
  // getOfferStatus(): void {
  //   this._globalServe.getAllOfferStatus().subscribe(
  //     res => {
  //       let filterById
  //       if (this.offerStatusIds?.length === 0) {
  //         // filterById = [140, 160, 200, 180, 220]
  //         this.offerStatusList = res['data'];
  //       }
  //       else {
  //         filterById = this.offerStatusIds;
  //         let filterByStatus = res['data'].filter(t => {
  //           return filterById.indexOf(t.statusId) !== -1;
  //         });
  //         this.offerStatusList = filterByStatus;
  //       }

  //     }

  //   );
  //   this.FilterCtrlOfferStatus.valueChanges.subscribe(
  //     get => {
  //       this.searchInputOffer = get;
  //     }
  //   )
  // }


  /***
   * get Int Status
   */
  GetInterviewStatus(): void {
    this._intCommonServe.getIntStatusList().subscribe(
      res => {
        this.statusList = res;
        this.FilterCtrlCandiStatus.valueChanges.subscribe(
          get => {
            this.searchInput = get;
          }
        )
        // let dropReasonId:any =[];
        // console.log(res);
        // this.statusList.forEach(ele => {
        //   if(ele.statusId == 240 || 260){
        //     dropReasonId.push(ele.statusId);
        //   }
        // });
        // this.getIdForSubList(dropReasonId);
      }
    );
  }
  /***
 * get Int Status
 */
  getAllRecruiter(): void {
    this._intCommonServe.getRecruiterList().subscribe(
      res => {
        this.recruiterList = res['data'];
        this.FilterCtrlRecruiter.valueChanges.subscribe(
          val => {
            this.searchInputRecruiter = val;
          }
        )
      }
    );
  }

  /***
 * get Interview Type
 */
  getIntType() {
    this._intCommonServe.getInterviewType().subscribe(
      res => {
        this.listData = res['data'];
      }

    );
  }

  ngOnChanges() {
    /**
     * if change detect
     */
    if (this.isResetForm) {
      this.form.reset();
      this.experienceRange?.reset();
      this.RangeSlider?.reset();
      this.RangeSliderNP?.reset();
      this.numberRange?.reset();
      this.setControl();
    }
  }

  @Input() filterAccount: string = '';
  //du id list
  @Input() public duIdList: any = [];
  getDuID(data: any) {
    if (data?.length != 0) {
      this.accountType?.reset();
      this.duIdList = data;
    } else {
      this.accountType?.reset();
    }
  }

  //practice id list
  @Input() public practiceIds: any = [];
  getPracticeId(data: any) {
    if (data?.length != 0) {
      this.practiceIds = data;
      this.subPracticeId?.reset();
      this.prCommunityId?.reset();
    } else {
      this.subPracticeId?.reset();
      this.prCommunityId?.reset();
    }
  }

  //sub list id 
  @Input() public subListIds: any = [];
  public isSubList: boolean = false;
  getIdForSubList(data: any) {
    if (data?.length != 0) {
      this.subListType?.reset();
      this.isSubList = true;
      this.subListIds = data;
    }
    else {
      this.isSubList = false;
      this.subListType?.reset();
    }
  }

  candStatusOptionChange(data: any) {
    let dropReasonId = [];
    if (data == 240 || data == 260) {
      dropReasonId.push(data);
    }
    this.getIdForSubList(dropReasonId);
  }

  /***
   * reset filter form
   */
  reset() {
    this.form.reset();
    this.setControl();
    let generateQueryParam = '';
    this.sendSortData.emit(generateQueryParam.trim());
    this.getDateOutput.emit({ startDate: null, endDate: null });
    this.getSortFormData.emit(this.form.value);
    this.resetForm.emit(true);
    this.isSubList = false;
    // this.duIdList = [];
  }

  /***
  * set
  */
  setControl() {
    this.toDate?.disable();
    this.form.get('statusId')?.setValue('all');
    this.form.get('InterviewTypeId')?.setValue('all');
    this.form.get('InterviewById')?.setValue('all');
    //  this.form.get('experienceRange')?.setValue(null);
    //  this.form.get('PartnerID')?.setValue('all');
    //this.form.get('ContractType')?.setValue('all');
    // this.form.get('recruiterId')?.setValue('all');
    this.form.get('statusAssignId')?.setValue('all');
    this.form.get('isBillable')?.setValue('all');
    this.form.get('noticePeriod')?.setValue('all');
    //this.form.get('location')?.setValue('all');
    // this.form.get('requisitionType')?.setValue('all');
    // this.form.get('offerstatus')?.setValue('all');
    this.form.get('designationId')?.setValue('all');
    //this.form.get('accountType')?.setValue('all');
    //  this.form.get('deliveryUnit')?.setValue('all');
    //this.designationControl.patchValue('all');
     this.form.get('isMuAllocation')?.setValue('all');
    this.skillMulti ? this.primarySkill.reset() : this.primarySkill?.setValue('all');
    this.accountMulti ? this.accountType.reset() : this.accountType?.setValue('all');
    this.duMulti ? this.deliveryUnit.reset() : this.deliveryUnit?.setValue('all');
    this.HMMulti ? this.HMId.reset() : this.HMId?.setValue('all');
    this.recMulti ? this.recruiterIdControl.reset() : this.recruiterIdControl?.setValue('all');
    this.panelMulti ? this.PanelIdControl.reset() : this.PanelIdControl?.setValue('all');
    //mine requsi
    this.requisitionMulti ? this.requisitionTypeControl.reset() : this.requisitionTypeControl?.setValue('all');
    this.LocationMulti ? this.locationControl.reset() : this.locationControl?.setValue('all');
    this.DivisionMulti ? this.DivisionControl.reset() : this.DivisionControl?.setValue('all');
    this.talentSubMulti ? this.talentSubStatusControl.reset() : this.talentSubStatusControl?.setValue('all');
    this.contractTypeMulti ? this.ContractTypeControl.reset() : this.ContractTypeControl?.setValue('all');
     this.contractTypeMultiUS ? this.ContractTypeControlUS.reset() : this.ContractTypeControlUS?.setValue('all');
    this.offrStatusMulti ? this.offerStatusControl.reset() : this.offerStatusControl?.setValue('all');
    this.bgvFinalStatusMulti ? this.bgvFinalStatusControl.reset() : this.bgvFinalStatusControl?.setValue('all');
    this.accountHeadMulti ? this.accountHeadCtrl.reset() : this.accountHeadCtrl?.setValue('all');
    this.profileSourMulti ? this.profileSourceControl.reset() : this.profileSourceControl?.setValue('all');
    this.candidateStatusMulti ? this.candidateStatusControl.reset() : this.candidateStatusControl?.setValue('all');
    this.interviewByMulti ? this.InterviewByIdNewControl.reset() : this.InterviewByIdNewControl?.setValue('all');
    this.regisPartnerStatusMulti ? this.regisPartnerStatusControl.reset() : this.regisPartnerStatusControl?.setValue('all');
    this.interviewTypeMulti ? this.InterviewTypeIdNewControl.reset() : this.InterviewTypeIdNewControl?.setValue('all');
    this.candidateStatusMultiNew ? this.candidateStatusNewControl.reset() : this.candidateStatusNewControl?.setValue('all');
    this.PartnerMulti ? this.PartnerIDControl.reset() : this.PartnerIDControl?.setValue('all');
    this.subListMulti ? this.subListType.reset() : this.subListType?.setValue('all');
    this.practiceMulti ? this.practiceId.reset() : this.practiceId?.setValue('all');
    //ar
    this.countryCskilldMulti ? this.countryCskilld.reset() : this.countryCskilld?.setValue('all');
    this.prCommunityMulti ? this.prCommunityId.reset() : this.prCommunityId?.setValue('all');
    this.subPracticeMulti ? this.subPracticeId.reset() : this.subPracticeId?.setValue('all');
    this.talentStatusMulti ? this.talentStatusIDControl.reset() : this.talentStatusIDControl?.setValue('all');
    this.onboardStatusMulti ? this.onboardStatusControl.reset() : this.onboardStatusControl?.setValue('all');
    this.onboardSubStatusMulti ? this.onboardSubStatusControl.reset() : this.onboardSubStatusControl?.setValue('all');
    this.day1SubStatusMulti ? this.day1SubStatusControl.reset() : this.day1SubStatusControl?.setValue('all');

    this.gradeMulti ? this.gradeControl.reset() : this.gradeControl?.setValue('all');
    this.gradeMulti ? this.ijpStatusControl.reset() : this.ijpStatusControl?.setValue('all');
    this.endTimeControl?.reset();
    this.startTimeControl?.reset();

    this.partnerContractStatusMulti ? this.partnerContractsStatusControl.reset() : this.partnerContractsStatusControl?.setValue('all');
    this.oppMulti ? this.OppIdCtrl.reset() : this.OppIdCtrl?.setValue('all');
    this.bizOpsMulti ? this.bizOpsLeadCtrl.reset() : this.bizOpsLeadCtrl?.setValue('all');
    this.numberRange?.reset();



  }

  get formDate() { return this.form.get('dateFrom') };
  get toDate() { return this.form.get('dateTo') };
  get dateStart() { return this.form.get('dateStart') };
  get dateEnd() { return this.form.get('dateEnd') };

  get dateStartThree() { return this.form.get('dateStartThree') };
  get dateEndThree() { return this.form.get('dateEndThree') };

  get primarySkill() { return this.form.get('primarySkill') };
  get HMId() { return this.form.get('HMId') };
  get accountType() { return this.form.get('accountType') };
  get deliveryUnit() { return this.form.get('deliveryUnit') };
  get PartnerIDControl() { return this.form.get('PartnerID') };
  get ContractTypeControl() { return this.form.get('ContractType') };
    get ContractTypeControlUS() { return this.form.get('ContractTypeUS') };
  get offerStatusControl() { return this.form.get('offerstatus') };
  get bgvFinalStatusControl() { return this.form.get('bgvFinalStatus') };
  get onboardStatusControl() { return this.form.get('onboardstatus') };
  get onboardSubStatusControl() { return this.form.get('onboardsubstatus') };
  get day1SubStatusControl() { return this.form.get('day1SubStatus') };
  get recruiterIdControl() { return this.form.get('recruiterId') };
  get PanelIdControl() { return this.form.get('panelId') };
  get accountHeadCtrl() { return this.form.get('accountHeadId') };
  get noticePeriodControl() { return this.form.get('noticePeriod') };
  get locationControl() { return this.form.get('location') };
  get DivisionControl() { return this.form.get('Division') };
  get talentSubStatusControl() { return this.form.get('subStatusId') };
  get requisitionTypeControl() { return this.form.get('requisitionType') };
  get profileSourceControl() { return this.form.get('source') };
  get candidateStatusControl() { return this.form.get('statusId') };
  get InterviewByIdNewControl() { return this.form.get('interviewByIdNew') };
  get regisPartnerStatusControl() { return this.form.get('resiteredPartnerStatusID') };
  get InterviewTypeIdNewControl() { return this.form.get('interviewTypeIdNew') };
  get candidateStatusNewControl() { return this.form.get('candidateStatusNew') };
  get experienceRange() { return this.form.get('experienceRange') };
  // get experinceMin() { return this.form.get('experinceMin') };

  //get accountControl() { return this.form.get('requisitionType') };
  get designationControl() { return this.form.get('designationId') };
  get subListType() { return this.form.get('subListType') };
  get practiceId() { return this.form.get('practiceId') };
  get countryCskilld() { return this.form.get('countryCskilld') };

  get prCommunityId() { return this.form.get('prCommunityId') };
  get subPracticeId() { return this.form.get('subPracticeId') };
  get talentStatusIDControl() { return this.form.get('talentStatusID') };
  get gradeControl() { return this.form.get('grade') };
  get ijpStatusControl() { return this.form.get('ijpStatus') };

  get startTimeControl() { return this.form.get('startTime') };
  get endTimeControl() { return this.form.get('endTime') };
  get partnerContractsStatusControl() { return this.form.get('partnerContractStatusID') };
  get RangeSlider() { return this.form.get('RangeSlider') };
  get RangeSliderNP() { return this.form.get('RangeSliderNP') };
  get OppIdCtrl() { return this.form.get('oppId') };
  get bizOpsLeadCtrl() { return this.form.get('bizOpsLead') };
  get numberRange() { return this.form.get('numberRange') };

  /**slider  experince */
  public optionsExp: Options = {
    floor: 0,
    ceil: 50,
    step: 1,
    //  noSwitching: true,
    minRange: 1,
    translate: (value: number): string => {
      return value + ' Year';
    }
  };


  public expData: any = {};
  /**showing selected exp value in ui */
  expControlUpdate(data: any) {
    this.expData = data;
  }

  /***
 * change date
 */
  changeDate(type: string, event: any) {
    this.toDate?.reset();
    this.toDate?.enable();
    let date = new Date(event.value);
    // date.setDate(date.getDate()+1);
    this.minDate = new Date(event.value);
  }

  changeDate2(type: string, event: any) {
    this.dateEnd?.reset();
    this.dateEnd?.enable();
    let date = new Date(event.value);
    // date.setDate(date.getDate()+1);
    this.minDate2 = new Date(event.value);
  }

  changeDate3(type: string, event: any) {
    debugger
    this.dateEndThree?.reset();
    this.dateEndThree?.enable();
    let date = new Date(event.value);
    // date.setDate(date.getDate()+1);
    this.minDate3 = new Date(event.value);
  }
  /***
  * submit method for filter form 
  */
  submitData(data: any) {
    if (this.form.valid) {
      let formData = data.value;
      let generateQueryParam: string = '';

      generateQueryParam = `
        ${formData['dateFrom'] ? '&startDate=' + GlobalMethod.formatDate(formData.dateFrom) : this.DateStartDefaultValue ? '&startDate=' + GlobalMethod.formatDate(this.DateStartDefaultValue) : ''
        }${formData['dateTo'] ? '&endDate=' + GlobalMethod.formatDate(formData.dateTo) : ''
        }${formData['dateStart'] ? '&dateStart=' + GlobalMethod.formatDate(formData.dateStart) : this.DateStartDefaultValue ? '&dateStart=' + GlobalMethod.formatDate(this.DateStartDefaultValue) : ''
        }${formData['dateEnd'] ? '&dateEnd=' + GlobalMethod.formatDate(formData.dateEnd) : ''
        }${formData['dateStartThree'] ? '&dateStartThree=' + GlobalMethod.formatDate(formData.dateStartThree) : ''
        }${formData['dateEndThree'] ? '&dateEndThree=' + GlobalMethod.formatDate(formData.dateEndThree) : ''
        }${formData['InterviewTypeId'] != 'all' ? formData.InterviewTypeId ? '&IntType=' + formData.InterviewTypeId : '' : ''
        }${formData['statusId'] != 'all' ? formData.statusId ? '&intStatus=' + formData.statusId : '' : ''
        }${formData['primarySkill'] != 'all' ? formData.primarySkill ? '&primarySkill=' + formData.primarySkill : '' : ''
        }${formData['accountType'] != 'all' ? formData.accountType ? '&accountId=' + formData.accountType : '' : ''
        }${formData['deliveryUnit'] != 'all' ? formData.deliveryUnit ? '&DUIDs=' + formData.deliveryUnit : '' : ''
        }${formData['PartnerID'] != 'all' ? formData.PartnerID ? '&PartnerID=' + formData.PartnerID : '' : ''
        }${formData['recruiterId'] != 'all' ? formData.recruiterId ? '&recruiterId=' + formData.recruiterId : '' : ''
        }${formData['statusAssignId'] != 'all' ? formData.statusAssignId ? '&statusID=' + formData.statusAssignId : '' : ''
        }${formData['isBillable'] != 'all' ? formData.isBillable ? '&isBillable=' + formData.isBillable : '' : ''
        }${formData['checkBoxCtrl'] ? '&screenReject=1' : ''
        }${formData['noticePeriod'] != 'all' ? formData.noticePeriod ? '&NPMax=' + formData.noticePeriod : '' : ''
        }${formData['location'] != 'all' ? formData.location ? '&Location=' + formData.location : '' : ''
        }${formData['Division'] != 'all' ? formData.Division ? '&Division=' + formData.Division : '' : ''
        }${formData['requisitionType'] != 'all' ? formData.requisitionType ? '&requisitionType=' + formData.requisitionType : '' : ''
        }${formData['subStatusId'] != 'all' ? formData.subStatusId ? '&subStatusId=' + formData.subStatusId : '' : ''
        }${formData['source'] != 'all' ? formData.source ? '&source=' + formData.source : '' : ''
        }${formData['offerstatus'] != 'all' ? formData.offerstatus ? '&offerstatus=' + formData.offerstatus : '' : ''
        }${formData['bgvFinalStatus'] != 'all' ? formData.bgvFinalStatus ? '&bgvFinalStatus=' + formData.bgvFinalStatus : '' : ''
        }${formData['pendingWithMe'] ? '&pendingWithMe=1' : ''
        }${formData['PendingCases'] ? '&PendingCases=1' : '&PendingCases=0'
        }${formData['ContractType'] != 'all' ? formData.ContractType ? '&ContractType=' + formData.ContractType : '' : ''
        }${formData['ContractTypeUS'] != 'all' ? formData.ContractTypeUS ? '&ContractTypeUS=' + formData.ContractTypeUS : '' : ''
        }${formData['HMId'] != 'all' ? formData.HMId ? '&HMId=' + formData.HMId : '' : ''
        }${formData['accountHeadId'] != 'all' ? formData.accountHeadId ? '&HMId=' + formData.accountHeadId : '' : ''
        }${formData['designationId'] != 'all' ? formData.designationId ? '&designationId=' + formData.accountHeadId : '' : ''
        }${formData['subListType'] != 'all' ? formData.subListType ? '&ReasoForDropId=' + formData.subListType : '' : ''
        }${formData['InterviewById'] != 'all' ? formData.InterviewById ? '&IntBy=' + formData.InterviewById : '' : ''
        }${formData['practiceId'] != 'all' ? formData.practiceId ? '&practiceId=' + formData.practiceId : '' : ''
        }${formData['countryCskilld'] != 'all' ? formData.countryCskilld ? '&countryCskilld=' + formData.countryCskilld : '' : ''
        }${formData['experienceRange'] ? '&experienceRange=' + formData?.experienceRange : ''
        }${formData['interviewTypeIdNew'] != 'all' ? formData.interviewTypeIdNew ? '&interviewTypeIdNew=' + formData.interviewTypeIdNew : '' : ''
        }${formData['interviewByIdNew'] != 'all' ? formData.interviewByIdNew ? '&interviewByIdNew=' + formData.interviewByIdNew : '' : ''
        }${formData['candidateStatusNew'] != 'all' ? formData.candidateStatusNew ? '&candidateStatusNew=' + formData.candidateStatusNew : '' : ''
        }${formData['resiteredPartnerStatusID'] != 'all' ? formData.resiteredPartnerStatusID ? '&resiteredPartnerStatusID=' + formData.resiteredPartnerStatusID : '' : ''
        }
        ${formData['partnerContractStatusID'] != 'all' ? formData.partnerContractStatusID ? '&partnerContractStatusID=' + formData.partnerContractStatusID : '' : ''
        }
       ${formData['prCommunityId'] != 'all' ? formData.prCommunityId ? '&practiceCommunityId=' + formData.prCommunityId : '' : ''
        }${formData['subPracticeId'] != 'all' ? formData.subPracticeId ? '&practiceCommunityId=' + formData.subPracticeId : '' : ''
        }${formData['talentStatusID'] != 'all' ? formData.talentStatusID ? '&talentStatusID=' + formData.talentStatusID : '' : ''
        }${formData['onboardstatus'] != 'all' ? formData.onboardstatus ? '&onboardstatus=' + formData.onboardstatus : '' : ''
        }${formData['onboardsubstatus'] != 'all' ? formData.onboardsubstatus ? '&onboardsubstatus=' + formData.onboardsubstatus : '' : ''
        }${formData['day1SubStatus'] != 'all' ? formData.day1SubStatus ? '&day1SubStatus=' + formData.day1SubStatus : '' : ''
        }${formData['grade'] != 'all' ? formData.grade ? '&grade=' + formData.grade : '' : ''
        }${formData['appliedEmp'] ? '&appliedEmp=1' : ''
        }${formData['ijpStatus'] != 'all' ? formData.ijpStatus ? '&ijpStatus=' + formData.ijpStatus : '' : ''
        }${formData['CheckBoxFilter'] ? '&CheckBoxFilter=1' : ''
        }${formData['textBoxCtrl'] ? '&textBoxCtrl=' + formData.textBoxCtrl : ''
        }${formData['panelId'] != 'all' ? formData.panelId ? '&panelId=' + formData.panelId : '' : ''
        }${formData['startTime'] != 'all' ? formData.startTime ? '&startTime=' + formData.startTime : '' : ''
        }${formData['endTime'] != 'all' ? formData.endTime ? '&endTime=' + formData.endTime : '' : ''
        }${formData['RangeSlider'] ? '&RatingMin=' + formData?.RangeSlider[0] + '&RatingMax=' + formData?.RangeSlider[1] : ''
        }${formData['RangeSliderNP'] ? '&NPMin=' + formData?.RangeSliderNP[0] + '&NPMax=' + formData?.RangeSliderNP[1] : ''
        }${formData['numberRange'] ? '&numberMin=' + formData?.numberRange[0] + '&numberMax=' + formData?.numberRange[1] : ''
        }${formData['oppId'] != 'all' ? formData.oppId ? '&oppId=' + formData.oppId : '' : ''
        }${formData['bizOpsLead'] != 'all' ? formData.bizOpsLead ? '&bizOpsLead=' + formData.bizOpsLead : '' : ''
        }${formData['isMuAllocation'] != 'all' ? formData.isMuAllocation ? '&isMuAllocation=' + formData.isMuAllocation : '' : ''
        }
        `;

      this.sendSortData.emit(generateQueryParam.trim());
      this.getDateOutput.emit({ startDate: formData.dateFrom, endDate: formData.dateTo });
      this.getSortFormData.emit(formData);
      this.trigger?.closeMenu();
    }
  }
  // ${formData['experinceMin'] ? '&experinceMin=' + this.expData?.pointerType : ''
  //       }
  /***
   * close filter panel
   */
  close() {
    this.trigger?.closeMenu();
  }
}
