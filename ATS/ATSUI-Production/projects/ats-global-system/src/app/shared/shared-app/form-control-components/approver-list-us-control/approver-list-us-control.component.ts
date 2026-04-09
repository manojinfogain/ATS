import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-approver-list-us-control',
  templateUrl: './approver-list-us-control.component.html',
  styleUrls: ['./approver-list-us-control.component.scss']
})
export class ApproverListUsControlComponent implements OnInit {
  @Input() public panelIdControl: UntypedFormControl;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public getAllEmp:any = [];
  @Input() placeholder:string = 'Search Approver';
  @Input() title:string = 'Select Approver';
  @Input() required:boolean = false;
  @Output() getDataTalentId = new EventEmitter<any>();
  @Input() showSelectedValue: boolean = false;
  @Input() defaultValue: string = '';
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  @Input() public type:string = "dh";
  @Input() public isDelegatorList:boolean = false;
  @Input() public divisionID:number = 1; 
  @Input() public ReqTypeId:number = 0; 
  @Input() public cid:number = 0; 
  @Input() public IsApprDataParent:boolean = false; 
  @Input() public  getAllEmpParent:any = [];
  constructor(
    private _globalApiServe: GlobalApisService,
    private _storage: GetSetStorageService
  ) { }

  ngOnInit() {
    if(this.IsApprDataParent){
      this.getAllEmp = this.getAllEmpParent;
      this.FilterCtrl.valueChanges.subscribe(
        val => {
          this.searchInput = val;
        }
      )
    }
   else{
    if(this.type === 'dh'){
      this.getList(1);
    }
    else{
      this.getList(2);
    }
   }

  
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.showSelectedValue){
      this.FilterCtrl.patchValue(this.defaultValue);
    }  
    if(this.IsApprDataParent){
      this.getAllEmp = this.getAllEmpParent;
    }
    else{
      if(this.type === 'dh'){
        this.getList(1);
      }
      else{
        this.getList(2);
      }
    }
  }
 
   /***
    * get talent  Id list
    */
    getList(type:number) {
      let userEmp =  this._storage.getUserEmpId();
      let filterData = {
       // empId:parseInt(userEmp),
        type:type,
       // Division: this.divisionID,
        cid: this.cid,
        ReqTypeId:this.ReqTypeId
      }
      this.serverCallForFetch(filterData);
    }

    serverCallForFetch(data){
      let obs:any = '';
      
      if(this.isDelegatorList){
        obs = this._globalApiServe.getDelegatorList()
      }else{
        obs = this._globalApiServe.getApproverList(data.empId,data.type,data.Division,data.cid,data.ReqTypeId)
      }
        obs.subscribe(
        res => {
          this.getAllEmp = res['data'];
          this.FilterCtrl.valueChanges.subscribe(
            val => {
              this.searchInput = val;
            }
          )
        }
      );
    }

}
