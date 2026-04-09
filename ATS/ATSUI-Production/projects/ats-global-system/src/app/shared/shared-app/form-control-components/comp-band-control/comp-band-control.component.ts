
  import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
  import { UntypedFormControl } from '@angular/forms';
  import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
  
  @Component({
    selector: 'app-comp-band-control',
    templateUrl: './comp-band-control.component.html',
    styleUrls: ['./comp-band-control.component.scss']
  })
  export class CompBandControlComponent implements OnInit,OnChanges {
    @Input() public formControlOpt: UntypedFormControl = new UntypedFormControl();
    public FilterCtrl: UntypedFormControl = new UntypedFormControl();
    public searchInput: string;
    public gradeBandList:any = [];
    @Input() placeholder:string = 'Search';
    @Input() title:string = 'Grade';
    @Input() required:boolean = false;
    @Output() getValFromControl = new EventEmitter<any>();
    @Input() outline:boolean = false;
    @Input() public formFieldAppearance:string = "legacy";
    @Input() public floatLabel:string = "auto";
    @Input() public GradeId:number;
    
    constructor(private _globalApiServe:GlobalApisService) { }
  
    ngOnInit(): void {
      // this.getGradeBand(this.GradeId);
    }

    ngOnChanges(changes: SimpleChanges): void {
      if(this.GradeId){
        this.getGradeBand(this.GradeId);
      }
    }
  
    getGradeBand(id: number) {
      this._globalApiServe.getGradeBandList(id).subscribe(
        res => {
          let data = res['data']
          this.gradeBandList = data.filter(({ ID }) => ID !== null);
        }
      );
    }
  
     // get id
     getSelectId(event) {
      this.getValFromControl.emit(event.source.value)
    }
  
  }
  
  