import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { forkJoin } from 'rxjs';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { Options } from '@angular-slider/ngx-slider';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators'

@Component({
  selector: 'app-propose-employyee-modal',
  templateUrl: './propose-employyee-modal.component.html',
  styleUrls: ['./propose-employyee-modal.component.scss']
})
export class ProposeEmployyeeModalComponent implements OnInit {
  public employeeReferForm: UntypedFormGroup = new UntypedFormGroup({});
  public selectedEmployeeDetails: any[];
  public employeeList: any[];
  public priSkillList: any = [];
  public primarySkillsList: any = [];
  public departmentList: any = [];
  public filterCtrlPrimarySkill: UntypedFormControl = new UntypedFormControl();
  public searchInputPrimarySkill: string;
  public formAppearance: string = 'outline';
  public filterParam: any = {};
  filterSkill: any = '';
  filterdeparment: any = '';
  filterMinExp: any = '';
  filterMaxExp: any = '';
  displayedColumns = ['srNo', 'empId', 'empName', 'designation', 'skills', 'experience', 'Grade', 'AccountName', 'Location'];
  constructor(
    public dialogRef: MatDialogRef<ProposeEmployyeeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _talentServ: TalentService,
    private _globApiServ: GlobalApisService
  ) { }

  ngOnInit(): void {
    this.excuteAllAPI();
    this.FormInit();
    this.getControl('experince').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500)
    ).subscribe(
      val => {
        this.resetEployeListDropAndTableList()
        /**assigning value to child on change*/
        this.filterMinExp = val[0];
        this.filterMaxExp = val[1];
      }
    )
  }

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
  public expData: any = {};
  /**showing selected exp value in ui */
  expControlUpdate(data: any) {
    this.expData = data;
  }

  //form control
  FormInit() {
    this.employeeReferForm = this._fb.group({
      referEmployees: [null, [Validators.required]],
      primarySkill: [null, [Validators.required]],
      department: [null],
      experince: [[0, 30]]
    })
  }

  excuteAllAPI() {
    forkJoin([
      this._globApiServ.GetDepartments(),
      this._talentServ.GetPrimarySkills(),
    ]).subscribe(
      res => {
        this.departmentList = res[0]['data'];
        this.primarySkillsList = res[1]['data'];

      }
    )
    /**primary skill search*/
    this.filterCtrlPrimarySkill.valueChanges.subscribe(
      val => {
        this.searchInputPrimarySkill = val;
      }
    )

  }
  //onchange offer status dropdown
  public isReqJoiningDate: boolean = true;
  offerStatusChange(elm: any) {

  }
  public getingSkillList:any=[];
//   ngOnChanges() {
    
//  if(this.getControl('primarySkill').valid){
//       this.isDisableEmpInput = true
//       

//     }
//   }

public isDisableEmpDropdown:boolean = false;
  /**get Primary Skill Id */

  public priSkillData: any = [];
  public gradeSalCtrl: boolean = false;
  getPriSkillId(data: any) {
    this.resetEployeListDropAndTableList()
    /**assigning value to child on change*/
    this.filterSkill = data?.toString();
    
   // this.getingSkillList = data;
   
    if (data.length > 0) {
      this.isDisableEmpDropdown = true
    }

  }

  /**get department data */
  getDepartmentId(data: any) {
   this.resetEployeListDropAndTableList()
    /**assigning value to child on change*/
    this.filterdeparment = data.toString();
  }

  /**to reset dropdowns */
  resetEployeListDropAndTableList(){
    this.getControl('referEmployees').reset();
    this.currentSelectedEmployeeList = [];
  }

  /**reset all filters including table data */
  resetFilterHandler(){
     this.resetEployeListDropAndTableList();
      this.getControl('primarySkill').reset();
      this.getControl('department').reset();
      this.getControl('experince').reset();  
      this.isDisableEmpDropdown = false; 
  }
  //control for form
  getControl(name: string) {
    return this.employeeReferForm.get(name);
  }

  get expControl() { return this.employeeReferForm.get('experince') };

  /**uncheck selection  */
  getUncheckedId(event: any) {
    let empList: any = this.currentSelectedEmployeeList;
    let getId = empList.findIndex((obj) => obj.EmpId == event)
    if (getId > -1) {
      empList.splice(getId, 1);
    }
    this.currentSelectedEmployeeList = [];
    this.currentSelectedEmployeeList = [...empList];
  }


  /***
  * get refer Employee id on change and filtering from all emp list
  */
  public currentSelectedEmployeeList: any = [];
  getreferEmployeeId(data: any): void {
    let FilteredData = this.referEmpList.filter(x => {
      return data.indexOf(x.EmpId) !== -1
    });
    // this.currentSelectedEmployeeList.concat(FilteredData);
    let currentSelectedEmployeeList = [...this.currentSelectedEmployeeList, ...FilteredData];
    let uniq = [...new Set(currentSelectedEmployeeList.map(({ EmpId }) => EmpId))].map(e => currentSelectedEmployeeList.find(({ EmpId }) => EmpId == e));
    this.currentSelectedEmployeeList = uniq;
  }

  /**getting all refer emp list here  */
  public referEmpList: any = [];
  getReferEmpList(data: any) {
    this.referEmpList = data;
  }

  //  submit form for refer
  submitReferFormHandler(form: UntypedFormGroup) {
    if (form.valid) {
      let formData = form.value;
      let empIds = formData?.referEmployees.toString();
      this._talentServ.AddReferralEmployeesAgainstTHID(this.data?.TH_ID, empIds).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )

    } else {
      form.markAllAsTouched();
      this._share.showAlertErrorMessage.next("Please Select a Candidate.");
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }


}
