import { Component, OnInit, Output, Input, ViewChild, EventEmitter, SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { TalentService } from 'projects/ats-global-system/src/app/talent-module/talent.service';

@Component({
  selector: 'app-primary-skills-by-tc-control',
  templateUrl: './primary-skills-by-tc-control.component.html',
  styleUrls: ['./primary-skills-by-tc-control.component.scss']
})
export class PrimarySkillsByTcControlComponent implements OnInit {
  @Input() Title: string = 'Primary Skills';
  @Input() public primarySkillTcControlOpt: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  // public listData: any = [];
  @Input() public isMultiple: boolean = false;
  // @Input() companyLocation: boolean = false;
  @Input() placeholder: string = 'Search';
  @Input() title: string = '';
  @Input() required: boolean = false;
  @Input() type: string = 'intmode';
  @Input() filterIds: any = [];
  @Output() getPrimarySkillValFromControl = new EventEmitter<any>();
  @Input() outline: boolean = false;
  @Input() public formFieldAppearance: string = "legacy";
  @Input() public floatLabel: string = "auto";
  @Input() public isAllOption: boolean = false;
  @Input() public allSelected: boolean = false;

  public statusData: any = [

    {
      "id": '4',
      "statusName": "Rejected"
    },
    {
      "id": '1',
      "statusName": "Applied"
    },
    {
      "id": '2',
      "statusName": "Proposed"
    },
    {
      "id": '3',
      "statusName": "Selected"
    }
  ];
  @Input() public talentCubeId:any = 0;
  public multiSelectedVal: any = [];
  public FilterCtrlGrade: UntypedFormControl = new UntypedFormControl();
  public searchInputGrade: string = '';
  @ViewChild('select') select: MatSelect;
  constructor(
    private _TalentService: TalentService
  ) { }

  ngOnInit(): void {
    // this.getPrimarySkillsByTc(this.talentCubeId);
    // this.primarySkillTcControlOpt?.valueChanges.subscribe(
    //   v => {
    //     if (v === null) {
    //       this.allSelected = false
    //     }
    //   }
    // )
    
  }
  ngAfterViewInit() {
    debugger
  //  this.getPrimarySkillsByTc(this.talentCubeId);
  }
  ngOnChanges(changes: SimpleChanges): void {
    debugger
    this.primarySkillTcControlOpt.reset();
    if (this.talentCubeId ) {
      this.getPrimarySkillsByTc(this.talentCubeId);
    }
  }

  public primarySkillsList: any = [];
  getPrimarySkillsByTc(tcId:number) {
    this._TalentService.getPrimarySKillsListByTc(tcId).subscribe(
      res => {
        this.primarySkillsList = res['data']
        this.FilterCtrl.valueChanges.subscribe(
          get => {
            debugger
            this.searchInput = get;
          }
        )
      }
    )

  }
  // get id
  getSelectId(event) {
    this.getPrimarySkillValFromControl.emit(event.source.value)
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
    /***
    * get selected value
    */
    let selectedData = this.select.options.filter(d => d.selected === true && d.viewValue != 'close' && d.viewValue != '');
    this.multiSelectedVal = selectedData;
    let sellectedItem = [];
    debugger
    selectedData.forEach(item => {
      if (item.value) {
        sellectedItem.push(item.value)
      }

    });

  }

  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
    /***
     * get selected value
     */
    let selectedData = this.select.options.filter(d => d.selected === true && d.viewValue != 'close' && d.viewValue != '');
    this.multiSelectedVal = selectedData;
    let sellectedItem = [];
    selectedData.forEach(item => {
      sellectedItem.push(item.value)
    });
     this.getPrimarySkillValFromControl.emit(sellectedItem);
  }

}
