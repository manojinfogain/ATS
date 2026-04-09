import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-state-list-control',
  templateUrl: './state-list-control.component.html',
  styleUrls: ['./state-list-control.component.scss']
})
export class StateListControlComponent implements OnInit {
  @Input() public parentIdControl: UntypedFormControl;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public countryDataList:any = [];
  @Input() placeholder:string = 'Search State';
  @Input() title:string = 'Search State';
  @Input() required:boolean = false;
  @Output() getDataIdState = new EventEmitter<any>();
  @Input() outline:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  constructor( private _globalServe:GlobalApisService) { }
  ngOnInit() {
    this.cityList();
  }

  cityList():void {
    this._globalServe.getStateList()
    .subscribe(
      res => {
        this.countryDataList =  res['data'];
        this.FilterCtrl.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        )

      }
    );
  }


    /***
    * get  Id
    */
     getId(data) {
      // let basic = this.talentData.filter(val=> val.talentID === data.value)
       this.getDataIdState.emit(data.value);
     }
}
