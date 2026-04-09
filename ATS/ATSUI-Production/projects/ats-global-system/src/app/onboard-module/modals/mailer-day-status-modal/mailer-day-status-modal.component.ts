import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OfferService } from 'projects/ats-global-system/src/app/offer-module/offer.service';
import { OnboardService } from '../../onboard.service';
import { GlobalApisService } from '../../../core/services/global-apis.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SelectionModel } from '@angular/cdk/collections';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

@Component({
  selector: 'app-mailer-day-status-modal',
  templateUrl: './mailer-day-status-modal.component.html',
  styleUrls: ['./mailer-day-status-modal.component.scss'],
})
export class MailerDayStatusModalComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'sno',
      'HiringTeam',
    'TalentId',
    'CandidateName',
    'OfferNumber',
    'JoiningLocation',
    'Rehire',
    'EmailCration',
    'TotalExperience',
    'EduQualification',
    'Practice',
    'DeliveryUnit',
    'Skill',
    'Designation',
    'Grade',
    'CurrentEmployer',
    'Account',
    'CandidateRM',
    'Division',
    'Status',
    'iOnboardingType',
  ];
  dataSource = new MatTableDataSource<any>([]);
  public minDate: any = new Date();
  public maxDate: any = new Date();
  public joineeStatusForm: UntypedFormGroup = new UntypedFormGroup({});
  public locationList: any = [];
  constructor(
    public dialogRef: MatDialogRef<MailerDayStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _onBoardServe: OnboardService,
    private _offerService: OfferService,
    private _globalApiServe: GlobalApisService
  ) {}

  ngOnInit(): void {
    this.maxDate = new Date();
    this.formInit();
    this.getLocation();
  }

  selection = new SelectionModel<any>(true, []);

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  /** Selects all rows if not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  getLocation() {
    this._globalApiServe.getLocationList().subscribe((res) => {
      let ids = [];
      ids = [1, 2, 4, 5, 16,23];
      // }
      let filterLocation = res['data'].filter((loc) => {
        return ids.indexOf(loc.LocID) !== -1;
      });
      this.locationList = filterLocation;
    });
  }

  toggleSelection(row: any) {
    this.selection.toggle(row);
  }

  //formInit
  formInit() {
    this.joineeStatusForm = this._fb.group({
      confirmJoinDate: [null, Validators.required],
      LocationId: [null, Validators.required],
    });
  }

  public onDateChange(event: MatDatepickerInputEvent<Date>): void {
    debugger;
    if (!event.value) return; // Protect against nulls
    // const selectedDate = GlobalMethod.formatDate(event.value);
    this.getDayPipeLineT();
  }

  onLocationChange(event: any) {
    this.getDayPipeLineT();
  }

  getDayPipeLineT() {
    this.dataSource = new MatTableDataSource([]);
    this.selection.clear();
    let formData = this.joineeStatusForm.value;
    let body = {};
    if (formData['confirmJoinDate'] && formData['LocationId']) {
      body['dateOfJoining'] = GlobalMethod.formatDate(
        formData['confirmJoinDate']
      );
      body['locationId'] = formData['LocationId'];
      this._onBoardServe
        .getPipelineConfirmCandidateListToday(body)
        .subscribe((res) => {
          const tableData = Array.isArray(res['data']) ? res['data'] : [];

          // ✅ Bind to MatTableDataSource
          this.dataSource = new MatTableDataSource(tableData);

          // ✅ Auto-select all rows when data is loaded
          this.selection.clear();
          tableData.forEach((row) => this.selection.select(row));
        });
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.selection.clear();
    }
  }
  /***
   * submit method
   */
  submitJoineeStatusForm(form: UntypedFormGroup) {
    debugger;
    form.markAllAsTouched();
    let formData = form.value;

    // 🟢 Check if location, joining date, and selection are valid

    if (!formData['confirmJoinDate']) {
      this._share.showAlertErrorMessage.next('Please select a joining date.');
      return;
    }
    if (!formData['LocationId']) {
      this._share.showAlertErrorMessage.next('Please select a location.');
      return;
    }

    if (!this.selection || this.selection.selected.length === 0) {
      this._share.showAlertErrorMessage.next(
        'Please select at least one candidate.'
      );
      return;
    }

    // 🟢 If form is valid, proceed
    if (form.valid) {
      let formDataJson: any = {};

      formDataJson['dateOfJoining'] = GlobalMethod.formatDate(
        formData['confirmJoinDate']
      );
      formDataJson['locationId'] = formData['LocationId'];

      // You can also pass selected candidate IDs
      // Send selected candidate IDs, or empty array if none selected
      formDataJson['selectedCandidates'] = this.selection?.selected?.length
        ? this.selection.selected.map((c) => c.candidateID)
        : [];
      debugger;

      this.apiCallOnSubmit(formDataJson);
    } else {
      this._share.showAlertErrorMessage.next(
        'Please fill all mandatory fields.'
      );
    }
  }

  /**
   * api
   * @param formDataJson
   */
  apiCallOnSubmit(formDataJson: any) {
    this._onBoardServe
      .mailersendDay1CandidateStatus(formDataJson)
      .subscribe((res) => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      });
  }

  //control for form
  getControl(name: string) {
    return this.joineeStatusForm.get(name);
  }

  /***/

  closeModal(): void {
    this.dialogRef.close();
  }
}
