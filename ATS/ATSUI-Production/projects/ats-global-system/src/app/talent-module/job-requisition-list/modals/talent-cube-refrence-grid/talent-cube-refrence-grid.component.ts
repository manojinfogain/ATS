import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { forkJoin } from 'rxjs';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { Options } from '@angular-slider/ngx-slider';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators'
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-talent-cube-refrence-grid',
  templateUrl: './talent-cube-refrence-grid.component.html',
  styleUrls: ['./talent-cube-refrence-grid.component.scss']
})
export class TalentCubeRefrenceGridComponent implements OnInit, AfterViewInit {
  public employeeReferForm: UntypedFormGroup = new UntypedFormGroup({});
  public priSkillList: any = [];
  public primarySkillsList: any = [];
  public currentSelectedEmployeeList: any = [];
  public TalentCubeList: any = [];
  public TalentCubeListAll: any = [];
  public isloader: boolean = false;
  displayedColumns: string[] = ['select', 'tc', 'PrimarySkill', 'skill1', 'skill2', 'skill3'];
  // displayedColumns = ['srNo', 'empId', 'empName', 'designation', 'skills', 'experience', 'Grade', 'AccountName', 'Location'];
  dataSourceTalentCube = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(false, []);
  selectedItem = <any>{};
  constructor(
    public dialogRef: MatDialogRef<TalentCubeRefrenceGridComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _talentServ: TalentService,
    private _globApiServ: GlobalApisService
  ) { }
  public searchInputPrimarySkill: string;
  public filterCtrlPrimarySkill: UntypedFormControl = new UntypedFormControl();
  ngOnInit(): void {
    this.FormInit();
    this._talentServ.GetPrimarySkills().subscribe(
      res => {
        this.primarySkillsList = res['data'];
        /**primary skill */
        this.filterCtrlPrimarySkill.valueChanges.subscribe(
          val => {
            this.searchInputPrimarySkill = val;
          }
        )
      }
    )
  }

  /**control */
  getControl(name: string) {
    return this.employeeReferForm.get(name);
  }
  ngAfterViewInit() {
    debugger
    // if (this.data?.type == 'skill') {
    //   if (this.data?.prSkillId && this.data?.skillIds) {
    //     this.getTalentCubeById(this.data?.prSkillId, this.data?.skillIds);
    //     this.getControl('primarySkill').patchValue(this.data?.prSkillId);
    //   }
    //   else if (this.data?.prSkillId) {
    //     this.getControl('primarySkill').patchValue(this.data?.prSkillId);
    //     this.getTalentCubeById(this.data?.prSkillId);
    //   }
    //   else {
    //     this.getTalentCubeById(null, this.data?.skillIds);
    //   }
    // }
    this.getTalentCubeBySubSkillId('', '', '');


  }

  /**
   * 
   * @param data 
   */
  getTalentCubeById(PrimarySkillId: number = null, SkillIds: string = null) {
    this._globApiServ.getTalentCubeBySkill(PrimarySkillId, SkillIds).subscribe(
      res => {
        this.TalentCubeList = res['data'];
        this.dataSourceTalentCube = new MatTableDataSource<any>(res['data']);

        this.selection.clear();
      }
    )
  }



  // getSkillId(data: any) {
  //   debugger
  //   let skillIds = []
  //   skillIds.push(data);
  //   this.selection.clear();
  //   let ids = skillIds.toString();
  //   this.selectedSkillName = ids;
  //   // this.getTalentCubeById(data.value);

  //   this.getTalentCubeBySubSkillId(ids, null);

  // }

  /***
   * search
   */
  public isResetSearch: boolean = false;
  public searchInput: string;
  public searchControl: UntypedFormControl = new UntypedFormControl();
  getSearchValueKey(e: any) {
    this.searchInput = e;
    if(e){
      this.dataSourceTalentCube.filter = e.trim().toLowerCase();
    }
    else{
      this.dataSourceTalentCube.filter = '';
    }
   
  }

