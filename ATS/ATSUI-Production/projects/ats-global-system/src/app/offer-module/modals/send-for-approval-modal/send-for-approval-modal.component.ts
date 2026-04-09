import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { forkJoin, pipe } from 'rxjs';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { OfferService } from '../../offer.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { FILE_UPLOAD, salaryMinMaxLoc } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { AtsOfferCommonMethodService } from 'projects/ats-global-system/src/app/core/common/ats-offer-common-method.service';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { TalentService } from '../../../talent-module/talent.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
@Component({
  selector: 'app-send-for-approval-modal',
  templateUrl: './send-for-approval-modal.component.html',
  styleUrls: ['./send-for-approval-modal.component.scss']
})
export class SendForApprovalModalComponent implements OnInit, AfterViewInit {
  //
  public sendForApprovalForm: UntypedFormGroup = new UntypedFormGroup({});
  gotSendApprovalSubmit: any
  //
  public allBonusNames: string= 'Joining Bonus, Notice Period Buyout, Travel Expense, Relocation Expense, Retention Bonus';
  public candData: any = [];
  public allRoundList: any = [];
  public selectedList: any = [];
  public gradeList: any = [];
  public gradeBandList: any = [];
  public jobFamilyList: any = [];
  public offerAprDt: any = [];
  public FilterCtrlTAG: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlTAGhead: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlGrade: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlTC: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlJB: UntypedFormControl = new UntypedFormControl();
  // public FilterCtrl1: FormControl = new FormControl();
  public searchInput: string;
  public searchInputTagHead: string;
  public searchInputTC: string;
  public salaryTypeList: any = CONSTANTS.salaryType;
  public billingHours: any = [8, 9];
  public billingRateControl: UntypedFormControl = new UntypedFormControl();
  public projectBufferControl: UntypedFormControl = new UntypedFormControl();
  public billableHoursDayControl: UntypedFormControl = new UntypedFormControl(8);
  public billingCurrencyControl: UntypedFormControl = new UntypedFormControl();
  public minDate: any = new Date();
  public minDateEnd: any = new Date();
  public JfCategList: any = CONSTANTS.JfCategList;
  public RehireList: any = CONSTANTS.RehireList;
  public offerInHand: any = CONSTANTS.isOfferInHand;
  public practiceList: any = [];
  public ReqTypeId: number = 0;
  public variablePayList: any = [];
  constructor(
    public dialogRef: MatDialogRef<SendForApprovalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _globalApi: GlobalApisService,
    private _fb: UntypedFormBuilder,
    private _offerService: OfferService,
    private _globalApiServe: GlobalApisService,
    private _share: ShareService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _commonOfferMet: AtsOfferCommonMethodService,
    private _talentServ: TalentService,
    private _commonMethodServe: GlobalCommonMethodService
  ) { }

  ngOnInit(): void {
    //
    if (this.data.DivisionID) {
      this.divisionID = this.data.DivisionID;
    }
    this.getCurrency();
    this.getAllPractices();
    this.getTagLeadApproverList(this.divisionID);
    this.getLocation();
    this.getContractList();
    this.sendApprovalForm()
    this.getCandidateDetails();
    this.getGrade();
    this.getCTC();
    this.getJustificationList();
    //this.getjobFamily(this.divisionID);
    this.remaarkValidation();
    this.getDivisionList();
    //this.getFieldsList();
    this.getTalentCubeList();
    // this.getDGMOfferNNT();
    // this.billableHoursDayControl.patchValue(8);


  }

   /**getting variable pay data */
   public VariableDetails: any = {};
  getVariableDetailsByGrade(grade: number) {

  

    this._globalApi.getCompensationVariableByGrade(grade).subscribe(
      res => {
        this.VariableDetails = res['data'][0];
        let candidateTypeId = this.getControl('CandidateTypeID').value;
        if(candidateTypeId == 3){
         this.getControl('variablePay').patchValue(this.VariableDetails?.VariablePercent);
        }
        else{
          this.getControl('variablePay').patchValue(0);
        }
        
      }
    )

  }

  //get getTalentCubeList list

  public talentCubeList: any = [];
  getTalentCubeList() {
    this._globalApiServe.getTalentCubeList().subscribe(
      res => {
        this.talentCubeList = res['data'];
        this.FilterCtrlTC.valueChanges.subscribe(
          val => {
            this.searchInputTC = val;
          }
        );
      }
    );
  }


  //get division list
  public RoleTalentCube: any = {};
  getRoleByTalentCube(talentCubeCode: number, gradeId: number) {
    this._globalApiServe.getRoleByTalentCube(talentCubeCode, gradeId).subscribe(
      res => {
        this.RoleTalentCube = res['data'][0];

      }
    );
  }


  ngAfterViewInit(): void {
    this.inputValueChangedFunc();
  }

  public isRemarkReq: boolean = false;
  remaarkValidation() {
    let remarkCtrl = this.getControl('remarks');

    if (this.dgmData?.variance > 0 ||
      this.data.OfferStatusID === 120 ||
      this.data.OfferStatusID === 140 ||
      this.data.OfferStatusID === 160 ||
      this.data.OfferStatusID === 180) {
      this.isRemarkReq = true;
      remarkCtrl.setValidators(Validators.required);
    }
    else {
      remarkCtrl.clearValidators();

      this.isRemarkReq = false;

    }

    remarkCtrl.updateValueAndValidity();

  }
  // public isFieldModReq: boolean = false;
  // fieldModValidation() {
  //   let fieldCtrl = this.getControl('FieldIDs');
  //   if (
  //     this.offerAprDt.OfferID && ( 
  //       this.data.OfferStatusID === 20 || 
  //       this.data.OfferStatusID === 40 || 
  //       this.data.OfferStatusID === 45 || 
  //       this.data.OfferStatusID === 60 || 
  //       this.data.OfferStatusID === 80 || 

  //       this.data.OfferStatusID === 30 || 
  //       this.data.OfferStatusID === 50 || 
  //       this.data.OfferStatusID === 55 || 
  //       this.data.OfferStatusID === 70 || 
  //       this.data.OfferStatusID === 90 || 

  //     this.data.OfferStatusID === 120 ||
  //     this.data.OfferStatusID === 140 ||
  //     this.data.OfferStatusID === 160 ||
  //     this.data.OfferStatusID === 180 ||
  //     this.data.OfferStatusID === 100
  //     )) {
  //     this.isFieldModReq = true;
  //     fieldCtrl.setValidators(Validators.required);
  //   }
  //   else {
  //     fieldCtrl.clearValidators();
  //     this.isFieldModReq = false;

  //   }

  //   fieldCtrl.updateValueAndValidity();

  // }

  public currencyTypeData: any = [];
  getCurrency() {
    //get cand type
    this._globalApi.GetCurrencyList().subscribe(
      res => {
        // this.currencyTypeData = res['data'];
        let filterById = [2]
        let filterByStatus = res['data'].filter(t => {
          return filterById.indexOf(t.CurId) !== -1;
        });
        this.currencyTypeData = filterByStatus;
      }
    );
  }
  getAllPractices() {
    //get cand type
    this._globalApi.getAllPractices().subscribe(
      res => {
        this.practiceList = res['data'];
      }
    );
  }

  /**getting variable pay data */
  getVariablePayList(cid: number, cubeId: number, grade: number) {

    this._globalApi.getVariablePayList(cid, cubeId, grade).subscribe(
      res => {
        this.variablePayList = res['data'];
      }
    )

  }
  public tagLeadList: any = [];
  public tagHeadList: any = [];
  getTagLeadApproverList(divisionID: number) {
    this._globalApiServe.getTagHeadApproverList(divisionID).subscribe(
      res => {
        this.tagLeadList = res['data']
        this.FilterCtrlTAG.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        )
      }
    )
    /**getting list of tag head  */
    this._globalApiServe.getTagHeadList().subscribe(
      res => {
        this.tagHeadList = res['data'];
        this.FilterCtrlTAGhead.valueChanges.subscribe(
          val => {
            this.searchInputTagHead = val
          }
        )
      }
    )

