import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';

@Component({
  selector: 'app-profile-source-control',
  templateUrl: './profile-source-control.component.html',
  styleUrls: ['./profile-source-control.component.scss']
})
export class ProfileSourceControlComponent implements OnInit {

 
  @Input() profileSourceTitle: string = 'Profile Source';
  @Input() public profileSourceControlOpt: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public listData: any = [];
  @Input() dropPendingWithMeOfferApr: boolean = false;
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
  @Input() offerStatusIds: any = [];
  public FilterCtrlOfferStatus: UntypedFormControl = new UntypedFormControl();
  public multiSelectedVal: any = [];
  public searchInputOffer: string = '';
  @ViewChild('select') select: MatSelect;
  constructor(
    private _intervCommonSer:InterviewCommonService
  ) { }

  ngOnInit(): void {
    this.getprofileSourceList();
    this.profileSourceControlOpt.valueChanges.subscribe(
      v=>{
        if(v === null){
          this.allSelected = false
        }
      }
    )
  }

  public profileList: any = [];
  getprofileSourceList() {
    this._intervCommonSer.getProfileName().subscribe(
      res => {
        this.profileList = res['data'];
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
