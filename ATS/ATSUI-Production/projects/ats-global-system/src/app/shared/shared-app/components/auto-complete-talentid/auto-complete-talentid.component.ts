import { Component, Input, OnInit, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ActivatedRoute } from '@angular/router';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';

@Component({
  selector: 'app-auto-complete-talentid',
  templateUrl: './auto-complete-talentid.component.html',
  styleUrls: ['./auto-complete-talentid.component.scss']
})
export class AutoCompleteTalentidComponent implements OnInit,AfterViewInit {
  autoAyat = new UntypedFormControl();
  filteredOptions: Observable<any>;
  IsDropdownLoader: boolean = false;
  setTalentId: any;
  @Input() isTelentIdAssignedServerSide: boolean = false;
  @Input() isTelentIdAssigned: boolean = false;
  @Input() isTelentIdAll: boolean = false;
  @Input() isTelentIdUserWise: boolean = false;
  @Input() isShowSearchIcon: boolean = true;
  @Input() required:boolean = false;
  @Output() getDataTalentId = new EventEmitter<any>();
  @Input() public talentIdControl: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public talentData: any = [];
  @ViewChild('mySelect') mySelect;
  public IsDropdownLoaderSearch:boolean = false;
  @Input() isAll:boolean = false;
  @Input() isSelectedRequisition: boolean = false;
  constructor(
    private _globalApiServe: GlobalApisService,
    private acttive: ActivatedRoute,
    private _storage:GetSetStorageService,
    private _globalMethodServe:GlobalCommonMethodService
  ) { }

  ngOnInit() {
    let userData = this._storage.getSetUserData();
    let userRole = userData.RoleId;
     if(userRole === 5 || userRole === 6){
      this.isTelentIdAll = true;
    }
    else{
      this.isTelentIdAssigned = true;
    }
     this.getList();
     this.setDefaultTalentId(); 
  }

  ngAfterViewInit(){  

  }

  private _filter(value: string): string[] {
    const filterValue = value;
    return this.setTalentId.filter(option => option.talentID.toLowerCase().includes(filterValue));
  }
  searchTalent(event) {
    this.mySelect.open();
  }
  /***
   * set default talent Id
   */
  setDefaultTalentId(){
    let queryToken = this.acttive['snapshot'].queryParams.query;
    let queryExtToken = queryToken? this._globalMethodServe.decryptData(queryToken):null;
    if(queryToken && queryExtToken){
      // let queryExtToken = JSON.parse(atob(queryToken));
      let queryExtToken = this._globalMethodServe.decryptData(queryToken);
      let thId = queryExtToken.thId;
      let talentId = queryExtToken.talentId;
      let filterData = {};
      if (thId && talentId) {    
        if(this.isTelentIdAssigned == true){
          this.talentIdControl.setValue(talentId);
        }
        if(this.isTelentIdAll){
          filterData['empId'] = this._storage.getUserEmpId();
        //  filterData['dataById'] = false;
          filterData['pagination'] = true;
          filterData['limit'] = 500;
          filterData['text'] = talentId;
          this.serverCallForFetch(filterData);
          setTimeout(() => {
            this.talentIdControl.setValue(talentId);
          }, 1000);
        }
          
      }
    }
    else{
      if(this.isAll === true){
        this.talentIdControl.setValue('all');
      }
    }
   
  }
   /***
    * get Talent Id
    */
  getTalentId(data) {
    let basic = this.talentData.filter(val=> val.talentID === data.value);
    
    if(basic.length === 0){
      this.getDataTalentId.emit({
        TH_ID: null,
        talentID: null,
        IsRenuTeam: null,
      })
    }
    else{
      this.getDataTalentId.emit(basic[0]);
    }
    
  }
   /***
    * get talent Id list
    */
  getList() {
    let queryToken = this.acttive['snapshot'].queryParams.query;
    let queryExtToken = queryToken? this._globalMethodServe.decryptData(queryToken):null;
    this.IsDropdownLoader = true;
    let thId = this.acttive['snapshot'].queryParams.thId;
    let talentId = this.acttive['snapshot'].queryParams.talentId;
    let filterData = {
      empId:this._storage.getUserEmpId(),
      pagination:false,
      limit:null,
      text:null
    }
    if(this.isTelentIdAssigned){
      filterData['empId'] = this._storage.getUserEmpId();
    //  filterData['dataById'] = true;
      filterData['pagination'] = false;
      filterData['limit'] = null;
      filterData['text'] = null;
      this.serverCallForFetch(filterData);
      this.FilterCtrl.valueChanges.subscribe(
        val => {
          this.searchInput = val;
        }
      )
    }
    else if(this.isTelentIdAssignedServerSide){
      filterData['empId'] = this._storage.getUserEmpId();
   //   filterData['dataById'] = true;
      filterData['pagination'] = false;
      filterData['limit'] = null;
      this.FilterCtrl.valueChanges.
      pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(
        val => {
          filterData['text'] = val;
          this.IsDropdownLoaderSearch = true;
          this.serverCallForFetch(filterData);
        }
      )
    }

   else if(this.isTelentIdAll){
      filterData['empId'] = this._storage.getUserEmpId();
    //  filterData['dataById'] = false;
      filterData['pagination'] = true;
      filterData['limit'] = 500;
      filterData['text'] = null;
      if(!thId && !talentId){
        this.serverCallForFetch(filterData);
      }
     
      this.FilterCtrl.valueChanges.
      pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(
        val => {
          filterData['text'] = val;
          this.IsDropdownLoaderSearch = true;
          this.serverCallForFetch(filterData);
        }
      )
    }
   
   
  }

  serverCallForFetch(data){
    let obs:any = '';
    if(this.isSelectedRequisition){
      obs = this._globalApiServe.getAllSelectedRequisition(data.empId,data.pagination, data.limit, data.text)
    }else{
      obs = this._globalApiServe.getAllOpenRequisition(data.empId,data.pagination, data.limit, data.text)
    }
    obs.subscribe(
      res => {
        this.talentData = res['data'];
        this.IsDropdownLoader = false;
        this.IsDropdownLoaderSearch = false;
      },
      (error) => {
        this.IsDropdownLoader = false;
        this.IsDropdownLoaderSearch = false;
      }
    );
  }
}
