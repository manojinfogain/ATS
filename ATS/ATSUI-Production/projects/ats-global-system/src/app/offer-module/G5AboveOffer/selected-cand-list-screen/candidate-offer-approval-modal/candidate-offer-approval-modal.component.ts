import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { forkJoin, pipe } from 'rxjs';
import { OfferService } from '../../../offer.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { AtsOfferCommonMethodService } from 'projects/ats-global-system/src/app/core/common/ats-offer-common-method.service';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { FILE_UPLOAD } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { G5OfferService } from '../../g5-offer.service';
import { G5AboveApproverNameList, SarList, VariablePayPercentage, VarpayCommitmentList } from 'projects/ats-global-system/src/app/core/constant/g5Above.const';
import { G5AboveCpmmon } from 'projects/ats-global-system/src/app/core/common/g5AboveCommon';
import { AddApproverDailogComponent } from '../../dialog/add-approver-dailog/add-approver-dailog.component';
@Component({
  selector: 'app-candidate-offer-approval-modal',
  templateUrl: './candidate-offer-approval-modal.component.html',
  styleUrls: ['./candidate-offer-approval-modal.component.scss']
})
export class CandidateOfferApprovalModalComponent implements OnInit {
  public sendForApprovalForm: UntypedFormGroup = new UntypedFormGroup({});
  public isVisiblePartner: boolean = false;
  public minDateEnd: any = new Date();
  public salaryTypeList: any = CONSTANTS.salaryType;
  public RehireList: any = CONSTANTS.RehireList;
  constructor(
    public dialogRef: MatDialogRef<CandidateOfferApprovalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _interviewStatus: InterviewStatusService,
    private _globalApi: GlobalApisService,
    private _offerService: OfferService,
    private _offerG5Serve: G5OfferService,
    private _globalApiServe: GlobalApisService,
    private _share: ShareService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _commonOfferMet: AtsOfferCommonMethodService
  ) { }

  ngOnInit(): void {
    // form Init
    this.sendApprovalForm();
    this.getAllApiMaster();
    this.getCandidateDetails();
  }

  /***
   * get variable pay percentage
   */
  getVariablePayPercentFunc(gradeId: number,cid: number,cubeId: number) {
    
    this._offerG5Serve.getVariablePayPercentageMaster(gradeId,cid,cubeId).subscribe(
      res => {
        this.variablePayPercentage = res['data'];
      }
    )
  }
  public talentCubeList: any = [];
  public currencyTypeData: any = [];
  public locationList: any = [];
  public contactList: any = [];
  public gradeList: any = [];
  public divisionList: any = [];
  public tagHeadList: any = [];
  // public sarList: any = SarList;
  public varpayCommitmentList: any = VarpayCommitmentList;
  public searchInputTC: string = '';
  public searchInputGrade: string;
  public searchInputCoo: string = '';
  public searchInputDH: string = '';
  public searchInputFH: string = '';
  public tagHeadLevelApproverList: any = [];
  public funcHeadLevelApproverList: any = [];
  public COOLevelApproverList: any = [];
  getAllApiMaster() {
    forkJoin([
      this._globalApiServe.getTalentCubeList(),
      this._globalApi.GetCurrencyList(),
      this._globalApiServe.getLocationList(),
      this._globalApiServe.GetContractTypes(),
      this._offerG5Serve.getGradeList(),
      this._globalApiServe.getDivisionList(),
      this._offerG5Serve.getG5AboveApproverList(),
     // this._offerG5Serve.getVariablePayPercentageMaster()
    ]).subscribe(
      res => {
        this.talentCubeList = res[0]['data'];
        this.currencyTypeData = res[1]['data'];
        this.locationList = res[2]['data'];
        let contactList = res[3]['data'];
        this.gradeList = res[4]['data'];
        this.divisionList = res[5]['data'];
        this.tagHeadLevelApproverList = res[6]['TagHeadLevel'];
        this.funcHeadLevelApproverList = res[6]['FuncHeadLevel'];
        this.COOLevelApproverList = res[6]['COOLevel'];
       // this.variablePayPercentage = res[7]['data'];

        /**
         * filter contract list
         */
        let filterById = [1, 2, 3, 6]
        let filterByStatus = contactList.filter(t => {
          return filterById.indexOf(t.ID) !== -1;
        });
        this.contactList = filterByStatus;

        /**
         * search inputfvz
         */
        this.FilterCtrlTC.valueChanges.subscribe(
          val => {
            this.searchInputTC = val;
          }
        );
        this.FilterCtrlGrade.valueChanges.subscribe(
          val => {
            this.searchInputGrade = val;
          }
        );
        this.FilterCtrlCoo.valueChanges.subscribe(
          val => {
            this.searchInputCoo = val;
          }
        );
        this.FilterCtrlDH.valueChanges.subscribe(
          val => {
            this.searchInputDH = val;
          }
        );
        this.FilterCtrlFH.valueChanges.subscribe(
          val => {
            this.searchInputFH = val;
          }
        );
      }
    )
  }

