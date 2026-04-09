import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-designation-control',
  templateUrl: './designation-control.component.html',
  styleUrls: ['./designation-control.component.scss']
})
export class DesignationControlComponent implements OnInit {
  @Input() public IdControl: UntypedFormControl;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public recList:any = [];
  @Input() placeholder:string = 'Search';
  @Input() title:string = 'Designation';
  @Input() required:boolean = false;
  @Input() outline:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  @Input() public isAllOption:boolean = false;
  @Input() public type:string = 'recruiter';
  @Output() getDataSource = new EventEmitter<any>();
  public userData: any = {};
  constructor(private _globalServe:GlobalApisService,private _storage: GetSetStorageService) { }

  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    this.recruiterList();
    
  }

  recruiterList() {
    this._globalServe.getDesignation()
    .subscribe(
      res => {
        this.recList =  res['data'];
        this.FilterCtrl.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        )

      }
    );
  }


  getId(data):void{
     this.getDataSource.emit(data.value)
  }

}
