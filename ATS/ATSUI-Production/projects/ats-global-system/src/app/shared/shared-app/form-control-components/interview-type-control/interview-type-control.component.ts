import { Component, OnInit,Input, EventEmitter, ViewChild,Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';

@Component({
  selector: 'app-interview-type-control',
  templateUrl: './interview-type-control.component.html',
  styleUrls: ['./interview-type-control.component.scss']
})
export class InterviewTypeControlComponent implements OnInit {

  @Input() public IdControl: UntypedFormControl;
  public FilterCtrlInterviewType: UntypedFormControl = new UntypedFormControl();
  // @Input() public interviewTypeControlOpt: FormControl = new FormControl();
  public searchInputInterviewType: string;
  public prCommunityList: any = [];
  @Input() placeholder: string = 'Search Interview Type';
  @Input() title: string = '';
  @Input() required: boolean = false;
  @Input() outline: boolean = false;
  @Input() public formFieldAppearance: string = "legacy";
  @Input() public floatLabel: string = "auto";
  @Input() public isAllOption: boolean = false;
  @Input() public isMultiple: boolean = false;
  @ViewChild('select') select: MatSelect;
  @Output() getDataSource = new EventEmitter<any>();
  public allSelected: boolean = false;
  public multiSelectedVal: any = [];
  @Input() public showOkButton: boolean = false;
  @Input() public PracticeIds: any = [];
  @Input() public filterAccount: string = '';
  public allSelcount: boolean = false;
  public showCount: any = '';
  public temp: any = [];
  constructor(
    // private _globalServe: GlobalApisService,
    private _intCommonServe: InterviewCommonService
  ) { }

  ngOnInit(): void {
    // if (this.PracticeIds?.length != 0) {
    //  // let ids = this.PracticeIds?.toString();
    //   this.getIntType();
    // }
    this.getIntType();
    if (!this.isMultiple) {
      this.IdControl.setValue('all');
    }
    this.IdControl?.valueChanges.subscribe(
      v => {
        if (v === null) {
          this.allSelected = false
        }
      }
    )
  }

  ngOnChanges(): void {
    if (this.PracticeIds?.length != 0) {      
    //  let ids = this.PracticeIds?.toString();
      this.getIntType();
      this.allSelected = false;
    }
    if (!this.isMultiple) {
      this.IdControl.setValue('all');
    }
  }

public listData:any=[];
  //get list by id
  getIntType(): void {
   //console.log(typeof(idList));
    this._intCommonServe.getInterviewType().subscribe(
      res => {
        // let filterByStatus = res['data'];
        // this.prCommunityList = filterByStatus;
        this.listData = res['data'];
        this.FilterCtrlInterviewType.valueChanges.subscribe(
          val => {
            this.searchInputInterviewType = val;
            this.allSelcount = false;
          }
        )
      }
    );
  }

  getIntType1() {
    this._intCommonServe.getInterviewType().subscribe(
      res => {
        this.listData = res['data'];
      }

    );
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
    selectedData = this.temp?.filter(d => this.IdControl?.value.some(o2 => d.value === o2));
    this.multiSelectedVal = selectedData;
    this.showCount = this.allSelcount ? this.IdControl?.value?.length - 1 : this.IdControl?.value?.length;

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

  /***
  * single option select /deselect
  */
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
      if (
        (this.IdControl?.value?.length == this.select?.options?.length - 1) &&
        !this.allSelcount &&
        !this.FilterCtrlInterviewType?.value?.length
      ) {
        newStatus = true;
      }
    });
    this.allSelected = newStatus;
    /***
     * get selected value
     */
    let selectedData: any = [];
    this.select.options.forEach((item: MatOption) => {
      const index: number = this.temp.indexOf(item);
      if (index < 0 && item.selected === true && item.viewValue !== '' && item.viewValue !== 'close') {
        this.temp.push(item)
      }
    });
    selectedData = this.temp?.filter(d => this.IdControl?.value.some(o2 => d.value === o2));
    this.multiSelectedVal = selectedData;
    this.showCount = this.allSelcount ? this.IdControl?.value?.length - 1 : this.IdControl?.value?.length;

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