  public gradeBandList: any = [];
  getGradeBand(id: number) {
    this._globalApiServe.getGradeBandList(id).subscribe(
      res => {
        this.gradeBandList = res['data']
      }
    );
  }

  /**
   * 
   * @param existApprover 
   */
  openDialogApprover(existApprover:any = []): void {
    let data:any = {}
    data['approver']= this.getExistApproverList();
    const dialogRef = this.dialog.open(AddApproverDailogComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap','ats-add-aprover-modal'],
      data: data,
   //   disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        
       // this.getSelectedApprover(result);
        this.approverHideShow(result);
      }
    })
  }
  

  public offerAprDt: any = [];
  public allRoundList: any = [];
  public candData: any = [];
  public selectedList: any = [];
  getCandidateDetails() {
    forkJoin([
      this._interviewStatus.getCandidateDetails(this.data.cid),
      this._offerService.getSelectedCandidateDetails(this.data.cid),
      this._offerService.getCandidateOfferAprDetails(this.data.cid),
      this._offerService.getOfferApprovalAttachaments(`cid=${this.data.cid}&ActionTakenBy=R`)
    ]).subscribe(
      res => {
        this.allRoundList = res[0];
        this.candData = res[1]['data'][0];
        this.offerAprDt = res[2]['data'][0];
        this.previewFileExist(res[3]['data']);
        this.selectedList = this.allRoundList.roundList.filter(d => d?.interviewType?.Id === 4 && d?.InterViewStatus?.Id === 4);

        if (this.offerAprDt.OfferID === null) {
          this.setDefaultValue(this.selectedList[0]);
          //  this.getGradeBand(this.candData.gradeId);
          this.hideShowMIP(this.candData.gradeId);
          // this.hideShowSAR(this.candData.gradeId);
          // this.hideShowVarPay(this.candData.gradeId);
          // this.getVariablePayPercentFunc(this.candData.gradeId,this.data?.cid,this.candData?.CubeID);
          this.getVariableDetailsByGrade(this.candData.gradeId);
        }
        else {
          // this.fieldModValidation();
          // this.getGradeBand(this.offerAprDt.gradeId);
          this.filterCubeList['ClusterName'] = this.offerAprDt?.ClusterName;
          this.filterCubeList['ClusterId'] = this.offerAprDt?.CubeClusterID;
          this.RoleTalentCube['RoleName'] = this.offerAprDt?.RoleName;
          this.RoleTalentCube['RoleId'] = this.offerAprDt?.CubeRoleID;
          this.hideShowMIP(this.offerAprDt.gradeId);
          // this.hideShowSAR(this.offerAprDt.gradeId);
          // this.hideShowVarPay(this.offerAprDt.gradeId);
          // this.getVariablePayPercentFunc(this.offerAprDt.gradeId,this.offerAprDt?.cid,this.offerAprDt?.CubeID);
          this.getVariableDetailsByGrade(this.offerAprDt.gradeId);
          let selectedAppr: any = [];
          if (this.offerAprDt?.G5DH) {
            selectedAppr.push(2);
          }
          if (this.offerAprDt?.G5FH) {
            selectedAppr.push(3);
          }
          if (this.offerAprDt?.G5COO) {
            selectedAppr.push(4);
          }
          this.approverControl.patchValue(selectedAppr);
          this.apprSelectedList = this.ApproverList.filter(r => selectedAppr.indexOf(r.id) !== -1);
          this.approverHideShow(selectedAppr);
          setTimeout(() => {
            this.setDefaultValue(this.offerAprDt);
          }, 1000);

        }

      }
    )
  }

  public CountryId: number;
  setDefaultValue(data: any) {
    
    this.CountryId = this.candData?.countryId;
    this.sendForApprovalForm.patchValue({
      JoiningLocationID: (this.candData?.JoiningLocationId ? this.candData?.JoiningLocationId  : null),
      // DivisionID: (this.candData?.DivisionIdOffer ? this.candData?.DivisionIdOffer  : null),
      DivisionID: this.offerAprDt.OfferID === null ? this.data.DivisionID : this.data.DivisionID,
      DesignationId: this.offerAprDt.OfferID === null ? data._designation.Id : data.designationId,
      //  JobFamilyID: this.offerAprDt.OfferID === null ? null : data.JobFamilyID,
      gradeId: this.offerAprDt.OfferID === null ? parseInt(this.candData?.gradeId) : data.gradeId,
      // gradeBand: this.offerAprDt.OfferID === null ? this.candData?.gradeBandId : data.gradeBandId,
      ctc: data.CTC,
      RelocationExp: data.RelocationExp,
      variablePay: data.VariablePay,
      variablePayDuration: data.variablePayDuration ? data.variablePayDuration : null,
      variablePayPercent: data.variablePayPercent ? data.variablePayPercent : null,
      MIP: data.MIP,
      // SAR: data.SAR,
      TravelExp: data.TravelExp,
      joiningBonus: data.joiningBonus,
      NoticeBuyOut: data.NoticeBuyOut,
      RetentionBonus: data.RetentionBonus,
      TAGLead_Approver: data.G5TagLead ? data.G5TagLead : null,
      FunctionHead: data.G5FH ? data.G5FH : null,
      COO_Approver: data.G5COO ? data.G5COO : null,
      DH_Approver: data.G5DH ? data.G5DH : null,
      DateOfJoining: this.offerAprDt.OfferID === null ? new Date(this.candData.doj) : new Date(data.DateOfJoining),
      CandidateTypeID: this.offerAprDt.OfferID === null ? null : data.CandidateTypeID,
      SalaryType: this.offerAprDt.OfferID === null ? 1 : data.SalaryType,
      // JoiningLocationID: this.offerAprDt.OfferID === null ? (this.data?.JoiningLocationID ? this.data?.JoiningLocationID : null) : data.JoiningLocationID,
      reHire: this.offerAprDt.OfferID === null ? null : data.reHire,
      remarks: this.offerAprDt.OfferID === null ? null : this.data?.IsApproveEdit == 'Y' ? null : data.Remarks,
      CubeID: this.offerAprDt?.CubeID == null ? null : data?.CubeID
    }, { emitEvent: false });

    this.minDateEnd = this.offerAprDt.OfferID === null ? new Date(this.candData.doj) : new Date(data.DateOfJoining);
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


  }
  //

  public FilterCtrlCoo: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlDH: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlFH: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlGrade: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlTC: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlJB: UntypedFormControl = new UntypedFormControl();
  public IsApproveWithEdit: boolean = false;
  public approverControl: UntypedFormControl = new UntypedFormControl([Validators.required]);
  public ApproverList: any = G5AboveApproverNameList;
  public variablePayPercentage: any = [];
  sendApprovalForm() {
    this.sendForApprovalForm = this._fb.group({
      SalaryType: [1, [Validators.required]],
      JoiningLocationID: [null, [Validators.required]],
      DateOfJoining: [null, [Validators.required]],
      CandidateTypeID: [null, [Validators.required]],
      DesignationId: [null, [Validators.required,]],
      gradeId: [null, [Validators.required]],
      //  gradeBand: [null, Validators.required],
      reHire: ['N', [Validators.required]],
      ctc: [null, [Validators.required]],
      joiningBonus: [null, [Validators.required]],
      NoticeBuyOut: [null],
      TravelExp: [null],
      RelocationExp: [null],
      RetentionBonus: [null],
      TAGLead_Approver: [null, [Validators.required]],
      FunctionHead: [null],
      DH_Approver: [null],
      COO_Approver: [null],
      PartnerID: [null],
      ContractCompletionDate: [null],
      lwdDate: [null],
      ServiceAndMarkup: [null],
      fileBGV: [null],
      DivisionID: [null, [Validators.required]],
      remarks: [null],
      CubeID: [null, [Validators.required]],
      variablePay: [null],
      variablePayDuration: [null],
      variablePayPercent: [null],
      // SAR: [null],
      MIP: [null, [Validators.max(300000)]],
      status: [null]

    })

    if (this.data?.IsApproveEdit == 'Y') {
      this.IsApproveWithEdit = true;
      this.getControl('remarks').reset();
      this.getControl('TAGLead_Approver').disable();
      this.getControl('status').addValidators([Validators.required]);
      this.getControl('status').updateValueAndValidity();
    }

    /**
     * ctc change
     */
    this.getControl('ctc').valueChanges.subscribe(  
      (selectedValue) => {
        this.calculateVarPay(selectedValue,this.getControl('variablePayPercent').value);
      } // <--- emit the selected value here
    );
  }

 /***
  * approver change
  */
  public isDeliveryHeadApprover: boolean = false;
  public isFunctionHeadApprover: boolean = false;
  public isCOOApproverr: boolean = false;
  public apprSelectedList: any = [];
  getSelectedApprover(data: any) {
    let selectedAppr: any = data.value;
    this.apprSelectedList = this.ApproverList.filter(r => selectedAppr.indexOf(r.id) !== -1);
    
    this.approverHideShow(selectedAppr);

  }

  /**
   * 
   * @returns get exist approver list
   */

  getExistApproverList(){
     let selet:any =[];
    if(this.isDeliveryHeadApprover){
      selet.push(2);
    }
    if(this.isFunctionHeadApprover){
      selet.push(3);
    }
    if(this.isCOOApproverr){
      selet.push(4);
    }
    return selet;
  }
  /***
   * approver hide show
   */
  approverHideShow(selectedAppr: any) {
    
    let deliveryHeadApprover = selectedAppr.filter(r => r == 2);
    let functionHeadApprover = selectedAppr.filter(r => r == 3);
    let COOApprover = selectedAppr.filter(r => r == 4);
    let DhCtrl = this.getControl('DH_Approver');
    let FHCtrl = this.getControl('FunctionHead');
    let COOCtrl = this.getControl('COO_Approver');
    if (deliveryHeadApprover.length != 0) {
      this.isDeliveryHeadApprover = true;
      DhCtrl.addValidators([Validators.required]);
    }
    else {
      DhCtrl.clearValidators();
      DhCtrl.reset();
      this.isDeliveryHeadApprover = false;
    }
    if (functionHeadApprover.length != 0) {
      this.isFunctionHeadApprover = true;
      FHCtrl.addValidators([Validators.required]);
    }
    else {
      FHCtrl.clearValidators();
      FHCtrl.reset();
      this.isFunctionHeadApprover = false;
    }
    if (COOApprover.length != 0) {
      this.isCOOApproverr = true;
      COOCtrl.addValidators([Validators.required]);
    }
    else {
      COOCtrl.clearValidators();
      COOCtrl.reset();
      this.isCOOApproverr = false;
    }

    DhCtrl.updateValueAndValidity();
    FHCtrl.updateValueAndValidity();
    COOCtrl.updateValueAndValidity();
  }
 /**
  * get var pay percent
  * @param e 
  */
  getVarPercent(e: any) {
    let ctc = this.getControl('ctc').value;
    let varPay = e.value;
    this.calculateVarPay(ctc,varPay);
  }

