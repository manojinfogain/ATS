import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-education-master-control',
  templateUrl: './education-master-control.component.html',
  styleUrls: ['./education-master-control.component.scss']
})
export class EducationMasterControlComponent implements OnInit {
  @Input() public formControlOpt: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public listData:any = [];
  @Input() placeholder:string = 'Search';
  @Input() title:string = 'Education';
  @Input() required:boolean = false;
  @Input() filterIds:any = [];
  @Output() getValFromControl = new EventEmitter<any>();
  @Input() outline:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  @Input() public isAllOption:boolean = false;
  @Input() public isOther:boolean = false;
  constructor(private _intCommonServe:GlobalApisService) { }

  ngOnInit(): void {
    this.getDaata();
  }

  getDaata(): void {
    this._intCommonServe.getEducationList().subscribe(
      res => {
        this.listData = res['data'];
        this.FilterCtrl.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        )
      }
    );
  }

   // get id
   getSelectId(event) {
    this.getValFromControl.emit(event.source.value)
  }

}
