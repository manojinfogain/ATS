// import { Component, Input, OnInit, Output, EventEmitter, ViewChild, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
// import { FormControl } from '@angular/forms';
// import { MatOption } from '@angular/material/core';
// import { MatSelect } from '@angular/material/select';
// import { Subscription } from 'rxjs';
// import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
// import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';

// @Component({
//   selector: 'app-skill-set',
//   templateUrl: './skill-set.component.html',
//   styleUrls: ['./skill-set.component.scss']
// })
// export class SkillSetComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
//   @Input() public panelIdControl: FormControl;
//   public FilterCtrl: FormControl = new FormControl([]);
//   public searchInput: string;
//   public skillDataList: any = [];
//   @Input() placeholder: string = 'Search Skill';
//   @Input() title: string = 'Primary Skill';
//   @Input() required: boolean = false;
//   @Output() getDataTalentId = new EventEmitter<any>();
//   @Input() setValue: boolean = false;
//   @Input() setValueDefault: boolean = false;
//   @Input() getOnlyText: boolean = false;
//   @Input() outline: boolean = false;
//   @Input() public formFieldAppearance: string = "legacy";
//   @Input() public floatLabel: string = "auto";
//   @Input() public isAllOption: boolean = false;
//   @Input() public isMultiple: boolean = false;
//   @Output() getSkillIdOutput = new EventEmitter<any>();
//   @Output() getSkillSelecteDetails = new EventEmitter<any>();
//   /** mat selector's option refernce for all admins  */
//   //@ViewChild('allSelected') private allSelected: MatOption;
//   @ViewChild('select') select: MatSelect;
//   public allSelcount: boolean = false;
//   public showCount: any = '';
//   public temp: any = [];
//   constructor(private _globalServe: GlobalApisService, private share: ShareService) { }
//   @Input() public allSelected: boolean = false;
//   @Input() public isAllText: boolean = true;
//   public multiSelectedVal: any = [];
//   public subsIsUpdate: Subscription;
//   ngOnInit() {
//     this.skillAll();
//     this.panelIdControl.valueChanges.subscribe(
//       v => {
//         if (v === null) {
//           this.allSelected = false
//         }
//       }
//     )

//   }
//   ngOnChanges() {
//   }
//   ngAfterViewInit(): void {
//     this.subsIsUpdate = this.share.isSkillUpdated.subscribe(
//       get => {
//         if (get) {
//           setTimeout(() => {
//             this.optionClick();
//           }, 1000);
//         }
//       }
//     )
//   }
//   skillAll() {
//     this._globalServe.getSkill()
//       .subscribe(
//         res => {
//           this.skillDataList = res['data'];
//           this.FilterCtrl.valueChanges.subscribe(
//             val => {
//               this.searchInput = val;
//               this.allSelcount = false;
//             }
//           );
//           // Patch value again to trigger display update
//           if (this.panelIdControl && this.panelIdControl.value && this.panelIdControl.value.length > 0) {
//             setTimeout(() => {
//               this.panelIdControl.setValue([...this.panelIdControl.value]);
//               this.optionClick();
//             }, 0);
//           }
//         }
//       );
//   }

//   getSkill(data): void {
//     this.getSkillIdOutput.emit(data.value)
//   }
//   /***
//    * all select /deselect
//    */
//   toggleAllSelection() {
//     if (this.allSelected) {
//       this.select.options.forEach((item: MatOption) => item.select());
//       this.allSelcount = true;
//     } else {
//       this.select.options.forEach((item: MatOption) => item.deselect());
//       this.allSelcount = false;
//     }
//     /***
//     * get selected value
//     */
//     // let selectedData = this.select.options.filter(d=>d.selected === true && d.viewValue != 'close' && d.viewValue != '');
//     let selectedData: any = [];
//     this.temp = [];
//     this.select.options.forEach((item: MatOption) => {
//       const index: number = this.temp.indexOf(item);
//       if (index < 0 && item.selected === true && item.viewValue !== '' && item.viewValue !== 'close') {
//         this.temp.push(item)
//       }
//       // else
//       //   // this.temp = this.temp.filter(it => it.value !== item.value);
//       //   if(index > -1){
//       //     // this.temp.splice(index, 1);
//       //     this.temp = this.temp.filter(it => it.value !== item.value);
//       //   }

