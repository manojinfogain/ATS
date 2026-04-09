import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';

@Component({
  selector: 'app-account-list-control',
  templateUrl: './account-list-control.component.html',
  styleUrls: ['./account-list-control.component.scss']
})
export class AccountListControlComponent implements OnInit, OnChanges {
  @Input() public IdControl: UntypedFormControl;
  public FilterCtrlAccount: UntypedFormControl = new UntypedFormControl();
  public searchInputAccount: string;
  public accountList:any = [];
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
  @Input() public showOkButton:boolean = false;
  @Input() public isAccountByDu:boolean = false;
  @Input() public DuIds:any = [];
  @Input() public filterAccount: string ='';
  public allSelcount:boolean = false;
  public showCount:any = '';
  public temp:any = [];
  constructor(
     private _intCommonServe:InterviewCommonService
     ) { }

  ngOnInit(): void {
    //acount by du
    if(this.isAccountByDu){
      let body ={
        DUIds:  this.DuIds.toString()
      }
      if(this.filterAccount){
        body['flag'] = this.filterAccount;
      }
     this.getAccountListsByDuID(body);
     this.IdControl.valueChanges.subscribe(
      v=>{
        if(v === null){
          this.allSelected = false
          
        }
      }
    )
    } else{
      this.getAccountLists();
      this.IdControl?.valueChanges.subscribe(
        v=>{
          if(v === null){
            this.allSelected = false
            
          }
        }
      )
    }
    
  }

  ngOnChanges(): void {
        if(this.DuIds?.length !=0){
          if(this.isAccountByDu){
            let body ={
              DUIds:  this.DuIds.toString()
            }
            if(this.filterAccount){
              body['flag'] = this.filterAccount;
            }
           this.getAccountListsByDuID(body);
           this.allSelected = false;
          } 
        }else{
          let body ={
            DUIds: '',
          }
          if(this.isAccountByDu){
            this.getAccountListsByDuID(body);
          }
          
          this.allSelected = false;
       
        }


  }

    /***
    * get Int Status
    */
     getAccountLists():void{
      this._intCommonServe.getAccountLists().subscribe(
        res => {
          this.accountList = res['data'];
          this.FilterCtrlAccount.valueChanges.subscribe(
            val => {
              this.searchInputAccount = val;
              this.allSelcount = false;   
            }
          )
        }
      );
    }


//get account by du
    getAccountListsByDuID(body):void{
      this._intCommonServe.getAccountListByDuIds(body).subscribe(
        res => {
          this.accountList = res['data'];
          this.FilterCtrlAccount.valueChanges.subscribe(
            val => {
              this.searchInputAccount = val;
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
      // console.log(selectedData);
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

  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
      if(
        (this.IdControl?.value?.length == this.select?.options?.length-1) &&
       !this.allSelcount &&
       !this.FilterCtrlAccount?.value?.length
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
