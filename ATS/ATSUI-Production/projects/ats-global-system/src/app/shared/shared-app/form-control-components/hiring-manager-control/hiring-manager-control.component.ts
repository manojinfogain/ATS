import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
@Component({
  selector: 'app-hiring-manager-control',
  templateUrl: './hiring-manager-control.component.html',
  styleUrls: ['./hiring-manager-control.component.scss']
})
export class HiringManagerControlComponent implements OnInit,OnChanges {
  @Input() public parentIdControl: UntypedFormControl =new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public HMList:any = [];
  @Input() placeholder:string = 'Search';
  @Input() title:string = 'Hiring Manager';
  @Input() required:boolean = false;
  @Output() getDataIdPartner = new EventEmitter<any>();
  @Input() outline:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  @Input() public isAllOption:boolean = false;
  @Input() public isMultiple:boolean = false;
  @Input() public allSelected:boolean = false;
  public multiSelectedVal:any = [];
  @ViewChild('select') select: MatSelect;
  constructor(
    private _globalApi:GlobalApisService,
  ) { }

  ngOnInit(): void {
     this.getHMList();
    this.parentIdControl.valueChanges.subscribe(
      v=>{
        if(v === null){
          this.allSelected = false
        }
      }
    )
  }

  ngOnChanges(){
    
  }

  getHMList() {
    this._globalApi.getAllHiringManagerList().subscribe(
      res => {
        this.HMList = res['data'];
        this.FilterCtrl.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        )
      }
    )
  }
  getId(data) {
    // let basic = this.talentData.filter(val=> val.talentID === data.value)
     this.getDataIdPartner.emit(data.value);
   }

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
    let selectedData = this.select.options.filter(d=>d.selected === true && d.viewValue != 'close' && d.viewValue != '');
    this.multiSelectedVal = selectedData;
    let sellectedItem = [];
    selectedData.forEach(item=>{ 
      sellectedItem.push(item.value)   
    });
   // this.getSkillIdOutput.emit(sellectedItem);
  }

}