/**
 * calculate var pay
 */
  calculateVarPay(ctc:number,varPayPercent:number){
    if(ctc){
      var getVarPay = (varPayPercent/ 100) * ctc;
      this.getControl('variablePay').patchValue(getVarPay.toFixed(2));
    }
    else{
      this.getControl('variablePay').patchValue(0); 
    }

  }

  /*
get control Method*/
  getControl(name: string) {
    return this.sendForApprovalForm.get(name);
  }


  
  /**
  * get Grade Id
  * @param e 
  */
 public IsVaribablePayVisible: boolean = false;
  getGradeId(e): void {
    let gradeId = e.value;
    this.getRoleByTalentCube(this.getControl('CubeID').value, e.value);
   
    // this.hideShowVarPay(gradeId);
    this.hideShowMIP(gradeId);
    // this.hideShowSAR(gradeId);
    this.getControl('variablePayPercent').reset();
    // this.getVariablePayPercentFunc(gradeId,this.data?.cid,this.getControl('CubeID').value);
      this.getVariableDetailsByGrade(gradeId);
  }

   /**getting variable pay data */
   public VariableDetails: any = {};
  getVariableDetailsByGrade(grade: number) {

    this._globalApi.getCompensationVariableByGrade(grade).subscribe(
      res => {
        this.VariableDetails = res['data'][0];
        debugger
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

  hideShowVarPay(gradeId:number){
    //G4
    if(gradeId === 205){
      this.IsVaribablePayVisible =true;
      this.getControl('variablePay').clearValidators();
      this.getControl('variablePay').reset();
      this.getControl('variablePay').updateValueAndValidity();
      this.getControl('variablePayPercent').clearValidators();
      this.getControl('variablePayPercent').reset();
      this.getControl('variablePayPercent').updateValueAndValidity();
      // this.getControl('variablePayDuration').clearValidators();
      // this.getControl('variablePayDuration').reset();
      // this.getControl('variablePayDuration').updateValueAndValidity();
    }
    else if(G5AboveCpmmon.validationGradeAboveG5AndAbove(gradeId)){
      this.IsVaribablePayVisible =true;
      this.getControl('variablePay').setValidators([Validators.required]);
      this.getControl('variablePay').updateValueAndValidity();
      this.getControl('variablePayPercent').setValidators([Validators.required]);
      this.getControl('variablePayPercent').updateValueAndValidity();
      // this.getControl('variablePayDuration').setValidators([Validators.required]);
      // this.getControl('variablePayDuration').updateValueAndValidity();
    }
    else{
      this.getControl('variablePay').clearValidators();
      this.getControl('variablePay').reset();
      this.getControl('variablePay').updateValueAndValidity();
      this.getControl('variablePayPercent').clearValidators();
      this.getControl('variablePayPercent').reset();
      this.getControl('variablePayPercent').updateValueAndValidity();
      // this.getControl('variablePayDuration').clearValidators();
      // this.getControl('variablePayDuration').reset();
      // this.getControl('variablePayDuration').updateValueAndValidity();
      this.IsVaribablePayVisible =false;
    }
  }

  // public IsSARVisible: boolean = false;
  public IsMIPVisible: boolean = false;
  hideShowMIP(gradeid:number){
    if(G5AboveCpmmon.validationGradeAboveG8AndAbove(gradeid)){
      this.IsMIPVisible = true;
      this.getControl('MIP').setValidators([Validators.required]);  
      this.getControl('MIP').updateValueAndValidity();
    }
    else{
      this.getControl('MIP').clearValidators();
      this.getControl('MIP').reset();
      this.getControl('MIP').updateValueAndValidity();
      this.IsMIPVisible = false;
    }
  }
  // hideShowSAR(gradeid:number){
  //   if(G5AboveCpmmon.validationGradeG5ToG7AndAbove(gradeid)){
  //     this.IsSARVisible =true;
  //     this.getControl('SAR').setValidators([Validators.required]);
  //     this.getControl('SAR').updateValueAndValidity();
  //   }
  //   else{
  //     this.getControl('SAR').clearValidators();
  //     this.getControl('SAR').reset();
  //     this.getControl('SAR').updateValueAndValidity();
  //     this.IsSARVisible =false;
  //   }
  // }
  /***
* change date
*/
  changeDate(type: string, event: any) {
    this.minDateEnd = new Date(event.value);
  }
  public isLwdDate: boolean = false;
  public isReqLwdDate: boolean = false;
  public isReqPartner: boolean = false;
  getCandidateTypeId(e: any) {
    let id = e.value;
    let PartnerID = this.getControl('PartnerID');
    let ContractCompletionDate = this.getControl('ContractCompletionDate');
    let ServiceAndMarkup = this.getControl('ServiceAndMarkup');
    let lwdDate = this.getControl('lwdDate');
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
    }

    PartnerID.updateValueAndValidity();
    ContractCompletionDate.updateValueAndValidity();
    ServiceAndMarkup.updateValueAndValidity();
    lwdDate.updateValueAndValidity();
       this.getVariableDetailsByGrade(this.getControl('gradeId').value);
  }

  /**
   * 
   * @param e get Cub Cluster Id
   */
  public filterCubeList: any = {};
  getCubeClusterID(e): any {
    this.filterCubeList = this.talentCubeList.filter(r => r.CubeId == e.value)[0];
    this.getRoleByTalentCube(e.value, this.getControl('gradeId').value);
    
    this.getControl('variablePayPercent').reset();
    this.getVariablePayPercentFunc(this.getControl('gradeId').value || 0,this.data?.cid,e.value);
  }
  //get 
  public RoleTalentCube: any = {};
  getRoleByTalentCube(talentCubeCode: number, gradeId: number) {
    this._globalApiServe.getRoleByTalentCube(talentCubeCode, gradeId).subscribe(
      res => {
        this.RoleTalentCube = res['data'][0];
        
      }
    );
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


  //submit sendapproval
  sendApprovalSubmit(form: UntypedFormGroup, action: string) {
    form.markAllAsTouched();
    this.approverControl.markAsTouched();
    if (this.approverControl.invalid) {
      this._share.showAlertErrorMessage.next('Minimum 2 Approver required.Please select atleast 1 approver from dropdown.');
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
      if (this.offerAprDt.StatusID === 120 ||
        this.offerAprDt.StatusID === 140 ||
        this.offerAprDt.StatusID === 180 ||
        this.offerAprDt.StatusID === 160 ||
        this.offerAprDt.StatusID === 100 ||
        this.offerAprDt.StatusID === 220) {
        formValue['IsRevisedOffer'] = 'Y';
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
      if (formValue['variablePay'] == '') {
        formValue['variablePay'] = null;
      }
      if (formValue['variablePayDuration'] == '') {
        formValue['variablePayDuration'] = null;
      }
      // if (formValue['SAR'] == '') {
      //   formValue['SAR'] = null;
      // }
      if (formValue['MIP'] == '') {
        formValue['MIP'] = null;
      }

      if (this.filterCubeList?.ClusterId) {
        formValue['CubeClusterID'] = this.filterCubeList?.ClusterId;
      }
      
      if (this.RoleTalentCube?.RoleId) {
        formValue['CubeRoleID'] = this.RoleTalentCube?.RoleId;
      }

      /***
       * approver with Update
       */

      if (this.data?.IsApproveEdit == 'Y') {
        if (formValue['status']) {
          formValue['Action'] = formValue['status'];
        }
        this.approvedReferredBackOffer(formValue);
      }
      /***
       * recruiter Action
       */
      else {
        this.sendApprovalRevisedOffer(formValue);
      }

    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }
  /***
   * send approval
   */
  sendApprovalRevisedOffer(formValue: any) {
    this._offerG5Serve.addUpdateOfferApprovalG5Above(formValue).subscribe(
      res => {
        let formData = new FormData();
        if (this.allFilesBGV.length != 0) {
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

        } else {
          this._share.showAlertSuccessMessage.next(res.Message);
          this.dialogRef.close(true);
        }

      }
    )
  }

  /***
 * Approve offer
 */
  approvedReferredBackOffer(formValue: any) {
    this._offerG5Serve.updateEditOfferApprovalG5Above(formValue).subscribe(
      res => {
        let formData = new FormData();
        if (this.allFilesBGV.length != 0) {
          formData.append('cid', this.data.cid);
          formData.append('ActionTakenBy', 'A');
          formData.append('ActionId', this.offerAprDt.ActionId);
          for (let i = 0; i < this.allFilesBGV.length; i++) {
            formData.append('File', this.allFiles[i]);
          }
          this._offerService.uploadDocumnetByRecApprover(formData).subscribe(
            doc => {
              this._share.showAlertSuccessMessage.next(res.Message);
              this.dialogRef.close(true);
            }
          )

        } else {
          this._share.showAlertSuccessMessage.next(res.Message);
          this.dialogRef.close(true);
        }

      }
    )
  }


  public isRemarkLabel: string = 'Remarks';
  statusChange(e) {
    if (e.value == 'A') {
      this.getControl('remarks').clearValidators();
      this.getControl('remarks').updateValueAndValidity();
      this.isRemarkLabel = 'Remarks';
    }
    else {
      this.getControl('remarks').setValidators([, Validators.required]);
      this.getControl('remarks').updateValueAndValidity();
      this.isRemarkLabel = 'Provide reasons for referring back to recruiter';
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
