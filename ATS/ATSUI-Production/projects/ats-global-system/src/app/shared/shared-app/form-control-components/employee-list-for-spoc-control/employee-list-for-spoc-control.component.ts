import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
@Component({
  selector: 'app-employee-list-for-spoc-control',
  templateUrl: './employee-list-for-spoc-control.component.html',
  styleUrls: ['./employee-list-for-spoc-control.component.scss']
})
export class EmployeeListForSpocControlComponent implements OnInit, OnChanges {
  @Input() public panelIdControl: UntypedFormControl;
  @Input() isMultiple: boolean = false;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  @Input() public getAllEmp: any = [];
  @Input() placeholder: string = 'Search';
  @Input() title: string = 'Select Spoc';
  @Input() required: boolean = false;
  @Output() getDataEmp = new EventEmitter<any>();
  IsDropdownLoader: boolean = false;
  public IsDropdownLoaderSearch: boolean = false;
  @Input() showSelectedValue: boolean = false;
  @Input() defaultValue: string = '';
  @Input() public formFieldAppearance: string = "legacy";
  @Input() public floatLabel: string = "auto";
  @Input() public fromDate: UntypedFormControl;
  @Output() getEmpList = new EventEmitter<any>();
  constructor(  ) { }

  ngOnInit() {
    if (this.getAllEmp) {
      this.FilterCtrl.valueChanges.subscribe(
        val => {
          this.searchInput = val;
        }
      )
    }


  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.showSelectedValue) {
      this.FilterCtrl.patchValue(this.defaultValue);
    }
  }

    
  /***
   * get Emp info
   */
  public filterEmp: any = [];
  getEmp(e: any) {
    let empId: string = e.value;
    this.filterEmp = this.getAllEmp.filter(v => v.empnewid == empId);
    this.getDataEmp.emit(this.filterEmp[0]);
  }  

  triggerFunc(id) {
    let names = this.getAllEmp?.filter(d => d.empnewid == id)[0];
    return names?.fullName;
  }

  // reset filter on close of drop down
  closeDropDown() {
    this.FilterCtrl.reset();
  }


}

