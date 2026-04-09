import { Component, OnInit,Input,EventEmitter,ViewChild,Output,SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { ViewCalenderHistoryComponent } from '../../components/view-calender-history/view-calender-history.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
@Component({
  selector: 'app-talent-interviewers-list-control',
  templateUrl: './talent-interviewers-list-control.component.html',
  styleUrls: ['./talent-interviewers-list-control.component.scss']
})
export class TalentInterviewersListControlComponent implements OnInit {
  /** For custom multi-select display */
  public multiSelectDisplayText: string = '';
  @Input() public panelIdControl: UntypedFormControl;
  @Input() isEmpListServerSide: boolean = false;
  @Input() isEmpListAll: boolean = false;
  @Input() isMultiple: boolean = false;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  @Input() public getAllEmp: any = [];
  @Input() placeholder: string = 'Search';
  @Input() title: string = 'Select Interviewer';
  @Input() public required: boolean = false;
  @Output() getDataEmp = new EventEmitter<any>();
  IsDropdownLoader: boolean = false;
  public IsDropdownLoaderSearch: boolean = false;
  @Input() showSelectedValue: boolean = false;
  @Input() defaultValue: string = '';
  @Input() public formFieldAppearance: string = "legacy";
  @Input() public floatLabel: string = "auto";
  @Input() public fromDate: UntypedFormControl;
  @Output() getEmpList = new EventEmitter<any>();
  @Input() disabled: boolean = false;
  @Output() getEmpListLoaded = new EventEmitter<any>();
  public multiSelectedVal: any = [];
  constructor(
    private _globalApiServe: GlobalApisService,
    private dialog: MatDialog,
    private _storage: GetSetStorageService
  ) { }
   sortedEmpList: any[] = [];
  ngOnInit() {
    //  this.intDataAllEmp();
    this.getList();
    if (this.isEmpListAll) {
  // Initialize sortedEmpList with full list initially
       this.sortedEmpList = [...this.getAllEmp];
      this.FilterCtrl.valueChanges.subscribe(
        val => {
          this.searchInput = val;
        }
      )
    }


  }

  

  getSelectedText(): string {
  const selectedIds = this.panelIdControl.value || [];
  const selectedList = this.getAllEmp.filter(emp => selectedIds.includes(emp.empnewid));

  if (selectedList.length === 0) return '';

  const first = selectedList[0]?.fullName + ' (' + selectedList[0]?.empnewid + ')';
  const others = selectedList.length - 1;

  if (others > 0) {
    return `${first} (+${others} ${others === 1 ? 'other' : 'others'})`;
  }

  return first;
}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.showSelectedValue) {
      this.FilterCtrl.patchValue(this.defaultValue);
    }
  }

  /***
   * get talent Id list
   */
  getList() {
    this.IsDropdownLoader = true;
    let userEmp =  this._storage.getUserEmpId();
    let filterData = {
      empId: userEmp,
      pagination: false,
      limit: null,
      text: null
    }
    if (this.isEmpListServerSide && !this.isEmpListAll) {
      filterData['pagination'] = true;
      filterData['limit'] = 100;
      if (this.showSelectedValue) {
        filterData['text'] = this.defaultValue;
      
      }
      this.serverCallForFetch(filterData);
      this.FilterCtrl.valueChanges.
        pipe(
          debounceTime(500),
        //  distinctUntilChanged()
        ).subscribe(
          val => {
            
            // if(val.trim() == ''){
            //   filterData['pagination'] = true;
            // } 
            // else{
            //   filterData['pagination'] = false;
            // }
            filterData['text'] = val;
            this.IsDropdownLoaderSearch = true;
            this.serverCallForFetch(filterData);
          }
        )
    }

    else if (!this.isEmpListServerSide && !this.isEmpListAll) {
      filterData['pagination'] = false;
      filterData['limit'] = null;
      filterData['text'] = null;
      this.serverCallForFetch(filterData);
      this.FilterCtrl.valueChanges.subscribe(
        val => {
          this.searchInput = val;
        }
      )
    }
  }

  

  serverCallForFetch(data) {
    this._globalApiServe.getEmployeeList(data.empId, data.pagination, data.limit, data.text).subscribe(
      res => {
        this.getAllEmp = res['data'];
        this.IsDropdownLoader = false;
        this.IsDropdownLoaderSearch = false;
        if (this.showSelectedValue) {
          if(data.text == null || data.text == '' || data.text != this.defaultValue){  
            this.defaultValue = '';          
            this.panelIdControl.patchValue(null);
          }else{
            this.panelIdControl.patchValue(this.defaultValue);
          }
        }
        if (this.isEmpListServerSide) {
          this.getEmpList.next(this.getAllEmp)
        }
        else {
          this.getEmpList.next(this.getAllEmp)
        }
        this.getEmpListLoaded.emit(true);

      },
      (error) => {
        this.IsDropdownLoader = false;
        this.IsDropdownLoaderSearch = false;
      }
    );
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

    public filterEmpMulti: any = [];
  getEmpMulti(e: any) {
    let empIds: string[] = e.value;
    this.filterEmpMulti = this.getAllEmp.filter(v => empIds.includes(v.empnewid));
    debugger
    this.getDataEmp.emit(this.filterEmpMulti);

    // Custom display logic: show first 2 names, then count of others
    if (this.filterEmpMulti.length > 2) {
      const names = this.filterEmpMulti.slice(0, 2).map(x => x.fullName);
      const othersCount = this.filterEmpMulti.length - 2;
      this.multiSelectDisplayText = names.join(', ') + '(+ ' + othersCount + ' others)';
    } else {
      this.multiSelectDisplayText = this.filterEmpMulti.map(x => x.fullName).join(', ');
    }
  }
  

  /***
   * View Calender
   */
  viewCalender() {
    let dateAfter = new Date()
    dateAfter.setDate(new Date(this.fromDate.value).getDate() + 1);
    let data = {
      emailId: this.filterEmp[0].empMailId,
      fromDate: GlobalMethod.formatDate(this.fromDate.value),
      toDate: GlobalMethod.formatDate(dateAfter),
      empName: this.filterEmp[0].fullName,
      empId: this.filterEmp[0].empnewid
    }
    
    const dialogRef = this.dialog.open(ViewCalenderHistoryComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'ats-model-lg'],
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }


  /** Utility for template: get display text for selected values */
  getMultiSelectDisplayText(): string {
    return this.multiSelectDisplayText;
  }

}
