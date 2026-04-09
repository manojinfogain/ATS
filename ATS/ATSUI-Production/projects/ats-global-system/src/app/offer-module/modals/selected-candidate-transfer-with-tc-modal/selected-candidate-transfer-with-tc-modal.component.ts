import { Component, Inject, OnInit,AfterViewInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
// import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OfferService } from '../../offer.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';

// import { TalentService } from '../../../talent-module/talent.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-selected-candidate-transfer-with-tc-modal',
  templateUrl: './selected-candidate-transfer-with-tc-modal.component.html',
  styleUrls: ['./selected-candidate-transfer-with-tc-modal.component.scss']
})
export class SelectedCandidateTransferWithTcModalComponent implements OnInit, AfterViewInit {
  //
  // public sendForApprovalForm: FormGroup = new FormGroup({});
  public candData: any = [];
  public candOfferApprDetail: any = [];
  public targetTHIDDetails: any = [];
  public formTransfer: UntypedFormGroup = new UntypedFormGroup({});;
  public dgmData:any = [];
  public billingHours: any = [8, 9];
  public currencyTypeData: any = [];
  constructor(
    public dialogRef: MatDialogRef<SelectedCandidateTransferWithTcModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private _interviewStatus: InterviewStatusService,
    private _fb: UntypedFormBuilder,
    private _offerService: OfferService,
    private _share: ShareService,
    public dialog: MatDialog,
    // private _talentServ: TalentService,
    private _globalCommonMethod: GlobalCommonMethodService,
    private _globalApiServe: GlobalApisService
  ) { }

  ngOnInit(): void {
    this.getCurrentTHIDDetails();
    this.getCandidateOfferApprDetails(this.data?.cid);
    this.getLocation();
    this.formTransfer = this._fb.group({
      talendIdControl: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
      thid: [null],      
      billingRateHrCurrency: [null],
      billingCurrencyId: [2],
      NonReimbursableTravelCost: [null],
      projectSpecificCost: [null],
      projectBuffer: [null],
      billableHoursDay: [],
    })
  }

  
  ngAfterViewInit(): void {
    this.inputValueChangedFunc();
  }

  getCandidateOfferApprDetails(cid: number) {
    this._offerService.getCandidateOfferAprDetails(cid).subscribe(
      res => {
        this.candOfferApprDetail = res['data'][0];
      }
    )
  }

  public currTHIDDetails: any = [];
  getCurrentTHIDDetails() {
    this._offerService.getCurrentTHIDDetails(this.data?.cid).subscribe(
      res => {
        this.candData = res['OfferedDetails'][0];
        this.currTHIDDetails = res['THIDDetails'][0];
        // this.patchDGMValues()
      })
  }


  getDataTalent(data) {
    let prvTalentId = this.data.th_id;
    if (prvTalentId == data.TH_ID) {
      this.formTransfer.get('talendIdControl').reset();
      this._share.showAlertErrorMessage.next(`${data.talentID} is already linked with ${this.data.email}.`);
    }
    else {
      this.formTransfer.get('thid').patchValue(data.TH_ID);
      this.getTargetTHIDDetails(data.TH_ID);
    }

  }

