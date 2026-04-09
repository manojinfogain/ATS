import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-location-control',
  templateUrl: './location-control.component.html',
  styleUrls: ['./location-control.component.scss']
})
export class LocationControlComponent implements OnInit {
  @Input() companyLocationTitle: string = 'Location';
  @Input() public locationControlOpt: UntypedFormControl = new UntypedFormControl();
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
  @Input() companyLocationIds: any = [];
  
  public multiSelectedVal: any = [];
  public FilterCtrllocStatus: UntypedFormControl = new UntypedFormControl();
  public searchInputOffer: string = '';
  @ViewChild('select') select: MatSelect;
  constructor(
    private _globalServe: GlobalApisService
  ) { }

  ngOnInit(): void {
    this.getLocation();
    this.locationControlOpt?.valueChanges.subscribe(
      v=>{
        if(v === null){
          this.allSelected = false
        }
      }
    )
  }

  public locationData: any = [];
  getLocation() {
    this._globalServe.getLocationList().subscribe(
      res => {
        let filterById
        if (this.companyLocationIds?.length === 0) {
          this.locationData = res['data'];
        }
        else {
          filterById = this.companyLocationIds;
          let filterByStatus = res['data'].filter(t => {
            return filterById?.indexOf(t.LocID) !== -1;
          });
          this.locationData = filterByStatus;
        }


        this.FilterCtrllocStatus?.valueChanges.subscribe(
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

  /**
   * Get truncated display name for the first selected location
   * Truncates location ID 21 name to show only 'Any Infogain Base Location'
   */
  getFirstSelectedDisplayName(): string {
    if (this.multiSelectedVal?.length === 0) {
      return '';
    }
    
    const firstSelected = this.multiSelectedVal[0];
    const displayName = firstSelected?.viewValue || '';
    
    // Check if the selected location ID is 21
    if (firstSelected?.value === 21) {
      // Truncate to show only 'Any Infogain Base Location' without the parenthetical part
      const matchResult = displayName.match(/^Any Infogain Base Location/);
      return matchResult ? matchResult[0] : displayName;
    }
    
    return displayName;
  }
}
