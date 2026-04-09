import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';
import { BgvServiceService } from '../../../bgv-module/bgv-service.service';
import { OnboardService } from '../../onboard.service';

@Component({
  selector: 'app-bgv-approved-by-rec-modal',
  templateUrl: './bgv-approved-by-rec-modal.component.html',
  styleUrls: ['./bgv-approved-by-rec-modal.component.scss']
})
export class BgvApprovedByRecModalComponent implements OnInit {
  public bgvApprovalForm: UntypedFormGroup = new UntypedFormGroup({});
  public statusList: any;
  public isSubmitBtnDisabled: boolean = false;
  public userData: any = {};
  public maxDateResche: any = new Date(new Date().setDate(new Date().getDate() + 10));
  public minDateResche: any = new Date(new Date().setDate(new Date().getDate() - 10));
  constructor(
    public dialogRef: MatDialogRef<BgvApprovedByRecModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _bgvServe: BgvServiceService,
    public _share: ShareService,
    private _storage: GetSetStorageService,
    private getLocInfo: GetLocationInfo,
    private _onboard: OnboardService,
  ) { }

  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    this.updateForm();
    this.GetInterviewStatus();
  }

  public minDate: any = new Date();
  public maxDate: any = new Date();
  //form control
  updateForm() {
    this.bgvApprovalForm = this._fb.group({
      PackageId: [null, [Validators.required]],
    })
  }

  /***
  * get Int Status
  */
  GetInterviewStatus(): void {
    this._bgvServe.GetPackagesList(this.data?.JoiningLocationID).subscribe(
      res => {
        this.statusList = res['data'];
      }
    );
  }



  //update  submit 
  updateHandler(form: UntypedFormGroup) {
    if (form.valid) {
      let formData = form.value;
      // formData['cid'] = this.data?.cid;
       formData['Candidateid'] = this.data?.candidateId;
      formData['recConsent'] = 1;
      this._onboard.SaveBGVConsentByRecruiter(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          // this.paginatorCompRef.paginator.pageIndex = 0;
          // this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
          this.dialogRef.close(true);
        }
      );
    } else {
      form.markAllAsTouched();
      this._share.showAlertErrorMessage.next("Please fill all mandatory fields.");
    }
  }

  //control for form
  getControl(name: string) {
    return this.bgvApprovalForm.get(name);
  }
  closeModal(): void {
    this.dialogRef.close();
  }


}
