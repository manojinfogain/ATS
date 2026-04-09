import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { BgvServiceService } from 'projects/ats-global-system/src/app/bgv-module/bgv-service.service';


@Component({
  selector: 'app-bgv-final-status-control',
  templateUrl: './bgv-final-status-control.component.html',
  styleUrls: ['./bgv-final-status-control.component.scss']
})
export class BgvFinalStatusControlComponent implements OnInit {
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
  // public searchInputOffer: string = '';
  @ViewChild('select') select: MatSelect;
  constructor(
      private _bgvServe: BgvServiceService,
  ) { }

  ngOnInit(): void {
    this.getBgvFinalStatus();
    this.ControlFormOpt.valueChanges.subscribe(
      v=>{
        if(v === null){
          this.allSelected = false
        }
      }
    )
  }

  public bgvFinalStatusData: any = [];
  getBgvFinalStatus() {
    this._bgvServe.getBgvFinalStatus().subscribe(
      res => {      
          this.bgvFinalStatusData = res['data'];
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
