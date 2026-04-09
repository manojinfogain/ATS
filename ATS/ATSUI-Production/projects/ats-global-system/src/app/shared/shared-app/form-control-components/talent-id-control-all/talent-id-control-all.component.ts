import { Component, Input, OnInit, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ActivatedRoute } from '@angular/router';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';

@Component({
  selector: 'app-talent-id-control-all',
  templateUrl: './talent-id-control-all.component.html',
  styleUrls: ['./talent-id-control-all.component.scss']
})
export class TalentIdControlAllComponent implements OnInit {
  filteredOptions: Observable<any>;
  IsDropdownLoader: boolean = false;
  setTalentId: any;
  @Input() isShowSearchIcon: boolean = true;
  @Input() required:boolean = false;
  @Output() getDataTalentId = new EventEmitter<any>();
  @Input() public talentIdControl: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public talentData: any = [];
  @ViewChild('mySelect') mySelect;
  public IsDropdownLoaderSearch:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  @Input() public isAllOption:boolean = false;
  
  constructor(
    private _globalApiServe: GlobalApisService,
    private _storage:GetSetStorageService
  ) { }

  ngOnInit() {
    this.getList();
  }

  ngAfterViewInit(){  

  }

  searchTalent(event) {
    this.mySelect.open();
  }


   /***
    * get Talent Id
    */
  getTalentId(data) {
    let basic = this.talentData.filter(val=> val.TH_ID === data.value);
    if(basic.length === 0){
      this.getDataTalentId.emit({
        TH_ID: null,
        talentID: null
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
    this.IsDropdownLoader = true;
    let filterData = {
      empId:this._storage.getUserEmpId(),
      pagination:false,
      limit:null,
      text:null
    }
    filterData['empId'] = this._storage.getUserEmpId();
      filterData['pagination'] = true;
      filterData['limit'] = 500;
      filterData['text'] = null;
      this.serverCallForFetch(filterData);
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
   
   
  

  serverCallForFetch(data){
    this._globalApiServe.getAllOpenRequisitionForTransfer(data.empId,data.pagination, data.limit, data.text).subscribe(
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
