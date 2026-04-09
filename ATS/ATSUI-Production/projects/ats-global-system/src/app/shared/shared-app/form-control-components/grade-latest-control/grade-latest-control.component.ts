import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-grade-latest-control',
  templateUrl: './grade-latest-control.component.html',
  styleUrls: ['./grade-latest-control.component.scss']
})
export class GradeLatestControlComponent implements OnInit {
  @Input() GradeTitle: string = 'Grade';
  @Input() public gradeControlOpt: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public listData: any = [];
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
  @Input() gradeIds: any = [];
  public multiSelectedVal: any = [];
  public FilterCtrlGrade: UntypedFormControl = new UntypedFormControl();
  public searchInputGrade: string = '';
  @ViewChild('select') select: MatSelect;
  constructor(
    private _globalServe: GlobalApisService
  ) { }

  ngOnInit(): void {
    this.getGrade();
    this.gradeControlOpt?.valueChanges.subscribe(
      v => {
        if (v === null) {
          this.allSelected = false
        }
      }
    )
  }

  public gradeList: any = [];
  getGrade() {
    this._globalServe.getGradeList().subscribe(
      res => {
       // this.gradeList = res['data'];
       debugger
        let filterById
        if (this.gradeIds?.length === 0) {
          // filterById = [140, 160, 200, 180, 220]
          this.gradeList  = res['data'];
        }
        else {
          filterById = this.gradeIds;
          let filterByStatus = res['data'].filter(t => {
            return filterById?.indexOf(t.GRADE_ID) !== -1;
          });
          this.gradeList = filterByStatus;
        }
        this.FilterCtrlGrade.valueChanges.subscribe(
          get => {
            this.searchInputGrade = get;
          }
        )
      }
    )

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
