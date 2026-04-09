import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { DashboardService } from 'projects/ats-global-system/src/app/dashboard-module/dashboard.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';


@Component({
  selector: 'app-updatejoining-details-modal',
  templateUrl: './updatejoining-details-modal.component.html',
  styleUrls: ['./updatejoining-details-modal.component.scss']
})
export class UpdatejoiningDetailsModalComponent implements OnInit {

  joindetailsForm: UntypedFormGroup;
  public TalentData: any = {};
  constructor(
    public dialogRef: MatDialogRef<UpdatejoiningDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    public _dashServe: DashboardService,
    public _talentServe: TalentService,
    private _share: ShareService,
    public _globalApi: GlobalApisService
  ) { }

  ngOnInit() {
    this.getJoinedCandidateList();
    this.formInit();
  }


  public FilterCtrlCandidateJoined: UntypedFormControl = new UntypedFormControl();
  public candidateJoinedList: any = [];
  public searchJoinedCandidate: string = '';
  /**get joined candidate list */
  getJoinedCandidateList() {
    this._globalApi.getJoinedCandidateList().subscribe(
      res => {
        this.candidateJoinedList = res['data']
      }
    )
    this.FilterCtrlCandidateJoined.valueChanges.subscribe(
      get => {
        this.searchJoinedCandidate = get;
        // this.allSelcount = false;   
      }
    )
  }

  /***
   * update talentid form submit
   */

  formInit() {
    this.joindetailsForm = this._fb.group({
      EmpId: [null, [Validators.required]],
      dateOfJoing: [null],
      remarks: [null]
    })

  }

  public filteredEmpList: any = {};
  JoinedEmployeeListChange(elm: any) {
    let selectedCandidate = this.candidateJoinedList.filter(x => x.EmplyeeID === elm.value);
    this.filteredEmpList = selectedCandidate[0];
    this.getControl('dateOfJoing').patchValue(this.filteredEmpList.EMP_DATEOFJOINING ? new Date(this.filteredEmpList.EMP_DATEOFJOINING) : null);

  }


  //control for form
  getControl(name: string) {
    return this.joindetailsForm.get(name);
  }

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

  /***
   * submit details  Data to server
   */
  updateTalentIdHandler(form: UntypedFormGroup) {
    this.joindetailsForm.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      formData['OfferId'] = this.data.OfferId;
      
      formData['dateOfJoing'] = GlobalMethod.formatDate(formData['dateOfJoing']);
      this._talentServe.CloseTHID(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    }
    else {
      this._share.showAlertErrorMessage.next("Please fill all mandatory fields.");
    }
  }


}
