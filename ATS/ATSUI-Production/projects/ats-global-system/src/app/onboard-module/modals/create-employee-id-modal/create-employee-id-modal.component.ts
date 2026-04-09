import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { FILE_UPLOAD, GENDER_LIST, NOTICE_PERIOD } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ExternalUserGlobalApiService } from '../../../core/services/external-user-global-api.service';
import { OnboardService } from '../../onboard.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/ats-global-system/src/environments/environment';
@Component({
  selector: 'app-create-employee-id-modal',
  templateUrl: './create-employee-id-modal.component.html',
  styleUrls: ['./create-employee-id-modal.component.scss']
})
export class CreateEmployeeIdModalComponent implements OnInit, AfterViewInit {
  //
  public empIdCreationForm: UntypedFormGroup = new UntypedFormGroup({});
  public FilterCtrlNationality: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlEmpCreationDesign: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlGrade: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlLastEmployer: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlJobTitle: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlReportingMngr: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlVendor: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlSubLocation: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlDepartment: UntypedFormControl = new UntypedFormControl();
  public minDate: any = new Date();
  public minDateEnd: any = new Date();
  public genderType: any = [];
  public noticePeriod: any = NOTICE_PERIOD;
  constructor(
    public dialogRef: MatDialogRef<CreateEmployeeIdModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _extGlobalApiServ: ExternalUserGlobalApiService,
    private _onboardServ: OnboardService,
    private _share: ShareService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getCandidateDefaultDetails();
    this.getDivisionList();
    this.GetEmpCreationLocation();
    this.GetNationalityNames();
    this.GetEmployeeUnitforEmpCreation();
    this.GetRelationShipNames();
    this.GetPIMSDesignation();
    this.GetAllPIMSEmployer(1);
    this.getJobTitlesList();
    this.empIdCreationFormInit();
    this.GetVendorList();
    this.getOnboardingFormDetails();
    this.getGenderList();
  }



  ngAfterViewInit(): void {
  }


  //get company location
  // public locationList: any = [];
  // getLocation() {
  //   this._globalApiServe.getLocationList().subscribe(
  //     res => {
  //       let ids = [];
  //       if(this.divisionID == 7){
  //         ids = [1, 2, 4, 5, 16];
  //       }else{
  //         ids = [1, 2, 4, 5];
  //       }
  //       let filterLocation = res['data'].filter(loc =>{
  //          return ids.indexOf(loc.LocID)!== -1;
  //       })
  //       this.locationList = filterLocation;
  //     }
  //   );
  // }

