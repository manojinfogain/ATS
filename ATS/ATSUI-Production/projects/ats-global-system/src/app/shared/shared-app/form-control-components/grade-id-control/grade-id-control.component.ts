  import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
  import { UntypedFormControl } from '@angular/forms';
  import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
  
  @Component({
    selector: 'app-grade-id-control',
    templateUrl: './grade-id-control.component.html',
    styleUrls: ['./grade-id-control.component.scss']
  })
  export class GradeIdControlComponent implements OnInit {
    @Input() public formControlOpt: UntypedFormControl = new UntypedFormControl();
    public FilterCtrl: UntypedFormControl = new UntypedFormControl();
    public searchInput: string;
    public gradeList:any = [];
    @Input() placeholder:string = 'Search';
    @Input() title:string = 'Grade';
    @Input() required:boolean = false;
    @Output() getValFromControl = new EventEmitter<any>();
    @Input() outline:boolean = false;
    @Input() public formFieldAppearance:string = "legacy";
    @Input() public floatLabel:string = "auto";
    constructor(private _globalApiServe:GlobalApisService) { }
  
    ngOnInit(): void {
      this.getGrade();
    }
  
    getGrade() {
      this._globalApiServe.getGradeList().subscribe(
        res => {
          this.gradeList = res['data'];
          this.FilterCtrl.valueChanges.subscribe(
            val => {
              this.searchInput = val;
            }
          );
        }
      );
    }
  
     // get id
     getSelectId(event) {
      this.getValFromControl.emit(event.source.value)
    }
  
  }
  
  