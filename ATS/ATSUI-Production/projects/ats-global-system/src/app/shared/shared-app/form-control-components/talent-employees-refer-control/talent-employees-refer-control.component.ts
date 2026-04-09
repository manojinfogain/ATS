import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { TalentService } from 'projects/ats-global-system/src/app/talent-module/talent.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-talent-employees-refer-control',
  templateUrl: './talent-employees-refer-control.component.html',
  styleUrls: ['./talent-employees-refer-control.component.scss']
})
export class TalentEmployeesReferControlComponent implements OnInit {

  @Input() public IdControl: UntypedFormControl;
  public FilterCtrlAccount: UntypedFormControl = new UntypedFormControl();
  public searchInputReferEmployee: string;
  public projectList: any = [];
  public EmployeeToReferList: any = [];
  // @Input() filterParam: any = {};
  @Input() filterSkill: any = '';
  @Input() filterdeparment: any = '';
  @Input() filterMinExp: any = '';
  @Input() filterMaxExp: any = '';
  @Input() isProposeEmp: boolean = false;
  @Input() placeholder: string = 'Search';
  @Input() title: string = 'Employee List';
  @Input() required: boolean = false;
  @Input() outline: boolean = false;
  @Input() public formFieldAppearance: string = "legacy";
  @Input() public floatLabel: string = "auto";
  @Input() public isAllOption: boolean = false;
  @Input() public isMultiple: boolean = false;
  @Input() public gettingsSkillList: any = [];
  @Input() public isDisableEmpDropdown: boolean = false;

  
  @ViewChild('select') select: MatSelect;
  public pazeSize: any = 100;
  @Output() getDataSource = new EventEmitter<any>();
  @Output() getDataEmpList = new EventEmitter<any>();
  @Output() getUncheckedId = new EventEmitter<any>();
  public allSelected: boolean = false;
  public multiSelectedVal: any = [];
  @Input() public filterIdBy: any = [];
  constructor(private _talentServ: TalentService) { }

  ngOnInit(): void {
    this.FilterCtrlAccount.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged()
    ).subscribe(
      val => {
        //this.searchInputReferEmployee = val;
        this.GetEmployeeToReferTalentIdLists(1, this.pazeSize, 1, val);
      }
    )
    this.GetEmployeeToReferTalentIdLists(1, this.pazeSize, 1, '');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      let selectedData = this.select?.options.filter(d => d.selected === true && d.viewValue != 'close' && d.viewValue != '');
      this.multiSelectedVal = selectedData;
    }, 2000)

  }


  ngOnChanges() {
    if (this.isProposeEmp) {
      this.GetEmployeeToReferTalentIdLists(1, this.pazeSize, 1, '');
    }

    // if (this.gettingsSkillList.length > 0) {
    //   this.isDisableEmpDropdown = true
    // }

  }

  /***
  * get list of  emp for refer/ propose
  */
  GetEmployeeToReferTalentIdLists(page: number, pageSize: number, type: any, search: any): void {
    let body = {
      page: page,
      pageSize: pageSize,
      type: type,
      search: search
    }
    if (this.isProposeEmp) {

      if (this.filterSkill) {
        body['Skill'] = this.filterSkill;
      }
      if (this.filterdeparment) {
        body['Departments'] = this.filterdeparment;
      }
      if (this.filterMinExp) {
        body['MINExperince'] = this.filterMinExp;
      }
      if (this.filterMaxExp) {
        body['MAXExperince'] = this.filterMaxExp;
      }
    }

    this._talentServ.GetEmployeeToReferTalentId(body).subscribe(
      res => {
        this.EmployeeToReferList = res['data'];
        this.getDataEmpList.emit(res['data']);
        // this.FilterCtrlAccount.valueChanges.subscribe(
        //   val => {
        //     this.searchInputReferEmployee = val;
        //   }
        // )
      }
    );
  }

  /***
* all select /deselect
*/
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
    this.getDataSource.emit(sellectedItem);
  }

  optionClick(event: any) {

    if (event.source?._selected == false) {
      this.getUncheckedId.emit(event.source.value);
    }
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
    let selectedData = this.select.options.filter(d => d.selected === true);
    this.multiSelectedVal = selectedData;
    let sellectedItem = [];
    selectedData.forEach(item => {
      sellectedItem.push(item.value)
    });
    this.getDataSource.emit(sellectedItem);
  }


}
