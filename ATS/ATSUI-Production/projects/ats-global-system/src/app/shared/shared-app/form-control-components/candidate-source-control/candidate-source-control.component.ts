import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';

@Component({
  selector: 'app-candidate-source-control',
  templateUrl: './candidate-source-control.component.html',
  styleUrls: ['./candidate-source-control.component.scss']
})
export class CandidateSourceControlComponent implements OnInit {
  @Input() public IdControl: UntypedFormControl;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl([]);
  public searchInput: string;
  public dataList:any = [];
  @Input() placeholder:string = 'Search Skill';
  @Input() title:string = 'Primary Skill';
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
  constructor(private _intCommonServe:InterviewCommonService) { }

  ngOnInit(): void {
    this.getSource();
  }

  getSource() {
    this._intCommonServe.getProfileName().subscribe(
      res=>{
         this.dataList = res['data'];
      })
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
      let selectedData = this.select.options.filter(d=>d.selected === true && d.viewValue != 'close');
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
