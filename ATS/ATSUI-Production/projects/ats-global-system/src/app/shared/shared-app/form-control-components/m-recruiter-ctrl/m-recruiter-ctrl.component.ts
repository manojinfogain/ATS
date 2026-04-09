import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
@Component({
  selector: 'app-m-recruiter-ctrl',
  templateUrl: './m-recruiter-ctrl.component.html',
  styleUrls: ['./m-recruiter-ctrl.component.scss']
})
export class MRecruiterCtrlComponent implements OnInit {
  @Input() public parentIdControl: UntypedFormControl =new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public HMList:any = [];
  @Input() placeholder:string = 'Search';
  @Input() title:string = 'Recruiter';
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
  public allSelcount:boolean = false;
  public showCount:any = '';
  public temp:any = [];
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
    this._globalApi.getRecruiter().subscribe(
      res => {
        this.HMList = res['data'];
        this.FilterCtrl.valueChanges.subscribe(
          val => {
            this.searchInput = val;
            this.allSelcount = false;   
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
      this.allSelcount = true;
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
      this.allSelcount = false;
    }
     /***
     * get selected value
     */
      // let selectedData = this.select.options.filter(d=>d.selected === true && d.viewValue != 'close' && d.viewValue != '');
    let selectedData:any = [];
    this.temp = [];
    this.select.options.forEach((item: MatOption)=>{
      const index:number = this.temp.indexOf(item);
      if( index < 0 && item.selected === true && item.viewValue !== '' && item.viewValue !== 'close'){
        this.temp.push(item)
      }
      // else
      //   // this.temp = this.temp.filter(it => it.value !== item.value);
      //   if(index > -1){
      //     // this.temp.splice(index, 1);
      //     this.temp = this.temp.filter(it => it.value !== item.value);
      //   }
      
    });
    selectedData = this.temp?.filter(d=> this.parentIdControl?.value.some(o2=> d.value === o2));
    this.multiSelectedVal = selectedData;
    this.showCount = this.allSelcount ? this.parentIdControl?.value?.length-1 : this.parentIdControl?.value?.length;

    // emitting selcted data
    let sellectedItem = [];
    let uniqSelectedData = [... new Set(selectedData.map(data=>data.value))];
    uniqSelectedData.forEach(item=>{
      if(item){
        sellectedItem.push(item);
      }           
    });
      
  }

  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
      if(
        (this.parentIdControl?.value?.length == this.select?.options?.length-1) &&
       !this.allSelcount &&
       !this.FilterCtrl?.value?.length
      ){
        newStatus = true;
      }
    });
    this.allSelected = newStatus;
    /***
     * get selected value
     */
    // let selectedData = this.select.options.filter(d=>d.selected === true && d.viewValue != 'close' && d.viewValue != '');
    let selectedData:any = [];
    this.select.options.forEach((item: MatOption)=>{
      const index:number = this.temp.indexOf(item);
      if( index < 0 && item.selected === true && item.viewValue !== '' && item.viewValue !== 'close'){
        this.temp.push(item)
      }
      // else
      //   // this.temp = this.temp.filter(it => it.value !== item.value);
      //   if(index > -1){
      //     // this.temp.splice(index, 1);
      //     this.temp = this.temp.filter(it => it.value !== item.value);
      //   }
      
    });
    selectedData = this.temp?.filter(d=> this.parentIdControl?.value.some(o2=> d.value === o2));
    this.multiSelectedVal = selectedData;
    this.showCount = this.allSelcount ? this.parentIdControl?.value?.length-1 : this.parentIdControl?.value?.length;
     // emitting selcted data
     let sellectedItem = [];
     let uniqSelectedData = [... new Set(selectedData.map(data=>data.value))];
     uniqSelectedData.forEach(item=>{ 
      if(item){
        sellectedItem.push(item);
      }        
     });
   // this.getSkillIdOutput.emit(sellectedItem);
  }


}
