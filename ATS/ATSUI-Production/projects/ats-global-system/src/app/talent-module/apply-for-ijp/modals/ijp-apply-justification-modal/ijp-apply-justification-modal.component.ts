import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from 'projects/ats-global-system/src/app/vendor-partner-module/partner.service';
import { TalentService } from '../../../talent.service';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-ijp-apply-justification-modal',
  templateUrl: './ijp-apply-justification-modal.component.html',
  styleUrls: ['./ijp-apply-justification-modal.component.scss']
})
export class IjpApplyJustificationModalComponent implements OnInit {

  public formJustificationSubmit: UntypedFormGroup;

  //  public disablePastDate: any = new Date(new Date().setDate(new Date().getDate()));
  //public minDate: any = new Date();
  constructor(
    public dialogRef: MatDialogRef<IjpApplyJustificationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _talentServ: TalentService
  ) { }

  ngOnInit() {
    this.formInit();
  }
  public isContractAvailibityNo: boolean = false;
  formInit() {
    this.formJustificationSubmit = this._fb.group({
      Justification: [null, [Validators.required]],
    });

  }

  getControl(name: string) {
    return this.formJustificationSubmit.get(name);
  }
  /** submit */
  submitHandler(form: any) {
    this.formJustificationSubmit.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      let paramData = {
        thId: this.data?.thId,
        TalentId: this.data?.TalentId,
        Justification: formData.Justification
      };
      debugger
      this._talentServ
        .ApplyForIJP(paramData)
        .subscribe((res) => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);

        });
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill justification field.');
    }
  }

  // IsIJPApplyValid(elm: any) {
  //   debugger
  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     panelClass: 'ats-confirm',
  //     data: {
  //       headerText: 'Alert',
  //       message: ` Are you sure to apply for this internal job Opportunity ?`,
  //       buttonText: {
  //         ok: "Yes",
  //         cancel: "No"
  //       },
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       if (result) {
  //         this._talentServ
  //           .ApplyForIJP(elm.thId, elm.TalentId, elm?.Justification)
  //           .subscribe((res) => {
  //             this._share.showAlertSuccessMessage.next(res);

  //             this.dialogRef.close(true);
  //           });
  //         console.log('IJP Apply api call', elm.thId, elm.TalentId, elm?.Justification);
  //       }
  //     }

  //   });
  // }


  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

}
