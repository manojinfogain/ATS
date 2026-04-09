import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { ViewOfferApprovalDetailsComponent } from 'projects/ats-global-system/src/app/offer-module/modals/view-offer-approval-details/view-offer-approval-details.component';
import { OfferService } from 'projects/ats-global-system/src/app/offer-module/offer.service';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { CandidateConnectService } from '../../candidate-connect.service';

@Component({
  selector: 'app-update-connect-history',
  templateUrl: './update-connect-history.component.html',
  styleUrls: ['./update-connect-history.component.scss']
})
export class UpdateConnectHistoryComponent implements OnInit {
  public updateConnectForm: UntypedFormGroup = new UntypedFormGroup({});
  public candData: any = [];
  public allRoundList: any = [];
  public selectedList: any = [];
  public gradeList: any = [];
  public offerAprDt: any = [];
  public isReasonAvl: boolean;
  displayedColumns = [
    'coonnectSequn',
    'connecEvent',
    'ActionTaken',
  ];

  public statusApplic: any = [{
    typeName: "Yes",
    typeId: 1,
    flag: 'YY'
  },
  {
    typeName: "No",
    typeId: 2,
    flag: 'NN'
  },
  {
    typeName: "NA",
    typeId: 3,
    flag: 'NA'
  }];

  public candidateReason: any = []

  public status: any[];
  public connectPeople: any;
  public hideShow = false;
  public hideShowConnectDate: boolean = true;
  public hideShowStatus: boolean;
  public isReschedule = false;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public maxDate: any = new Date();

  public maxDateResche: any = new Date(new Date().setDate(new Date().getDate() + 10));
  public minDateResche: any = new Date(new Date().setDate(new Date().getDate()));
  public minDate: any = new Date(new Date().setDate(new Date().getDate() - 6));
  //public minDateResche: any = new Date(new Date().setDate(new Date().getDate() + 4));
  constructor(
    public dialogRef: MatDialogRef<ViewOfferApprovalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _offerService: OfferService,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _globalApiServe: GlobalApisService,
    private _CandidateConnectService: CandidateConnectService,
    private _share: ShareService
  ) { }

  ngOnInit(): void {
    this.getCandidateConnectCallDetails();
    this.getCandidateReasonList();
    this.getCandidateDetails();
    this.connectPerson();
    this._CandidateConnectService.CandidateStatusMaster(this.data.cid).subscribe((res) => {
      this.status = res.data;
    });

    this.updateForm();
    this.FilterCtrl.valueChanges.
      pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(
        val => {
          this.searchInput = val;
        }
      )
  }

  //get candidate calls details
  public candidateCallsDetailsList: any = [];
  getCandidateConnectCallDetails() {
    this._CandidateConnectService.CandidateCallsDetails(this.data.cid).subscribe(
      res => {
        this.candidateCallsDetailsList = res['data'];
        //this.filteredReasonLsit(1);
      }
    )
  }

  //getCandidate Reason
  public allCandidateReason: any = [];
  getCandidateReasonList() {
    this._CandidateConnectService.getCandidateReasonList().subscribe(
      res => {
        this.allCandidateReason = res['data'];
        this.filteredReasonLsit(1);
      }
    )
  }

  filteredReasonLsit(id: number) {
    this.candidateReason = this.allCandidateReason.filter(d => d.Flag == id);
  }


  //form 
  updateForm() {
    this.updateConnectForm = this._fb.group({
      CandidateStatus: [null, [Validators.required]],
      RescheduleDate: [null],
      RescheduleReason: [null,],
      ConnectDate: [null, [Validators.required]],
      ConnectPerson: [null, [Validators.required]],
      StatusCondi: [null, [Validators.required]],
    });
  }
  //get connect person
  connectPerson() {
    this._CandidateConnectService.getCandidateList().subscribe((res) => {
      this.connectPeople = res.data;
    });
  }

