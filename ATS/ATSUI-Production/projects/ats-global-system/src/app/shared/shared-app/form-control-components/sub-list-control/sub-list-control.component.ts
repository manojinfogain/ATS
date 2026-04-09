import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-sub-list-control',
  templateUrl: './sub-list-control.component.html',
  styleUrls: ['./sub-list-control.component.scss']
})
export class SubListControlComponent implements OnInit,OnChanges {
  @Input() public IdControl: UntypedFormControl;
  public FilterCtrlSubList: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public subList:any = [];
  @Input() placeholder:string = 'Search Substatus';
  @Input() title:string = '';
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
  @Input() public showOkButton:boolean = false;
  @Input() public Ids:any = [];
  @Input() public filterAccount: string ='';
  public allSelcount:boolean = false;
  public showCount:any = '';
  public temp:any = [];
  constructor(
    private _globalServe: GlobalApisService
  ) { }

  ngOnInit(): void {
      if(this.Ids?.length != 0){
        this.getListsByID(this.Ids);
      }
      if(!this.isMultiple){
        this.IdControl.setValue('all');
      }      
      this.IdControl?.valueChanges.subscribe(
        v=>{
          if(v === null){
            this.allSelected = false
          }
        }
      )
    }
    
    ngOnChanges(): void {
      if(this.Ids?.length != 0){
        this.getListsByID(this.Ids);
        this.allSelected = false;
    }
    if(!this.isMultiple){
      this.IdControl.setValue('all');
    }
  }


//get list by id
    getListsByID(idList):void{
      this._globalServe.getCandidateOfferDropReason(idList).subscribe(
        res => {
            let filterByStatus = res['data'].filter(t => {
              return t.parentId == 240 || t.parentId == 260;
            });
            this.subList = filterByStatus;
            this.FilterCtrlSubList.valueChanges.subscribe(
              val => {
                this.searchInput = val;
                this.allSelcount = false;   
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
      selectedData = this.temp?.filter(d=> this.IdControl?.value.some(o2=> d.value === o2));
      this.multiSelectedVal = selectedData;
      this.showCount = this.allSelcount ? this.IdControl?.value?.length-1 : this.IdControl?.value?.length;
      
      // emitting selcted data
      let sellectedItem = [];
      let uniqSelectedData = [... new Set(selectedData.map(data=>data.value))];
      uniqSelectedData.forEach(item=>{
        if(item){
          sellectedItem.push(item);
        }           
      });
     this.getDataSource.emit(sellectedItem);
  }

  /***
  * single option select /deselect
  */
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
      if(
        (this.IdControl?.value?.length == this.select?.options?.length-1) &&
       !this.allSelcount &&
       !this.FilterCtrlSubList?.value?.length
      ){
        newStatus = true;
      }
    });
    this.allSelected = newStatus;
    /***
     * get selected value
     */
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
    selectedData = this.temp?.filter(d=> this.IdControl?.value.some(o2=> d.value === o2));    
    this.multiSelectedVal = selectedData;
    this.showCount = this.allSelcount ? this.IdControl?.value?.length-1 : this.IdControl?.value?.length;
    
    // emitting selcted data
    let sellectedItem = [];
    let uniqSelectedData = [... new Set(selectedData.map(data=>data.value))];
    uniqSelectedData.forEach(item=>{ 
      if(item){
        sellectedItem.push(item);
      }        
    });
   this.getDataSource.emit(sellectedItem);
  }

  
  // selectData(){
  // /***
  //    * get selected value
  //    */
  //  let selectedData = this.select.options.filter(d=>d.selected === true && d.viewValue != 'close' && d.viewValue != '');
  //  let sellectedItem = [];
  //  selectedData.forEach(item=>{
  //    if(item.value){
  //      sellectedItem.push(item.value);
  //    }
        
  //  });
  //  this.getDataSource.emit(sellectedItem);
  // }

}

