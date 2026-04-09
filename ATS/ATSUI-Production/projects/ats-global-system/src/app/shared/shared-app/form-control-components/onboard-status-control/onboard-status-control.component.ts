import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';


@Component({
  selector: 'app-onboard-status-control',
  templateUrl: './onboard-status-control.component.html',
  styleUrls: ['./onboard-status-control.component.scss']
})
export class OnboardStatusControlComponent implements OnInit {
  @Input() public ControlFormOpt: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  @Input() public isMultiple: boolean = false;
  @Input() placeholder: string = 'Search';
  @Input() title: string = '';
  @Input() required: boolean = false;
  @Output() getValFromControl = new EventEmitter<any>();
  @Input() outline: boolean = false;
  @Input() public formFieldAppearance: string = "legacy";
  @Input() public floatLabel: string = "auto";
  @Input() public isAllOption: boolean = false;
  @Input() public allSelected: boolean = false;
  @Input() public statusType: string = 'M';
  public multiSelectedVal: any = [];
  public searchInputOffer: string = '';
  @ViewChild('select') select: MatSelect;
  constructor(
    private _globalServe: GlobalApisService
  ) { }

  ngOnInit(): void {
    this.getLocation();
    this.ControlFormOpt.valueChanges.subscribe(
      v=>{
        if(v === null){
          this.allSelected = false
        }
      }
    )
  }

  public offerStatusData: any = [];
  getLocation() {
    this._globalServe.getAllOnboardStatus().subscribe(
      res => {
      //  this.offerStatusData = res['data'];
        //main status
        if(this.statusType == 'M'){
          // let filterById = ['E','O'];
          // let filterByStatus = res.filter(t => {
          //   return filterById.indexOf(t.statusId) !== -1;
          // });
          this.offerStatusData = res['data'].filter(d=> d.StatusType == 'E' || d.StatusType == 'O' || d.StatusType == null);
        }
        else if(this.statusType == 'S'){
          this.offerStatusData = res['data'].filter(d=> d.StatusType == 'S' ||  d.StatusType == null);
        }
        this.FilterCtrl.valueChanges.subscribe(
          get => {
            this.searchInputOffer = get;
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