//     });
//     selectedData = this.temp?.filter(d => this.panelIdControl?.value.some(o2 => d.value === o2));
//     this.multiSelectedVal = selectedData;
//     this.showCount = this.allSelcount ? this.panelIdControl?.value?.length - 1 : this.panelIdControl?.value?.length;

//     // emitting selcted data
//     let sellectedItem = [];
//     let uniqSelectedData = [... new Set(selectedData.map(data => data.value))];
//     uniqSelectedData.forEach(item => {
//       if (item) {
//         sellectedItem.push(item);
//       }
//     });
//     this.getSkillIdOutput.emit(sellectedItem);
//   }

//   optionClick() {

//     let newStatus = true;
//     this.select.options.forEach((item: MatOption) => {
//       if (!item.selected) {
//         newStatus = false;
//       }
//       if (
//         (this.panelIdControl?.value?.length == this.select?.options?.length - 1) &&
//         !this.allSelcount &&
//         !this.FilterCtrl?.value?.length
//       ) {
//         newStatus = true;
//       }
//     });
//     this.allSelected = newStatus;
//     /***
//      * get selected value
//      */
//     // let selectedData = this.select.options.filter(d=>d.selected === true && d.viewValue != 'close' && d.viewValue != '');
//     let selectedData: any = [];
//     this.select.options.forEach((item: MatOption) => {
//       const index: number = this.temp.indexOf(item);
//       if (index < 0 && item.selected === true && item.viewValue !== '' && item.viewValue !== 'close') {
//         this.temp.push(item)
//       }
//       // else
//       //   // this.temp = this.temp.filter(it => it.value !== item.value);
//       //   if(index > -1){
//       //     // this.temp.splice(index, 1);
//       //     this.temp = this.temp.filter(it => it.value !== item.value);
//       //   }

//     });
//     selectedData = this.temp?.filter(d => this.panelIdControl?.value.some(o2 => d.value === o2));
//     this.multiSelectedVal = selectedData;
//     this.showCount = this.allSelcount ? this.panelIdControl?.value?.length - 1 : this.panelIdControl?.value?.length;
//     // emitting selcted data
//     let sellectedItem = [];
//     let uniqSelectedData = [... new Set(selectedData.map(data => data.value))];

//     uniqSelectedData.forEach(item => {
//       if (item) {
//         sellectedItem.push(item);
//       }
//     });
//     let viewSellectedItem = [];
//     let uniqSelectedDataView = [... new Set(selectedData.map(data => data.viewValue))];
//     uniqSelectedDataView.forEach(item => {
//       if (item) {
//         viewSellectedItem.push(item);
//       }
//     });
//     this.getSkillIdOutput.emit(sellectedItem);
//     this.getSkillSelecteDetails.emit({ skillId: sellectedItem, skillName: viewSellectedItem });
//   }


//   ngOnDestroy(): void {
//     if (this.subsIsUpdate) {
//       this.subsIsUpdate.unsubscribe();
//     }
//   }

// }


