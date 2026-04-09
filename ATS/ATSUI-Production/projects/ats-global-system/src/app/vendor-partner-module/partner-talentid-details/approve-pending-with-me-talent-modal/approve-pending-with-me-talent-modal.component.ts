import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ShareService } from '../../../core/services/share.service';
import { PartnerService } from '../../partner.service';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { GlobalApisService } from '../../../core/services/global-apis.service';

@Component({
  selector: 'app-approve-pending-with-me-talent-modal',
  templateUrl: './approve-pending-with-me-talent-modal.component.html',
  styleUrls: ['./approve-pending-with-me-talent-modal.component.scss']
})
export class ApprovePendingWithMeTalentModalComponent implements OnInit {
  public submitPendingForms: UntypedFormGroup = new UntypedFormGroup({});
  public selectedList: any = [];
  public pendingTalentList: any = [];

  displayedColumns = ['action', 'talent_id', 'partnerName', 'primaryRecruiter', 'secondaryRecruiter', 'contractType',
    'AccountName', 'Practice', 'reasonForAssing', 'Approver', 'approvalStatus',  'assignBy', 'assignOn', 'Remarks'
  ];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild('formsList') InputData;
  constructor(
    public dialogRef: MatDialogRef<ApprovePendingWithMeTalentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _globalApiServe: GlobalApisService,
    private _share: ShareService,
    private _partnerServe: PartnerService
  ) { }

  public candidateCallsDetailsList: any = [];
  public offerDetails: any = {};
  ngOnInit(): void {
    this.getPendingTalentList();
    this.updateForm();
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }



  //form 
  updateForm() {
    this.submitPendingForms = this._fb.group({
      formsList: [null],
      status: [null, [Validators.required]],
      remarks: [null]
    });
  }


  getControl(name: string) {
    return this.submitPendingForms.get(name);
  }

  /**get pending list */
  getPendingTalentList() {
    this._partnerServe.getPendingWithMePartnerTalentId().subscribe((res) => {
      this.pendingTalentList = res['data'];
      this.dataSource = new MatTableDataSource<any>(res['data']);
      this.selection.clear();
      this.dataSource.data.forEach(row => {
        if (row.isSelectedForm === 1 && row.IsEnable == null) {
          this.selection.select(row)
        }
      });
    })

  }

  /**approve reffered change */
  statusChange(e: any) {
    this.getControl('remarks').reset();
    if (e.value == 'A') {
      this.getControl('remarks').clearValidators();
    }
    else {
      this.getControl('remarks').setValidators([Validators.required]);
    }
    this.getControl('remarks').updateValueAndValidity();
  }
  //submit action button
  submitTalentFormsHandler(form: UntypedFormGroup) {
    if (this.selection?.selected?.length > 0) {
      form.markAllAsTouched();
      if (form.valid) {
        let body = form.value;
        let selectedForm = this.selection.selected;
        let getIdList: any = [];
        if (selectedForm.length != 0) {
          for (let i = 0; i < selectedForm.length; i++) {
            getIdList.push(selectedForm[i].ID)
          }
        }
        body['asignIds'] = getIdList.toString();
        this._partnerServe.ApproveOrRejectPartnerTHID(body).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true)
          }
        )
      }
      else {
        this._share.showAlertErrorMessage.next('Please fill the required fields');
      }
    }
    else {
      this._share.showAlertErrorMessage.next('Please Select Talent IDs');
    }

  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
