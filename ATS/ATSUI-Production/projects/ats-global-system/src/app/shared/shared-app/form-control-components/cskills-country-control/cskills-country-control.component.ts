import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { UntypedFormControl, FormGroup } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';

@Component({
  selector: 'app-cskills-country-control',
  templateUrl: './cskills-country-control.component.html',
  styleUrls: ['./cskills-country-control.component.scss']
})
export class CskillsCountryControlComponent implements OnInit {
  @Input() public panelIdControl: UntypedFormControl;
  public FilterCtrlPractice: UntypedFormControl = new UntypedFormControl([]);
  public FilterCtrlCskillCountry:UntypedFormControl = new UntypedFormControl([]);
  public searchInputCskillContry:string;
  public searchInputPractice: string;
  public cskillCountryList: any = [];
  @Input() placeholder: string = 'Search Country';
  @Input() title: string = 'Country';
  @Input() required: boolean = false;
  @Input() outline: boolean = false;
  @Input() public formFieldAppearance: string = "legacy";
  @Input() public floatLabel: string = "auto";
  @Input() public isAllOption: boolean = false;
  @Input() public isMultiple: boolean = false;
  @Output() getDataSource = new EventEmitter<any>();
  /** mat selector's option refernce for all admins  */
  //@ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('select') select: MatSelect;
  public allSelcount: boolean = false;
  public showCount: any = '';
  public temp: any = [];
  constructor(
    private _globalServe: GlobalApisService,
     private share: ShareService
     ) 
     { }
  @Input() public allSelected: boolean = false;
  @Input() public isAllText: boolean = true;
  public multiSelectedVal: any = [];
  ngOnInit() {
    this.getcSkillCountryList();
    this.panelIdControl?.valueChanges.subscribe(
      v => {
        if (v === null) {
          this.allSelected = false
        }
      }
    )

  }
  ngOnChanges() {
  }

  //get practice list
  getcSkillCountryList() {
    this._globalServe.getcSkillCountryList()
      .subscribe(
        res => {
          this.cskillCountryList = res['data'];
          
          this.FilterCtrlCskillCountry.valueChanges.subscribe(
            val=>{
              this.searchInputCskillContry = val;
            }
          )

        }
      );
  }

  getPracticeId(data): void {
    this.getDataSource.emit(data.value)
  }
  /***
   * all select /deselect
   */
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
      this.allSelcount = true;
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
      this.allSelcount = false;
    }
    /***
    * get selected value
    */
    // let selectedData = this.select.options.filter(d=>d.selected === true && d.viewValue != 'close' && d.viewValue != '');
    let selectedData: any = [];
    this.temp = [];
    this.select.options.forEach((item: MatOption) => {
      const index: number = this.temp.indexOf(item);
      if (index < 0 && item.selected === true && item.viewValue !== '' && item.viewValue !== 'close') {
        this.temp.push(item)
      }
    });
    selectedData = this.temp?.filter(d => this.panelIdControl?.value.some(o2 => d.value === o2));
    this.multiSelectedVal = selectedData;
    this.showCount = this.allSelcount ? this.panelIdControl?.value?.length - 1 : this.panelIdControl?.value?.length;

    // emitting selcted data
    let sellectedItem = [];
    let uniqSelectedData = [... new Set(selectedData.map(data => data.value))];
    uniqSelectedData.forEach(item => {
      if (item) {
        sellectedItem.push(item);
      }
    });
    this.getDataSource.emit(sellectedItem);
  }

  optionClick() {
    
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
      if (
        (this.panelIdControl?.value?.length == this.select?.options?.length - 1) &&
        !this.allSelcount &&
        !this.FilterCtrlPractice?.value?.length
      ) {
        newStatus = true;
      }
    });
    this.allSelected = newStatus;
    /***
     * get selected value
     */
    // let selectedData = this.select.options.filter(d=>d.selected === true && d.viewValue != 'close' && d.viewValue != '');
    let selectedData: any = [];
    this.select.options.forEach((item: MatOption) => {
      const index: number = this.temp.indexOf(item);
      if (index < 0 && item.selected === true && item.viewValue !== '' && item.viewValue !== 'close') {
        this.temp.push(item)
      }
    });
    selectedData = this.temp?.filter(d => this.panelIdControl?.value.some(o2 => d.value === o2));
    this.multiSelectedVal = selectedData;
    this.showCount = this.allSelcount ? this.panelIdControl?.value?.length - 1 : this.panelIdControl?.value?.length;
    // emitting selcted data
    let sellectedItem = [];
    let uniqSelectedData = [... new Set(selectedData.map(data => data.value))];
    uniqSelectedData.forEach(item => {
      if (item) {
        sellectedItem.push(item);
      }
    });
    this.getDataSource.emit(sellectedItem);
  }

}
