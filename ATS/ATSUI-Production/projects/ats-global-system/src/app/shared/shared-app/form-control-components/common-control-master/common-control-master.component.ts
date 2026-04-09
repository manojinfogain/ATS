import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
@Component({
  selector: 'app-common-control-master',
  templateUrl: './common-control-master.component.html',
  styleUrls: ['./common-control-master.component.scss']
})
export class CommonControlMasterComponent implements OnInit {
  @Input() public formControlOpt: UntypedFormControl;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public designationListData:any = [];
  @Input() placeholder:string = 'Search';
  @Input() title:string = 'Designation';
  @Input() required:boolean = false;
  @Input() desgination:boolean = false;
  @Output() getGradeId = new EventEmitter<any>();
  @Input() outline:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  constructor( private _globalServe:GlobalApisService) { }

  ngOnInit() {
    this.skillAll();
  }
  skillAll() {
    this._globalServe.getDesignation()
    .subscribe(
      res => {
        this.designationListData =  res['data'];
        this.FilterCtrl.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        )

      }
    );
  }

  getdesignationId(e:EventTarget){
    let ev = (<HTMLInputElement> e).value;
    let getSelectedData = this.designationListData.filter(v=>v.DesignationId === parseInt(ev))
    this.getGradeId.emit(getSelectedData[0].GRADE_ID);
  }

}
