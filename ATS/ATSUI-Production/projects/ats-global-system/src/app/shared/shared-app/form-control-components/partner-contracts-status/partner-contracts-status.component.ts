import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';

@Component({
  selector: 'app-partner-contracts-status',
  templateUrl: './partner-contracts-status.component.html',
  styleUrls: ['./partner-contracts-status.component.scss']
})
export class PartnerContractsStatusComponent implements OnInit {

  @Input() regisPartnerStatusTitle: string = 'Contract Status';
  @Input() public partnerContractsStatusControlOpt: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlCandiStatus: UntypedFormControl = new UntypedFormControl();
  public partnerStatusList: any = [
    {
      Id: 1,
      StatusName: "Pending"
    },
    {
      Id: 2,
      StatusName: "Approved"
    },
    {
      Id: 3,
      StatusName: "Rejected"
    },];
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
    //  this.getPartnerstatusList();
    this.partnerContractsStatusControlOpt?.valueChanges.subscribe(
      v => {
        if (v === null) {
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

  /**registred partner status list */
  getPartnerstatusList(): void {
    this._intCommonServe.getPartnerstatusList().subscribe(
      res => {


        //this.partnerStatusList = res['data'];
        // let idsToFilter = [1, 3];
        // this.partnerStatusList=   res['data'].filter(item => idsToFilter.includes(item.id));
        // debugger
        // this.FilterCtrlCandiStatus.valueChanges.subscribe(
        //   get => {
        //     this.searchInput = get;
        //   }
        // )

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
