import { Component, OnInit ,Input,Output, ViewChild, EventEmitter} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';

@Component({
  selector: 'app-candidate-status-control',
  templateUrl: './candidate-status-control.component.html',
  styleUrls: ['./candidate-status-control.component.scss']
})
export class CandidateStatusControlComponent implements OnInit {

  @Input() candidateStatusTitle: string = 'Candidate Status';
  @Input() public candidateStatusControlOpt: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlCandiStatus: UntypedFormControl = new UntypedFormControl();
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
    private _globalServe: GlobalApisService,
    private _intCommonServe: InterviewCommonService
  ) { }

  ngOnInit(): void {
    this.GetInterviewStatus();
    this.candidateStatusControlOpt?.valueChanges.subscribe(
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
  
  GetInterviewStatus(): void {
    this._intCommonServe.getIntStatusList().subscribe(
      res => {
        this.statusList = res;
        this.FilterCtrlCandiStatus.valueChanges.subscribe(
          get => {
            this.searchInput = get;
          }
        )
        // let dropReasonId:any =[];
        // console.log(res);
        // this.statusList.forEach(ele => {
        //   if(ele.statusId == 240 || 260){
        //     dropReasonId.push(ele.statusId);
        //   }
        // });
        // this.getIdForSubList(dropReasonId);
      }
    );
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