import { Component, Input, OnInit, Output, EventEmitter, ViewChild, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { Subscription } from 'rxjs';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';

@Component({
  selector: 'app-skill-set',
  templateUrl: './skill-set.component.html',
  styleUrls: ['./skill-set.component.scss']
})
export class SkillSetComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() public panelIdControl: UntypedFormControl;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl([]);
  public searchInput: string;
  public skillDataList: any = [];
  @Input() placeholder: string = 'Search Skill';
  @Input() title: string = 'Primary Skill';
  @Input() required: boolean = false;
  @Output() getDataTalentId = new EventEmitter<any>();
  @Input() setValue: boolean = false;
  @Input() setValueDefault: boolean = false;
  @Input() getOnlyText: boolean = false;
  @Input() outline: boolean = false;
  @Input() public formFieldAppearance: string = "legacy";
  @Input() public floatLabel: string = "auto";
  @Input() public isAllOption: boolean = false;
  @Input() public isMultiple: boolean = false;
  @Output() getSkillIdOutput = new EventEmitter<any>();
  @Output() getSkillSelecteDetails = new EventEmitter<any>();
  @ViewChild('select') select: MatSelect;
  public allSelcount: boolean = false;
  public showCount: any = '';
  public temp: any = [];
  constructor(private _globalServe: GlobalApisService, private share: ShareService) { }
  @Input() public allSelected: boolean = false;
  @Input() public isAllText: boolean = true;
  public multiSelectedVal: any = [];
  public subsIsUpdate: Subscription;

  ngOnInit() {
    this.skillAll();
    this.panelIdControl.valueChanges.subscribe(
      v => {
        if (v === null) {
          this.allSelected = false
        }
      }
    )
  }
  ngOnChanges() {}
  ngAfterViewInit(): void {
    this.subsIsUpdate = this.share.isSkillUpdated.subscribe(
      get => {
        if (get && this.isMultiple) {
          setTimeout(() => {
            if (this.select) {
              this.optionClick();
            }
          }, 1000);
        }
      }
    )
  }

  // Getter to return sorted skills: selected skills on top
  get sortedSkillDataList() {
    const selected = this.panelIdControl?.value || [];
    return [
      ...this.skillDataList.filter(skill => selected.includes(skill.SkillId)),
      ...this.skillDataList.filter(skill => !selected.includes(skill.SkillId))
    ];
  }

  skillAll() {
    this._globalServe.getSkill()
      .subscribe(
        res => {
          this.skillDataList = res['data'];
          this.FilterCtrl.valueChanges.subscribe(
            val => {
              this.searchInput = val;
              this.allSelcount = false;
            }
          );
          // Patch value again to trigger display update
          if (this.isMultiple && this.panelIdControl && this.panelIdControl.value && this.panelIdControl.value.length > 0) {
            setTimeout(() => {
              this.panelIdControl.setValue([...this.panelIdControl.value]);
              // Only call optionClick if select is initialized
              if (this.select) {
                this.optionClick();
              }
            }, 100);
          }
        }
      );
  }

  getSkill(data): void {
    this.getSkillIdOutput.emit(data.value)
  }

  toggleAllSelection() {
    // Guard clause: return early if select is not initialized
    if (!this.select || !this.isMultiple) {
      return;
    }

    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
      this.allSelcount = true;
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
      this.allSelcount = false;
    }
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

    let sellectedItem = [];
    let uniqSelectedData = [... new Set(selectedData.map(data => data.value))];
    uniqSelectedData.forEach(item => {
      if (item) {
        sellectedItem.push(item);
      }
    });
    this.getSkillIdOutput.emit(sellectedItem);
  }

  optionClick() {
    // Guard clause: return early if select is not initialized or not in multiple mode
    if (!this.select || !this.isMultiple) {
      return;
    }

    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
      if (
        (this.panelIdControl?.value?.length == this.select?.options?.length - 1) &&
        !this.allSelcount &&
        !this.FilterCtrl?.value?.length
      ) {
        newStatus = true;
      }
    });
    this.allSelected = newStatus;
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
    let sellectedItem = [];
    let uniqSelectedData = [... new Set(selectedData.map(data => data.value))];

    uniqSelectedData.forEach(item => {
      if (item) {
        sellectedItem.push(item);
      }
    });
    let viewSellectedItem = [];
    let uniqSelectedDataView = [... new Set(selectedData.map(data => data.viewValue))];
    uniqSelectedDataView.forEach(item => {
      if (item) {
        viewSellectedItem.push(item);
      }
    });
    this.getSkillIdOutput.emit(sellectedItem);
    this.getSkillSelecteDetails.emit({ skillId: sellectedItem, skillName: viewSellectedItem });
  }

  ngOnDestroy(): void {
    if (this.subsIsUpdate) {
      this.subsIsUpdate.unsubscribe();
    }
  }
}