  public isTransferable: boolean = false;
  public isReinitiationRequired: boolean = false;
  public isTargetReqIdDetailsVisible: boolean = false;
  public reinitiationMsg: string = '';
  public reinitiationMsgForPopup: string = '';
  public isBillRateEditable: boolean = true;
  public isBillHrEditable: boolean = true;
  getTargetTHIDDetails(TH_ID: number) {
    this._offerService.getTargetTHIDDetails(this.data?.cid, TH_ID).subscribe(
      res => {
        this.targetTHIDDetails = res['data'][0];
        if (this.targetTHIDDetails?.ISTCImplimented != 1) {
          this.isTransferable = false;
          this.isReinitiationRequired = false;
          this.isTargetReqIdDetailsVisible = false;
          this.formTransfer.get('talendIdControl').reset();
          // this._share.showAlertErrorMessage.next(`${this.targetTHIDDetails?.TalentID} is not implemented with TC. Please select another THID created with TC.`);
          this._globalCommonMethod.showMessagedisplay({
            title: 'Message',
            autoHide: false,
            msg: `
             <p>The THID ${this.targetTHIDDetails?.TalentID} does not belong to any talent cube. Please select another talent id.</p>`
          });
        } else {
          if (this.targetTHIDDetails?.ISTransferAllowed != 1 && this.targetTHIDDetails?.TransferNotAllowedRemark !== null) {
            this.isTransferable = false;
            this.isReinitiationRequired = false;
            this.isTargetReqIdDetailsVisible = false;
            // this._share.showAlertErrorMessage.next(`transfer is not allowed. Please select another THID.`);
            this._globalCommonMethod.showMessagedisplay({
              title: 'Message',
              autoHide: false,
              msg: `
               <p>Transfer is not allowed as ${this.targetTHIDDetails?.TransferNotAllowedRemark}. Please select another Talent ID.</p>`
            });
          }
          else {
            if (this.targetTHIDDetails?.ISSalarygridExist == 0 && this.targetTHIDDetails?.SalarygridNotExistRemark !== null) {
              this.isTransferable = false;
              this.isReinitiationRequired = false;
              this.isTargetReqIdDetailsVisible = false;
              // this._share.showAlertErrorMessage.next(`transfer is not allowed. Please select another THID.`);
              this._globalCommonMethod.showMessagedisplay({
                title: 'Message',
              //   autoHide: false,
              msg: `
              <p>Salary grid for the requested grade is not available. Please select another talent id.</p>`
              });
            }
            else {
              this.isTransferable = true;
              this.isTargetReqIdDetailsVisible = true;
              if(this.targetTHIDDetails?.IsBillable == 'Y'){
                if(this.targetTHIDDetails?.BillingRate != null && this.targetTHIDDetails?.BillingRate != 0){
                  this.isBillRateEditable = false;
                  // this.targetTHIDDetails['BillingRate'] = parseInt(this.targetTHIDDetails?.BillingRate);
                  this.getControl('billingRateHrCurrency').clearValidators();
                  this.getControl('billingRateHrCurrency').reset();
                }else{
                  this.isBillRateEditable = true;
                  this.getControl('billingRateHrCurrency').addValidators([Validators.required]);
                }
                if(this.targetTHIDDetails?.BillingHours != null && this.targetTHIDDetails?.BillingHours != 0){
                  this.isBillHrEditable = false;
                  this.targetTHIDDetails['BillingHours'] = parseInt(this.targetTHIDDetails?.BillingHours);
                  this.getControl('billableHoursDay').clearValidators();
                  this.getControl('billableHoursDay').reset();
                }else{
                  this.isBillHrEditable = true;
                  this.getControl('billableHoursDay').addValidators([Validators.required]);
                }
              }else{
                this.isBillRateEditable = true;
                this.isBillHrEditable = true;        
                // this.getControl('billingRateHrCurrency').addValidators([Validators.required]);
                // this.getControl('billableHoursDay').addValidators([Validators.required]); 
                this.getControl('billingRateHrCurrency').clearValidators();
                this.getControl('billingRateHrCurrency').reset();
                this.getControl('billableHoursDay').clearValidators();
                this.getControl('billableHoursDay').reset();
              }
              this.getControl('billingRateHrCurrency').updateValueAndValidity();
              this.getControl('billableHoursDay').updateValueAndValidity();            
              if (this.targetTHIDDetails?.ISReinitiationRequired == 1) {
                this.isReinitiationRequired = true;
                if (this.targetTHIDDetails?.ISReinitiationFromAccount === 'Y') {
                  this.reinitiationMsg = 'as the Account for the target Talent ID is different';
                  this.reinitiationMsgForPopup = `The THID <span class='u-name'>${this.targetTHIDDetails?.TalentID}</span> belongs to different account. Candidate transfer to this talent id will lead to reinititation of offer approval.`;
                } else if (this.targetTHIDDetails?.IsReinitiationFromVariance === 'Y') {
                  this.reinitiationMsg = 'as the variance for the target Talent ID exceeds the approved variance';
                  this.reinitiationMsgForPopup = `The variance of target talent id exceeds the approved variance. Candidate transfer to this talent id will lead to reinitiation of offer approval.`;
                } else {
                  this.reinitiationMsg = '';
                  this.reinitiationMsgForPopup = '';
                }
                // this._share.showAlertErrorMessage.next(`Reinititation is required to transfer to ${this.targetTHIDDetails?.TalentID} THID.`);
                this._globalCommonMethod.showMessagedisplay({
                  title: 'Message',
                  autoHide: false,
                  msg: `
                 <p>${this.reinitiationMsgForPopup}</p>`
                });
              }
              else {
                this.isReinitiationRequired = false;
                this.reinitiationMsg = '';
                this.reinitiationMsgForPopup = '';
              }
              this.getCurrency();
              this.getDGMCalcValue(0, this.candOfferApprDetail.gradeId, this.candOfferApprDetail.gradeBandId);
            }
          }
        }
      }
    )
  }

