import { Component, Inject, OnInit,AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OfferService } from 'projects/ats-global-system/src/app/offer-module/offer.service';
import { TalentService } from '../../../talent.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { FILE_UPLOAD } from 'projects/ats-global-system/src/app/core/constant/common.const';

@Component({
  selector: 'app-joined-candidate-reopen-transfer-modal',
  templateUrl: './joined-candidate-reopen-transfer-modal.component.html',
  styleUrls: ['./joined-candidate-reopen-transfer-modal.component.scss']
})
export class JoinedCandidateReopenTransferModalComponent implements OnInit, AfterViewInit {
  public candData: any = [];
  public candOfferApprDetail: any = [];
  public targetTHIDDetails: any = [];
  public formTransfer: UntypedFormGroup = new UntypedFormGroup({});;
  public dgmData:any = [];
  public billingHours: any = [8, 9];
  public currencyTypeData: any = [];
  constructor(
    public dialogRef: MatDialogRef<JoinedCandidateReopenTransferModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _offerService: OfferService,
    private _talentService: TalentService,
    private _share: ShareService,
    public dialog: MatDialog,
    private _globalCommonMethod: GlobalCommonMethodService,
    private _globalApiServe: GlobalApisService
  ) { }

  ngOnInit(): void {
    this.getCurrentTHIDDetails();
    this.getCandidateOfferApprDetails(this.data?.cid);
    this.getLocation();
    this.formTransfer = this._fb.group({
      talendIdControl: [null, [Validators.required]],
      ReopeningReason: [null, [Validators.required]],
      DPApproverId: [null],
      thid: [null],      
      billingRateHrCurrency: [null],
      billingCurrencyId: [2],
      NonReimbursableTravelCost: [null],
      projectSpecificCost: [null],
      projectBuffer: [null],
      billableHoursDay: [],
      approvalDoc: [null],
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
      this.getReasonsToReopen();
    }

  }

  public isTransferable: boolean = false;
  public isReinitiationRequired: boolean = false;
  public isTargetReqIdDetailsVisible: boolean = false;
  public reinitiationMsg: string = '';
  public reinitiationMsgForPopup: string = '';
  public isBillRateEditable: boolean = true;
  public isBillHrEditable: boolean = true;
  public isDPApproverVisible: boolean = false;
  getTargetTHIDDetails(TH_ID: number) {
    this._offerService.getTargetTHIDDetails(this.data?.cid, TH_ID).subscribe(
      res => {
        this.targetTHIDDetails = res['data'][0];
        if (this.targetTHIDDetails?.ISTCImplimented != 1) {
          this.isTransferable = false;
          this.isReinitiationRequired = false;
          this.isDPApproverVisible = false;
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
            this.isDPApproverVisible = false;
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
              this.isDPApproverVisible = false;
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
                  this.getControl('billingRateHrCurrency').addValidators([Validators.required]);
                  this.getControl('billableHoursDay').addValidators([Validators.required]);
                }              
                this.getControl('billingRateHrCurrency').updateValueAndValidity();
                this.getControl('billableHoursDay').updateValueAndValidity(); 
              // }           
              if (this.targetTHIDDetails?.ISReinitiationRequired == 1) {
                  this.isReinitiationRequired = true;
                  this.isDPApproverVisible = true;
                  this.getDPApproverList(TH_ID,this.targetTHIDDetails?.requisitionTypeId);
                  if (this.targetTHIDDetails?.ISReinitiationFromAccount === 'Y') {
                    this.reinitiationMsg = 'as the Account for the target Talent ID is different';
                    this.reinitiationMsgForPopup = `The THID <span class='u-name'>${this.targetTHIDDetails?.TalentID}</span> belongs to different account. Candidate transfer to this talent id will require DP approval.`;
                  } else if (this.targetTHIDDetails?.IsReinitiationFromVariance === 'Y') {
                    this.reinitiationMsg = 'as the variance for the target Talent ID exceeds the approved variance';
                    this.reinitiationMsgForPopup = `The variance of target talent id exceeds the approved variance. Candidate transfer to this talent id will require DP approval.`;
                  } else {
                    this.reinitiationMsg = '';
                    this.reinitiationMsgForPopup = '';
                  }
                this._globalCommonMethod.showMessagedisplay({
                  title: 'Message',
                  autoHide: false,
                  msg: `<p>${this.reinitiationMsgForPopup}</p>`
                });
              }
              else {
                this.isReinitiationRequired = false;
                this.isDPApproverVisible = false;
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
        // if (this.targetTHIDDetails?.MinGridLimit) {
        //   formValue['MinSalary'] = this.targetTHIDDetails?.MinGridLimit;
        // }
        // if (this.targetTHIDDetails?.MedGridLimit) {
        //   formValue['MedSalary'] = this.targetTHIDDetails?.MedGridLimit;
        // }
        // if (this.targetTHIDDetails?.MaxGridLimit) {
        //   formValue['MaxSalary'] = this.targetTHIDDetails?.MaxGridLimit;
        // }
        if (this.targetTHIDDetails?.VarianceMax) {
          formValue['VarianceMax'] = this.targetTHIDDetails?.VarianceMax;
        }
        if (this.targetTHIDDetails?.VarianceMed) {
          formValue['VarianceMid'] = this.targetTHIDDetails?.VarianceMed;
        }
        // if (this.targetTHIDDetails?.ISReinitiationRequired) {
          formValue['IsReinitiationRequired'] = this.targetTHIDDetails?.ISReinitiationRequired;
        // }
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
        // if (this.dgmData['JoiningBonus']) {
        //   formValue['joiningBonusUsd'] = this.dgmData['JoiningBonus'];
        // }
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
        
      // if(this.data?.callType == 1){
      //   this._offerService.transferSelectedCandidateByTalentIdWithTC(formValue).subscribe(
      //     res => {
      //       this._share.showAlertSuccessMessage.next(res);
      //       //  if(this.targetTHIDDetails?.ISReinitiationRequired == 1){
      //       //  this.confirmReinitiationDialogBox();
      //       let obj = {
      //         flag: true,
      //         isReinitiationRequired: this.targetTHIDDetails?.ISReinitiationRequired,
      //         target_thid: this.targetTHIDDetails?.THID,
      //         target_talentId: this.targetTHIDDetails?.TalentID
      //       }
      //       this.dialogRef.close(obj);
      //       // }
      //     }
      //   )
      // }else
      // if(this.data?.callType == 2){
        
        // delete formValue['talendIdControl'];
        // delete formValue['joiningBonusUsd'];
        // delete formValue['MinSalary'];
        // delete formValue['MedSalary'];
        // delete formValue['MaxSalary'];


        // let body = {
        //   cid: this.data.cid,
        //   toThId: this.targetTHIDDetails?.THID,
        //   IsReinitiationRequired : this.targetTHIDDetails?.ISReinitiationRequired,
        //   Remarks: formValue['remarks']
        // }
        this._talentService.transferAndReopenTalentId(formValue).subscribe(
          res => {
            console.log(res);
            let formData = new FormData();
            if (this.allFilesApprovalDoc.length != 0) {
              formData.append('cid', this.data.cid);
              formData.append('ActionTakenBy', 'R');
              formData.append('ActionID', res.ActionId);              
              if (this.allFilesApprovalDoc.length != 0){
                for (let i = 0; i < this.allFilesApprovalDoc.length; i++) {
                  formData.append('File', this.allFilesApprovalDoc[i]);
                }
                // this._offerService.uploadApprovalDocumentByRec(formData).subscribe(
                //   apprDoc => {
                //     this._share.showAlertSuccessMessage.next(res);
                //     this.dialogRef.close(true);
                //   }
                // )
                this._offerService.uploadDocumnetByRecApprover(formData).subscribe(
                  doc => {
                    this._share.showAlertSuccessMessage.next(res.Message);
                    this.dialogRef.close(true);
                  }
                )
              }

            } else {
              this._share.showAlertSuccessMessage.next(res?.Message);
              this.dialogRef.close(true);
            }

            // this._share.showAlertSuccessMessage.next(res);
            // // this.dialogRef.close(true);
            // let obj = {
            //   flag: true,
            //   isReinitiationRequired: this.targetTHIDDetails?.ISReinitiationRequired,
            //   target_thid: this.targetTHIDDetails?.THID,
            //   target_talentId: this.targetTHIDDetails?.TalentID
            // }
            // this.dialogRef.close(obj);
          }
        )
      // }
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
          ? ` This will require DP Approval <span class='u-name'> ${this.reinitiationMsg}</span>. Are you sure you want to transfer candidate to ${this.targetTHIDDetails?.TalentID} Talent ID ?`
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

  public reasonList: any = [];
  getReasonsToReopen() {
    this._globalApiServe.GetTalentReopenningRemarksList().subscribe(
      res => {
        this.reasonList = res['data'];
      }
    )
  }

  public dPApproversList: any = [];
  getDPApproverList(TH_ID: number,reqType:number) {
    let body = {
      thid: TH_ID,
      reqType: reqType
    }
    this._globalApiServe.getDPApproverList(body).subscribe(
      res => {
        this.dPApproversList = res['data'];
        setTimeout(() => {
          this.getControl('DPApproverId').patchValue(this.dPApproversList[0].empnewid);
        }, 1000);
      }
    )

  }

  public existFilesApprDoc: any = [];
  previewFileExistApprDoc(files: any = []) {
    if (files.length != 0) {
      for (let x in files) {
        this.existFilesApprDoc.push({ name: files[x].FileName, type: 'e' })
      }
      this.allFilesApprDoc = this.existFilesApprDoc;
    }
  }

  public allFiles: any = [];
  public allFilesApprDoc: any = [];
  public allFilesApprovalDoc: any = [];
  @ViewChild('approvalDoc') approvalDoc: ElementRef;
  fileUpApprovalDoc(event: any) {
    this.getControl('approvalDoc').reset();
    this.allFilesApprDoc = [];
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf|\.msg|\.xlsx)$/i;
    let files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let fileName = files[i].name;
      if (!allowedExtensions.exec(fileName)) {
        this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf/msg/xlsx only.');
        event.target.value = "";
        this.allFiles = [];
        this.getControl('approvalDoc').reset();
        return false;
      }
      else if (files[i].size > FILE_UPLOAD.FILE_SIZE) {
        this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
        event.target.value = "";
        this.allFiles = [];
        this.getControl('approvalDoc').reset();
        return false;

      }
      else {
        this.getControl('approvalDoc').patchValue('files');
        this.allFilesApprDoc.push(files[i]);
        this.allFilesApprovalDoc.push(files[i]);
      }

    }

    this.allFilesApprDoc = [...this.allFilesApprDoc, ...this.existFilesApprDoc];
  }
}


