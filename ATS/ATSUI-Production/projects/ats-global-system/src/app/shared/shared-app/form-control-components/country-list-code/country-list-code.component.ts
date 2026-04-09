
import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
@Component({
  selector: 'app-country-list-code',
  templateUrl: './country-list-code.component.html',
  styleUrls: ['./country-list-code.component.scss']
})
export class CountryListCodeComponent implements OnInit {
  @Input() public parentIdControl: UntypedFormControl;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public countryDataList:any = [];
  @Input() placeholder:string = 'Search Country';
  @Input() title:string = 'Search Country';
  @Input() public required:boolean = false;
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
    this._globalServe.getCountryListCode()
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
