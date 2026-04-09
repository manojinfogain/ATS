import { Component, OnInit,Input,ViewChild,Output,EventEmitter } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
@Component({
  selector: 'app-interview-by-list-control',
  templateUrl: './interview-by-list-control.component.html',
  styleUrls: ['./interview-by-list-control.component.scss']
})
export class InterviewByListControlComponent implements OnInit {
  @Input() interviewByTitle: string = 'Interview By';
  @Input() public interviewByControlOpt: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlCandiStatus: UntypedFormControl = new UntypedFormControl();
  public interviewByList: any = CONSTANTS.InterViewByListData;
  public searchInput: string;
  public listData: any = [];
  public statusList: any = [];
  @Input() public isMultiple: boolean = false;
  @Input() companyLocation: boolean = false;
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
  public multiSelectedVal: any = [];
  public FilterCtrllocStatus: UntypedFormControl = new UntypedFormControl();
  public searchInputOffer: string = '';
  @ViewChild('select') select: MatSelect;
  constructor(
    // private _globalServe: GlobalApisService,
    private _intCommonServe: InterviewCommonService
  ) { }

  ngOnInit(): void {
   // this.GetInterviewStatus();
    this.interviewByControlOpt?.valueChanges.subscribe(
      v=>{
        if(v === null){
          this.allSelected = false
        }
      }
    )
  }

  // public locationData: any = [];
  // getLocation() {
  //   this._globalServe.getLocationList().subscribe(
  //     res => {
  //       this.locationData = res['data']
  //       this.FilterCtrllocStatus.valueChanges.subscribe(
  //         get => {
  //           this.searchInputOffer = get;
  //         }
  //       )
  //     }
  //   )
  
  // }
  
  // GetInterviewStatus(): void {
  //   this._intCommonServe.getIntStatusList().subscribe(
  //     res => {
  //       this.statusList = res;
  //       this.FilterCtrlCandiStatus.valueChanges.subscribe(
  //         get => {
  //           this.searchInput = get;
  //         }
  //       )
      
  //     }
  //   );
  // }
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
