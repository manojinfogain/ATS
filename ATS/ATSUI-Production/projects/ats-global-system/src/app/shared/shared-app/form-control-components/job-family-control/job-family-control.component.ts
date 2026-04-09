import { Component, EventEmitter, Input, OnInit, Output, OnChanges,SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-job-family-control',
  templateUrl: './job-family-control.component.html',
  styleUrls: ['./job-family-control.component.scss']
})
export class JobFamilyControlComponent implements OnInit,OnChanges {
  @Input() public formControlOpt: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public jobFamilyList:any = [];
  @Input() placeholder:string = 'Search';
  @Input() title:string = 'Job Family';
  @Input() required:boolean = false;
  @Output() getValFromControl = new EventEmitter<any>();
  @Input() outline:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  @Input() public DivisionID:number;
  @Input() public PracticeID:number;
  constructor(private _globalApiServe:GlobalApisService) { }

  ngOnInit(): void {
    // this.getjobFamily(this.DivisionID);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.PracticeID){
      this.getjobFamily(this.PracticeID);
    }
  }

  getjobFamily(id:number) {
    this._globalApiServe.getJobFamilyList(id).subscribe(
      res => {
        this.jobFamilyList = res['data'];
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
    this.getValFromControl.emit(event.value)
  }

}

