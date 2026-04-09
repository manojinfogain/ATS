import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { UploadManualOfferModalComponent } from 'projects/ats-global-system/src/app/offer-module/modals/upload-manual-offer-modal/upload-manual-offer-modal.component';
import { ViewGenerateOfferComponent } from 'projects/ats-global-system/src/app/offer-module/modals/view-generate-offer/view-generate-offer.component';
import { OfferService } from 'projects/ats-global-system/src/app/offer-module/offer.service';
import { OnboardService } from '../../onboard.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-update-candidate-joining-status',
  templateUrl: './update-candidate-joining-status.component.html',
  styleUrls: ['./update-candidate-joining-status.component.scss']
})
export class UpdateCandidateJoiningStatusComponent implements OnInit {
  public minDate: any = new Date();
  public maxDate: any = new Date();
  public joineeStatus: any = CONSTANTS.CandidateJoinStatusList;
  public joineeStatusForm: UntypedFormGroup = new UntypedFormGroup({});
  public declineCategoryList: any;
  constructor(
    public dialogRef: MatDialogRef<UpdateCandidateJoiningStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _onBoardServe: OnboardService,
    private _offerService: OfferService
  ) { }

  ngOnInit(): void {
    // if (this.data?.JoineeStatus == 1) {
    //   this.joineeStatus = this.joineeStatus.filter(v => v.value !== 1);
    // }
    // if(this.data?.JoineeStatus == 2){
    //   this.joineeStatus = this.joineeStatus.filter(v=>v.value !== 2);
    // }
    // if(this.data?.JoineeStatus == 3){
    //   this.joineeStatus = this.joineeStatus.filter(v=>v.value !== 3);
    // }
    this.maxDate = new Date(this.data?.joiningDate);
    this.formInit();
    this.getDeclineCategoryList();
    this.getControl('joineeStatus').markAsTouched();
  }

  //get Decline CategoryList
  getDeclineCategoryList() {
    this._offerService.getDeclineCategory().subscribe(
      res => {
        this.declineCategoryList = res.data;
      }
    )
  }
  /***
   * on select radio button
   */
  public isDojReq: boolean = false;
  public isRemarkReq: boolean = false;
  public isDeclineCatgReq: boolean = false;
  public IsDefferd: boolean = false;
  public isConfirmed: boolean = false;
  //set default value in form for reschedule
  public interviwerImpId: number;
  public showSelectedValue: boolean = false;
  joineeStatusAction(e: any) {
    let val = e.value;
    this.getControl('declineCateg').clearValidators();
    this.getControl('confirmJoinDate').clearValidators();
    this.getControl('reportingManager').clearValidators();
    this.getControl('billingStartDate').clearValidators();
    this.getControl('onboardMode').clearValidators();
    /**
     * defer
     */
    if (val === 2) {
      this.updateJoiningDateOffer(this.data);
      this.isDojReq = true;
      this.IsDefferd = true;
      this.isRemarkReq = false;
      //  this.isRemarkReq = true;
      this.isDeclineCatgReq = false;
      this.isConfirmed = false;
    }

    /**
     * decline
     */
    else if (val === 3) {
      this.isDojReq = false;
      this.IsDefferd = false;
      this.isDeclineCatgReq = true;
      this.isRemarkReq = true;
      this.isConfirmed = false;
      //  this.getControl('remark').addValidators([Validators.required]);
      this.getControl('declineCateg').addValidators([Validators.required]);

    }
    /***
     * confirm
     */
    else {
      this.isDojReq = false;
      this.isRemarkReq = false;
      this.isDeclineCatgReq = false;
      this.IsDefferd = false;
      this.isConfirmed = true;
      this.getControl('confirmJoinDate').addValidators([Validators.required]);
      this.getControl('billingStartDate').addValidators([Validators.required]);
      this.getControl('reportingManager').addValidators([Validators.required]);
      this.getControl('onboardMode').addValidators([Validators.required]);
      this.getControl('confirmJoinDate').patchValue(new Date(this.data?.confirmJoinDate?this.data?.confirmJoinDate:this.data?.joiningDate));
      this.getControl('billingStartDate').patchValue(this.data?.billingStartDate?new Date(this.data?.billingStartDate):null);
      if (this.data?.reportingManager) {
        this.getControl('reportingManager').patchValue(this.data?.reportingManager);
      }
      this.getControl('onboardMode').patchValue(this.data?.OnboardingMode? this.data?.OnboardingMode : null)
    }
    this.getControl('declineCateg').updateValueAndValidity();
    this.getControl('confirmJoinDate').updateValueAndValidity();
    this.getControl('billingStartDate').updateValueAndValidity();
    this.getControl('reportingManager').updateValueAndValidity();
    this.getControl('onboardMode').updateValueAndValidity();
  }

