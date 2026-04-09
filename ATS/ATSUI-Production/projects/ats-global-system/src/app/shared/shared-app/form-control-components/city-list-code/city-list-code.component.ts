
import { Component, Input, OnInit, Output,EventEmitter, OnChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
@Component({
  selector: 'app-city-list-code',
  templateUrl: './city-list-code.component.html',
  styleUrls: ['./city-list-code.component.scss']
})
export class CityListCodeComponent implements OnInit,OnChanges {
  @Input() public parentIdControl: UntypedFormControl;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public cityListData:any = [];
  @Input() placeholder:string = 'Search ';
  @Input() title:string = 'Primary Skill';
  @Input() required:boolean = false;
  @Input() getId:any= '';
  @Input() filteryByCountry:boolean= true;
  @Input() outline:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  @Output() getDataIdCountry = new EventEmitter<any>();
  constructor( private _globalServe:GlobalApisService) { }

  ngOnInit() {
    
    
  }
  getCity(data) {
     this.getDataIdCountry.emit(data.value);
   }
  ngOnChanges(){
    debugger
    if(this.getId){
      if(this.filteryByCountry){
        this.getCityListById(this.getId,null);
      }
      else{
        this.getCityListById(null,this.getId);
      }
      
    }
  }
  getCityListById(id:number = null,stateId:number = null) {
    this._globalServe.getCityList(id,stateId)
    .subscribe(
      res => {
        this.cityListData =  res['data'];
        this.FilterCtrl.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        )

      }
    );
  }
}
