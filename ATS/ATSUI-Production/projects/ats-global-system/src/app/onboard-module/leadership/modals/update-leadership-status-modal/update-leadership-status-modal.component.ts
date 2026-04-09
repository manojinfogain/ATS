import { Component, OnInit ,Inject} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup,Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OnboardService } from '../../../onboard.service';
import { OfferService } from 'projects/ats-global-system/src/app/offer-module/offer.service';

@Component({
  selector: 'app-update-leadership-status-modal',
  templateUrl: './update-leadership-status-modal.component.html',
  styleUrls: ['./update-leadership-status-modal.component.scss']
})
export class UpdateLeadershipStatusModalComponent implements OnInit {

  public minDate: any = new Date();
  public maxDate: any = new Date();
  public joineeStatus: any = CONSTANTS.CandidateJoinStatusList;
  public joineeStatusForm: UntypedFormGroup = new UntypedFormGroup({});
  public declineCategoryList: any;
  constructor(
    public dialogRef: MatDialogRef<UpdateLeadershipStatusModalComponent>,
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
    /**
     * defer
     */
    if (val === 2) {
      //this.updateJoiningDateOffer(this.data);
      this.isDojReq = true;
      this.IsDefferd = true;
      this.isRemarkReq = true;
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
      this.getControl('confirmJoinDate').patchValue(new Date(this.data?.confirmJoinDate?this.data?.confirmJoinDate:this.data?.joiningDate));
      this.getControl('billingStartDate').patchValue(this.data?.billingStartDate?new Date(this.data?.billingStartDate):null);
      if (this.data?.reportingManager) {
        this.getControl('reportingManager').patchValue(this.data?.reportingManager);
      }
    }
    this.getControl('declineCateg').updateValueAndValidity();
    this.getControl('confirmJoinDate').updateValueAndValidity();
    this.getControl('billingStartDate').updateValueAndValidity();
    this.getControl('reportingManager').updateValueAndValidity();
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



  //formInit
  formInit() {
    this.joineeStatusForm = this._fb.group({
      remark: [null],
      joineeStatus: [null, [Validators.required]],
      confirmJoinDate: [null],
      billingStartDate: [null],
      declineCateg: [null],
      reportingManager: [null],
    //  joiningDate: [null],
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
