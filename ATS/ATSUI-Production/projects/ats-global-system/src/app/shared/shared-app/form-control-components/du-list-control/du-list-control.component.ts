import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-du-list-control',
  templateUrl: './du-list-control.component.html',
  styleUrls: ['./du-list-control.component.scss']
})
export class DuListControlComponent implements OnInit {
  @Input() public IdControl: UntypedFormControl;
  public FilterCtrlAccount: UntypedFormControl = new UntypedFormControl();
  public searchInputAccount: string;
  public accountList: any = [];
  @Input() placeholder: string = 'Search';
  @Input() title: string = 'DU';
  @Input() required: boolean = false;
  @Input() outline: boolean = false;
  @Input() public formFieldAppearance: string = "legacy";
  @Input() public floatLabel: string = "auto";
  @Input() public isAllOption: boolean = false;
  @Input() public isMultiple: boolean = false;
  @Input() public MultipleDu: boolean = false;
  @ViewChild('select') select: MatSelect;
  @Output() getDataSource = new EventEmitter<any>();
  public allSelected: boolean = false;
  public multiSelectedVal: any = [];
  public allSelcount:boolean = false;
  public showCount:any = '';
  public temp:any = [];
  constructor(private _globalServe: GlobalApisService) { }

  ngOnInit(): void {
    this.getAccountLists();
    this.IdControl.valueChanges.subscribe(
      v=>{
        if(v === null){
          this.allSelected = false
        }
      }
    )
  }

  /***
  * get Int Status
  */
  getAccountLists(): void {
    this._globalServe.getDUList().subscribe(
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
    // let selectedData = this.select.options.filter(d => d.selected === true && d.viewValue != 'close' && d.viewValue != '');
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


  optionClick() {
    this.getDataSource.emit([]);
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }if(
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
    // let selectedData = this.select.options.filter(d => d.selected === true && d.viewValue != 'close' && d.viewValue != '');
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
  // selectData() {
  //   /***
  //      * get selected value
  //      */
  //   let selectedData = this.select.options.filter(d => d.selected === true && d.viewValue != 'close' && d.viewValue != '');
  //   let sellectedItem = [];
  //   selectedData.forEach(item => {
  //     if (item.value) {
  //       sellectedItem.push(item.value);
  //     }

  //   });
  //   this.getDataSource.emit(sellectedItem);
  // }

  //getting du data id
  GetDuDataID(data:any){
  //  
     this.getDataSource.emit(data.value);
  }
}