  TransferTalent(form: any) {
    if (this.formTransfer.valid) {
      let formValue = form.value;
      if (this.data.cid) {
        formValue['cid'] = this.data.cid;
      }
      if (this.targetTHIDDetails?.THID) {
        formValue['thid'] = this.targetTHIDDetails?.THID;
      }
      if (this.targetTHIDDetails?.TalentcubeID) {
        formValue['CubeId'] = this.targetTHIDDetails?.TalentcubeID;
      }
      if (this.targetTHIDDetails?.ClusterID) {
        formValue['ClusterID'] = this.targetTHIDDetails?.ClusterID;
      }
      if (this.targetTHIDDetails?.RoleID) {
        formValue['RoleID'] = this.targetTHIDDetails?.RoleID;
      }
      if (this.targetTHIDDetails?.CandidateGradeId) {
        formValue['GradeId'] = this.targetTHIDDetails?.CandidateGradeId;
      }
      if (this.targetTHIDDetails?.MinGridLimit) {
        formValue['MinSalary'] = this.targetTHIDDetails?.MinGridLimit;
      }
      if (this.targetTHIDDetails?.MedGridLimit) {
        formValue['MedSalary'] = this.targetTHIDDetails?.MedGridLimit;
      }
      if (this.targetTHIDDetails?.MaxGridLimit) {
        formValue['MaxSalary'] = this.targetTHIDDetails?.MaxGridLimit;
      }
      if (this.targetTHIDDetails?.VarianceMax) {
        formValue['VarianceMax'] = this.targetTHIDDetails?.VarianceMax;
      }
      if (this.targetTHIDDetails?.VarianceMed) {
        formValue['VarianceMid'] = this.targetTHIDDetails?.VarianceMed;
      }
      if (this.targetTHIDDetails?.ISReinitiationRequired) {
        formValue['IsReinitiationRequired'] = this.targetTHIDDetails?.ISReinitiationRequired;
      }
      if (this.dgmData['BillingRateHr']) {
        formValue['billingRateHrInUSD'] = this.dgmData['BillingRateHr'];
      }
      if (this.dgmData['AnnualBillableHours']) {
        formValue['annualBillableHours'] = this.dgmData['AnnualBillableHours'];
      }
      if(this.targetTHIDDetails?.IsBillable  == 'Y' && this.targetTHIDDetails?.BillingRate != null && this.targetTHIDDetails?.BillingRate != 0){
        formValue['billingRateHrCurrency'] = this.targetTHIDDetails?.BillingRate;
       }else{
         formValue['billingRateHrCurrency'] = formValue['billingRateHrCurrency'] ;
       }
       if(this.targetTHIDDetails?.IsBillable  == 'Y' && this.targetTHIDDetails?.BillingHours != null && this.targetTHIDDetails?.BillingHours != 0){
         formValue['billableHoursDay'] = this.targetTHIDDetails?.BillingHours;
        }else{
          formValue['billableHoursDay'] = formValue['billableHoursDay'] ;
        }
      if (this.dgmData['AnnualRevenue']) {
        formValue['annualRevenueUsd'] = this.dgmData['AnnualRevenue'];
      }
      if (this.dgmData['AnnualSalaryCost']) {
        formValue['annualSalaryCostUsd'] = this.dgmData['AnnualSalaryCost'];
      }
      if (this.dgmData['JoiningBonus']) {
        formValue['joiningBonusUsd'] = this.dgmData['JoiningBonus'];
      }
      if (this.dgmData['Benefits']) {
        formValue['benefitsUsd'] = this.dgmData['Benefits'];
      }
      if (this.dgmData['ProjectBuffer']) {
        formValue['ProjectBufferUsd'] = this.dgmData['ProjectBuffer'];
      }
      if (this.dgmData['dgmCost']) {
        formValue['dgmCostUsd'] = this.dgmData['dgmCost'];
      }
      if (this.dgmData['dgmCostPercent']) {
        formValue['dgmPercentUsd'] = this.dgmData['dgmCostPercent'];
      }
      delete formValue['talendIdControl'];
      this._offerService.transferSelectedCandidateByTalentIdWithTC(formValue).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          //  if(this.targetTHIDDetails?.ISReinitiationRequired == 1){
          //  this.confirmReinitiationDialogBox();
          let obj = {
            flag: true,
            isReinitiationRequired: this.targetTHIDDetails?.ISReinitiationRequired,
            target_thid: this.targetTHIDDetails?.THID,
            target_talentId: this.targetTHIDDetails?.TalentID
          }
          this.dialogRef.close(obj);
          // }
        }
      )
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  // get control Method*/
  getControl(name: string) {
    return this.formTransfer.get(name);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  submitForm() {
    if (this.formTransfer.valid) {
      this.confirmTransferDialogBox();
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }



  }

  //confirmation to transfer candidate
  confirmTransferDialogBox() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: this.targetTHIDDetails?.IsReinitiationFromVariance == 'Y' || this.targetTHIDDetails?.ISReinitiationFromAccount == 'Y'
          ? ` You need to reinitiate the Offer Approval <span class='u-name'> ${this.reinitiationMsg}</span>. Are you sure you want to transfer candidate to ${this.targetTHIDDetails?.TalentID} Talent ID ?`
          : ` Are you sure you want to transfer candidate to ${this.targetTHIDDetails?.TalentID} Talent ID ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.TransferTalent(this.formTransfer);
      }

    });
  }
  /**
   * joining location on changed
   * @param event 
   */
  locChanged(event: any) {
    this.getDGMCalcValue(0, this.candOfferApprDetail.gradeId, this.candOfferApprDetail.gradeBandId);

  }

  getCurrency() {
    //get cand type
    this._globalApiServe.GetCurrencyList().subscribe(
      res => {
        // this.currencyTypeData = res['data'];
        let filterById = [2]
        let filterByStatus = res['data'].filter(t => {
          return filterById.indexOf(t.CurId) !== -1;
        });
        this.currencyTypeData = filterByStatus;
      }
    );
    let localCurrencyId = this.locationList.filter(v => v.LocID === parseInt(this.candOfferApprDetail?.JoiningLocationID))
    
    this.localCurrency = localCurrencyId[0]?.CurName;
  }

  
  public localCurrency: string;
  public localCurrencyId: string;
  //get company location
  public locationList: any = [];
  getLocation() {
    this._globalApiServe.getLocationList().subscribe(
      res => {
        // let ids = [];
        // if (this.divisionID == 7 || this.divisionID == 1) {
        //   ids = [1, 2, 4, 5, 16];
        // } else {
        //   ids = [1, 2, 4, 5];
        // }
        // let filterLocation = res['data'].filter(loc => {
        //   return ids.indexOf(loc.LocID) !== -1;
        // })
        // this.locationList = filterLocation;
        this.locationList =  res['data'];
      }
    );
  }

  getDGMCalcValue(type: number, gradeId: number, GradeBand: number) {
    let formValue = this.formTransfer.value;
    let localCurrencyId = this.locationList.filter(v => v.LocID === parseInt(this.candOfferApprDetail?.JoiningLocationID))
    let body = {
      cid: this.data.cid,
      billingRate: this.targetTHIDDetails?.IsBillable  == 'Y' && this.targetTHIDDetails?.BillingRate != null && this.targetTHIDDetails?.BillingRate != 0 ? this.targetTHIDDetails?.BillingRate : formValue['billingRateHrCurrency'],
      billableHoursDay: this.targetTHIDDetails?.IsBillable  == 'Y' && this.targetTHIDDetails?.BillingHours != null && this.targetTHIDDetails?.BillingHours != 0 ? this.targetTHIDDetails?.BillingHours : formValue['billableHoursDay'],
      billingCurrencyId: type === 1 ? this.candOfferApprDetail?.billingCurrencyID : formValue['billingCurrencyId'],
      projectBuffer: type === 1 ? this.candOfferApprDetail?.projectBufferInPercent : formValue['projectBuffer'],
      NonReimbursableTravelCost: type === 1 ? this.candOfferApprDetail?.nonReimbursableTravelCostUsd : formValue['NonReimbursableTravelCost'],
      projectSpecificCost: type === 1 ? this.candOfferApprDetail?.projectSpecificCostUsd : formValue['projectSpecificCost'],
      JoiningLocationId: type === 1 ? this.candOfferApprDetail?.JoiningLocationID : this.candOfferApprDetail?.JoiningLocationID,
      cadidateTypeId: type === 1 ? this.candOfferApprDetail?.CandidateTypeID : this.candOfferApprDetail?.CandidateTypeID,
      annualCTC: type === 1 ? this.candOfferApprDetail?.CTC : this.candOfferApprDetail?.CTC,
      joiningBonus: type === 1 ? this.candOfferApprDetail?.joiningBonus : this.candOfferApprDetail?.joiningBonus,
      localCurrencyId: localCurrencyId[0]?.CurrencyId ? localCurrencyId[0]?.CurrencyId : 0,
      gradeId: gradeId,
      GradeBand: GradeBand,
      CubeClusterID: type === 1 ? this.candOfferApprDetail?.CubeClusterID : this.targetTHIDDetails?.ClusterID || 0,
      //  JfCategory: type === 1 ? this.offerAprDt?.JobFamilyCategory : formValue['JfCateg'],
      divisionID: this.candOfferApprDetail?.divisionid,
      // PracticeId: type === 1 ? this.offerAprDt?.PracticeId : formValue['PracticeId']
    }
    this.localCurrency = localCurrencyId[0]?.CurName;
    this.dgmCallAPI(body);

  }

  /***
   * api call for dgm calc 
   */
  dgmCallAPI(body: any) {
    this._offerService.getDgmCalc(body).subscribe(
      res => {
        this.dgmData = res['data'][0];
        // this.remaarkValidation();
      }
    )
  }

  /***
   * Method for input control
   */
  inputValueChangedFunc() {
    //joiningBonus
    // this.getControl('joiningBonus').valueChanges.
    //   pipe(
    //     distinctUntilChanged(),
    //     debounceTime(500)
    //   ).subscribe(
    //     get => {
    //       if (get) {
    //         this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData.totalExpYear, this.candData.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, get);
    //         this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
    //       }
    //       else {
    //         this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData.totalExpYear, this.candData.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, 0);
    //         this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
    //       }
    //     }
    //   );
    this.getControl('billingRateHrCurrency')?.valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValue(0, this.candOfferApprDetail.gradeId, this.candOfferApprDetail.gradeBandId);
        }
      )

    this.getControl('projectBuffer')?.valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValue(0, this.candOfferApprDetail.gradeId, this.candOfferApprDetail.gradeBandId);
        }
      )

    this.getControl('NonReimbursableTravelCost')?.valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValue(0, this.candOfferApprDetail.gradeId, this.candOfferApprDetail.gradeBandId);
        }
      )

    this.getControl('projectSpecificCost')?.valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValue(0, this.candOfferApprDetail.gradeId, this.candOfferApprDetail.gradeBandId);
        }
      );
  }
}