  public onDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (!event.value) return; // Protect against nulls
  
    const currentJoiningDate = GlobalMethod.formatDate(this.data?.joiningDate);
    const selectedDate = GlobalMethod.formatDate(event.value);
  
    if (currentJoiningDate !== selectedDate) {
      console.log('Test', event.value);
  
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        panelClass: 'ats-confirm',
        data: {
          headerText: 'Alert',
          message: `Are you sure you want to change the joining date as this will lead to offer regeneration?`,
          buttonText: {
            ok: "Yes",
            cancel: "No"
          },
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateJoiningDateOffer(this.data);
        }
        else{
          this.getControl('confirmJoinDate').patchValue(new Date(this.data?.confirmJoinDate?this.data?.confirmJoinDate:this.data?.joiningDate));
        }
      });
    }
  }
  

  /***
   * weekend exclude
   */
  FilterDateWeekend = (d: Date): boolean => {
    const day = d?.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }


  //onchange  remark required
  public isRequiRemark: boolean = false;
  remarkRequireChange(elm: any) {
    let remarkCtrControl = this.getControl('remark');
    if (elm.value == 6) {
      remarkCtrControl.setValidators([Validators.required]);
      this.isRequiRemark = true;
    } else {
      remarkCtrControl.clearValidators();
      this.isRequiRemark = false;
    }
    remarkCtrControl.updateValueAndValidity();
  }


  /**
   * joining date update
   * @param element 
   */
  updateJoiningDateOffer(element: any) {
    if (element?.OfferGenerateBy === 'M') {
      this.generateOfferManual(element);
    }
    else {
      this.generateOffer(element);
    }
  }

  /***
  *  update doj and  generate Offer by recruiter
  */
  generateOffer(elm: any) {
    const dialogRef = this.dialog.open(ViewGenerateOfferComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          // this.dialogRef.close(true);
          let body = {
            cid: this.data.cid,
            joineeStatus: 2
          }
          this.apiCallOnSubmit(body);
        }
      }
    )

  }
  /**
   * manual offer
   * @param elm 
   */
  generateOfferManual(elm: any) {
    const dialogRef = this.dialog.open(UploadManualOfferModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          //  this.dialogRef.close(true);
          let body = {
            cid: this.data.cid,
            joineeStatus: 2
          }
          this.apiCallOnSubmit(body);
        }
      }
    )
  }



  //formInit
  formInit() {
    this.joineeStatusForm = this._fb.group({
      remark: [null],
      joineeStatus: [null, [Validators.required]],
      confirmJoinDate: [null],
      billingStartDate: [null],
      declineCateg: [null],
      reportingManager: [null],
      onboardMode:[null]
    })
  }

  /***
   * submit method
   */
  submitJoineeStatusForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    let formData = form.value;
    if (form.valid) {
      let formDataJson = {};
     // formDataJson['cid'] = this.data.cid;
      formDataJson['Candidateid'] = this.data.candidateId;
      formDataJson['joineeStatus'] = formData['joineeStatus'];
      if (formData['confirmJoinDate']) {
        formDataJson['confirmJoinDate'] = GlobalMethod.formatDate(formData['confirmJoinDate']);
      }
      if (formData['billingStartDate']) {
        formDataJson['billingStartDate'] = GlobalMethod.formatDate(formData['billingStartDate']);
      }
      if (formData['remark']) {
        formDataJson['remark'] = formData['remark'];
      }
      if (formData['declineCateg']) {
        formDataJson['declineCategId'] = formData['declineCateg'];
      }
      if (formData['reportingManager']) {
        formDataJson['reportingManager'] = formData['reportingManager'];
      }
      if (formData['onboardMode']) {
        formDataJson['OnboardMode'] = formData['onboardMode'];
      }

      this.apiCallOnSubmit(formDataJson);

    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }


  /**
   * api
   * @param formDataJson 
   */
  apiCallOnSubmit(formDataJson: any) {
    this._onBoardServe.updateJoineeCandidateStatus(formDataJson).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      }
    )
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
