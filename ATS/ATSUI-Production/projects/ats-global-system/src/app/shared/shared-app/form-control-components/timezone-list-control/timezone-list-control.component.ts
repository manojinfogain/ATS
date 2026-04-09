import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-timezone-list-control',
  templateUrl: './timezone-list-control.component.html',
  styleUrls: ['./timezone-list-control.component.scss']
})
export class TimezoneListControlComponent implements OnInit {
  @Input() public IdControl: UntypedFormControl;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public timeZoneList:any = [];
  @Input() placeholder:string = 'Search Timezone';
  @Input() title:string = 'Select Timezone';
  @Input() required:boolean = false;
  @Output() getDataTimeZone = new EventEmitter<any>();
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  @Output() getEmpTzList = new EventEmitter<any>();
  constructor(
    private _globalApiServe: GlobalApisService
  ) { }

  ngOnInit(): void {
    this.getList();
    this.FilterCtrl.valueChanges.subscribe(
      val => {
        this.searchInput = val;
      }
    )
  }

  /***
    * get talent Id list
    */
   getList() {
    
    this._globalApiServe.getTzList().subscribe(
      res => {
        this.timeZoneList = res['value'];
      }
    );
  }


}
