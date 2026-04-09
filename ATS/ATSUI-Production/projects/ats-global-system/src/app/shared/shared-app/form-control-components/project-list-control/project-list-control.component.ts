import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';

@Component({
  selector: 'app-project-list-control',
  templateUrl: './project-list-control.component.html',
  styleUrls: ['./project-list-control.component.scss']
})
export class ProjectListControlComponent implements OnInit,OnChanges {
  @Input() public IdControl: UntypedFormControl;
  public FilterCtrlAccount: UntypedFormControl = new UntypedFormControl();
  public searchInputAccount: string;
  public projectList:any = [];
  @Input() placeholder:string = 'Search';
  @Input() title:string = 'Project';
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
  constructor( private _intCommonServe:InterviewCommonService) { }

  ngOnInit(): void {
   // this.getAccountLists(this.filterIdBy);
  }
  ngOnChanges(){
    this.getAccountLists(this.filterIdBy);
  }

    /***
    * get Int Status
    */
     getAccountLists(data:any):void{
      this._intCommonServe.getProjectListLists(data.length === 0 ? 0:data.toString()).subscribe(
        res => {
          this.projectList = res['data'];
          this.FilterCtrlAccount.valueChanges.subscribe(
            val => {
              this.searchInputAccount = val;
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

}
