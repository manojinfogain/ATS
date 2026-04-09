import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-opplistcontrol',
  templateUrl: './opplistcontrol.component.html',
  styleUrls: ['./opplistcontrol.component.scss'],
})
export class OpplistcontrolComponent implements OnInit, OnDestroy {
  @Input() public IdControl: UntypedFormControl;
  public FilterCtrlAccount: UntypedFormControl = new UntypedFormControl();
  public searchInputAccount: string;
  public accountList: any = [];
  @Input() placeholder: string = 'Search';
  @Input() title: string = 'Opportunity List';
  @Input() required: boolean = false;
  @Input() outline: boolean = false;
  @Input() public formFieldAppearance: string = 'legacy';
  @Input() public floatLabel: string = 'auto';
  @Input() public isAllOption: boolean = false;
  @Input() public isMultiple: boolean = false;
  @ViewChild('select') select: MatSelect;
  @Output() getDataSource = new EventEmitter<any>();
  public allSelected: boolean = false;
  public multiSelectedVal: any = [];
  @Input() public showOkButton: boolean = false;
  @Input() public filterAccount: string = '';
  public showCount: any = '';
  selectedMap = new Map<number, any>();

  private destroy$ = new Subject<void>();

  constructor(private _intCommonServe: InterviewCommonService) {}

  ngOnInit(): void {
    this.loadOpportunity('');

    // Search with debounce
    this.FilterCtrlAccount.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((search) => {
          this.searchInputAccount = search;
          if (!search || search.length < 4) {
            return this._intCommonServe.getOpportunityListDeamnd('');
          }
          return this._intCommonServe.getOpportunityListDeamnd(search);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((res) => {
        this.accountList = res['data'] || [];

        const selectedIds = this.IdControl?.value || [];
        this.accountList.forEach((item) => {
          if (selectedIds.includes(item.Id)) {
            this.selectedMap.set(item.Id, item);
          }
        });

        this.mergeSelectedToTop();
        this.updateSelectedDisplay();
      });

    // Control value change
    this.IdControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (!val || val.length === 0) {
          this.allSelected = false;
          this.selectedMap.clear();
        }
        this.updateSelectedDisplay();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOpportunity(search: string) {
    this._intCommonServe.getOpportunityListDeamnd(search)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.accountList = res['data'] || [];

        // Cache any already-selected items on initial load
        const selectedIds = this.IdControl?.value || [];
        this.accountList.forEach((item) => {
          if (selectedIds.includes(item.Id)) {
            this.selectedMap.set(item.Id, item);
          }
        });

        this.mergeSelectedToTop();
        this.updateSelectedDisplay();
      });
  }

  // Keep selected items at the top of dropdown list
  mergeSelectedToTop(): void {
    const selectedIds = this.IdControl?.value || [];
    if (!selectedIds.length) return;

    // Separate: selected items on top, rest below
    const selectedItems: any[] = [];
    const unselectedItems: any[] = [];
    const seenIds = new Set<number>();

    // First, add cached selected items not in current list
    this.selectedMap.forEach((item, id) => {
      if (selectedIds.includes(id)) {
        selectedItems.push(item);
        seenIds.add(id);
      }
    });

    // Then process current list
    this.accountList.forEach((item) => {
      if (seenIds.has(item.Id)) return; // already added from cache
      if (selectedIds.includes(item.Id)) {
        selectedItems.push(item);
        this.selectedMap.set(item.Id, item);
      } else {
        unselectedItems.push(item);
      }
    });

    this.accountList = [...selectedItems, ...unselectedItems];
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }

    const selectedIds = this.IdControl?.value || [];

    // Update selectedMap from current selections
    this.accountList.forEach((item) => {
      if (selectedIds.includes(item.Id)) {
        this.selectedMap.set(item.Id, item);
      } else {
        this.selectedMap.delete(item.Id);
      }
    });

    this.multiSelectedVal = Array.from(this.selectedMap.values())
      .filter(item => selectedIds.includes(item.Id));
    this.showCount = this.multiSelectedVal.length;

    const uniqueIds = [...new Set(selectedIds)].filter(Boolean);
    this.getDataSource.emit(uniqueIds);
  }

 optionClick() {
  let selectedIds = this.IdControl?.value || [];

  if (!Array.isArray(selectedIds)) {
    selectedIds = [selectedIds];
  }

  // Add/update selectedMap
  this.accountList.forEach(item => {
    if (selectedIds.includes(item.Id)) {
      this.selectedMap.set(item.Id, item);
    }
  });

  // Remove unselected
  Array.from(this.selectedMap.keys()).forEach(id => {
    if (!selectedIds.includes(id)) {
      this.selectedMap.delete(id);
    }
  });

  // Update UI
  this.multiSelectedVal = Array.from(this.selectedMap.values())
    .filter(item => selectedIds.includes(item.Id));
  this.showCount = this.multiSelectedVal.length;

  // Select All logic (only visible)
  const visibleIds = this.accountList.map(x => x.Id);
  this.allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.includes(id));

  this.getDataSource.emit([...selectedIds]);
}

  // Update display state
  updateSelectedDisplay() {
    const selectedIds = this.IdControl?.value || [];

    // Only include items that are currently selected
    this.multiSelectedVal = Array.from(this.selectedMap.values())
      .filter(item => selectedIds.includes(item.Id));

    this.showCount = this.multiSelectedVal.length;

    const visibleIds = this.accountList.map((x) => x.Id);
    this.allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedIds.includes(id));

    this.getDataSource.emit(selectedIds);
  }

  trackById(index: number, item: any): number {
    return item.Id;
  }
}
