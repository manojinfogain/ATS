import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-offer-status-control',
  templateUrl: './offer-status-control.component.html',
  styleUrls: ['./offer-status-control.component.scss']
})
export class OfferStatusControlComponent implements OnInit {

  
  @Input() offerStatusTitle: string = 'Status';
  @Input() public offerStatusControlOpt: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public listData: any = [];
  @Input() dropPendingWithMeOfferApr: boolean = false;
  @Input() public isMultiple: boolean = false;
  @Input() companyLocation: boolean = false;
  @Input() placeholder: string = 'Search';
  @Input() title: string = '';
  @Input() required: boolean = false;
  @Input() type: string = 'intmode';
  @Input() filterIds: any = [];
  @Output() getValFromControl = new EventEmitter<any>();
  @Input() outline: boolean = false;
  @Input() public formFieldAppearance: string = "legacy";
  @Input() public floatLabel: string = "auto";
  @Input() public isAllOption: boolean = false;
  @Input() public allSelected: boolean = false;
  @Input() offerStatusIds: any = [];
  public FilterCtrlOfferStatus: UntypedFormControl = new UntypedFormControl();
  public multiSelectedVal: any = [];
  public searchInputOffer: string = '';
  @ViewChild('select') select: MatSelect;
  @Output() getDataSource = new EventEmitter<any>();
  public allSelcount:boolean = false;
  public showCount:any = '';
  public temp:any = [];
  constructor(
    private _globalServe: GlobalApisService
  ) { }

  ngOnInit(): void {
    this.getOfferStatus();
    this.offerStatusControlOpt.valueChanges.subscribe(
      v=>{
        if(v === null){
          this.allSelected = false
        }
      }
    )
  }

  // public contactList: any = [];
  // getContractList() {
  //   this._globalServe.GetContractTypes().subscribe(
  //     res => {
  //       this.contactList = res['data'];
  //     }
  //   )
  // }

  public offerStatusList: any = [];
  getOfferStatus(): void {
    this._globalServe.getAllOfferStatus().subscribe(
      res => {
        let filterById
        if (this.offerStatusIds?.length === 0) {
          // filterById = [140, 160, 200, 180, 220]
          this.offerStatusList = res['data'];
        }
        else {
          filterById = this.offerStatusIds;
          let filterByStatus = res['data'].filter(t => {
            return filterById.indexOf(t.statusId) !== -1;
          });
          this.offerStatusList = filterByStatus;
        }

      }

    );
    this.FilterCtrlOfferStatus.valueChanges.subscribe(
      get => {
        this.searchInputOffer = get;
        this.allSelcount = false;   
      }
    )
  }



  // get id
  getSelectId(event) {
    this.getValFromControl.emit(event.source.value);
    /***
       * get selected value
       */
    //  let selectedData = this.select.options.filter(d => d.selected === true && d.viewValue != 'close' && d.viewValue != '');
    //  let sellectedItem = [];
    //  selectedData.forEach(item => {
    //    if (item.value) {
    //      sellectedItem.push(item.value);
    //    }
 
    //  });
    //  this.getDataSource.emit(sellectedItem);
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
    selectedData = this.temp?.filter(d=> this.offerStatusControlOpt?.value.some(o2=> d.value === o2));
    this.multiSelectedVal = selectedData;
    this.showCount = this.allSelcount ? this.offerStatusControlOpt?.value?.length-1 : this.offerStatusControlOpt?.value?.length;

    // emitting selcted data
    let sellectedItem = [];
    let selectedItemForDrop = []
    let uniqSelectedData = [... new Set(selectedData.map(data=>data.value))];
    uniqSelectedData.forEach(item=>{
      if(item){
        if(item == 240 || item == 260 ){
            selectedItemForDrop.push(item);
        }
        sellectedItem.push(item);
      }
    // selectedData.forEach(item => {
    //   if (item.value) {
    //     if(item.value == 240 || item.value == 260 ){
    //       selectedItemForDrop.push(item.value);
    //     }
    //     sellectedItem.push(item.value)
    //   }
    });
    this.getDataSource.emit(selectedItemForDrop);

  }

  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
      if(
        (this.offerStatusControlOpt?.value?.length == this.select?.options?.length-1) &&
       !this.allSelcount &&
       !this.FilterCtrlOfferStatus?.value?.length
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
    selectedData = this.temp?.filter(d=> this.offerStatusControlOpt?.value.some(o2=> d.value === o2));
    this.multiSelectedVal = selectedData;
    this.showCount = this.allSelcount ? this.offerStatusControlOpt?.value?.length-1 : this.offerStatusControlOpt?.value?.length;
     // emitting selcted data
     let sellectedItem = [];
     let selectedItemForDrop = [];
     let uniqSelectedData = [... new Set(selectedData.map(data=>data.value))];
     uniqSelectedData.forEach(item=>{ 
      if(item){
        if(item == 240 || item == 260 ){
          selectedItemForDrop.push(item);
        }
        sellectedItem.push(item);
      }        
     });
    // this.getSkillIdOutput.emit(sellectedItem);
    this.getDataSource.emit(selectedItemForDrop);
  }

}