    /**offer release for */
    this._globalApiServe.getTagHeadList().subscribe(
      res => {
        this.tagHeadList = res['data'];
        this.FilterCtrlTAGhead.valueChanges.subscribe(
          val => {
            this.searchInputTagHead = val
          }
        )
      }
    )
  }

  public justificationReasonList: any = [];
  getJustificationList() {

    /**getting list of tag head  */
    this._globalApiServe.GetJustificationBucketList().subscribe(
      res => {
        this.justificationReasonList = res['data'];
        // this.FilterCtrlTAGhead.valueChanges.subscribe(
        //   val => {
        //     this.searchInputTagHead = val
        //   }
        // )
      }
    )
  }



  public searchInputGrade: string;
  getGrade() {
    this._globalApiServe.getGradeList().subscribe(
      res => {
        this.gradeList = res['data'];
        this.FilterCtrlGrade.valueChanges.subscribe(
          val => {
            this.searchInputGrade = val;
          }
        );

      }
    );
  }
  getGradeBand(id: number) {
    this._globalApiServe.getGradeBandList(id).subscribe(
      res => {
        this.gradeBandList = res['data']
      }
    );
  }

  public searchInputJB: string;
  getjobFamily(id: number) {
    this._globalApiServe.getJobFamilyList(id).subscribe(
      res => {
        this.jobFamilyList = res['data'];
        this.FilterCtrlJB.valueChanges.subscribe(
          val => {
            this.searchInputJB = val;
          }
        );
      }
    );
  }

  //get company location
  public locationList: any = [];
  getLocation() {
    this._globalApiServe.getLocationList().subscribe(
      res => {
        let ids = [];
        if (this.divisionID == 7) {
          ids = [1, 2, 4, 5, 16];
        }
        else if (this.divisionID == 9) {
          ids = [23];
        }
        else if (this.divisionID == 1) {
          ids = [1, 2, 4, 5, 16];
        } else {
          ids = [1, 2, 4, 5];
        }
        let filterLocation = res['data'].filter(loc => {
          return ids.indexOf(loc.LocID) !== -1;
        })
        this.locationList = filterLocation;
      }
    );
  }

  //get division list
  public divisionList: any = [];
  getDivisionList() {
    this._globalApiServe.getDivisionList().subscribe(
      res => {
        this.divisionList = res['data'];
      }
    );
  }

  //get 
  // public fieldsListData: any = [];
  // public fieldsListDataCtrl: FormControl = new FormControl();
  // public fieldsListDatasearch: string = '';
  // @ViewChild('selectfieldsListData') select: MatSelect;
  // getFieldsList() {
  //   this._offerService.getFieldsList().subscribe(
  //     res => {
  //       this.fieldsListData = res['data'];
  //       this.fieldsListDataCtrl.valueChanges.subscribe(
  //         val => {
  //           this.fieldsListDatasearch = val;
  //         }
  //       );
  //     }
  //   );
  // }

  // public multiSelectedValField: any = [];
  // optionClickFieldsList() {
  //   
  //   let newStatus = true;
  //   this.select.options.forEach((item: MatOption) => {
  //     if (!item.selected) {
  //       newStatus = false;
  //     }
  //   });
  //   /***
  //    * get selected value
  //    */
  //   let selectedData = this.select.options.filter(d => d.selected === true && d.viewValue != 'close' && d.viewValue != '');
  //   this.multiSelectedValField = selectedData;
  // }


  /**
   * Division on changed
   * @param event 
   */
  public gradeBandReq: boolean = true;
  public convRateReq: boolean = false;
  public RevenueReq: boolean = false;
  public divisionID: number = 1;
  divisionChanged(event: any) {
    this.divisionID = event.value;
    this.getControl('JobFamilyID').reset();
    /**
     * NNT
     */

    this.getLocation();
    this.getTagLeadApproverList(event.value);
    // this.getjobFamily(event.value);
    this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value || 0, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, this.getControl('joiningBonus').value, this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value, this.getControl('RelocationExp').value, this.getControl('RetentionBonus').value );
    this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
  }

  public contactList: any = [];
  getContractList() {
    this._globalApiServe.GetContractTypes().subscribe(
      res => {

        if (this.data?.requirementTypeId == 6) {
          let permanentFoC2h = res['data'].filter(t => t.ID == 3);

          this.contactList = permanentFoC2h;
        } else {
          let filterById = [1, 2, 3, 6]
          let filterByStatus = res['data'].filter(t => {
            return filterById.indexOf(t.ID) !== -1;
          });
          this.contactList = filterByStatus;
        }

      }
    )
  }

  // upload multiple  documents 
  public isFileReq: boolean = false;
  uploadButtonValidation(bgvDocList: any) {
    let fileControl = this.getControl('fileBGV');
    if (bgvDocList.length === 0) {
      fileControl.setValidators(Validators.required);
      this.isFileReq = true;
    }
    else {
      this.previewFileExist(bgvDocList);
      fileControl.clearValidators();
      this.isFileReq = false;
    }

    fileControl.updateValueAndValidity();

  }
  public existFilesBgv: any = [];
  previewFileExist(files: any = []) {
    if (files.length != 0) {
      for (let x in files) {
        this.existFilesBgv.push({ name: files[x].FileName, type: 'e' })
      }
      this.allFiles = this.existFilesBgv;
    }


  }

  public talentDetails: any = {};
  public isDemandCreateByCube: boolean = false;
  public isTCEditExcep: boolean = false;
  public isBillRateEditable: boolean = true;
  public isBillHrEditable: boolean = true;
  getCandidateDetails() {
    forkJoin([
      this._interviewStatus.getCandidateDetails(this.data.cid),
      this._offerService.getSelectedCandidateDetails(this.data.cid),
      this._offerService.getCandidateOfferAprDetails(this.data.cid),
      this._offerService.getOfferApprovalAttachaments(`cid=${this.data.cid}&ActionTakenBy=R`),
      this._talentServ.GetTHIDDetailsByTHID(this.data?.th_id)
    ]).subscribe(
      res => {
        this.allRoundList = res[0];
        this.candData = res[1]['data'][0];
        this.offerAprDt = res[2]['data'][0];
        this.previewFileExist(res[3]['data']);
        this.talentDetails = res[4]['data'][0];

        //  this.candData['RequirementTypeId'] = this.candData?.RequirementTypeId
        this.selectedList = this.allRoundList.roundList.filter(d => d?.interviewType?.Id === 4 && d?.InterViewStatus?.Id === 4);
        debugger
        this.getAllApproverList();
        if (this.talentDetails?.TalentIdCreatedBy == 'TC') {
          this.isDemandCreateByCube = true;
        }
        else {
          this.isDemandCreateByCube = false
        }

        if (this.candData?.isTCEdit == 'Y') {
          this.isTCEditExcep = true
        }


        if (this.offerAprDt.OfferID === null) {

          if (this.isDemandCreateByCube) {
            this.getControl('CubeID').patchValue(this.talentDetails?.TalentCubeId);
            this.getControl('gradeId').patchValue(this.talentDetails?.TCGradeId);

            this.filterCubeList = this.talentCubeList.filter(r => r.CubeId == this.talentDetails?.TalentCubeId)[0];
            this.RoleTalentCube['RoleName'] = this.talentDetails?.TalentCubeRole;
            this.RoleTalentCube['RoleId'] = this.talentCubeList?.TalentCubeRoleId;
            // this.getRoleByTalentCube(this.talentDetails?.TalentCubeId, this.talentDetails?.TCGradeId);
          }
          else {
            this.getControl('CubeID').patchValue(this.candData?.CubeID);
            this.getControl('gradeId').patchValue(this.candData?.gradeIdM);
            this.getControl('gradeBand').patchValue(this.candData?.gradeBandIdM);
            this.filterCubeList['ClusterName'] = this.candData?.ClusterName;
            this.filterCubeList['ClusterId'] = this.candData?.CubeClusterID;
            this.RoleTalentCube['RoleName'] = this.candData?.RoleName;
            this.RoleTalentCube['RoleId'] = this.candData?.CubeRoleID;

          //  this.getVariablePayList(this.data?.cid, this.candData?.CubeID, this.candData?.gradeIdM);
          //  this.variablePayHideShow(this.candData?.gradeIdM);
          this.getVariableDetailsByGrade(this.candData?.gradeIdM);
          }

          setTimeout(() => {
            this.setDefaultValue(this.selectedList[0]);

            // this.billableHoursDayControl.patchValue(parseInt(this.talentDetails?.BillingHours));
            this.getGradeBand(this.isDemandCreateByCube ? this.talentDetails?.TCGradeId : this.candData.gradeIdM);
            //  this.getGradeBand(this.talentDetails?.TCGradeId);
            //  this.getRoleByTalentCube(this.talentDetails?.TalentCubeId,this.getControl('gradeId').value);
          }, 1000);
          // this.getjobFamily(null);
          // this.DefaulDGMCalc();
          // this.getApproverCont(this.candData.gradeId, this.selectedList[0].CTC, this.candData.skillId, this.candData.totalExpYear, this.candData.totalExpMonth);
        }
        else {
          // this.fieldModValidation();
          this.getGradeBand(this.offerAprDt.gradeId);
          this.getControl('CubeID').patchValue(this.offerAprDt?.CubeID);
          this.getControl('gradeId').patchValue(this.offerAprDt?.gradeId);
          this.filterCubeList['ClusterName'] = this.offerAprDt?.ClusterName;
          this.filterCubeList['ClusterId'] = this.offerAprDt?.CubeClusterID;
          this.RoleTalentCube['RoleName'] = this.offerAprDt?.RoleName;
          this.RoleTalentCube['RoleId'] = this.offerAprDt?.CubeRoleID;
          setTimeout(() => {
            this.setDefaultValue(this.offerAprDt);
            this.hideVandOtherContract(this.offerAprDt?.CandidateTypeID);
            this.getDGMCalcValue(1, this.offerAprDt.gradeId, this.offerAprDt.gradeBandId);
          }, 1000);

        }
        if (this.talentDetails?.IsBillableID == 'Y') {
          if (this.talentDetails?.BillingRate != null && this.talentDetails?.BillingRate != 0) {
            this.isBillRateEditable = false;
            this.getControl('billingRateHrCurrency').clearValidators();
            this.getControl('billingRateHrCurrency').reset();
          } else {
            this.isBillRateEditable = true;
            this.getControl('billingRateHrCurrency').addValidators([Validators.required]);
          }
          if (this.talentDetails?.BillingHours != null && this.talentDetails?.BillingHours != 0) {
            this.isBillHrEditable = false;
            this.getControl('billableHoursDay').clearValidators();
            this.getControl('billableHoursDay').reset();
          } else {
            this.isBillHrEditable = true;
            this.getControl('billableHoursDay').addValidators([Validators.required]);
          }
        } else {
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
      }
    )
  }



  /***
   * hide for contractor
   */
  public isHideVarience: boolean = true;
  hideVandOtherContract(id: number) {
    if (id == 1 || id == 2) {
      this.isHideVarience = false;
    }
    else {
      this.isHideVarience = true;
    }
  }

  /** is offer in hand change  */
  public isOfferInHandCTCReq: boolean = false;
  getOfferInHand(e: any) {
    this.showOfferInHandCTC(e.value);
  }

  onValueChangeInHand(event: any) {
    debugger
  const enteredValue = event.target.value;
  let prevValue = this.offerAprDt?.OfferInHandCTC || 0;
  let IsOfferInHand = this.offerAprDt?.IsOfferInHand || 0;
  if(this.offerAprDt?.IsOfferInHand == 1){
     IsOfferInHand = 1;
     prevValue = this.offerAprDt?.OfferInHandCTC || 0;
  }
  else if(this.candData?.IsOfferInHandInt == 'Y'){
     IsOfferInHand = 1;
      prevValue = this.candData?.OfferInHandCTCInt || 0;
  }
  if (IsOfferInHand == 1) {
    if (enteredValue != prevValue) {
      // this.getControl('fileOffer').setValidators([Validators.required]);
      this.IsDocOption = true;
      this.getControl('isDocAvailableInHandCTCDoc').setValidators([Validators.required]);
    }
    else{
      this.getControl('isDocAvailableInHandCTCDoc').clearValidators();
        this.getControl('isConsentInHandCTCDoc').clearValidators();
      this.IsDocOption = false
      this.IsConsentVisible = false;
      this.isConsentSignReq = false;
        this.getControl('fileOffer').clearValidators(); 
        this.getControl('fileOffer').reset();
        this.isOfferInHandUpload = false;

    } 
    this.getControl('isDocAvailableInHandCTCDoc').updateValueAndValidity();
    this.getControl('isConsentInHandCTCDoc').updateValueAndValidity();
    this.getControl('fileOffer').updateValueAndValidity();
  }
 
}

public IsConsentVisible: boolean = false;
public isConsentSignReq: boolean = false;
  getDocumentVailabel(event: any) {
      if (event.value == 1) {
          this.isOfferInHandUpload = true;
          this.getControl('fileOffer').setValidators([Validators.required]);
          this.getControl('isConsentInHandCTCDoc').clearValidators();
          this.IsConsentVisible = false;
          this.isConsentSignReq = false;
      }
      else{
        this.getControl('fileOffer').clearValidators(); 
        this.getControl('fileOffer').reset();
        this.isOfferInHandUpload = false;
        this.IsConsentVisible = true;
        this.getControl('isConsentInHandCTCDoc').setValidators([Validators.required]);
        this.isConsentSignReq = true;
      }
      this.getControl('fileOffer').updateValueAndValidity();
  }

    changeCheckHROffer(e: any) {
    if (e.checked == false) {
      this.getControl('isConsentInHandCTCDoc').reset();
    }

  }


  /**method to show hide offer in hand ctc field */
   public salRange: any = salaryMinMaxLoc;
   public isOfferInHandUpload: boolean = false;
    public IsDocOption: boolean = false;
  showOfferInHandCTC(value: number) {
    let salTypeCtrl = this.getControl('SalaryType').value;
    let OfferInHandCTC= this.getControl('OfferInHandCTC');
    debugger
    if (value === 1) {
      this.isOfferInHandCTCReq = true;
      //this.isOfferInHandUpload = true;
      //this.getControl('fileOffer').setValidators([Validators.required]);
  //   this.getControl('OfferInHandCTC').setValidators([Validators.required]);
      this.getControl('OfferInHandCTC').setValidators([Validators.required, Validators.min(this.salRange?.inrMin), Validators.max(this.salRange?.inrMax)]);
       if (salTypeCtrl == 1) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.inrMin), Validators.max(this.salRange.inrMax)]);
        } else if (salTypeCtrl == 2) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.inrMonthlyMin), Validators.max(this.salRange.inrMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.inrHrlyMin), Validators.max(this.salRange.inrHrlyMax)]);
        }
    } else {
      OfferInHandCTC.clearValidators();
      OfferInHandCTC.reset();
      this.getControl('fileOffer').clearValidators();
      this.getControl('fileOffer').reset();
      this.getControl('isDocAvailableInHandCTCDoc').clearValidators();
      this.getControl('isDocAvailableInHandCTCDoc').reset();
      this.IsDocOption = false;
      this.isOfferInHandCTCReq = false;
      this.isOfferInHandUpload = false;
    }
   OfferInHandCTC.updateValueAndValidity();
   this.getControl('fileOffer').updateValueAndValidity();
    this.getControl('isDocAvailableInHandCTCDoc').updateValueAndValidity();
  }

  public allFiles: any = [];
  public allFilesBGV: any = [];
  @ViewChild('fileBGV') fileBGV: ElementRef;
  fileUp(event: any) {
    this.getControl('fileBGV').reset();
    this.allFiles = [];
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf|\.msg|\.xlsx)$/i;
    let files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let fileName = files[i].name;
      if (!allowedExtensions.exec(fileName)) {
        this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf/msg/xlsx only.');
        event.target.value = "";
        this.allFiles = [];
        this.getControl('fileBGV').reset();
        return false;
      }
      else if (files[i].size > FILE_UPLOAD.FILE_SIZE) {
        this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
        event.target.value = "";
        this.allFiles = [];
        this.getControl('fileBGV').reset();
        return false;

      }
      else {
        this.getControl('fileBGV').patchValue('files');
        this.allFiles.push(files[i]);
        this.allFilesBGV.push(files[i]);
      }

    }

    this.allFiles = [...this.allFiles, ...this.existFilesBgv];
  }



