import { Component, OnInit, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { TalentService } from 'projects/ats-global-system/src/app/talent-module/talent.service';

@Component({
  selector: 'app-ijp-status-control',
  templateUrl: './ijp-status-control.component.html',
  styleUrls: ['./ijp-status-control.component.scss']
})
export class IjpStatusControlComponent implements OnInit {
  @Input() statusTitle: string = 'IJP Status';
  @Input() public ijpStatusControlOpt: UntypedFormControl = new UntypedFormControl();
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
  @Output() getValFromControl = new EventEmitter<any>();
  @Input() outline: boolean = false;
  @Input() public formFieldAppearance: string = "legacy";
  @Input() public floatLabel: string = "auto";
  @Input() public isAllOption: boolean = false;
  @Input() public allSelected: boolean = false;
  @Input() public screenType: string = '';
  public statusData: any = [];
  // this?.screenType == 'I' ? [
  //   {
  //     "id": '0',
  //     "statusName": "Rejected"
  //   },
  //   {
  //     "id": '11',
  //     "statusName": "Applied"
  //   },
  //   {
  //     "id": '1',
  //     "statusName": "Proposed"
  //   },
  //   {
  //     "id": '2',
  //     "statusName": "Selected"
  //   },
  //   {
  //     "id": '3',
  //     "statusName": "Client Interview"
  //   },
  //   {
  //     "id": '4',
  //     "statusName": "Train & Deploy"
  //   },
  //   {
  //     "id": '5',
  //     "statusName": "Pending With WMG Approval"
  //   }
  // ] : [
  //    {
  //     "id": '0',
  //     "statusName": "Rejected"
  //   },
  //   {
  //     "id": '1',
  //     "statusName": "Proposed"
  //   },
  //   {
  //     "id": '2',
  //     "statusName": "Selected"
  //   },
  //   {
  //     "id": '3',
  //     "statusName": "Client Interview"
  //   },
  //   {
  //     "id": '4',
  //     "statusName": "Train & Deploy"
  //   },
  //   {
  //     "id": '5',
  //     "statusName": "Pending With WMG Approval"
  //   }
  // ];
  public multiSelectedVal: any = [];
  public FilterCtrlGrade: UntypedFormControl = new UntypedFormControl();
  public searchInputGrade: string = '';
  @ViewChild('select') select: MatSelect;
  constructor(
    private _TalentService: TalentService
  ) { }

  ngOnInit(): void {
    this.getStatusIjp();
    this.ijpStatusControlOpt?.valueChanges.subscribe(
      v => {
        if (v === null) {
          this.allSelected = false
        }
      }
    )
  }

  public gradeList: any = [];
  getStatusIjp() {
    // this._TalentService.getStatusIjp().subscribe(
    //   res => {
    //     this.gradeList = res['data']
    //     this.FilterCtrlGrade.valueChanges.subscribe(
    //       get => {
    //         this.searchInputGrade = get;
    //       }
    //     )
    //   }
    // )
    this.statusData = this?.screenType == 'I' ? [
    {
      "id": '0',
      "statusName": "Rejected"
    },
    {
      "id": '11',
      "statusName": "Applied"
    },
    {
      "id": '1',
      "statusName": "Proposed"
    },
    {
      "id": '2',
      "statusName": "Selected"
    },
    {
      "id": '3',
      "statusName": "Client Interview"
    },
    {
      "id": '4',
      "statusName": "Train & Deploy"
    },
    {
      "id": '5',
      "statusName": "Pending With WMG Approval"
    }
  ] : [
     {
      "id": '0',
      "statusName": "Rejected"
    },
    {
      "id": '1',
      "statusName": "Proposed"
    },
    {
      "id": '2',
      "statusName": "Selected"
    },
    {
      "id": '3',
      "statusName": "Client Interview"
    },
    {
      "id": '4',
      "statusName": "Train & Deploy"
    },
    {
      "id": '5',
      "statusName": "Pending With WMG Approval"
    }
  ];
  }
  // get id
  getSelectId(event) {
    this.getValFromControl.emit(event.source.value)
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
    // this.getSkillIdOutput.emit(sellectedItem);
  }


}
