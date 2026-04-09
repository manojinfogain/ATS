import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-lib/src/lib/services/lib-global-apis.service';

@Component({
  selector: 'lib-country-list-code',
  templateUrl: './lib-country-list-code.component.html',
  styleUrls: ['./lib-country-list-code.component.scss']
})
export class LibCountryListCodeComponent implements OnInit {
 @Input() public parentIdControl: UntypedFormControl;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public countryDataList:any = [];
  @Input() public apiBaseUrlMaster:string = '';
  @Input() placeholder:string = 'Search Country';
  @Input() title:string = 'Search Country';
  @Input() required:boolean = false;
  @Input() country:boolean = false;
  @Input() countryCode:boolean = false;
  @Output() getDataIdCountry = new EventEmitter<any>();
  @Input() outline:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  constructor( private _globalServe:GlobalApisService) { }

  ngOnInit() {
    this.skillAll();
  }
  skillAll() {
    this._globalServe.getCountryListCode(this.apiBaseUrlMaster)
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
    * get Talent Id
    */
   getTalentId(data) {
   // let basic = this.talentData.filter(val=> val.talentID === data.value)
    this.getDataIdCountry.emit(data.value);
  }

}