  registerPartner(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      if (formData['ConnectDate']) {
        formData['ConnectDate'] = GlobalMethod.formatDate(formData['ConnectDate']);
      }
      if (formData['RescheduleDate']) {
        formData['RescheduleDate'] = GlobalMethod.formatDate(formData['RescheduleDate']);
      }
      formData['cid'] = this.data.cid;
      const statusName = this.status.find(x => x.STATUS_ID == formData?.CandidateStatus)

      formData['StatusCondi'] = formData.StatusCondi;
      // formData.CandidateStatus = statusName.CANDIDATE_STATUS_NAME;
      // const empName = this.connectPeople.find(x => x.empid == formData.ConnectPerson)
      // formData.ConnectPerson = empName.fullName;
      this.confirmOfferSend(formData);

    } else {
      this._share.showAlertErrorMessage.next(
        'Please fill all mandatory fields.'
      );
    }
  }

  /***
   * confirmation dailog
   */

  confirmOfferSend(formData: any) {
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
        this._CandidateConnectService
          .UpdateOfferedStatus(formData)
          .subscribe((res) => {
            this._share.showAlertSuccessMessage.next(res);
            //this._router.navigate(['Update History'])
            this.dialogRef.close(true);
          });
      }
    });
  }

  getControl(name: string) {
    return this.updateConnectForm.get(name);
  }

  //status yes/no/na
  public statusVal: any
  public isStatusYes: boolean;

  changeStatus(e) {
    this.statusVal = e.value;
    let rescheduleReasonCn = this.getControl('RescheduleReason');
    if (e.value == 'YY') {
      this.filteredReasonLsit(123);
      rescheduleReasonCn.clearValidators();

      this.isStatusYes = false
    }
    else if (e.value == 'NN') {
      this.filteredReasonLsit(1);
      this.isStatusYes = true;
      // rescheduleReasonCn.clearValidators();
      rescheduleReasonCn.setValidators([Validators.required]);
    } else {
      this.isStatusYes = true;

      this.filteredReasonLsit(2);
      //rescheduleReasonCn.clearValidators();
      rescheduleReasonCn.setValidators([Validators.required]);
    }

    rescheduleReasonCn.updateValueAndValidity();

  }

  //connect event status change 
  changeCandidateStatus(e) {
    let connectDateCn = this.getControl('ConnectDate');
    let rescheduleDateCn = this.getControl('RescheduleDate');
    let rescheduleReasonCn = this.getControl('RescheduleReason');
    //
    let StatusCondi = this.getControl('StatusCondi');

    if (e.value == 5 || e.value == 6 || e.value == 7 || e.value == 8) {
      connectDateCn.clearValidators();
      this.isStatusYes = true;
      rescheduleReasonCn.setValidators([Validators.required]);
      rescheduleDateCn.setValidators([Validators.required]);
      StatusCondi.clearValidators();
      this.hideShowConnectDate = false;
      this.hideShowStatus = false;
      this.hideShow = true;
      this.isReschedule = true;
      this.filteredReasonLsit(1);
    } else {
      this.hideShowConnectDate = true;
      this.hideShowStatus = true;
      connectDateCn.setValidators([Validators.required]);
      StatusCondi.setValidators([Validators.required]);
      rescheduleReasonCn.clearValidators();
      rescheduleDateCn.clearValidators();
      this.isStatusYes = false;
      this.hideShow = false;
      this.isReschedule = false;
      rescheduleReasonCn.reset();
      StatusCondi.reset();
    }
    connectDateCn.updateValueAndValidity();
    rescheduleReasonCn.updateValueAndValidity();
    rescheduleDateCn.updateValueAndValidity();
    StatusCondi.updateValueAndValidity();
    //this.updateOfferForm.controls.RescheduleDate.updateValueAndValidity();
  }

  getCandidateDetails() {
    forkJoin([
      this._offerService.getCandidateOfferAprDetails(this.data.cid),
    ]).subscribe((res) => {
      this.offerAprDt = res[0]['data'][0];
    });
  }

  //update button
  updateCandiConnectHandler(form: UntypedFormGroup) {
    this.registerPartner(form);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