public offerInhandDocs: any = [];
@ViewChild('fileOffer') fileInhandOff: ElementRef;

fileUpofferInhandDocs(event: any) {
  this.getControl('fileOffer').reset();
  this.offerInhandDocs = [];

  let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf|\.msg|\.xlsx)$/i;
  let file = event.target.files[0]; // only single file

  if (!file) {
    return false;
  }

  let fileName = file.name;

  if (!allowedExtensions.exec(fileName)) {
    this._share.showAlertErrorMessage.next(
      fileName + ' is not a valid document type. Please upload jpeg/jpg/png/txt/pdf/doc/docx/rtf/msg/xlsx only.'
    );
    event.target.value = "";
    this.offerInhandDocs = [];
    this.getControl('fileOffer').reset();
    return false;
  } 
  else if (file.size > FILE_UPLOAD.FILE_SIZE) {
    this._share.showAlertErrorMessage.next('File uploaded cannot be greater than 15MB.');
    event.target.value = "";
    this.offerInhandDocs = [];
    this.getControl('fileOffer').reset();
    return false;
  } 
  else {
    this.getControl('fileOffer').patchValue('file');
    this.offerInhandDocs = [file]; // overwrite with single file
  }

}


  //
  sendApprovalForm() {
    this.sendForApprovalForm = this._fb.group({
      SalaryType: [1, [Validators.required]],
      JoiningLocationID: [null, [Validators.required]],
      DateOfJoining: [null, [Validators.required]],
      CandidateTypeID: [null, [Validators.required]],
      DesignationId: [null, [Validators.required,]],
      gradeId: [null, [Validators.required]],
      gradeBand: [null, Validators.required],
      JobFamilyID: [null],
      JfCateg: [null],
      PracticeId: [null],
      reHire: ['N', [Validators.required]],
      ctc: [null, [Validators.required]],
      joiningBonus: [null, [Validators.max(900000)]],
      NoticeBuyOut: [null, [Validators.max(200000)]],
      TravelExp: [null, [Validators.max(50000)]],
      RelocationExp: [null, [Validators.max(100000)]],
      RetentionBonus: [null, [Validators.max(300000)]],
      // offerGivenBy: [null, [Validators.required]],
      TAGLead_Approver: [null, [Validators.required]],
      TAGHead_Approver: [null, [Validators.required]],
      DH_Approver: [null],
      SVP_Approver: [null],
      //CDO_Approver: [null],
      COO_Approver: [null],
      PartnerID: [null],
      ContractCompletionDate: [null],
      lwdDate: [null],
      ServiceAndMarkup: [null],
      fileBGV: [null],
      DivisionID: [null, [Validators.required]],
      /** DGM Control */
      billingRateHrCurrency: [null],
      billingCurrencyId: [2],
      NonReimbursableTravelCost: [null],
      projectSpecificCost: [null],
      projectBuffer: [null],
      billableHoursDay: [null],
      remarks: [null],
      ConversionRate: [null],
      ClientApprovedBilling: [null],
      Revenue: [null],
      OtherHiringCost: [null],
      FieldIDs: [[]],
      CubeID: [null, [Validators.required]],
      variablePay: [null],
      JustificationBucketId: [null],
      ContractExtensionRemarks: [null],
      OfferReleasedFor: [null, [Validators.required]],
      IsOfferInHand: [null, [Validators.required]],
      OfferInHandCTC: [null],
       fileOffer: [null],
       isDocAvailableInHandCTCDoc: [null],
       isConsentInHandCTCDoc: [null],
    })
    if (this.convRateReq) {
      this.getControl('ConversionRate').setValidators([Validators.required]);
      this.getControl('ClientApprovedBilling').setValidators([Validators.required]);
    }
    this.getControl('ConversionRate').updateValueAndValidity();
    this.getControl('ClientApprovedBilling').updateValueAndValidity();
    if (this.RevenueReq) {
      this.getControl('Revenue').setValidators([Validators.required]);
      this.getControl('OtherHiringCost').setValidators([Validators.required]);
    }
    this.getControl('Revenue').updateValueAndValidity();
    this.getControl('OtherHiringCost').updateValueAndValidity();

  }

  myFilterDate = (d: Date): boolean => {
    const day = d?.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
  /***
   * defaul dgm calc value
   */
  DefaulDGMCalc() {
    let body = {
      cid: this.data.cid,
      billingCurrencyId: '2',
      billableHoursDay: 8,
      JoiningLocationId: '1',
      billingRate: this.candData?.billingRateHrCurrency,
      gradeId: this.candData.gradeId
    }
    this.dgmCallAPI(body);
  }
  /***
   * get DGM calc value
   */
  public localCurrency: string;
  public localCurrencyId: string;
  public dgmData: any = {};
  getDGMCalcValue(type: number, gradeId: number, GradeBand: number) {

    let formValue = this.sendForApprovalForm.value;
    let localCurrencyId = this.locationList.filter(v => v.LocID === parseInt(type === 1 ? this.offerAprDt?.JoiningLocationID : formValue['JoiningLocationID']))
    let body = {
      cid: this.data.cid,
      billingRate: this.talentDetails?.IsBillableID == 'Y' && this.talentDetails?.BillingRate != null && this.talentDetails?.BillingRate != 0 ? this.talentDetails?.BillingRate : formValue['billingRateHrCurrency'],
      billingCurrencyId: type === 1 ? this.offerAprDt?.billingCurrencyID : formValue['billingCurrencyId'],
      billableHoursDay: this.talentDetails?.IsBillableID == 'Y' && this.talentDetails?.BillingHours != null && this.talentDetails?.BillingHours != 0 ? this.talentDetails?.BillingHours : formValue['billableHoursDay'],
      projectBuffer: type === 1 ? this.offerAprDt?.projectBufferInPercent : formValue['projectBuffer'],
      NonReimbursableTravelCost: type === 1 ? this.offerAprDt?.nonReimbursableTravelCostUsd : formValue['NonReimbursableTravelCost'],
      projectSpecificCost: type === 1 ? this.offerAprDt?.projectSpecificCostUsd : formValue['projectSpecificCost'],
      JoiningLocationId: type === 1 ? this.offerAprDt?.JoiningLocationID : formValue['JoiningLocationID'],
      cadidateTypeId: type === 1 ? this.offerAprDt?.CandidateTypeID : formValue['CandidateTypeID'],
      annualCTC: type === 1 ? this.offerAprDt?.CTC : formValue['ctc'],
      joiningBonus: type === 1 ? this.offerAprDt?.joiningBonus : formValue['joiningBonus'],
      localCurrencyId: localCurrencyId[0]?.CurrencyId ? localCurrencyId[0]?.CurrencyId : 0,
      gradeId: gradeId,
      GradeBand: GradeBand,
      CubeClusterID: type === 1 ? this.offerAprDt?.CubeClusterID : this.filterCubeList?.ClusterId || 0,
      //  JfCategory: type === 1 ? this.offerAprDt?.JobFamilyCategory : formValue['JfCateg'],
      divisionID: this.divisionID,
      // PracticeId: type === 1 ? this.offerAprDt?.PracticeId : formValue['PracticeId']

      NoticeBuyOut: type === 1 ? this.offerAprDt?.NoticeBuyOut : formValue['NoticeBuyOut'],
      TravelExp: type === 1 ? this.offerAprDt?.TravelExp : formValue['TravelExp'],
      RelocationExp: type === 1 ? this.offerAprDt?.RelocationExp : formValue['RelocationExp'],
      RetentionBonus: type === 1 ? this.offerAprDt?.RetentionBonus : formValue['RetentionBonus'],
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
        this.remaarkValidation();

        this.justificationMethod(this.dgmData);
      }
    )
  }

  /**method to show justification reason for greator varience for median salary */
  public isJustificationVarience: boolean = false;
  justificationMethod(data: any) {

    if (data?.varianceMid > 0) {
      this.isJustificationVarience = true;
      this.getControl('JustificationBucketId').setValidators([Validators.required]);
      // this.getControl('JustificationRemark').setValidators([Validators.required]);
    }
    else {
      this.getControl('JustificationBucketId').reset();
      this.getControl('JustificationBucketId').clearValidators();
      // this.getControl('JustificationRemark').reset();
      //this.getControl('JustificationRemark').clearValidators();
      this.isJustificationVarience = false;
    }
    this.getControl('JustificationBucketId').updateValueAndValidity();
    // this.getControl('JustificationRemark').updateValueAndValidity();
  }

  // DGM calc for NNT
  public monthlyCTCNNT: number;
  public ClientApprovedBilling: number;
  public conversionRate: number;
  public obj = {};
  getDGMCalcValueForNNT() {
    let annualCTC = this.getControl('ctc').value;
    let type = this.getControl('CandidateTypeID').value;
    let conversionRateNew = this.getControl('ConversionRate').value;
    let clientApprovedBillingNew = this.getControl('ClientApprovedBilling').value;
    this.obj = this._commonOfferMet.getDGMCalcValueForNNT(annualCTC, type, conversionRateNew, clientApprovedBillingNew, this.monthlyCTCNNT, this.conversionRate, this.ClientApprovedBilling)

  }

  public dgmDataNNT: any = [];
  getDGMOfferNNT() {
    this._offerService.getDGMOfferNNT(this.data.cid).subscribe(
      res => {
        this.dgmDataNNT = res['data'][0];
        this.monthlyCTCNNT = this.dgmDataNNT?.MonthlyCTC;
        if (this.dgmDataNNT?.ConversionRate != 0) {
          this.conversionRate = this.dgmDataNNT?.ConversionRate;
        }
        if (this.dgmDataNNT?.ClientApprovedBilling != 0) {
          this.ClientApprovedBilling = this.dgmDataNNT?.ClientApprovedBilling;
        }
        this.getDGMCalcValueForNNT();
      }
    )
  }

  // DGM calc for ADT
  public ADTObj = {};
  getDGMCalcValueForADT() {
    let annualCTC = this.getControl('ctc')?.value ? parseInt(this.getControl('ctc')?.value) : 0;
    let revenueVal = this.getControl('Revenue')?.value ? parseInt(this.getControl('Revenue')?.value) : 0;
    let otherHiringCostVal = this.getControl('OtherHiringCost')?.value ? parseInt(this.getControl('OtherHiringCost')?.value) : 0;
    this.ADTObj = this._commonOfferMet.getDGMCalcValueForADT(annualCTC, revenueVal, otherHiringCostVal)

  }

  //restrict initial zero
  restrictInitialZero(e) {
    if (e.target.value.length === 0 && e.key === "0") {
      e.preventDefault();
    }
  }
  /**
   * joining location on changed
   * @param event 
   */
  locChanged(event: any) {
    this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);

  }
  /***
   * Method for input control
   */
  inputValueChangedFunc() {
    //joiningBonus
    this.getControl('joiningBonus').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          if (get) {
            debugger
            this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, get, this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value, this.getControl('RelocationExp').value, this.getControl('RetentionBonus').value);
            this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
          }
          else {
            this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, 0, this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value, this.getControl('RelocationExp').value, this.getControl('RetentionBonus').value);
            this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
          }
        }
      );
    /**notice period buyout */
    this.getControl('NoticeBuyOut').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          if (get) {
            debugger
            this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, this.getControl('joiningBonus').value, get, this.getControl('TravelExp').value, this.getControl('RelocationExp').value, this.getControl('RetentionBonus').value);
            this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
          }
          else {
            this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID,this.getControl('joiningBonus').value, 0, this.getControl('TravelExp').value, this.getControl('RelocationExp').value, this.getControl('RetentionBonus').value);
            this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
          }
        }
      );

    /**TravelExp  */
    this.getControl('TravelExp').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          if (get) {
            debugger
            this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, this.getControl('joiningBonus').value,this.getControl('NoticeBuyOut').value , get, this.getControl('RelocationExp').value, this.getControl('RetentionBonus').value);
            this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
          }
          else {
            this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID,this.getControl('joiningBonus').value,this.getControl('NoticeBuyOut').value, 0, this.getControl('RelocationExp').value, this.getControl('RetentionBonus').value);
            this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
          }
        }
      );
    //end 
    /**Relocation Expenses */
    this.getControl('RelocationExp').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          if (get) {
            debugger
            this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID,  this.getControl('joiningBonus').value,this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value, get, this.getControl('RetentionBonus').value);
            this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
          }
          else {
            this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID,  this.getControl('joiningBonus').value,this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value, 0, this.getControl('RetentionBonus').value);
            this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
          }
        }
      );
    /**Retention Bonus */
    this.getControl('RetentionBonus').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          if (get) {
            debugger
            this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID,  this.getControl('joiningBonus').value,this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value,  this.getControl('RelocationExp').value, get);
            this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
          }
          else {
            this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID,  this.getControl('joiningBonus').value,this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value,  this.getControl('RelocationExp').value,0);
            this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
          }
        }
      );
    // end
    this.getControl('billingRateHrCurrency').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
        }
      )

    this.getControl('projectBuffer').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
        }
      )

    this.getControl('NonReimbursableTravelCost').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
        }
      )

    this.getControl('projectSpecificCost').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
        }
      );
    this.getControl('ConversionRate').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValueForNNT();
        }
      );

    this.getControl('ClientApprovedBilling').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValueForNNT();
        }
      );

    this.getControl('Revenue').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValueForADT();
        }
      );

    this.getControl('OtherHiringCost').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValueForADT();
        }
      );

      this.getControl('OfferInHandCTC').valueChanges.
      pipe(
      //  distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
        //  this.onValueChangeInHand(get);
        }
      );
  }

  public CountryId: number;
  getCountry(e) {
    this.CountryId = e;
  }


  public showSelectedValueOfferBy: boolean = false;
  public SelectedValueOfferBy: string = '';
  public showSelectedValuePMAppr: boolean = false;
  public SelectedValuePMAppr: string = '';
  public showSelectedValueDHAppr: boolean = false;
  public SelectedValueDHAppr: string = '';
  public showSelectedValueSVPAppr: boolean = false;
  public showSelectedValueCDOAppr: boolean = false;
  public SelectedValueSVPAppr: string = '';
  public SelectedValueCDOAppr: string = '';
  public isVisiblePartner: boolean = false;
  public isReqPartner: boolean = false;
  public isReqInHandOf: boolean = false;
  setDefaultValue(data: any) {
    debugger
    let isofferInhand:number = 0;
    let OfferInHandCTC:number = 0
      if (data?.IsOfferInHand == 1) {
         isofferInhand = 1;
         OfferInHandCTC = data?.OfferInHandCTC != null ? data?.OfferInHandCTC : 0;
         this.showOfferInHandCTC(1);
        
         this.isReqInHandOf = true;
         if(data?.OfferInHandFileName){
           this.getControl('fileOffer').clearValidators();
            this.getControl('fileOffer').updateValueAndValidity();
           this.isReqInHandOf = false;
         }
      }
      else if (this.candData?.IsOfferInHandInt == 'Y' && data?.StatusID == null) {
         isofferInhand = 1;
         OfferInHandCTC = this.candData?.OfferInHandCTCInt != null ? this.candData?.OfferInHandCTCInt : 0;
         this.showOfferInHandCTC(1);
         this.isReqInHandOf = true;
      }
      else{
        isofferInhand = 0;
        this.isReqInHandOf = false;
        this.showOfferInHandCTC(0);
      }


    let billableHours: number = this.talentDetails?.BillingHours ? parseInt(this.talentDetails?.BillingHours) : 0;

    this.showSelectedValueOfferBy = true;
    this.showSelectedValuePMAppr = true;
    this.showSelectedValueDHAppr = true;
    this.showSelectedValueSVPAppr = true;
    this.showSelectedValueCDOAppr = true;
    this.SelectedValueOfferBy = this.offerAprDt.OfferID === null ? data.offeredby.Id : data.offeredBy;
    this.SelectedValuePMAppr = data.PM_Approver ? data.PM_Approver : null;
    // this.SelectedValueDHAppr = data.DH_Approver ? data.DH_Approver : null;
    // this.SelectedValueSVPAppr = data.SVPApprover ? data.SVPApprover : null;
    this.CountryId = this.candData?.countryId;
    this.billingCurrencyControl.patchValue(this.candData?.CurrencyId);
    this.data;

    this.sendForApprovalForm.patchValue({
      DesignationId: this.offerAprDt.OfferID === null ? data._designation.Id : data.designationId,
      JobFamilyID: this.offerAprDt.OfferID === null ? null : data.JobFamilyID,
      //gradeId: this.offerAprDt.OfferID === null ? parseInt(this.candData?.gradeIdM?this.candData?.gradeIdM:'0') : data.gradeId,
      gradeBand: this.offerAprDt.OfferID === null ? null : data.gradeBandId,
      ctc: data.CTC,
      variablePay: data?.variablePayId != null ? data?.variablePayId : null,
      RelocationExp: parseInt(data.RelocationExp) ? data.RelocationExp : null,
      TravelExp: parseInt(data.TravelExp) ? data.TravelExp : null,
      joiningBonus: parseInt(data.joiningBonus) ? data.joiningBonus : null,
      NoticeBuyOut: parseInt(data.NoticeBuyOut) ? data.NoticeBuyOut : null,
      RetentionBonus: parseInt(data.RetentionBonus) ? data.RetentionBonus : null,
      TAGLead_Approver: data.PM_Approver ? data.PM_Approver : null,
      TAGHead_Approver: data.TAG_HeadApprover ? data.TAG_HeadApprover : null,
      DH_Approver: data.DH_Approver ? data.DH_Approver : null,
      SVP_Approver: data.SVPApprover ? data.SVPApprover : null,
      // CDO_Approver: data.CDOApprover ? data.CDOApprover : null,
      COO_Approver: data.COOApprover ? data.COOApprover : null,
      JustificationBucketId: data.JustificationBucketId ? data.JustificationBucketId : null,
      //   JustificationRemark: data.JustificationRemark ? data.JustificationRemark : null,
      DateOfJoining: this.offerAprDt.OfferID === null ? new Date(this.candData?.doj) : new Date(data?.DateOfJoining),
      // CandidateTypeID: this.offerAprDt.OfferID === null ? null : data.CandidateTypeID,
      CandidateTypeID: this.offerAprDt.OfferID === null ? (this.data.requirementTypeId == 6 ? 3 : null) : (this.data.requirementTypeId == 6 ? 3 : data.CandidateTypeID),
      SalaryType: this.offerAprDt.OfferID === null ? 1 : data.SalaryType,
      // JoiningLocationID: this.offerAprDt.OfferID === null ? (this.candData?.JoiningLocationId ? this.candData?.JoiningLocationId  : null): data.JoiningLocationID,
      // DivisionID: this.offerAprDt.OfferID === null ? (this.candData?.DivisionIdOffer ? this.candData?.DivisionIdOffer  : null): data.divisionID,
      JoiningLocationID: (this.candData?.JoiningLocationId ? this.candData?.JoiningLocationId : null),
      // DivisionID: (this.candData?.DivisionIdOffer ? this.candData?.DivisionIdOffer  : null),
      billingCurrencyId: this.offerAprDt.OfferID === null ? 2 : data.billingCurrencyID,
      // billingRateHrCurrency: this.offerAprDt.OfferID === null ? this.candData?.billingRateHrCurrency : data.billingRateHrCurrency,
      // billableHoursDay: this.offerAprDt.OfferID === null ?billableHours : data.billableHoursDay,
      projectBuffer: this.offerAprDt.OfferID === null ? null : data.projectBufferInPercent || null,
      NonReimbursableTravelCost: this.offerAprDt.OfferID === null ? null : data.nonReimbursableTravelCostUsd || null,
      projectSpecificCost: this.offerAprDt.OfferID === null ? null : data.projectSpecificCostUsd || null,
      reHire: this.offerAprDt.OfferID === null ? null : data.reHire,
      remarks: this.offerAprDt.OfferID === null ? null : data.Remarks,
      PracticeId: this.offerAprDt.OfferID === null ? null : data.PracticeId == 0 ? data.PracticeId.toString() : data.PracticeId,
      Revenue: this.offerAprDt?.Revenue == null ? null : data?.Revenue,
      OtherHiringCost: this.offerAprDt?.OtherCost == null ? null : data?.OtherCost,
      //  CubeID: this.offerAprDt?.CubeID == null ? this.candData?.CubeID : data?.CubeID
      OfferReleasedFor: data.OfferReleasedFor ? data.OfferReleasedFor : null,

      IsOfferInHand: isofferInhand,
      OfferInHandCTC: OfferInHandCTC ? OfferInHandCTC : null,
    }, { emitEvent: false });

    this.minDateEnd = this.offerAprDt.OfferID === null ? new Date(this.candData?.doj) : new Date(data?.DateOfJoining);
    //contract to hire
    if (data.CandidateTypeID == 2) {
      let PartnerID = this.getControl('PartnerID');
      let ContractCompletionDate = this.getControl('ContractCompletionDate');
      let ServiceAndMarkup = this.getControl('ServiceAndMarkup');
      this.isVisiblePartner = true;
      this.isReqPartner = true;
      PartnerID.setValidators([Validators.required]);
      ContractCompletionDate.setValidators([Validators.required]);
      ServiceAndMarkup.setValidators([Validators.required]);
      PartnerID.patchValue(data?.PartnerID);
      ContractCompletionDate.patchValue(new Date(data?.ContractCompletionDate));
      ServiceAndMarkup.patchValue(data?.ServiceAndMarkup)
    }
    // independent freelancer
    if (data.CandidateTypeID == 6 || data.CandidateTypeID == 1) {
      let lwdDate = this.getControl('lwdDate');
      this.isLwdDate = true;
      this.isReqLwdDate = true;
      lwdDate.setValidators([Validators.required]);
      lwdDate.patchValue(new Date(data?.ContractCompletionDate));
      lwdDate.updateValueAndValidity();
    }
    //if development 
    // if (data.JobFamilyID === 4 && data.PracticeId == 0) {
    //   this.jfCategHide = true;
    //   this.getControl('JfCateg').patchValue(data.JobFamilyCategory);
    // }

    // if(this.employmentTypeId == 3 || this.getControl('CandidateTypeID').value == 3){
    //this.getVariablePayList(data?.cid, data?.CubeID, data?.gradeId);
   // this.variablePayHideShow(data?.gradeId);
    this.getControl('variablePay').patchValue(data?.variablePayPercent)
    this.getVariableDetailsByGrade(data?.gradeId);
    // }
    //this.showOfferInHandCTC(data?.IsOfferInHand);
    setTimeout(() => {

      this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, this.getControl('CubeID').value, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, this.getControl('joiningBonus').value, this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value, this.getControl('RelocationExp').value, this.getControl('RetentionBonus').value);
      this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);

    }, 500);
  }
  /***
   * get Designation Id
   */
  getDesignation(e: string) {
    this.getControl('gradeId').patchValue(parseInt(e));
    this.getGradeBand(parseInt(e));
  }
  /*
  get control Method*/
  getControl(name: string) {
    return this.sendForApprovalForm.get(name);
  }

  /***
* change date joining
*/
  changeDate(type: string, event: any) {
    this.minDateEnd = new Date(event.value);
    let CandidateTypeID = this.getControl('CandidateTypeID').value;
    let ContractCompletionDate = this.getControl('ContractCompletionDate').value;
    if (CandidateTypeID == 2) {
      ContractCompletionDate = this.getControl('ContractCompletionDate').value;
    }
    else if (CandidateTypeID == 6 || CandidateTypeID == 1) {
      ContractCompletionDate = this.getControl('lwdDate').value;
    }
    let joiningdate = new Date(event.value);
    this.showhideJustificstionDuration6MonthAbove(CandidateTypeID, joiningdate, ContractCompletionDate);
  }

  /***
* change date
*/
  changeDateCompletion(type: string, event: any) {
    let CandidateTypeID = this.getControl('CandidateTypeID').value;
    let joiningdate = this.getControl('DateOfJoining').value;
    let ContractCompletionDate = new Date(event.value);
    this.showhideJustificstionDuration6MonthAbove(CandidateTypeID, joiningdate, ContractCompletionDate);
  }

  /***
   * hide show contract extended 6month above
   */
  public isContractLimitExtend: boolean = false;
  public durationContract: any = {};
  showhideJustificstionDuration6MonthAbove(CandidateTypeID: number, joiningdate: any, ContractCompletionDate: any) {
    if (joiningdate && ContractCompletionDate) {
      this.durationContract = this.calculateDuration(joiningdate, ContractCompletionDate);

      if (CandidateTypeID == 2 || CandidateTypeID == 6 || CandidateTypeID == 1) {
        // Create a new date that is 6 months after the joining date
        let sixMonthsAfterJoiningDate = new Date(joiningdate);
        sixMonthsAfterJoiningDate.setMonth(joiningdate.getMonth() + 6);

        // Check if the contract completion date is greater than 6 months after the joining date
        if (ContractCompletionDate && new Date(ContractCompletionDate) > sixMonthsAfterJoiningDate) {
          this.isContractLimitExtend = true;
          this.getControl('ContractExtensionRemarks').setValidators([Validators.required]);
        } else {
          this.getControl('ContractExtensionRemarks').reset();
          this.getControl('ContractExtensionRemarks').clearValidators();
          this.isContractLimitExtend = false;
        }

      }
      else {
        this.getControl('ContractExtensionRemarks').reset();
        this.getControl('ContractExtensionRemarks').clearValidators();
        this.isContractLimitExtend = false;
      }
    }
    else {
      this.getControl('ContractExtensionRemarks').reset();
      this.getControl('ContractExtensionRemarks').clearValidators();
      this.isContractLimitExtend = false;
    }
    this.getControl('ContractExtensionRemarks').updateValueAndValidity();
  }

  calculateDuration(startDate: Date, endDate: Date) {
    const oneDay = 1000 * 60 * 60 * 24; // milliseconds in one day
    // Subtract the start date from the end date and divide by the number of milliseconds in one day
    const days = Math.floor((endDate.getTime() - startDate.getTime()) / oneDay);

    return days;
  }
  public isLwdDate: boolean = false;
  public isReqLwdDate: boolean = false;
  public employmentTypeId: number;
  getCandidateTypeId(e: any) {
    let id = e.value;

    this.employmentTypeId = e.value;

    let PartnerID = this.getControl('PartnerID');
    let ContractCompletionDate = this.getControl('ContractCompletionDate');
    let ServiceAndMarkup = this.getControl('ServiceAndMarkup');
    let lwdDate = this.getControl('lwdDate');
    ContractCompletionDate.reset();
    lwdDate.reset();
    //Contract to hire
    if (id === 2) {
      this.isVisiblePartner = true;
      this.isReqPartner = true;
      PartnerID.setValidators([Validators.required]);
      ContractCompletionDate.setValidators([Validators.required]);
      ServiceAndMarkup.setValidators([Validators.required]);
      lwdDate.clearValidators();
      this.isLwdDate = false;
      this.isReqLwdDate = false;
    }
    //Independent Consultant(freelancer)/Contracter
    else if (id === 6 || id === 1) {
      this.isVisiblePartner = false;
      this.isReqPartner = false;
      PartnerID.clearValidators();
      ContractCompletionDate.clearValidators();
      ServiceAndMarkup.clearValidators();
      this.isLwdDate = true;
      this.isReqLwdDate = true;
      lwdDate.setValidators([Validators.required]);
      // if(id===1){
      //   this.hideVandOtherContract(id);
      // }
    }
    else {
      this.isVisiblePartner = false;
      this.isReqPartner = false;
      this.isLwdDate = false;
      this.isReqLwdDate = false;
      PartnerID.clearValidators();
      ContractCompletionDate.clearValidators();
      ServiceAndMarkup.clearValidators();
      lwdDate.clearValidators();
      // this.isVariablePay = true;
      // this.getControl('variablePay')?.addValidators([Validators.required]);

    }

    PartnerID.updateValueAndValidity();
    ContractCompletionDate.updateValueAndValidity();
    ServiceAndMarkup.updateValueAndValidity();
    lwdDate.updateValueAndValidity();

    this.getApproverCont(this.getControl('gradeId').value || 0, this.getControl('gradeBand').value || 0, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, e.value, this.divisionID, this.getControl('joiningBonus').value, this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value , this.getControl('RelocationExp').value , this.getControl('RetentionBonus').value);
    // if(this.isNNT){
    //   //this.getDGMCalcValueForNNT();
    //  // this.getApproverCont(this.getControl('gradeId').value || 0, this.getControl('gradeBand').value || 0, this.getControl('ctc').value, this.getControl('JobFamilyID').value || 0, this.candData.totalExpYear, this.candData.totalExpMonth, e.value, this.divisionID,this.getControl('joiningBonus').value);
    // }

    this.hideVandOtherContract(id);
    this.variablePayHideShow(null);


    this.showhideJustificstionDuration6MonthAbove(id, null, null);
    this.getVariableDetailsByGrade(this.getControl('gradeId').value);
  }



  /**
   * get Grade Id
   * @param e 
   */
  public isG4AndAbove: boolean = false;
  public isVariablePay: boolean = false;
  getGradeId(e): void {
    this.getApproverCont(e.value, this.getControl('gradeBand').value || 0, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, this.getControl('joiningBonus').value, this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value , this.getControl('RelocationExp').value , this.getControl('RetentionBonus').value);
    this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value || 0);
    this.getGradeBand(e.value);
    this.getRoleByTalentCube(this.getControl('CubeID').value, e.value);
    let gradeId = e.value;

    // if(this.employmentTypeId == 3 || this.getControl('CandidateTypeID').value == 3){
   // this.getVariablePayList(this.data.cid, this.getControl('CubeID').value, gradeId);
    //this.variablePayHideShow(gradeId);
    this.variablePayList = [];
    this.getControl('variablePay').reset();
    //  }
    //this.getVariablePayList(this.data.cid, this.getControl('CubeID').value, gradeId);
    this.getVariableDetailsByGrade(gradeId);

  }

  /**to hide show variable pay on grade 4 and above */
  variablePayHideShow(grade: number) {

    this.isG4AndAbove = this._commonMethodServe.validationGradeAboveG4AndAbove(grade ? grade : this.getControl('gradeId').value);
    if (this.employmentTypeId == 3 || this.getControl('CandidateTypeID').value == 3) {
      if (this.isG4AndAbove) {
        this.isVariablePay = true;
        this.getControl('variablePay')?.addValidators([Validators.required]);
      } else {
        this.getControl('variablePay')?.reset();
        this.getControl('variablePay')?.clearValidators();
        this.isVariablePay = false;
      }

    } else {
      this.getControl('variablePay')?.reset();
      this.getControl('variablePay')?.clearValidators();
      this.isVariablePay = false;
    }
    this.getControl('variablePay')?.updateValueAndValidity();
  }
  getGradeBandId(e: any) {
    this.getApproverCont(this.getControl('gradeId').value || 0, e.value, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, this.getControl('joiningBonus').value, this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value , this.getControl('RelocationExp').value , this.getControl('RetentionBonus').value);
    if (this.divisionID == 1) {
      // this.getApproverCont(this.getControl('gradeId').value || 0, e.value, this.getControl('ctc').value, this.getControl('JobFamilyID').value || 0, this.candData.totalExpYear, this.candData.totalExpMonth, this.getControl('CandidateTypeID').value,this.divisionID, this.getControl('joiningBonus').value);
      this.getDGMCalcValue(0, this.getControl('gradeId').value, e.value);
    }
  }


  /**
   * get job Family Id
   * @param e 
   */
  public jfCategHide: boolean = false;
  public jfCategReq: boolean = false;
  getJobFamilyId(e): any {
    this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, e.value, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, this.getControl('joiningBonus').value, this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value , this.getControl('RelocationExp').value , this.getControl('RetentionBonus').value);
    this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
    let practiceId = this.getControl('PracticeId').value;
    if (e.value === 4 && practiceId == 0) {
      this.jfCategHide = true;
      this.jfCategReq = true;
      this.getControl('JfCateg').setValidators([Validators.required]);
    }
    else {
      this.jfCategReq = false;
      this.jfCategHide = false;
      this.getControl('JfCateg').clearValidators();
      this.getControl('JfCateg').reset();
    }

    this.getControl('JfCateg').updateValueAndValidity();

  }

  /**
   * 
   * @param e get Cub Cluster Id
   */
  public filterCubeList: any = {};
  getCubeClusterID(e): any {
    this.filterCubeList = this.talentCubeList.filter(r => r.CubeId == e.value)[0];
    this.getRoleByTalentCube(e.value, this.getControl('gradeId').value);
    this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, e.value, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, this.getControl('joiningBonus').value, this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value , this.getControl('RelocationExp').value , this.getControl('RetentionBonus').value);
    this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);

    // this.variablePayHideShow(0);
    //this.getVariablePayList(this.data.cid, this.getControl('CubeID').value, this.getControl('gradeId').value);
    this.variablePayList = [];
    this.getControl('variablePay').reset();
  }

  getJfCateg(e: any) {
    this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
    this.getApproverCont(this.getControl('gradeId').value || 0, this.getControl('gradeBand').value || 0, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, this.getControl('joiningBonus').value, this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value , this.getControl('RelocationExp').value , this.getControl('RetentionBonus').value);

  }
  /***
   * practice change
   */
  getpracticeId(e: any) {
    this.getControl('JobFamilyID').reset();
    if (e.value == 0) {
      this.jfCategReq = true;
      this.jfCategHide = true;
      this.getControl('JfCateg').setValidators([Validators.required]);
    }
    else {
      this.jfCategReq = false;
      this.jfCategHide = false;
      this.getControl('JfCateg').clearValidators();
      this.getControl('JfCateg').reset();
    }
    this.getControl('JfCateg').updateValueAndValidity();

    this.getApproverCont(this.getControl('gradeId').value || 0, this.getControl('gradeBand').value || 0, this.getControl('ctc').value, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, this.getControl('joiningBonus').value, this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value , this.getControl('RelocationExp').value , this.getControl('RetentionBonus').value);
    this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
    // this.getjobFamily(e.value);
  }

  /***
   * get CTC
   */
  getCTC() {
    this.getControl('ctc').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, get, this.getControl('CubeID').value || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID, this.getControl('joiningBonus').value, this.getControl('NoticeBuyOut').value, this.getControl('TravelExp').value , this.getControl('RelocationExp').value , this.getControl('RetentionBonus').value);
          this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
        }
      )

    // this.getControl('joiningBonus').valueChanges.
    // pipe(
    //   distinctUntilChanged(),
    //   debounceTime(500)
    // ).subscribe(
    //   get => {

    //     if(get && this.getControl('gradeId').valid){
    //       this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, this.getControl('JobFamilyID').value || 0, this.candData.totalExpYear, this.candData.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID,get);            
    //       this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
    //     }
    //   }
    // )
  }
  /***
   * get ApproverList
   */

  public DPApproverList: any = [];
  public GDLApproverList: any = [];
  public CDOApproverList: any = [];
  public COOLApproverList: any = [];
  getAllApproverList() {
    let userEmp = this._storage.getUserEmpId();
    let data = {
      empId: parseInt(userEmp),
      Division: this.divisionID,
      cid: this.data.cid,
      ReqTypeId: this.candData?.RequirementTypeId
    }

    forkJoin([
      this._globalApiServe.getApproverList(data.empId, 1, data.Division, data.cid, data.ReqTypeId),
      this._globalApiServe.getApproverList(data.empId, 2, data.Division, data.cid, data.ReqTypeId),
      this._globalApiServe.getApproverList(data.empId, 3, data.Division, data.cid, data.ReqTypeId),
      this._globalApiServe.getApproverList(data.empId, 7, data.Division, data.cid, data.ReqTypeId),
    ]).subscribe(
      res => {
        this.DPApproverList = res[0]['data'];
        this.GDLApproverList = res[1]['data'];
        this.COOLApproverList = res[2]['data'];
        this.CDOApproverList = res[3]['data'];
        this.getApproverCont(this.offerAprDt.gradeId, this.offerAprDt.gradeBandId, this.offerAprDt.CTC, this.offerAprDt?.talentCubeId || 0, this.candData?.totalExpYear, this.candData?.totalExpMonth, this.offerAprDt.CandidateTypeID, this.divisionID, this.offerAprDt.joiningBonus, this.offerAprDt?.NoticeBuyOut, this.offerAprDt?.TravelExp , this.offerAprDt?.RelocationExp , this.offerAprDt?.RetentionBonus , true);
      }
    )
  }
  /***
   * get Approver Count
   */
  public gradeID: number;
  public ctc: number;
  public isTag_ApproverReq: boolean = false;
  public isTag_ApproverShow: boolean = false;
  public isDH_ApproverReq: boolean = false;
  public isDH_ApproverShow: boolean = false;
  public isSvp_ApproverReq: boolean = false;
  public isSvp_ApproverShow: boolean = false;
  public isCDO_ApproverShow: boolean = false;
  public isPresidentCOOApprShow: boolean = false;
  public approverMsgMissing: string = '';
  public approverLength: number = 0;
  public aprvCountDataList: any = [];
  getApproverCont(gradeID: number, gradeBand: number, ctc: number, cubeID: number, ExpYear: number, ExpMonth: number, CandidateTypeID: string, divisionID: number, joiningBonus: number = 0, NoticeBuyOut: number = 0, TravelExp: number = 0, RelocationExp: number = 0, RetentionBonus: number = 0, isLoad: boolean = false) {
    let DH_Approver = this.getControl('DH_Approver');
    let SVP_Approver = this.getControl('SVP_Approver');
    //  let CDO_Approver = this.getControl('CDO_Approver');
    let COO_Approver = this.getControl('COO_Approver');
    let JFCategory = this.getControl('JfCateg').value;
    let GradeLevelAboveG4 = this._commonMethodServe.validationGradeAboveG4AndAbove(this.getControl('gradeId').value);
    // let GradeLevelAboveG4 = this.gradeList?.filter(r => r.GRADE_ID == this.getControl('gradeId')?.value)[0]?.Grade_Level;
    //let CandidateTypeID = this.getControl('CandidateTypeID').value;
    joiningBonus = joiningBonus == null ? 0 : joiningBonus;

     NoticeBuyOut = NoticeBuyOut == null ? 0 : NoticeBuyOut;
     TravelExp = TravelExp == null ? 0 : TravelExp;
     RelocationExp = RelocationExp == null ? 0 : RelocationExp;
     RetentionBonus = RetentionBonus == null ? 0 : RetentionBonus;

    let PracticeId: number = 0;
    if (isLoad) {
      PracticeId = this.offerAprDt?.PracticeId;
    }
    else {
      PracticeId = this.getControl('PracticeId').value;
    }
    this._offerService.getApprovalCount(gradeID, gradeBand, ctc, this.filterCubeList?.ClusterId || 0, ExpYear, ExpMonth, JFCategory, CandidateTypeID, divisionID, joiningBonus, NoticeBuyOut, TravelExp, RelocationExp, RetentionBonus, this.candData?.RequirementTypeId, PracticeId, this.data?.cid, this.candData?.RequirementTypeId).subscribe
      (
        res => {
          let data = res['data'][0];
          this.aprvCountDataList = data;
          this.approverMsgMissing = '';
          this.approverLength = data.NumberOfApprover;
          if (data.NumberOfApprover === 0) {
            DH_Approver.clearValidators();
            SVP_Approver.clearValidators();
            //  CDO_Approver.clearValidators();
            COO_Approver.clearValidators();
            DH_Approver.reset();
            SVP_Approver.reset();
            //  CDO_Approver.reset();
            COO_Approver.reset()
            this.isTag_ApproverShow = false;
            this.isDH_ApproverShow = false;
            this.isSvp_ApproverShow = false;
            this.isCDO_ApproverShow = false;
            this.isPresidentCOOApprShow = false;
            this.approverMsgMissing = data.Msg;
            this._share.showAlertErrorMessage.next(data.Msg)
          }
          else {
            if (data.NumberOfApprover === 1) {
              this.isTag_ApproverShow = true;
              DH_Approver.clearValidators();
              SVP_Approver.clearValidators();
              // CDO_Approver.clearValidators();
              COO_Approver.clearValidators();
              DH_Approver.reset();
              SVP_Approver.reset();
              // CDO_Approver.reset();
              COO_Approver.reset();
              this.isDH_ApproverShow = false;
              this.isCDO_ApproverShow = false;
              this.isPresidentCOOApprShow = false;
              if (data?.isReplaceReq === 1) {
                this.isSvp_ApproverShow = true;
              }
              else {
                this.isSvp_ApproverShow = false;
              }
            }
            else if (data.NumberOfApprover === 2) {
              this.isTag_ApproverShow = true;
              this.isDH_ApproverShow = true;
              this.isCDO_ApproverShow = false;
              this.isPresidentCOOApprShow = false;
              SVP_Approver.clearValidators();
              SVP_Approver.reset();
              //    CDO_Approver.clearValidators();
              //   CDO_Approver.reset();
              COO_Approver.clearValidators();
              COO_Approver.reset();
              if (data?.isReplaceReq === 1) {
                this.isSvp_ApproverShow = true;
              }
              else {
                this.isSvp_ApproverShow = false;
              }

              setTimeout(() => {
                DH_Approver.patchValue(this.DPApproverList[0]?.empnewid);
              }, 1000);
            }

            else if (data.NumberOfApprover === 3) {

              this.isTag_ApproverShow = true;
              this.isDH_ApproverShow = true;
              this.isSvp_ApproverShow = true;
              //    CDO_Approver.clearValidators();
              //   CDO_Approver.reset();
              COO_Approver.clearValidators();
              COO_Approver.reset();
              this.isPresidentCOOApprShow = false;
              this.isCDO_ApproverShow = false;
              setTimeout(() => {
                DH_Approver.patchValue(this.DPApproverList[0]?.empnewid);
                SVP_Approver.patchValue(this.GDLApproverList[0]?.empnewid);
              }, 1000);
            }
            else if (data.NumberOfApprover === 4) {
              if (GradeLevelAboveG4) {
                this.isTag_ApproverShow = true;
                this.isDH_ApproverShow = true;
                this.isSvp_ApproverShow = true;
                this.isCDO_ApproverShow = true;
                COO_Approver.clearValidators();
                COO_Approver.reset();
                this.isPresidentCOOApprShow = false;
                setTimeout(() => {
                  DH_Approver.patchValue(this.DPApproverList[0]?.empnewid);
                  SVP_Approver.patchValue(this.GDLApproverList[0]?.empnewid);
                  // CDO_Approver.patchValue(this.CDOApproverList[0]?.empnewid);
                }, 1000);
              } else {
                this.isTag_ApproverShow = true;
                this.isDH_ApproverShow = true;
                this.isSvp_ApproverShow = true;
                this.isPresidentCOOApprShow = true;
                // CDO_Approver.clearValidators();
                // CDO_Approver.reset();
                this.isCDO_ApproverShow = false;
                setTimeout(() => {
                  DH_Approver.patchValue(this.DPApproverList[0]?.empnewid);
                  SVP_Approver.patchValue(this.GDLApproverList[0]?.empnewid);
                }, 1000);
              }
            }
            DH_Approver.updateValueAndValidity();
            SVP_Approver.updateValueAndValidity();
            // CDO_Approver.updateValueAndValidity();
            COO_Approver.updateValueAndValidity();
          }
        }
      )
  }




  //submit sendapproval
  sendApprovalSubmit(form: UntypedFormGroup, action: string) {
    form.markAllAsTouched();
    this.getControl('billingRateHrCurrency').markAsTouched();
    this.getControl('billableHoursDay').markAsTouched();

    if (!this.filterCubeList?.ClusterId) {
      this._share.showAlertErrorMessage.next('Cluster not found.');
      return
    }
    if (!this.RoleTalentCube?.RoleId) {
      this._share.showAlertErrorMessage.next('Role not found.');
      return
    }
    if (form.valid) {

      let empId = this._storage.getUserEmpId();
      let formValue = form.value;

      // formValue['DivisionID'] = this.divisionID;
      formValue['cid'] = this.data.cid;
      formValue['OfferID'] = this.offerAprDt.OfferID === null ? 0 : this.offerAprDt.OfferID;
      formValue['Action'] = action;
      formValue['offerGivenBy'] = empId;
      if (formValue['DateOfJoining']) {
        formValue['DateOfJoining'] = GlobalMethod.formatDate(formValue['DateOfJoining']);
      }
      if (formValue['ContractCompletionDate']) {
        formValue['ContractCompletionDate'] = GlobalMethod.formatDate(formValue['ContractCompletionDate']);
      }

      if (formValue['lwdDate']) {
        formValue['ContractCompletionDate'] = GlobalMethod.formatDate(formValue['lwdDate']);
      }
      if (
        this.offerAprDt.StatusID === 20 ||
        this.offerAprDt.StatusID === 25 ||
        this.offerAprDt.StatusID === 40 ||
        this.offerAprDt.StatusID === 45 ||
        this.offerAprDt.StatusID === 60 ||
        this.offerAprDt.StatusID === 65 ||
        this.offerAprDt.StatusID === 80 ||

        this.offerAprDt.StatusID === 30 ||
        this.offerAprDt.StatusID === 35 ||
        this.offerAprDt.StatusID === 50 ||
        this.offerAprDt.StatusID === 55 ||
        this.offerAprDt.StatusID === 70 ||
        this.offerAprDt.StatusID === 75 ||
        this.offerAprDt.StatusID === 90 ||

        this.offerAprDt.StatusID === 120 ||
        this.offerAprDt.StatusID === 140 ||
        this.offerAprDt.StatusID === 180 ||
        this.offerAprDt.StatusID === 160 ||
        this.offerAprDt.StatusID === 100 ||
        this.offerAprDt.StatusID === 220) {
        formValue['IsRevisedOffer'] = 'Y';
      }
      if (this.offerAprDt.StatusID === 270) {
        formValue['IsReinitiate'] = 'Y';
      }
      if (formValue['RelocationExp'] == '') {
        formValue['RelocationExp'] = null;
      }
      if (formValue['RetentionBonus'] == '') {
        formValue['RetentionBonus'] = null;
      }
      if (formValue['TravelExp'] == '') {
        formValue['TravelExp'] = null;
      }
      if (formValue['NoticeBuyOut'] == '') {
        formValue['NoticeBuyOut'] = null;
      }
      if (formValue['joiningBonus'] == '') {
        formValue['joiningBonus'] = null;
      }
      if (this.talentDetails?.IsBillableID == 'Y' && this.talentDetails?.BillingRate != null && this.talentDetails?.BillingRate != 0) {
        formValue['billingRateHrCurrency'] = this.talentDetails?.BillingRate;
      } else {
        formValue['billingRateHrCurrency'] = formValue['billingRateHrCurrency'];
      }
      if (this.talentDetails?.IsBillableID == 'Y' && this.talentDetails?.BillingHours != null && this.talentDetails?.BillingHours != 0) {
        formValue['billableHoursDay'] = this.talentDetails?.BillingHours;
      } else {
        formValue['billableHoursDay'] = formValue['billableHoursDay'];
      }
      if (this.dgmData['BillingRateHr']) {
        formValue['billingRateHrInUSD'] = this.dgmData['BillingRateHr'];
      }
      if (this.dgmData['AnnualBillableHours']) {
        formValue['annualBillableHours'] = this.dgmData['AnnualBillableHours'];
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

      let FieldIDs = formValue?.FieldIDs;
      formValue['FieldIDs'] = '';
      if (FieldIDs && FieldIDs.length != 0) {
        // let FieldIDsOp = formValue?.FieldIDs.filter(n => n);;
        formValue['FieldIDs'] = FieldIDs.toString();
      }
      // dgm data for NNT
      //   formValue['BillingAmountInUSD'] = this.obj['convertedCTC'];
      // }
      // if (this.obj['DGM']) {
      //   formValue['DGMPer'] = this.obj['DGM'];
      // }
      // if (this.dgmData['remarks']) {
      //   formValue['remarks'] = this.dgmData['remarks'];
      // }

      // dgm data for ADT
      //  if(this.isADT){
      //   if (formValue['Revenue']) {
      //     formValue['Revenue'] = formValue['Revenue'];
      //   }
      //   if (formValue['OtherHiringCost']) {
      //     formValue['OtherCost'] = formValue['OtherHiringCost'];
      //   }
      //   if (this.ADTObj['ADTDGM']) {
      //     formValue['DGMAmount'] = this.ADTObj['ADTDGM'];
      //   }
      //   if (this.ADTObj['ADTDGMPer']) {
      //     formValue['DGMPer'] = this.ADTObj['ADTDGMPer'];
      //   }
      // }
      if (this.filterCubeList?.ClusterId) {
        formValue['CubeClusterID'] = this.filterCubeList?.ClusterId;
      }
      if (this.RoleTalentCube?.RoleId) {
        formValue['CubeRoleID'] = this.RoleTalentCube?.RoleId;
      }
        formValue['isConsentInHandCTCDoc'] = formValue['isConsentInHandCTCDoc']?1:0;
      
      

      this._offerService.addUpdateOfferApproval(formValue).subscribe(
        res => {
          let formData = new FormData();
          let formDataInHand = new FormData();
          debugger
          if(this.offerInhandDocs?.length != 0 && this.allFilesBGV.length != 0) {
            formData.append('cid', this.data.cid);
            formData.append('ActionTakenBy', 'R');
            formData.append('ActionID', res.ActionID);
            for (let i = 0; i < this.allFilesBGV.length; i++) {
              formData.append('File', this.allFiles[i]);
            }
              formDataInHand.append('cid', this.data.cid);
            for (let i = 0; i < this.offerInhandDocs.length; i++) {
              formDataInHand.append('File', this.offerInhandDocs[i]);
            }
            forkJoin([
              this._offerService.uploadDocumnetByRecApprover(formData),
              this._offerService.uplaodOfferInHandDocument(formDataInHand),
            ]).subscribe({
              next: ([res1, res2]) => {
                this._share.showAlertSuccessMessage.next(res.Message);
                this.dialogRef.close(true);
              }
            });
          }
          else if (this.allFilesBGV.length != 0) {
            formData.append('cid', this.data.cid);
            formData.append('ActionTakenBy', 'R');
            formData.append('ActionID', res.ActionID);
            for (let i = 0; i < this.allFilesBGV.length; i++) {
              formData.append('File', this.allFiles[i]);
            }
            this._offerService.uploadDocumnetByRecApprover(formData).subscribe(
              doc => {
                this._share.showAlertSuccessMessage.next(res.Message);
                this.dialogRef.close(true);
              }
            )

          }
          else if(this.offerInhandDocs?.length != 0) {
            formDataInHand.append('cid', this.data.cid);
            for (let i = 0; i < this.offerInhandDocs.length; i++) {
              formDataInHand.append('File', this.offerInhandDocs[i]);
            }
              this._offerService.uplaodOfferInHandDocument(formDataInHand).subscribe(
              doc => {
                this._share.showAlertSuccessMessage.next(res.Message);
                this.dialogRef.close(true);
              }
            )
           
          }
           else {
            this._share.showAlertSuccessMessage.next(res.Message);
            this.dialogRef.close(true);
          }

        }
      )
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  /**
  * show interview round details
  * @param data 
  */
  openfeedbackInfoModal(data: any) {
    const dialogRef = this.dialog.open(FeedbackRoundDetailsComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }


}
