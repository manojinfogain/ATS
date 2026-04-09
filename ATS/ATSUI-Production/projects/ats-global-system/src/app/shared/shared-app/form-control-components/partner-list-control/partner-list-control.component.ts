import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from 'projects/ats-global-system/src/app/vendor-partner-module/partner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-partner-list-control',
  templateUrl: './partner-list-control.component.html',
  styleUrls: ['./partner-list-control.component.scss']
})
export class PartnerListControlComponent implements OnInit, OnChanges,OnDestroy {
  @Input() public parentIdControl: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public partnerList: any = [];
  @Input() placeholder: string = 'Search';
  @Input() title: string = 'Partner';
  @Input() required: boolean = false;
  @Output() getDataIdPartner = new EventEmitter<any>();
  @Output() getDataIdsPartners = new EventEmitter<any>();
  @Output() getPartnerList = new EventEmitter<any>();
  @Input() outline: boolean = false;
  @Input() public formFieldAppearance: string = "legacy";
  @Input() public floatLabel: string = "auto";
  @Input() public isAllOption: boolean = false;
  @Input() public isMultiple: boolean = false;
  @Input() public allSelected: boolean = false;
  @Input() public partnerStatus: string = '4,5,6';
  public multiSelectedVal: any = [];
  @Input() contractTypeID: string = '';
  @ViewChild('select') select: MatSelect;
  public allSelcount:boolean = false;
  public showCount:any = '';
  public temp:any = [];
  private refreshSubscription: Subscription = new Subscription();
  constructor(
    private _partnerServe: PartnerService,
    private _storage: GetSetStorageService,
    private _share:ShareService
  ) { }

  ngOnInit(): void {
    console.log(this.parentIdControl.value)
    this.getVenderList(1, 500, null);
  
    this.parentIdControl.valueChanges.subscribe(
      v => {
        if (v === null) {
          this.allSelected = false
        }
      }
    )

    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.getVenderList(1, 500, null,this.contractTypeID);
      }
    )
  }

  ngOnDestroy(): void {
    if(this.refreshSubscription){
      this.refreshSubscription.unsubscribe();
    }
  }

  ngOnChanges() {
    this.getVenderList(1, 500, null,this.contractTypeID);
  }

  getVenderList(page: number, pageSize: number, search: any,ContractTypeID:string=null) {
    let body ={
      statusId : this.partnerStatus,
      ContractTypeID:ContractTypeID
    }
    // let queryString = `EmpID=${this._storage.getUserEmpId()}&page=${page}&pageSize=${pageSize}&search=${search ? search.trim() : ''}&statusId=${this.partnerStatus}${ContractTypeID?'&ContractTypeID='+ContractTypeID:''}`;
    this._partnerServe.getActivePartnerList(body).subscribe(
      res => {
        this.partnerList = res['data'];
        this.getPartnerList.emit(this.partnerList);
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
     this.getDataIdsPartners.emit(sellectedItem);
    // console.log(this.parentIdControl.value)
    // this.getSkillIdOutput.emit(sellectedItem);
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
     this.getDataIdsPartners.emit(sellectedItem);
    // this.getSkillIdOutput.emit(sellectedItem);
  }
}
