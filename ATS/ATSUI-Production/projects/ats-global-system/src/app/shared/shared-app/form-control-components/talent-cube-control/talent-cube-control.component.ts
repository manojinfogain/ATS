import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-talent-cube-control',
  templateUrl: './talent-cube-control.component.html',
  styleUrls: ['./talent-cube-control.component.scss']
})
export class TalentCubeControlComponent implements OnInit, OnChanges {
  @Input() public formControlOpt: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  @Input() placeholder: string = 'Search';
  @Input() title: string = 'Job Family';
  @Input() required: boolean = false;
  @Output() getValFromControl = new EventEmitter<any>();
  @Output() getTalentCubeListFromControl = new EventEmitter<any>();
  @Input() outline: boolean = false;
  @Input() public formFieldAppearance: string = "legacy";
  @Input() public floatLabel: string = "auto";
  @Input() public DivisionID: number;
  @Input() public PracticeID: number;
  constructor(private _globalApiServe: GlobalApisService) { }

  ngOnInit(): void {
    this.getTalentCubeList();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  //get getTalentCubeList list

  public talentCubeList: any = [];
  getTalentCubeList() {
    this._globalApiServe.getTalentCubeList().subscribe(
      res => {
        this.talentCubeList = res['data'];
        this.FilterCtrl.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        );          
        this.getTalentCubeListFromControl.emit(res['data']);
      }
    );
  }

  // get id
  getSelectId(event) {
    let obj = {
      talentCubeList : this.talentCubeList,
      selectedVal: event.value
    }
    this.getValFromControl.emit(obj)
  }

}