  //get onboarding form details
  public profilePicPath:string;
  public profilePicSrc:any;
  public base64File:any;  
  public picName: string;
  getOnboardingFormDetails() {
    this._onboardServ.getOnboardingFormDetails(this.data?.candidateId, 1).subscribe(
      res => {
        this.profilePicPath = res['profilePhotoPath'][0].ProfilePhotoPath;
        this._http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${this.profilePicPath}`, { responseType: 'blob' }).subscribe(
          res => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.profilePicSrc = e.target.result;
            this.base64File = reader.result.toString().replace(/^data:.+;base64,/, '');
            this.picName = 'test.png';  
          }
          reader.readAsDataURL(new Blob([res]));
          }
        )
      }
    )
  }

  //get division list
  getGenderList() {
    this._onboardServ.getPIMSGender().subscribe(
      res => {
        this.genderType = res['data'];
        // this.getEmpCategList();
      }
    );
  }
  //get division list
  public divisionList: any = [];
  getDivisionList() {
    this._extGlobalApiServ.getEmpCreationDivision().subscribe(
      res => {
        this.divisionList = res['data'];
        this.getEmpCategList();
      }
    );
  }

  //get Employee category list
  public empCategList: any = [];
  getEmpCategList() {
    this._extGlobalApiServ.GetEmpCategoryDetails().subscribe(
      res => {
        this.empCategList = res['data'];
      }
    );
  }

  //get location list
  public locationList: any = [];
  GetEmpCreationLocation() {
    this._extGlobalApiServ.GetEmpCreationLocation().subscribe(
      res => {
        this.locationList = res['data'];
      }
    );
  }

  //get sub location list
  public searchInputSubLocation: string;
  public subLocationList: any = [];
  GetSubLocationNames(locId: number) {
    this._extGlobalApiServ.GetSubLocationNames(locId).subscribe(
      res => {
        this.subLocationList = res['data'];
        this.FilterCtrlSubLocation.valueChanges.subscribe(
          val => {
            this.searchInputSubLocation = val;
          }
        );
      }
    );
  }

  //get Nationality list
  public searchInputNationality: string;
  public nationalityList: any = [];
  GetNationalityNames() {
    this._extGlobalApiServ.GetNationalityNames().subscribe(
      res => {
        this.nationalityList = res['data'];
        this.FilterCtrlNationality.valueChanges.subscribe(
          val => {
            this.searchInputNationality = val;
          }
        );
      }
    );
  }

  //get legalEntityList
  public legalEntityList: any = [];
  GetLegalEntityByLocation(locId: number) {
    this._extGlobalApiServ.GetLegalEntityByLocation(locId).subscribe(
      res => {
        this.legalEntityList = res['data'];
      }
    );
  }

  //get Nationality list
  public empUnitList: any = [];
  GetEmployeeUnitforEmpCreation() {
    this._extGlobalApiServ.GetEmployeeUnitforEmpCreation(1).subscribe(
      res => {
        this.empUnitList = res['data'];
      }
    );
  }

  //  get delivery/DepartList list
  public searchInputDepartment: string;
  public deliveryDepartList: any = [];
  GetHorizontalDepartment(empUnitId: number) {
    this._extGlobalApiServ.GetHorizontalDepartment(empUnitId).subscribe(
      res => {
        this.deliveryDepartList = res['data'];
        this.FilterCtrlDepartment.valueChanges.subscribe(
          val => {
            this.searchInputDepartment = val;
          }
        );
      }
    );
  }

  //get relationshipList list
  public relationshipList: any = [];
  GetRelationShipNames() {
    this._extGlobalApiServ.GetRelationShipNames().subscribe(
      res => {
        this.relationshipList = res['data'];
      }
    );
  }

  //get employmentStatusList list
  public employmentStatusList: any = [];
  GetPIMSEmpStatus(CreateType: string) {
    this._extGlobalApiServ.GetPIMSEmpStatus(CreateType).subscribe(
      res => {
        this.employmentStatusList = res['data'];
      }
    );
    if (CreateType == 'E') {
      this.getControl('EmploymentStatus').patchValue('P');
      this.selectEmplStatus('P');
    } else if (CreateType == 'C' || CreateType == 'F') {
      this.getControl('EmploymentStatus').patchValue('O');
      this.selectEmplStatus('O');
    }else if (CreateType == 'T') {
      this.getControl('EmploymentStatus').patchValue('T');
      this.selectEmplStatus('T');
    } else {
      this.getControl('EmploymentStatus').reset();
    }
  }

  //get GetPIMSDesignation list
  public searchInputDesignation: string;
  public designationsList: any = [];
  GetPIMSDesignation() {
    this._extGlobalApiServ.GetPIMSDesignation().subscribe(
      res => {
        this.designationsList = res['data'];
        this.FilterCtrlEmpCreationDesign.valueChanges.subscribe(
          val => {
            this.searchInputDesignation = val;
          }
        );
      }
    );
  }

  //get GetVendor list
  public searchInputVendor: string;
  public vendorList: any = [];
  GetVendorList() {
    this._extGlobalApiServ.GetVendor().subscribe(
      res => {
        this.vendorList = res['data'];
        this.FilterCtrlVendor.valueChanges.subscribe(
          val => {
            this.searchInputVendor = val;
          }
        );
      }
    );
  }

  //get GetGradeByDesignation list
  public searchInputGrade: string;
  public desigWiseGradeList: any = [];
  GetGradeByDesignation(DesignationId: number) {
    this._extGlobalApiServ.GetGradeByDesignation(DesignationId).subscribe(
      res => {
        this.desigWiseGradeList = res['data'];
        this.FilterCtrlGrade.valueChanges.subscribe(
          val => {
            this.searchInputGrade = val;
          }
        );
        let gradeId = res['Table1'][0]?.GRADE_ID;
        // this.getControl('Grade').patchValue(gradeId);
        this.GetReportingManagerBYGrade(gradeId);
      }
    );
  }

  //get GetReportingManagerBYGrade list
  public searchInputReportingMngr: string
  public gradeWiseRMList: any = [];
  GetReportingManagerBYGrade(GradeId: number) {
    this._extGlobalApiServ.GetReportingManagerBYGrade(GradeId).subscribe(
      res => {
        this.gradeWiseRMList = res['data'];
        this.FilterCtrlReportingMngr.valueChanges.subscribe(
          val => {
            this.searchInputReportingMngr = val;
          }
        );
      }
    );
  }

  //get prevEmployerList list
  public searchInputLastEmployer: string;
  public prevEmployerList: any = [];
  GetAllPIMSEmployer(flag: number) {
    this._extGlobalApiServ.GetAllPIMSEmployer(flag).subscribe(
      res => {
        this.prevEmployerList = res['data'];
        this.FilterCtrlLastEmployer.valueChanges.subscribe(
          val => {
            this.searchInputLastEmployer = val;
          }
        );
      }
    );
  }

  //get jobTitleList list
  public searchInputJobTitle: string;
  public jobTitleList: any = [];
  getJobTitlesList() {
    this._extGlobalApiServ.GetPIMSDesignationNames().subscribe(
      res => {
        this.jobTitleList = res['data'];
        this.FilterCtrlJobTitle.valueChanges.subscribe(
          val => {
            this.searchInputJobTitle = val;
          }
        );
      }
    );
  }

  //get getTeamPractice list
  public teamPracticeList: any = [];
  getTeamPracticeList() {
    if (this.getControl('EmployeeUnit')?.value == 1 && this.divisionID == 'A') {
      this._extGlobalApiServ.getTeamPracticeList().subscribe(
        res => {
          this.teamPracticeList = res['data'];
        }
      );
    }
  }

  public isContractor: boolean = false;
  public isTrainee: boolean = false;
  getCreateType(event: any) {
    // this.getConfirmDueDate();
    this.GetPIMSEmpStatus(event);
    if (event == 'C' || event == 'F') {
      this.isContractor = true;
      this.isTrainee = false;
      this.getControl('EmploymentStatus').patchValue('O');
      this.getControl('Designation').patchValue(15);
      this.GetGradeByDesignation(15);
      // this.getControl('Grade').disable();
      this.getControl('NoticePeriod').patchValue(30);
      this.getControl('isBootCampJoinee').reset();
      this.getControl('regularizationFromDate').reset();
      this.getControl('regularizationFromDate').clearValidators();
      this.getControl('ConfirmDueDate').reset();
      this.getControl('ConfirmDueDate').clearValidators();
      if(event == 'C'){
        this.getControl('contractorPayrollType').patchValue('Of');
      }else{
        this.getControl('contractorPayrollType').patchValue('On');
      }
      this.getControl('JobTitleEffFrom').reset();
      this.getControl('JobTitleEffFrom').clearValidators();
      this.getControl('contractEndDate').setValidators([Validators.required]);
      this.getControl('trainingEndDate').reset();
      this.getControl('trainingEndDate').clearValidators();
      this.getControl('traineeType').reset();
    } else if (event == 'T') {
      this.isContractor = false;
      this.isTrainee = true;
      this.getControl('EmploymentStatus').patchValue('T');
      this.getControl('Designation').reset();
      // this.getControl('Grade').enable();
      this.getControl('Grade').reset();
      this.getControl('NoticePeriod').patchValue(60);
      this.getControl('isBootCampJoinee').patchValue('Y');
      this.getIsBootCampJoinee('Y');
      
      // this.getControl('traineeType').patchValue('SL');
      this.getControl('JobTitleEffFrom').patchValue(new Date(this.getControl('DateOfJoining')?.value));
      // this.getConfirmDueDate();
        this.getControl('contractorPayrollType').clearValidators();
        this.getControl('contractorPayrollType').reset();
        this.getControl('contractEndDate').reset();
        this.getControl('contractEndDate').clearValidators();
    } else {
      this.isContractor = false;
      this.isTrainee = false;
      this.getControl('EmploymentStatus').patchValue('P');
      this.getControl('Designation').reset();
      // this.getControl('Grade').enable();
      this.getControl('Grade').reset();
      this.getControl('NoticePeriod').patchValue(90);
      this.getControl('isBootCampJoinee').reset();
      this.getControl('regularizationFromDate').reset();
      this.getControl('regularizationFromDate').clearValidators();
      this.getControl('ConfirmDueDate').clearValidators();
      this.getConfirmDueDate();
      this.getControl('trainingEndDate').reset();
      this.getControl('trainingEndDate').clearValidators();
      this.getControl('JobTitleEffFrom').patchValue(new Date(this.getControl('DateOfJoining')?.value));
      this.getControl('contractorPayrollType').clearValidators();
      this.getControl('contractorPayrollType').reset();
      this.getControl('contractEndDate').reset();
      this.getControl('contractEndDate').clearValidators();
      this.getControl('traineeType').reset();
    }
    
    this.getControl('contractorPayrollType').updateValueAndValidity();
    this.getControl('JobTitleEffFrom').updateValueAndValidity();
    this.getControl('trainingEndDate').updateValueAndValidity();
    this.getControl('contractEndDate').updateValueAndValidity();
    this.getControl('regularizationFromDate').updateValueAndValidity();
    this.getControl('ConfirmDueDate').updateValueAndValidity();
  }

  getDesignationId(event: any) {
    this.GetGradeByDesignation(event);
  }

  //get Regularization Date
  getRegularizationDate(){
    let createType = this.getControl('createType')?.value;
    let empStatus = this.getControl('EmploymentStatus')?.value
    if(createType == 'T' || empStatus == 'T'){
      this.getControl('regularizationFromDate').patchValue(new Date(this.getControl('DateOfJoining')?.value));
    }else{
      this.getControl('regularizationFromDate').reset();
    }
  }

  /**
   * Division on changed
   * @param event 
   */
  public divisionID: string;
  divisionChanged(event: any) {
    this.divisionID = event;
    if (this.divisionID == 'N') {
      this.getControl('empCateg').enable();
      this.getControl('empCateg').patchValue(1);
      this.getControl('isPepApplicable').patchValue('Y');
      this.getControl('teamNameADT').clearValidators();
      this.getControl('teamEffectiveFrom').clearValidators();
      this.getControl('teamNameADT').reset();
      this.getControl('teamEffectiveFrom').reset();
    } else if (this.divisionID == 'A') {
      this.getControl('empCateg').disable();
      this.getControl('empCateg').patchValue(-1);
      this.getControl('isPepApplicable').reset();
      this.getTeamPracticeList();
      // this.getControl('teamNameADT').setValidators([Validators.required]);
      this.getControl('teamNameADT').clearValidators();
      this.getControl('teamEffectiveFrom').clearValidators();
      // this.getControl('teamEffectiveFrom').setValidators([Validators.required]);      
      // this.getControl('teamEffectiveFrom').patchValue(this.getControl('DateOfJoining')?.value);
      this.getControl('teamNameADT').reset();
    } else {
      this.getControl('empCateg').disable();
      this.getControl('empCateg').patchValue(-1);
      this.getControl('isPepApplicable').reset();
      this.getControl('teamNameADT').clearValidators();
      this.getControl('teamEffectiveFrom').clearValidators();
      this.getControl('teamNameADT').reset();
      this.getControl('teamEffectiveFrom').reset();
    }

    this.getControl('teamNameADT').updateValueAndValidity();
    this.getControl('teamEffectiveFrom').updateValueAndValidity();
  }


  //form init
  empIdCreationFormInit() {
    this.empIdCreationForm = this._fb.group({
      actionType: [null, [Validators.required]],
      createType: ['E', [Validators.required]],
      freelancer: ['N'],
      DivisionID: ['I', [Validators.required]],
      empCateg: [{ value: -1, disabled: true }],
      isPepApplicable: [null],
      LocationID: [null, [Validators.required]],
      subLocationID: [null],
      Nationality: [null, [Validators.required]],
      legalEntity: [null, [Validators.required]],
      USEmpCateg: [null],
      USEmpCategEffFrom: [null],
      EmployeeUnit: [null, [Validators.required]],
      DepartmentId: [null, [Validators.required]],
      FirstName: [null, [Validators.required]],
      MiddleName: [null],
      LastName: [null],
      Gender: [null, [Validators.required]],
      Dob: [null, [Validators.required]],
      EmailId: [null, [Validators.required]],
      DomainId: [null, [Validators.required]],
      teamNameADT: [null],
      teamEffectiveFrom: [null],
      Em_Contact: [null],
      EM_ContName: [null],
      Relation: [null],
      EmploymentStatus: [null, [Validators.required]],
      isBootCampJoinee: [null],
      traineeType: [null],
      contractorPayrollType: [null],
      vendorId: [null],
      // vendorNameATS: [null],
      Designation: [null, [Validators.required]],
      Grade: [null, [Validators.required]],
      totalExpInYear: [null, [Validators.required]],
      totalExpInMonth: [null, [Validators.required]],
      LastEmployer: [null],
      // LastEmployerATS: [null],
      LeavePolicy: [null, [Validators.required]],
      JobTitle: [null, [Validators.required]],
      NoticePeriod: [90, [Validators.required]],
      JobTitleEffFrom: [null],
      DateOfJoining: [null, [Validators.required]],
      contractEndDate: [null],
      regularizationFromDate: [null],
      trainingEndDate: [null],
      ConfirmDueDate: [null],
      ReportingManager: [null],
      // uploadImage: [null, [Validators.required]]
    });
    this.getConfirmDueDate();
    this.GetPIMSEmpStatus('E');
  }

  //select employment status
  selectEmplStatus(val: any) {
    if(val == 'P' || val == 'W' || val == 'T'){
      this.getConfirmDueDate();
    }else if(val == 'C'){
      this.getControl('ConfirmDueDate').reset();
    }
  }

  getConfirmDueDate() {
    // new Date(this.joiningDate.getFullYear(),this.joiningDate.getMonth()+6,this.joiningDate.getDate())
    let joinDate = new Date(this.getControl('DateOfJoining')?.value);
    let createType = this.getControl('createType')?.value;
    let emplStatus = this.getControl('EmploymentStatus')?.value;
    let dueDate;
    if (createType == 'E') {
      dueDate = new Date(joinDate.getFullYear(), joinDate.getMonth() + 6, joinDate.getDate());
      this.getControl('ConfirmDueDate').patchValue(new Date(dueDate));
    } else if (createType == 'T') {
      dueDate = new Date(joinDate.getFullYear(), joinDate.getMonth() + 9, joinDate.getDate());
      this.getControl('ConfirmDueDate').patchValue(new Date(dueDate));
    } else if (createType == 'F') {
      if (emplStatus == 'P' || emplStatus == 'W') {
        dueDate = new Date(joinDate.getFullYear(), joinDate.getMonth() + 6, joinDate.getDate());
        this.getControl('ConfirmDueDate').patchValue(new Date(dueDate));
      }
      if (emplStatus == 'T') {
        dueDate = new Date(joinDate.getFullYear(), joinDate.getMonth() + 9, joinDate.getDate());
        this.getControl('ConfirmDueDate').patchValue(new Date(dueDate));
      }
    } else {
      dueDate = null;
      this.getControl('ConfirmDueDate').patchValue(null);
    }
  }

  getIsBootCampJoinee(event: any) {
    if (event == 'Y') {
      this.getControl('trainingEndDate').clearValidators();      
      this.getControl('trainingEndDate').reset();
      this.getControl('regularizationFromDate').setValidators([Validators.required]);
      // this.getControl('regularizationFromDate').reset();      
      this.getControl('ConfirmDueDate').setValidators([Validators.required]);
      // this.getControl('ConfirmDueDate').reset();
      this.getConfirmDueDate();
      this.getRegularizationDate();
      this.getControl('traineeType').patchValue('SB');
    } else if (event == 'N') {
      this.getControl('traineeType').patchValue('SL');
      this.getControl('trainingEndDate').setValidators([Validators.required]);
      this.getControl('regularizationFromDate').clearValidators();
      this.getControl('regularizationFromDate').reset();      
      this.getControl('ConfirmDueDate').clearValidators();
      this.getControl('ConfirmDueDate').reset();
      this.getControl('regularizationFromDate').updateValueAndValidity();
      this.getControl('ConfirmDueDate').updateValueAndValidity();
    } else {
      this.getControl('traineeType').reset();
      // this.getConfirmDueDate();
      // this.getRegularizationDate();
      // this.getControl('trainingEndDate').clearValidators();
    }
    this.getControl('trainingEndDate').updateValueAndValidity();
  }

  myFilterDate = (d: Date): boolean => {
    const day = d?.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }



  //restrict initial zero
  restrictInitialZero(e) {
    if (e.target.value.length === 0 && e.key === "0") {
      e.preventDefault();
    }
  }

  public newLocation: any = {};
  public newLocationId: number;
  /**
   * joining location on changed
   * @param event 
   */
  locChanged(event: any) {
    this.GetSubLocationNames(event);
    this.GetNewLocation(event);
    this.getControl('LeavePolicy')?.patchValue(event);
  }

  //get new location id
  GetNewLocation(e: number) {
    this._extGlobalApiServ.GetNewLocation(e).subscribe(
      res => {
        this.newLocation = res['data'][0];
        this.newLocationId = this.newLocation?.LOCATION_ID;
        this.GetSubLocationsNew(this.newLocationId);
        this.GetLegalEntityByLocation(this.newLocationId);
      }
    );
  }

  public subLocationsNewList: any = [];
  //get new location id
  GetSubLocationsNew(e: number) {
    this._extGlobalApiServ.GetSubLocationNew(this.newLocationId).subscribe(
      res => {
        this.subLocationsNewList = res['data'];
      }
    );
  }

  //on selection of employee unit
  selectEmpUnit(event: any) {
    this.GetHorizontalDepartment(event);
    this.getTeamPracticeList();
  }

  changeGrade(event: any) {
    this.GetReportingManagerBYGrade(event);
  }

  public CountryId: number;
  getCountry(e) {
    this.CountryId = e;
  }

  //get candidate default details to autofill
  public candidateDefaultDetails: any = {};
  getCandidateDefaultDetails() {
    this._extGlobalApiServ.getCandidateDefaultDetails(this.data?.candidateId).subscribe(
      res => {
        this.candidateDefaultDetails = res['data'][0];
        this.setDefaultValue(res['data'][0]);
      }
    );
  }

  //set division id as in ats
  setDivision(divId: number) {
    if (divId == 1) {
      return 'I';
    } else if (divId == 2) {
      return 'N';
    } else if (divId == 7) {
      return 'A';
    } else {

    }
  }

  //set create type on basis of employment type of cand in Ats
  setCreateType(empTypeId: number) {
    if (empTypeId == 1) {
      return 'F';
    } else if (empTypeId == 2) {
      return 'C';
    } else if (empTypeId == 3) {
      return 'E';
    } else {

    }
  }

  setDefaultValue(data: any) {
    this.empIdCreationForm.patchValue({
      // this.candidateDefaultDetails
      actionType: data?.IsConversionCase == 1 ? 'C' : 'N',
      createType: data?.EmploymentTypeID ? this.setCreateType(data?.EmploymentTypeID) : 'E',
      DivisionID: data?.DivisionID ? this.setDivision(data?.DivisionID) : 'I',
      LocationID: data?.LocationId ? data?.LocationId : null,
      EmployeeUnit: data?.EmpUnit ? data?.EmpUnit : null,
      FirstName: data?.FirstName ? data?.FirstName : null,
      MiddleName: data?.MiddleName ? data?.MiddleName : null,
      LastName: data?.LastName ? data?.LastName : null,
      Gender: data?.Gender ? data?.Gender : null,
      Dob: data?.DOB ? data?.DOB : null,
      EmailId: data?.OfficialEmailId ? data?.OfficialEmailId : null,
      DomainId: data?.DomainId ? data?.DomainId : null,
      Em_Contact: data?.EmergercyPhoneNo ? data?.EmergercyPhoneNo : null,
      EM_ContName: data?.ContactPersonName ? data?.ContactPersonName : null,
      Relation: data?.RelationId ? data?.RelationId : null,
      Designation: data?.DesignationID ? data?.DesignationID : null,      
      Grade: data?.GeadeId ? data?.GeadeId : null,
      totalExpInYear: data?.TotalExInYear ? data?.TotalExInYear : null,
      totalExpInMonth: data?.TotalExpInMonth ? data?.TotalExpInMonth : null,
      DateOfJoining: data?.DOJ ? data?.DOJ : null,
      NoticePeriod: data?.NoticePeriodInDays ? data?.NoticePeriodInDays : null,
      JobTitle: data?.JobTitleId ? data?.JobTitleId : null,
      // vendorNameATS: data?.VenderName ? data?.VenderName : null,
      // LastEmployerATS: data?.LastEmployeer ? data?.LastEmployeer : null,
      Nationality: data?.Nationality ? data?.Nationality : null,
    }, { emitEvent: false });

    if (data?.EmploymentTypeID) {
      if (data?.EmploymentTypeID == 1) {
        this.getCreateType('F');
      } else if (data?.EmploymentTypeID == 2) {
        this.getCreateType('C');
      } else if (data?.EmploymentTypeID == 3) {
        this.getCreateType('E');
      } else {

      }
    }
    if (data?.DivisionID) {
      if (data?.DivisionID == 1) {
        this.divisionChanged('I');
      } else if (data?.DivisionID == 2) {
        this.divisionChanged('N');
      } else if (data?.DivisionID == 7) {
        this.divisionChanged('A');
      } else {

      }
    }
    if (data?.LocationId) {
      this.locChanged(data?.LocationId);
    }
    if (data?.EmpUnit) {
      this.selectEmpUnit(data?.EmpUnit);
    }
    if (data?.DesignationID) {
      setTimeout(() => {           
        this.getControl('Designation').patchValue(data?.DesignationID);
        this.getDesignationId(data?.DesignationID);       
    }, 1000);
    }
    if(data?.DOJ){
      this.getDOJ(new Date(data?.DOJ));
    }
    if(data?.TotalExInYear || data?.TotalExpInMonth){
      this.lastEmployerValidation();
    }
    if (data?.GeadeId) {
      setTimeout(() => {           
          this.getControl('Grade').patchValue(data?.GeadeId);
          this.GetReportingManagerBYGrade(data?.GeadeId);        
      }, 1000);
    }
    if( data?.LastEmployeer){
      setTimeout(() => {
      let keys = Object.keys(this.prevEmployerList);
      keys.forEach(element => {       
        if(this.prevEmployerList[element]?.Employer_name?.trim().toLowerCase() == data?.LastEmployeer?.trim().toLowerCase()){
          this.getControl('LastEmployer').patchValue(this.prevEmployerList[element]?.empr_id);
        }
      });
    }, 1000);
    }
  }
  /***
   * get Designation Id
   */
  getDesignation(e: string) {
    this.getControl('gradeId').patchValue(parseInt(e));
  }
  /*
  get control Method*/
  getControl(name: string) {
    return this.empIdCreationForm.get(name);
  }

  /***
* change date
*/
  changeDate(type: string, event: any) {
    this.minDateEnd = new Date(event.value);
  }

  // public isRegularizationDateVisible:boolean = false;
  // public isTeamEffectiveFromVisible:boolean = false;
  getDOJ(e: any) {
    this.getConfirmDueDate();
    if(!this.isContractor){
      this.getControl('JobTitleEffFrom').patchValue(new Date(e));
    }
    if(this.getControl('isBootCampJoinee')?.value == 'Y'){
      this.getControl('regularizationFromDate').patchValue(new Date(e));
    }
    //if(this.isTeamEffectiveFromVisible){
    //   this.getControl('teamEffectiveFrom').patchValue(new Date(e?.value));
    // }
  }

  //upload image
  // public uploadPic: any;
  // public base64File: any;
  // public picName: string;
  // imageUpload(event) {
  //   this.uploadPic = '';
  //   let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.JPG|\.JPEG|\.PNG)$/i;
  //   let file = event.target.files[0];
  //   let fileName = file?.name;
  //   // this.getControl('uploadPic').markAsTouched();
  //   if (!allowedExtensions.exec(fileName)) {
  //     this._share.showAlertErrorMessage.next('Please upload file type jpeg/jpg/png only.');
  //     event.target.value = "";
  //     this.uploadPic = '';
  //     return false;
  //   }
  //   else if (file.size > FILE_UPLOAD.FILE_SIZE) {
  //     this._share.showAlertErrorMessage.next('file  cannot be greater than 15MB.');
  //     event.target.value = "";
  //     this.uploadPic = '';
  //     return false;
  //   }
  //   else {
  //     this.uploadPic = file;
  //     //
  //     var reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       this.base64File = reader.result.toString().replace(/^data:.+;base64,/, '');
  //       this.picName = file?.name;
  //     }
  //   }
  // }

  //last employer mandotory validation
  lastEmployerValidation(){
    let expInYear = this.getControl('totalExpInYear')?.value;
    let expInMonth = this.getControl('totalExpInMonth')?.value;
    if(expInYear && expInMonth){      
      let totalExpInMonth = parseInt(expInYear)*12 + parseInt(expInMonth);
      if(totalExpInMonth > 0){
        this.getControl('LastEmployer').enable();
        this.getControl('LastEmployer').setValidators([Validators.required]);
      }else{
        this.getControl('LastEmployer').disable();      
        this.getControl('LastEmployer').clearValidators();
      }
      this.getControl('LastEmployer').updateValueAndValidity();
    }else{      
      this.getControl('LastEmployer').disable(); 
    }
  }


  //submit emp id creation form
  empIdCreationFormSubmit(form: UntypedFormGroup) {
    
    form.markAllAsTouched();
    
    if (form.valid) {
      let empId = this._storage.getUserEmpId();
      let formValue = form.value;
      let body = {};
     // body['cid'] = this.data.cid;
      body['Candidateid'] = this.data.candidateId;
      if (formValue['actionType']) {
        body['Action_Type'] = formValue['actionType'];
      }
      if (formValue['createType']) {
        body['EMP_TYPE'] = formValue['createType'];
      }
      if (formValue['DomainId']) {
        body['EMP_DOMAINID'] = formValue['DomainId'];
      }
      // if (formValue['DomainId']) {
      body['EMP_ISACTIVE'] = '1';
      // }
      if (formValue['FirstName']) {
        body['EMP_FIRSTNAME'] = formValue['FirstName'];
      }
      if (formValue['MiddleName']) {
        body['EMP_MIDDLENAME'] = formValue['MiddleName'];
      }
      if (formValue['LastName']) {
        body['EMP_LASTNAME'] = formValue['LastName'];
      }
      if (formValue['Dob']) {
        body['EMP_DOB'] = GlobalMethod.formatDate(formValue['Dob']);
      }
      if (formValue['Gender']) {
        body['EMP_GENDER'] = formValue['Gender'];
      }
      if (formValue['teamNameADT']) {
        body['EmpTeamPracticeID'] = formValue['teamNameADT'];
      }
      
      if (formValue['teamEffectiveFrom']) {
        body['EmpTeamPracticeDate'] = GlobalMethod.formatDate(formValue['teamEffectiveFrom']);
      }
      if (formValue['DateOfJoining']) {
        body['EMP_DATEOFJOINING'] = GlobalMethod.formatDate(formValue['DateOfJoining']);
      }
      if (formValue['regularizationFromDate']) {
        body['EMP_EFFECTIVEFROM'] = GlobalMethod.formatDate(formValue['regularizationFromDate']);
      }
      if (formValue['EmploymentStatus']) {
        body['EMP_STATUS'] = formValue['EmploymentStatus'];
      }
      if (formValue['ConfirmDueDate']) {
        body['EMP_CONFIRMATIONDUEDATE'] = GlobalMethod.formatDate(formValue['ConfirmDueDate']);
      }
      if (formValue['LocationID']) {
        body['EMP_LOCATION_ID'] = formValue['LocationID'];
      }
      if (formValue['subLocationID']) {
        body['EMP_SUB_LOCATION_ID'] = formValue['subLocationID'];
      }
      if (formValue['JobTitle']) {
        body['EMP_DESIGNATION_CODE'] = formValue['JobTitle'];
      }
      if (formValue['Grade']) {
        body['EMP_GRADEID'] = formValue['Grade'];
      }

      if (formValue['totalExpInYear']) {
        body['EMP_INDEXP_YRS'] = formValue['totalExpInYear'];
      }
      if (formValue['totalExpInMonth']) {
        body['EMP_INDEXP_MTH'] = formValue['totalExpInMonth'];
      }
      if (formValue['EmailId']) {
        body['EMP_MAILID'] = formValue['EmailId'];
      }
      if (formValue['NoticePeriod']) {
        body['EMP_NOTICEPERIODDAYS'] = formValue['NoticePeriod'];
      }
      if (formValue['LeavePolicy']) {
        body['EMP_LEAVE_POLICY'] = formValue['LeavePolicy'];
      }
      if (formValue['JobTitleEffFrom']) {
        body['JOBTITLE_EFFECTIVEDATE'] = GlobalMethod.formatDate(formValue['JobTitleEffFrom']);
      }
      if (formValue['Designation']) {
        body['DesignationId'] = formValue['Designation'];
      }
      if (formValue['isBootCampJoinee']) {
        body['IsBootCamp'] = formValue['isBootCampJoinee'];
      }
      if (formValue['traineeType']) {
        body['TraineeType'] = formValue['traineeType'];
      }
      if(formValue['createType'] == 'C' || formValue['createType'] == 'F'){
        if(formValue['createType'] == 'C'){
          body['ContractorPayType'] = 'Of';
        }else if(formValue['createType'] == 'F'){
          body['ContractorPayType'] = 'On';
        }else{

        }
        // if (formValue['contractorPayrollType']) {
        //   body['ContractorPayType'] = formValue['contractorPayrollType'];
        // }
      }
      if (formValue['trainingEndDate']) {
        body['EMP_TRAINEEENDDATE'] = GlobalMethod.formatDate(formValue['trainingEndDate']);
      }
      if (formValue['contractEndDate']) {
        body['EMP_CONTRACTENDDATE'] = GlobalMethod.formatDate(formValue['contractEndDate']);
      }
      if (formValue['legalEntity']) {
        body['Emp_LegalEntity'] = formValue['legalEntity'];
      }
      if (formValue['DepartmentId']) {
        body['EMP_Horizontal'] = formValue['DepartmentId'];
      }
      if (formValue['vendorId']) {
        body['EMP_VendorID'] = formValue['vendorId'];
      }
      if (formValue['EmployeeUnit']) {
        body['Emp_DeliveryStatus'] = formValue['EmployeeUnit'];
      }
      if (formValue['ReportingManager']) {
        body['EmpRM'] = formValue['ReportingManager'];
      }
      if (formValue['Em_Contact']) {
        body['EmrContactNo'] = formValue['Em_Contact'];
      }
      if (formValue['Em_Contact']) {
        body['EM_ContName'] = formValue['EM_ContName'];
      }
      if (formValue['Relation']) {
        body['EmrContactPersonRelation'] = formValue['Relation'];
      }
      if (formValue['LastEmployer']) {
        body['Emp_EmployerId'] = formValue['LastEmployer'];
      }
      if (formValue['isPepApplicable']) {
        body['EMP_IsPepApplicable'] = formValue['isPepApplicable'];
      }
      if (formValue['empCateg']) {
        body['EMP_CATEGORY_VALUE'] = formValue['empCateg'];
      }
      if (formValue['Nationality']) {
        body['EMP_COUNTRY'] = formValue['Nationality'];
      }
      if (formValue['DivisionID']) {
        body['Division'] = formValue['DivisionID'];
      }
      // if (this.newLocationId) {
      //   body['EMP_LOCATION_ID_New'] = this.newLocationId;
      // }
      if (this.newLocationId) {
        body['EMP_LOCATION_ID_New'] = this.newLocationId;
      }
      if (this.picName) {
        body['UploadProfilePic'] = this.picName;
      }
      if (this.base64File) {
        body['fileProfilePic'] = this.base64File;
      }

      this._onboardServ.submitEmployeeIdCreationForm(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    } else {
      if (this.profilePicSrc == '' || this.profilePicSrc == null) {
        this._share.showAlertErrorMessage.next('Employee profile picture not loaded, Please reload.');
      }else{
        this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
      }
    }

  }

  closeModal(): void {
    this.dialogRef.close();
  }


}

