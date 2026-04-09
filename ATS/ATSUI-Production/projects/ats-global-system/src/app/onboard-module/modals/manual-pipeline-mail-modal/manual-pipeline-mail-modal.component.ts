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
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-manual-pipeline-mail-modal',
  templateUrl: './manual-pipeline-mail-modal.component.html',
  styleUrls: ['./manual-pipeline-mail-modal.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({
        height: '*',
        opacity: 1,
        overflow: 'visible'
      })),
      state('collapsed', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('expanded <=> collapsed', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class ManualPipelineMailModalComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'sno',
    'CandidateId',
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
    'iOnboardingType',
    'ContactNumber',
    'PersonalEmail',
    'CurrentAddress',
  ];
  dataSource = new MatTableDataSource<any>([]);
  public minDate: any = new Date();
  public maxDate: any = new Date();
  public manualPipelineForm: UntypedFormGroup = new UntypedFormGroup({});
  public locationList: any = [];
  public uploadedFile: File | null = null;
  public uploadedFileName: string = '';

  // Collapse/Expand states
  public isStep1Expanded: boolean = true;
  public isStep2Expanded: boolean = true;
  public isStep3Expanded: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ManualPipelineMailModalComponent>,
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
    const wasAllSelected = this.isAllSelected();
    
    if (wasAllSelected) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
      
      // Auto-expand step 3 when selecting all
      this.isStep2Expanded = false;
      this.isStep3Expanded = true;
    }
  }

  getLocation() {
    this._globalApiServe.getLocationList().subscribe((res) => {
      let ids = [];
      ids = [1, 2, 4, 5, 16,23];
      let filterLocation = res['data'].filter((loc) => {
        return ids.indexOf(loc.LocID) !== -1;
      });
      this.locationList = filterLocation;
    });
  }

  toggleSelection(row: any) {
    this.selection.toggle(row);
    
    // Auto-expand step 3 when first candidate is selected
    if (this.selection.selected.length === 1) {
      this.isStep2Expanded = false;
      this.isStep3Expanded = true;
    }
  }

  // Toggle expand/collapse for steps
  toggleStep(step: number) {
    if (step === 1) {
      this.isStep1Expanded = !this.isStep1Expanded;
    } else if (step === 2) {
      this.isStep2Expanded = !this.isStep2Expanded;
    } else if (step === 3) {
      this.isStep3Expanded = !this.isStep3Expanded;
    }
  }

  // Get location name by ID
  getLocationName(locationId: number): string {
    const location = this.locationList.find(l => l.LocID === locationId);
    return location ? location.LocName : '';
  }

  //formInit
  formInit() {
    this.manualPipelineForm = this._fb.group({
      confirmJoinDate: [null, Validators.required],
      LocationId: [null, Validators.required],
      approvalDocument: [null], // Not required initially
    });
  }

  public onDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (!event.value) return;
    this.getDayPipeLineT();
  }

  onLocationChange(event: any) {
    this.getDayPipeLineT();
  }

  /**
   * Handle file upload
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type (optional - allow only specific types)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
      ];

      if (!allowedTypes.includes(file.type)) {
        this._share.showAlertErrorMessage.next(
          'Please upload a valid document (PDF, DOC, DOCX, JPG, PNG)'
        );
        return;
      }

      // Validate file size (optional - max 5MB)
      const maxSizeInMB = 5;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        this._share.showAlertErrorMessage.next(
          `File size should not exceed ${maxSizeInMB}MB`
        );
        return;
      }

      this.uploadedFile = file;
      this.uploadedFileName = file.name;
      this.manualPipelineForm.patchValue({ approvalDocument: file });
      this.manualPipelineForm.get('approvalDocument').markAsTouched();
    }
  }

  /**
   * Remove uploaded file
   */
  removeFile(): void {
    this.uploadedFile = null;
    this.uploadedFileName = '';
    this.manualPipelineForm.patchValue({ approvalDocument: null });
  }

  getDayPipeLineT() {
    this.dataSource = new MatTableDataSource([]);
    this.selection.clear();
    let formData = this.manualPipelineForm.value;
    let body = {};
    if (formData['confirmJoinDate'] && formData['LocationId']) {
      body['dateOfJoining'] = GlobalMethod.formatDate(
        formData['confirmJoinDate']
      );
      body['locationId'] = formData['LocationId'];
      this._onBoardServe
        .GetPipelineCandidateListPending(body)
        .subscribe((res) => {
          const tableData = Array.isArray(res['data']) ? res['data'] : [];

          // Bind to MatTableDataSource
          this.dataSource = new MatTableDataSource(tableData);

          // Auto-select all rows when data is loaded
          this.selection.clear();
          tableData.forEach((row) => this.selection.select(row));

          // Auto-expand step 2 when data loads and collapse step 1
          if (tableData.length > 0) {
            this.isStep1Expanded = false;
            this.isStep2Expanded = true;
          }
        });
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.selection.clear();
    }
  }

  /***
   * submit method
   */
  submitManualPipelineForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    let formData = form.value;

    // Step-by-step validation with user-friendly messages
    if (!formData['confirmJoinDate']) {
      this._share.showAlertErrorMessage.next('Please select a joining date first.');
      this.isStep1Expanded = true;
      this.isStep2Expanded = false;
      this.isStep3Expanded = false;
      return;
    }
    
    if (!formData['LocationId']) {
      this._share.showAlertErrorMessage.next('Please select a location.');
      this.isStep1Expanded = true;
      this.isStep2Expanded = false;
      this.isStep3Expanded = false;
      return;
    }
    
    if (!this.dataSource || this.dataSource.data.length === 0) {
      this._share.showAlertErrorMessage.next('No candidates found for the selected criteria. Please adjust your filters.');
      this.isStep1Expanded = true;
      this.isStep2Expanded = false;
      this.isStep3Expanded = false;
      return;
    }
    
    if (!this.selection || this.selection.selected.length === 0) {
      this._share.showAlertErrorMessage.next('Please select at least one candidate from the list.');
      this.isStep1Expanded = false;
      this.isStep2Expanded = true;
      this.isStep3Expanded = false;
      return;
    }
    
    // Document is mandatory only when candidates are selected
    if (!this.uploadedFile) {
      this._share.showAlertErrorMessage.next('Please upload approval document as proof before sending email.');
      this.manualPipelineForm.get('approvalDocument').setErrors({ required: true });
      this.manualPipelineForm.get('approvalDocument').markAsTouched();
      this.isStep1Expanded = false;
      this.isStep2Expanded = false;
      this.isStep3Expanded = true;
      return;
    }

    // If all validations pass, proceed
    if (form.valid) {
      const formDataToSend = new FormData();

      formDataToSend.append(
        'dateOfJoining',
        GlobalMethod.formatDate(formData['confirmJoinDate'])
      );
      formDataToSend.append('locationId', formData['LocationId']);

      // Append approval document
      if (this.uploadedFile) {
        formDataToSend.append('approvalDocument', this.uploadedFile);
      }

      // Append selected candidate IDs
      const selectedCandidates = this.selection?.selected?.length
        ? this.selection.selected.map((c) => c.CandidateID)
        : [];

      formDataToSend.append(
        'selectedCandidates',
        JSON.stringify(selectedCandidates)
      );

      this.apiCallOnSubmit(formDataToSend);
    } else {
      this._share.showAlertErrorMessage.next(
        'Please fill all mandatory fields.'
      );
    }
  }

  /**
   * api call to send manual pipeline mail with document
   * @param formData
   */
  apiCallOnSubmit(formData: FormData) {
    // TODO: Replace with actual API endpoint for manual pipeline mail
    this._onBoardServe
      .sendManualPipelineMail(formData)
      .subscribe((res) => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      });
  }

  //control for form
  getControl(name: string) {
    return this.manualPipelineForm.get(name);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