  /**and type & while selecting and changeing skill */
  public skillIdsAnd = [];
  public skillIdsOr = [];
  public selectedOneSkillName: string = '';
  public selectedTwoSkillName: string = '';
  public combineDataList: any = [];
  public filterAndDataList: any = [];
  getAndSelectedSkillDetails(data: any) {
    this.skillIdsAnd = [];
    this.selection.clear();
    this.skillIdsAnd=data?.skillName;
    let skillNames = [];
    skillNames.push(data?.skillName);
    this.selectedOneSkillName = skillNames.toString().split(',').join(', ');
   // this.getTalentCubeBySubSkillId(idsAnd, this.skillIdsOr?.toString(), null);
   /***
    * filter data by skill ids with And Operator
    */
   this.filterAndDataList= this.TalentCubeListAll.filter(item => 
    {
      if(item.CubeSkillIdsName){
        return  data.skillName.every(id => item.CubeSkillIdsName.includes(id))
        }
    }
  );
  //let filteredData1 = filteredData.filter(item => this.skillIdsOr.includes(item.CubeSkillIds));
  let filterdata:any =[];
  /***
    * filter data by 2nd dropdown skill ids with And Operator
    */
   debugger
  if(this.skillIdsOr.length>0 ){
    if(data.skillId.length>0){
      filterdata = this.filterAndDataList.filter(item => 
        this.skillIdsOr.some(id => item.CubeSkillIdsName.includes(id))
      );
      this.combineDataList  = [...filterdata];
    }
    else{
      filterdata = this.TalentCubeListAll.filter(item => 

        {
          if(item.CubeSkillIdsName){
            return   this.skillIdsOr.some(id => item.CubeSkillIdsName.includes(id))
            }
        }
       
      );
      this.combineDataList  = [...filterdata];
    }
    
  }
  else{
    if(data.skillId.length>0){
      this.combineDataList  = [...this.filterAndDataList];
    }
    else{
      this.combineDataList  = [ ...this.TalentCubeListAll];
    }
   
  }
   
   this.dataSourceTalentCube = new MatTableDataSource<any>(this.combineDataList);
  }
  /**or type while selecting and changeing skill */
  //public selectedSkillName: string = '';
  public selectedSkillListOR: string = '';
  getSelectedSkillDetails(data: any) {
    debugger
    this.skillIdsOr = [];
   // let skillIds = []
    this.skillIdsOr=data.skillName;
    this.selection.clear();
    let IdsOr = this.skillIdsOr.toString();
    let skillNames = [];
    skillNames.push(data?.skillName);
    this.selectedTwoSkillName = skillNames.toString().split(',').join(', ');
   // this.getTalentCubeBySubSkillId( this.skillIdsAnd?.toString(), IdsOr, null);
 
   
  // let filteredData = this.TalentCubeListAll.filter(item => 
  //   {
  //     if(item.CubeSkillIdsName){
  //       return  this.skillIdsAnd.every(id => item.CubeSkillIdsName.includes(id))
  //       }
  //   }
  // );

let filterdata:any =[];

  debugger
  /***
    * filter data by first dropdown skill ids with  And Operator
    */
  if(this.skillIdsAnd.length>0 ){
    filterdata = this.filterAndDataList.filter(item => 
      data.skillName.some(id => item.CubeSkillIdsName.includes(id))
    );
    if(data.skillId.length>0){
      this.combineDataList  = [ ...filterdata];
     }
     else{
      this.combineDataList  = [ ...this.filterAndDataList];
     }
  }
  /***
    * filter data by 2nd  dropdown skill ids Or CASE
    */
  else{
    filterdata = this.TalentCubeListAll.filter(item => 

      {
        if(item.CubeSkillIdsName){
          return   data.skillName.some(id => item.CubeSkillIdsName.includes(id))
          }
      }
     
    );
    if(data.skillId.length>0){
      this.combineDataList  = [ ...filterdata];
     }
     else{
      this.combineDataList  = [ ...this.TalentCubeListAll];
     }
  }
   
   
   this.dataSourceTalentCube = new MatTableDataSource<any>(this.combineDataList);


  
  }


  /**reseting selected skills */
  resetSelectedSkills() {
    debugger
    this.getControl('SkillAndSelection').reset();
    this.getControl('primarySkill').reset();
    this.selectedTwoSkillName = '';
    this.selectedOneSkillName = '';

    this.skillIdsAnd = [];
    this.skillIdsOr = [];
    this.dataSourceTalentCube = new MatTableDataSource<any>(this.TalentCubeListAll);
   // this.getTalentCubeById(null, this.data?.skillIds);
   // this.getTalentCubeBySubSkillId('', '', '');
  }
  /**get talent cube by subskills */
  getTalentCubeBySubSkillId(skillIdsAnd, SkillIds, PrimarySkillId = null) {
    debugger
    this._globApiServ.getTalentCubeBySubSkill(skillIdsAnd, SkillIds, PrimarySkillId).subscribe(
      res => {
        this.isloader = false
        this.TalentCubeList = res['data'];
        this.TalentCubeListAll = res['data'];
        this.dataSourceTalentCube = new MatTableDataSource<any>(res['data']);

        this.selection.clear();
      }
    )
  }
  radioLabel(row?: any): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  selectItem(row: any) {
    this.selection.toggle(row);
    this.selectedItem = row;
  }


  //form control
  FormInit() {
    this.employeeReferForm = this._fb.group({
      SkillAndSelection: [null],
      primarySkill: [null]
    })
  }


  //  submit form for refer
  public selectedCube: any = [];
  submitReferFormHandler(form: UntypedFormGroup) {
    this.selectedItem;

    // this.selectedCube = this.selection?.selected;
    this.dialogRef.close(this.selectedItem);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  /***
    * get Skill
    */
  getSkillId111(e) {
    let selectedDataBody = {};
    // this.transformValueForServer(this.searchFilterFormGroup.value);
  }

}
