import { Component, Input, OnInit, Output, ViewChild, EventEmitter, AfterViewInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { TalentService } from 'projects/ats-global-system/src/app/talent-module/talent.service';

@Component({
  selector: 'app-tc-skills-control',
  templateUrl: './tc-skills-control.component.html',
  styleUrls: ['./tc-skills-control.component.scss']
})
export class TcSkillsControlComponent implements OnInit {

  @Input() public IdControl: UntypedFormControl;
  public FilterCtrlAccount: UntypedFormControl = new UntypedFormControl();
  public searchInputAdditionalSkills: string;
  public projectList:any = [];
  @Input() public additionalSkillList:any =[];
  public additionalSkillListFilter:any =[];
  @Input() placeholder:string = 'Search';
  @Input() title:string = 'Addional Skills';
  @Input() required:boolean = false;
  @Input() outline:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  @Input() public isAllOption:boolean = false;
  @Input() public isMultiple:boolean = false;
  @ViewChild('select') select: MatSelect;
  @Output() getDataSource = new EventEmitter<any>();
  public allSelected:boolean = false;
  public multiSelectedVal:any = [];
  @Input() public filterIdBy:any = [];
  @Input() public SkillId:any = 0;
  @Input() public isFilterBySkillId:boolean = false;
  @Input() public isInitCallAPI:boolean = true;
  @Output() getDataSourceBlur = new EventEmitter<any>();
  @Input() public tcSkillIds:any = '';
  @Input() public isDataGetFromParent:boolean = true;
  @Input() public isDisableForEdit:boolean = false;
  constructor( private _talentServ: TalentService) { }

  ngOnInit(): void {
   // this.getAccountLists(this.filterIdBy);
  //  if(this.isInitCallAPI){
  //   if(this.isFilterBySkillId){
  //     this.getAdditionalSkillLists(this.SkillId);
  //    }
  //    else{
  //     this.getAdditionalSkillLists(0);
  //    }
  //  }
  //this.getAdditionalSkillLists(0);
   if(!this.isDataGetFromParent){
    this.getAdditionalSkillLists(0);
   }
   else{
    if(this.tcSkillIds){
      this.filterTcSkill();
    }
  }
 
  }

  filterTcSkill(){
    
    let  splitId = this.tcSkillIds.split(",").map(Number);
      if(this.additionalSkillList.length != 0){
        let filterById = this.additionalSkillList.filter(t => {
          return splitId.indexOf(t.skillid) !== -1;
        });
        this.additionalSkillListFilter = filterById;
      }

      this.FilterCtrlAccount.valueChanges.subscribe(
        val => {
          this.searchInputAdditionalSkills = val;
        }
      )
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      let selectedData = this.select?.options.filter(d=>d.selected === true && d.viewValue != 'close' && d.viewValue != '');
      this.multiSelectedVal = selectedData;
    },2000)
    
  }
  
  ngOnChanges(){
   // this.getAdditionalSkillLists(0);
   setTimeout(()=>{
    let selectedData = this.select?.options.filter(d=>d.selected === true && d.viewValue != 'close' && d.viewValue != '');
    this.multiSelectedVal = selectedData;
  },500)
  // if(this.isInitCallAPI){
  //   if(this.isFilterBySkillId){
  //     this.getAdditionalSkillLists(this.SkillId);
  //   }
  // }
  if(!this.isDataGetFromParent){
    if(this.tcSkillIds){
      this.getAdditionalSkillLists(0);
    }
  }
  else{
    if(this.tcSkillIds){
      this.filterTcSkill();
    }
  }
  
  
  
  }

    /***
    * get Int Status
    */
     getAdditionalSkillLists(id:number):void{
      this._talentServ.GetSubSkills(id).subscribe(
        res => {
          if(this.tcSkillIds){
          let  splitId = this.tcSkillIds.split(",").map(Number);
          if(res['data'].length != 0){
            let filterById = res['data'].filter(t => {
              return splitId.indexOf(t.skillid) !== -1;
            });
            this.additionalSkillListFilter = filterById;
          }
         
            
          }
          else{
           // this.additionalSkillList = res['data'];
          }
          
          this.FilterCtrlAccount.valueChanges.subscribe(
            val => {
              this.searchInputAdditionalSkills = val;
            }
          )
        }
      );
    }

     /***
  * all select /deselect
  */
   toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
     /***
     * get selected value
     */
      let selectedData = this.select.options.filter(d=>d.selected === true && d.viewValue != 'close' && d.viewValue != '');
      this.multiSelectedVal = selectedData;
      let sellectedItem = [];
      selectedData.forEach(item=>{
        if(item.value){
          sellectedItem.push(item.value)
        }
           
      });
      this.getDataSource.emit(sellectedItem);
  }

  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
    /***
     * get selected value
     */
    let selectedData = this.select.options.filter(d=>d.selected === true);
    this.multiSelectedVal = selectedData;
    let sellectedItem = [];
    selectedData.forEach(item=>{ 
      sellectedItem.push(item.value)   
    });
    this.getDataSource.emit(sellectedItem);
  }

  onBlure(e:any){
   /***
     * get selected value
     */
   let selectedData = this.select.options.filter(d=>d.selected === true);
   this.multiSelectedVal = selectedData;
   let sellectedItem = [];
   selectedData.forEach(item=>{ 
     sellectedItem.push(item.value)   
   });
   this.getDataSourceBlur.emit(sellectedItem);
  }
}
