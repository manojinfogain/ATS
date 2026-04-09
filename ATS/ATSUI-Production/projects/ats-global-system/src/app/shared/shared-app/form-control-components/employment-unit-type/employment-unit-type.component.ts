import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-employment-unit-type',
  templateUrl: './employment-unit-type.component.html',
  styleUrls: ['./employment-unit-type.component.scss']
})
export class EmploymentUnitTypeComponent implements OnInit {
  @Input() public formControlOpt: UntypedFormControl = new UntypedFormControl();
  public empUnitList:any = [];
  @Input() placeholder:string = 'Search';
  @Input() title:string = 'Employee Unit';
  @Input() required:boolean = false;
  @Output() getValFromControl = new EventEmitter<any>();
  @Input() outline:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  constructor(private _globalApiServe:GlobalApisService) { }

  ngOnInit(): void {
    this.getEmployeeUnitList();
    // this.empUnitList = CONSTANTS.EmpUnitList
  }

  getEmployeeUnitList() {
    this._globalApiServe.getEmployeeUnitList().subscribe(
      res => {
        this.empUnitList = res['data'];
      }
    );
  }

   // get id
   getSelectId(event) {
    this.getValFromControl.emit(event.source.value)
  }

}

