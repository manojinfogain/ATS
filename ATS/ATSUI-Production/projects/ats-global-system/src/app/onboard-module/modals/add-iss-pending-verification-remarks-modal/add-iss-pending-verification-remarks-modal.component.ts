import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { forkJoin } from 'rxjs';
import { OfferService } from '../../../offer-module/offer.service';
import { GlobalApisService } from '../../../core/services/global-apis.service';
import { CandidateConnectService } from '../../../candidate-connect-module/candidate-connect.service';
import { ShareService } from '../../../core/services/share.service';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { OnboardService } from '../../onboard.service';

@Component({
  selector: 'app-add-iss-pending-verification-remarks-modal',
  templateUrl: './add-iss-pending-verification-remarks-modal.component.html',
  styleUrls: ['./add-iss-pending-verification-remarks-modal.component.scss']
})
export class AddIssPendingVerificationRemarksModalComponent implements OnInit {
  public filterCtrlIssReason: UntypedFormControl = new UntypedFormControl();
  public searchCtrlIssReason: string;
  public addIssRemarkForm: UntypedFormGroup = new UntypedFormGroup({});
  public offerAprDt: any = [];
  displayedColumns = [
    'Category',
    'Remarks',
    'AddedBy',
    'addedOndate',
  ];

  public searchInput: string;
  constructor(
    public dialogRef: MatDialogRef<AddIssPendingVerificationRemarksModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _globalApiServe: GlobalApisService,
    private _share: ShareService,
    private _onboardSer: OnboardService
  ) { }

  ngOnInit(): void {
    this.data;
    debugger
    this.getIssRemarkDetails();
    this.getApiDetails();
    this.FormInit();
  }

  //get candidate calls details
  public issRemarkDetailsList: any = [];
  getIssRemarkDetails() {
    this._onboardSer.GetRemarkHistoryUpdatedByIss(this.data.candidateId).subscribe(
      res => {
        this.issRemarkDetailsList = res['data'];
      }
    )
  }

  //form 
  FormInit() {
    this.addIssRemarkForm = this._fb.group({
      category: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
    });
  }


  getControl(name: string) {
    return this.addIssRemarkForm.get(name);
  }



  public reasonCategoryList: any = [];
  getApiDetails() {
    forkJoin([
      // this._onboardSer.GetRemarkHistoryUpdatedByIss(this.data.candidateId),
      this._onboardSer.GetVerificationDelayReasonMaster(),
    ]).subscribe((res) => {
      //  this.offerAprDt = res[0]['data'][0];
      this.reasonCategoryList = res[0]['data'];
      this.filterCtrlIssReason.valueChanges.subscribe(
        val => {
          this.searchCtrlIssReason = val;
        }
      )
    });
  }

  //add button
  addRemarkHandler(form: UntypedFormGroup) {
    this.submitRemark(form);
  }

  submitRemark(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      let formBody: any = {};
      formBody['ReasonId'] = formData.category;
      formBody['candidateId'] = this.data.candidateId;
      formBody['Remarks'] = formData.remarks;
      // this.confirmAndSave(formBody);
      this._onboardSer
        .updateRemarkByISSForLaptopDelivery(formBody)
        .subscribe((res) => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        });
    } else {
      this._share.showAlertErrorMessage.next(
        'Please fill all mandatory fields.'
      );
    }
  }

  /***
   * confirmation dailog
   */

  confirmAndSave(formData: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to save?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._onboardSer
          .updateRemarkByISSForLaptopDelivery(formData)
          .subscribe((res) => {
            this._share.showAlertSuccessMessage.next(res);
            //this._router.navigate(['Update History'])
            this.dialogRef.close(true);
          });
      }
    });
  }


  closeModal(): void {
    this.dialogRef.close();
  }

}
