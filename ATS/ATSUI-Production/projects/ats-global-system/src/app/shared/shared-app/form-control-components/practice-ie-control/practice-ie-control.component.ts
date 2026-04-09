import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-practice-ie-control',
  templateUrl: './practice-ie-control.component.html',
  styleUrls: ['./practice-ie-control.component.scss']
})
export class PracticeIeControlComponent implements OnInit {
  @Input() public formControlOpt: UntypedFormControl = new UntypedFormControl();
  public practiceList:any = [];
  @Input() placeholder:string = 'Search';
  @Input() title:string = 'Studio / Practice';
  @Input() required:boolean = false;
  @Output() getValFromControl = new EventEmitter<any>();
  @Input() outline:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  constructor(private _globalApiServe:GlobalApisService) { }

  ngOnInit(): void {
    this.getAllPractices();
  }

  getAllPractices() {
    //get cand type
    this._globalApiServe.getAllPractices().subscribe(
      res => {
        this.practiceList = res['data'];
      }
    );
  }

   // get id
   getSelectId(event) {
    this.getValFromControl.emit(event.source.value)
  }

}

