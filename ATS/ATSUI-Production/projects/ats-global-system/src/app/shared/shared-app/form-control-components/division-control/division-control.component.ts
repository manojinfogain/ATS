import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';

@Component({
  selector: 'app-division-control',
  templateUrl: './division-control.component.html',
  styleUrls: ['./division-control.component.scss']
})
export class DivisionControlComponent implements OnInit {

  @Input() public DivisionIdControl: UntypedFormControl;
  public divisionList:any = [];
  @Input() title:string = 'Division';
  @Input() required:boolean = false;
  @Input() outline:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  @Output() getDataSource = new EventEmitter<any>();
  public userData: any = {};
  @Input() public isMultiple: boolean = false;
  @Input() public isAllOption: boolean = false;
  @Input() public allSelected: boolean = false;
  public multiSelectedVal: any = [];
  @ViewChild('select') select: MatSelect;
   @Input() public isInfoIcon: boolean = false;
    @Input() helpAlignment:string = 'top';
  constructor(
    private _globalServe: GlobalApisService
  ) { }

  ngOnInit(): void {   
    this.getDivisionList();
  }

  getDivisionList() {
    this._globalServe.getDivisionList().subscribe(
      res => {
        this.divisionList = res['data'];
      }
    );
  }


  getDivisionId(data):void{
     this.getDataSource.emit(data.value)
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

  onHelpClick(event: MouseEvent): void {
  event.stopPropagation(); // Prevents opening the select dropdown
}

}
