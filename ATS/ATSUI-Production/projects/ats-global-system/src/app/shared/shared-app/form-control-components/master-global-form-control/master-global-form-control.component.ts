import { Component, Input, OnInit, Output,EventEmitter, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { forkJoin } from 'rxjs';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';

@Component({
  selector: 'app-master-global-form-control',
  templateUrl: './master-global-form-control.component.html',
  styleUrls: ['./master-global-form-control.component.scss']
})
export class MasterGlobalFormControlComponent implements OnInit {
  @Input() public formControlOpt: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public listData:any = [];
  @Input() placeholder:string = 'Search';
  @Input() title:string = 'Interview Mode';
  @Input() required:boolean = false;
  @Input() type:string = 'intmode';
  @Input() filterIds:any = [];
  @Output() getValFromControl = new EventEmitter<any>();
  @Input() outline:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";

  public intMode:boolean = false;
  public intType:boolean = false;
  public intStatusMultiple:boolean = false;
  public allSelected:boolean = false;
  public multiSelectedVal:any = [];
  @ViewChild('select') select: MatSelect;
  constructor(
    private _globalServe:GlobalApisService,
    private _intCommonServe:InterviewCommonService
    ) { }

  ngOnInit() {
    if(this.type == 'intmode'){
      this.intMode = true;
      this.getIntMode();
    }
    else if(this.type == 'inttype'){
      this.intType = true;
      this.getIntType();
    }
    else if(this.type == 'intstatusMulti'){
      this.intStatusMultiple = true;
      this.GetInterviewStatus();
    }
  }
    /***
   * get Interview Mode
   */
     getIntMode() {
      this._intCommonServe.getIntMode().subscribe(
        res => {
          if(this.filterIds.length === 0){
            this.listData = res;
          }
          else{
            let filterById =res.filter(t => {
              return this.filterIds.indexOf(t.id) !== -1;
            });
            this.listData = filterById;
          }
        }
      );
    }

     /***
   * get Interview Type
   */
      getIntType() {
        this._intCommonServe.getInterviewType().subscribe(
          res => {
            if(this.filterIds.length === 0){
              this.listData = res['data'];
            }
            else{
              let filterById =res['data'].filter(t => {
                return this.filterIds.indexOf(t.id) !== -1;
              });
              this.listData = filterById;
            }
          }
        );
      }

       /***
    * get Int Status
    */
  GetInterviewStatus(): void {
    this._intCommonServe.getIntStatusList().subscribe(
      res => {
        this.listData = res;
      }
    );
  }

  // get id
  getSelectId(event) {
    this.getValFromControl.emit(event.source.value)
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
      let selectedData = this.select.options.filter(d=>d.selected === true);
      this.multiSelectedVal = selectedData;
      let sellectedItem = [];
      let selectedItemForDrop = [];
      selectedData.forEach(item=>{ 
        if(item){
          if(item.value == 240 || item.value == 260 ){
              selectedItemForDrop.push(item.value);
          }
          sellectedItem.push(item.value)   
        }
      });
      this.getValFromControl.emit(selectedItemForDrop);
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
    
    let selectedItemForDrop = [];
    selectedData.forEach(item=>{ 
      if(item){
        if(item.value == 240 || item.value == 260 ){
            selectedItemForDrop.push(item.value);
        }
        sellectedItem.push(item.value)   
      }
    });
    this.getValFromControl.emit(selectedItemForDrop);
  }

}
