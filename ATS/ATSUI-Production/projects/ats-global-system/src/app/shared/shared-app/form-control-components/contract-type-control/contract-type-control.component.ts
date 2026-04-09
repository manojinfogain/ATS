import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { of } from 'rxjs';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-contract-type-control',
  templateUrl: './contract-type-control.component.html',
  styleUrls: ['./contract-type-control.component.scss']
})
export class ContractTypeControlComponent implements OnInit {

  @Input() ContractTypeTitle: string = 'Contract Type';
  @Input() public contractTypeControlOpt: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public listData: any = [];
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
  @Input() public contractIds: any = [];
  public multiSelectedVal: any = [];
  @ViewChild('select') select: MatSelect;
  constructor(
    private _globalServe: GlobalApisService
  ) { }

  ngOnInit(): void {
    this.getContractList();
    this.contractTypeControlOpt.valueChanges.subscribe(
      v=>{
        if(v === null){
          this.allSelected = false
        }
      }
    )

  }

  public contactList: any = [];
  getContractList() {
    this._globalServe.GetContractTypes().subscribe(
      res => {
        if (this.contractIds.length == 0) {
          this.contactList = res['data'];
        } else {
          let filteredContType = res.data.filter(t => {
            return this.contractIds.indexOf(t.ID) !== -1;
          });
          this.contactList = filteredContType;
        }
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
