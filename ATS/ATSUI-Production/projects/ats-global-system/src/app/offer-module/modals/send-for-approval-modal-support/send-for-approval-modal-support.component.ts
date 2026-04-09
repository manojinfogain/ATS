import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { forkJoin, pipe } from 'rxjs';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { OfferService } from '../../offer.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { FILE_UPLOAD,salaryMinMaxLoc } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { AtsOfferCommonMethodService } from 'projects/ats-global-system/src/app/core/common/ats-offer-common-method.service';
import { TalentService } from '../../../talent-module/talent.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { SupportApproverNameList } from '../../../core/constant/g5Above.const';

@Component({
  selector: 'app-send-for-approval-modal-support',
  templateUrl: './send-for-approval-modal-support.component.html',
  styleUrls: ['./send-for-approval-modal-support.component.scss'],
})
export class SendForApprovalModalSupportComponent implements OnInit {
  //
  public sendForApprovalForm: UntypedFormGroup = new UntypedFormGroup({});
  gotSendApprovalSubmit: any;
  //
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
  public ApproverList: any = SupportApproverNameList;
  constructor(
    public dialogRef: MatDialogRef<SendForApprovalModalSupportComponent>,
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
    private _commonMethodServe: GlobalCommonMethodService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    //
    if (this.data.DivisionID) {
      this.divisionID = this.data.DivisionID;
    }
    // this.getApproverListSupport();
    this.getCurrency();
    this.getAllPractices();
    this.getTagLeadApproverList(this.divisionID);
    this.getLocation();
    this.getContractList();
    this.sendApprovalForm();
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

  /***
   * approver change
   */
  public FilterCtrlFH: UntypedFormControl = new UntypedFormControl();
  public searchInputFH: string = '';
  public approverControl: UntypedFormControl = new UntypedFormControl([]);
  public isDeliveryHeadApprover: boolean = false;
  public isFunctionHeadApprover: boolean = false;
  public isCOOApproverr: boolean = false;
  public apprSelectedList: any = [];
  getSelectedApprover(data: any) {
    let selectedAppr: any = data.value;
    this.apprSelectedList = this.ApproverList.filter(
      (r) => selectedAppr.indexOf(r.id) !== -1
    );

    this.approverHideShow(selectedAppr);
  }

  /***
   * approver hide show
   */
  /***
   * approver hide show
   */
  approverHideShow(selectedAppr: any) {
    let deliveryHeadApprover = selectedAppr.filter((r) => r == 2);
    let functionHeadApprover = selectedAppr.filter((r) => r == 3);
    let GDLApprover = selectedAppr.filter((r) => r == 4);
    let COOApprover = selectedAppr.filter((r) => r == 5);
    let DhCtrl = this.getControl('DH_Approver');
    let FHCtrl = this.getControl('FunctionHead');
    let COOCtrl = this.getControl('COO_Approver');
    let GDLCtrl = this.getControl('SVP_Approver');
    if (deliveryHeadApprover.length != 0) {
      this.isDH_ApproverShow = true;
      DhCtrl.addValidators([Validators.required]);
    } else {
      DhCtrl.clearValidators();
      DhCtrl.reset();
      this.isDH_ApproverShow = false;
    }
    if (functionHeadApprover.length != 0) {
      this.isFunctionHeadApprover = true;
      FHCtrl.addValidators([Validators.required]);
    } else {
      FHCtrl.clearValidators();
      FHCtrl.reset();
      this.isFunctionHeadApprover = false;
    }
    if (GDLApprover.length != 0) {
      this.isSvp_ApproverShow = true;
      GDLCtrl.addValidators([Validators.required]);
    } else {
      GDLCtrl.clearValidators();
      GDLCtrl.reset();
      this.isSvp_ApproverShow = false;
    }
    if (COOApprover.length != 0) {
      this.isPresidentCOOApprShow = true;
      COOCtrl.addValidators([Validators.required]);
    } else {
      COOCtrl.clearValidators();
      COOCtrl.reset();
      this.isPresidentCOOApprShow = false;
    }

    DhCtrl.updateValueAndValidity();
    FHCtrl.updateValueAndValidity();
    GDLCtrl.updateValueAndValidity();
    COOCtrl.updateValueAndValidity();
  }

  //get getTalentCubeList list

  public talentCubeList: any = [];
  getTalentCubeList() {
    this._globalApiServe.getTalentCubeList().subscribe((res) => {
      this.talentCubeList = res['data'];
      this.FilterCtrlTC.valueChanges.subscribe((val) => {
        this.searchInputTC = val;
      });
    });
  }

  //get division list
  public RoleTalentCube: any = {};
  getRoleByTalentCube(talentCubeCode: number, gradeId: number) {
    this._globalApiServe
      .getRoleByTalentCube(talentCubeCode, gradeId)
      .subscribe((res) => {
        this.RoleTalentCube = res['data'][0];
      });
  }

  ngAfterViewInit(): void {
    this.inputValueChangedFunc();
    this.cdr.detectChanges(); 
  }

  public isRemarkReq: boolean = false;
  remaarkValidation() {
    let remarkCtrl = this.getControl('remarks');

    if (
      this.data.OfferStatusID === 120 ||
      this.data.OfferStatusID === 140 ||
      this.data.OfferStatusID === 160 ||
      this.data.OfferStatusID === 180
    ) {
      this.isRemarkReq = true;
      remarkCtrl.setValidators(Validators.required);
    } else {
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
    this._globalApi.GetCurrencyList().subscribe((res) => {
      this.currencyTypeData = res['data'];
    });
  }
  getAllPractices() {
    //get cand type
    this._globalApi.getAllPractices().subscribe((res) => {
      this.practiceList = res['data'];
    });
  }

  /**getting variable pay data */
  getVariablePayList(cid: number, cubeId: number, grade: number) {
    this._globalApi.getVariablePayList(cid, cubeId, grade).subscribe((res) => {
      this.variablePayList = res['data'];
    });
  }
  public tagLeadList: any = [];
  public tagHeadList: any = [];
  getTagLeadApproverList(divisionID: number) {
    this._globalApiServe.getTagHeadApproverList(divisionID).subscribe((res) => {
      this.tagLeadList = res['data'];
      this.FilterCtrlTAG.valueChanges.subscribe((val) => {
        this.searchInput = val;
      });
    });
    /**getting list of tag head  */
    this._globalApiServe.getTagHeadList().subscribe((res) => {
      this.tagHeadList = res['data'];
      this.FilterCtrlTAGhead.valueChanges.subscribe((val) => {
        this.searchInputTagHead = val;
      });
    });
  }

  public justificationReasonList: any = [];
  getJustificationList() {
    /**getting list of tag head  */
    this._globalApiServe.GetJustificationBucketList().subscribe((res) => {
      this.justificationReasonList = res['data'];
      // this.FilterCtrlTAGhead.valueChanges.subscribe(
      //   val => {
      //     this.searchInputTagHead = val
      //   }
      // )
    });
  }

  public searchInputGrade: string;
  getGrade() {
    this._globalApiServe.getGradeList().subscribe((res) => {
      this.gradeList = res['data'];
      this.FilterCtrlGrade.valueChanges.subscribe((val) => {
        this.searchInputGrade = val;
      });
    });
  }
  getGradeBand(id: number) {
    this._globalApiServe.getGradeBandList(id).subscribe((res) => {
      this.gradeBandList = res['data'];
    });
  }

  public searchInputJB: string;
  getjobFamily(id: number) {
    this._globalApiServe.getJobFamilyList(id).subscribe((res) => {
      this.jobFamilyList = res['data'];
      this.FilterCtrlJB.valueChanges.subscribe((val) => {
        this.searchInputJB = val;
      });
    });
  }

  //get company location
  public locationList: any = [];
  getLocation() {
    this._globalApiServe.getLocationList().subscribe((res) => {
      let ids = [];
      // if (this.divisionID == 7 || this.divisionID == 1) {
      //   ids = [1, 2, 4, 5, 16];
      // } else {
      //   ids = [1, 2, 4, 5];
      // }
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
      let filterLocation = res['data'].filter((loc) => {
        return ids.indexOf(loc.LocID) !== -1;
      });
      this.locationList = filterLocation;
    });
  }

  //get division list
  public divisionList: any = [];
  getDivisionList() {
    this._globalApiServe.getDivisionList().subscribe((res) => {
      this.divisionList = res['data'];
    });
  }

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
  }

  public contactList: any = [];
  getContractList() {
    this._globalApiServe.GetContractTypes().subscribe((res) => {
      let filterById = [1, 2, 3, 6];
      let filterByStatus = res['data'].filter((t) => {
        return filterById.indexOf(t.ID) !== -1;
      });
      this.contactList = filterByStatus;
    });
  }

  // upload multiple  documents
  public isFileReq: boolean = false;
  uploadButtonValidation(bgvDocList: any) {
    let fileControl = this.getControl('fileBGV');
    if (bgvDocList.length === 0) {
      fileControl.setValidators(Validators.required);
      this.isFileReq = true;
    } else {
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
        this.existFilesBgv.push({ name: files[x].FileName, type: 'e' });
      }
      this.allFiles = this.existFilesBgv;
    }
  }

  public talentDetails: any = {};
  public isDemandCreateByCube: boolean = false;
  public isTCEditExcep: boolean = false;
  getCandidateDetails() {
    forkJoin([
      this._interviewStatus.getCandidateDetails(this.data.cid),
      this._offerService.getSelectedCandidateDetails(this.data.cid),
      this._offerService.getCandidateOfferAprDetails(this.data.cid),
      this._offerService.getOfferApprovalAttachaments(
        `cid=${this.data.cid}&ActionTakenBy=R`
      ),
      this._talentServ.GetTHIDDetailsByTHID(this.data?.th_id),
    ]).subscribe((res) => {
      this.allRoundList = res[0];
      this.candData = res[1]['data'][0];
      this.offerAprDt = res[2]['data'][0];
      this.previewFileExist(res[3]['data']);
      this.talentDetails = res[4]['data'][0];
      this.selectedList = this.allRoundList.roundList.filter(
        (d) => d?.interviewType?.Id === 4 && d?.InterViewStatus?.Id === 4
      );
      this.getAllApproverList();
      if (this.talentDetails?.TalentIdCreatedBy == 'TC') {
        this.isDemandCreateByCube = true;
      } else {
        this.isDemandCreateByCube = false;
      }

      if (this.candData?.isTCEdit == 'Y') {
        this.isTCEditExcep = true;
      }

      if (this.offerAprDt.OfferID === null) {
        if (this.isDemandCreateByCube) {
          this.getControl('CubeID').patchValue(
            this.talentDetails?.TalentCubeId
          );
          this.getControl('gradeId').patchValue(this.talentDetails?.TCGradeId);

          this.filterCubeList = this.talentCubeList.filter(
            (r) => r.CubeId == this.talentDetails?.TalentCubeId
          )[0];
          this.RoleTalentCube['RoleName'] = this.talentDetails?.TalentCubeRole;
          this.RoleTalentCube['RoleId'] = this.talentCubeList?.TalentCubeRoleId;
          // this.getRoleByTalentCube(this.talentDetails?.TalentCubeId, this.talentDetails?.TCGradeId);
        } else {
          this.getControl('CubeID').patchValue(this.candData?.CubeID);
          this.getControl('gradeId').patchValue(this.candData?.gradeIdM);
          this.getControl('gradeBand').patchValue(this.candData?.gradeBandIdM);
          this.filterCubeList['ClusterName'] = this.candData?.ClusterName;
          this.filterCubeList['ClusterId'] = this.candData?.CubeClusterID;
          this.RoleTalentCube['RoleName'] = this.candData?.RoleName;
          this.RoleTalentCube['RoleId'] = this.candData?.CubeRoleID;

          this.getVariablePayList(
            this.data?.cid,
            this.candData?.CubeID,
            this.candData?.gradeIdM
          );
         // this.variablePayHideShow(this.candData?.gradeIdM);
             this.getVariableDetailsByGrade(this.candData?.gradeIdM);
        }

        setTimeout(() => {
          this.setDefaultValue(this.selectedList[0]);
          this.getGradeBand(
            this.isDemandCreateByCube
              ? this.talentDetails?.TCGradeId
              : this.candData.gradeIdM
          );
          //  this.getGradeBand(this.talentDetails?.TCGradeId);
          //  this.getRoleByTalentCube(this.talentDetails?.TalentCubeId,this.getControl('gradeId').value);
        }, 1000);
      } else {
        this.getGradeBand(this.offerAprDt.gradeId);
        this.getControl('CubeID').patchValue(this.offerAprDt?.CubeID);
        this.getControl('gradeId').patchValue(this.offerAprDt?.gradeId);
        this.filterCubeList['ClusterName'] = this.offerAprDt?.ClusterName;
        this.filterCubeList['ClusterId'] = this.offerAprDt?.CubeClusterID;
        this.RoleTalentCube['RoleName'] = this.offerAprDt?.RoleName;
        this.RoleTalentCube['RoleId'] = this.offerAprDt?.CubeRoleID;

        let selectedAppr: any = [];
        if (this.offerAprDt?.DH_Approver) {
          selectedAppr.push(2);
        }
        if (this.offerAprDt?.G5FH) {
          selectedAppr.push(3);
        }
        if (this.offerAprDt?.SVPApprover) {
          selectedAppr.push(4);
        }
        if (this.offerAprDt?.COOApprover) {
          selectedAppr.push(5);
        }
        this.approverControl.patchValue(selectedAppr);
        this.apprSelectedList = this.ApproverList.filter(
          (r) => selectedAppr.indexOf(r.id) !== -1
        );
        this.approverHideShow(selectedAppr);
        setTimeout(() => {
          this.setDefaultValue(this.offerAprDt);
          this.hideVandOtherContract(this.offerAprDt?.CandidateTypeID);
        }, 1000);
      }
    });
  }

  /***
   * hide for contractor
   */
  public isHideVarience: boolean = true;
  hideVandOtherContract(id: number) {
    if (id == 1 || id == 2) {
      this.isHideVarience = false;
    } else {
      this.isHideVarience = true;
    }
  }

  public allFiles: any = [];
  public allFilesBGV: any = [];
  @ViewChild('fileBGV') fileBGV: ElementRef;
  fileUp(event: any) {
    this.getControl('fileBGV').reset();
    this.allFiles = [];
    let allowedExtensions =
      /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf|\.msg|\.xlsx)$/i;
    let files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let fileName = files[i].name;
      if (!allowedExtensions.exec(fileName)) {
        this._share.showAlertErrorMessage.next(
          fileName +
          'is not  valid document type. Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf/msg/xlsx only.'
        );
        event.target.value = '';
        this.allFiles = [];
        this.getControl('fileBGV').reset();
        return false;
      } else if (files[i].size > FILE_UPLOAD.FILE_SIZE) {
        this._share.showAlertErrorMessage.next(
          'Image  uploaded cannot be greater than 15MB.'
        );
        event.target.value = '';
        this.allFiles = [];
        this.getControl('fileBGV').reset();
        return false;
      } else {
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
      DesignationId: [null, [Validators.required]],
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
      COO_Approver: [null],
      FunctionHead: [null],
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
      billableHoursDay: [8],
      remarks: [null],
      ConversionRate: [null],
      ClientApprovedBilling: [null],
      Revenue: [null],
      OtherHiringCost: [null],
      CubeID: [null, [Validators.required]],
      variablePay: [null],
      JustificationBucketId: [null],
      ContractExtensionRemarks: [null],
      OfferReleasedFor: [null, [Validators.required]],
      IsOfferInHand: [null, [Validators.required]],
      OfferInHandCTC: [null],
      fileOffer: [null],
        isDocAvailableInHandCTCDoc: [null],
       isConsentInHandCTCDoc: [null]
    });
    if (this.convRateReq) {
      this.getControl('ConversionRate').setValidators([Validators.required]);
      this.getControl('ClientApprovedBilling').setValidators([
        Validators.required,
      ]);
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
  };

  /**method to show justification reason for greator varience for median salary */
  public isJustificationVarience: boolean = false;
  justificationMethod(data: any) {
    if (data?.varianceMid > 0) {
      this.isJustificationVarience = true;
      this.getControl('JustificationBucketId').setValidators([
        Validators.required,
      ]);
      // this.getControl('JustificationRemark').setValidators([Validators.required]);
    } else {
      this.getControl('JustificationBucketId').reset();
      this.getControl('JustificationBucketId').clearValidators();
      // this.getControl('JustificationRemark').reset();
      //this.getControl('JustificationRemark').clearValidators();
      this.isJustificationVarience = false;
    }
    this.getControl('JustificationBucketId').updateValueAndValidity();
    // this.getControl('JustificationRemark').updateValueAndValidity();
  }

  //restrict initial zero
  restrictInitialZero(e) {
    if (e.target.value.length === 0 && e.key === '0') {
      e.preventDefault();
    }
  }
  /**
   * joining location on changed
   * @param event
   */
  locChanged(event: any) { }
  /***
   * Method for input control
   */
  inputValueChangedFunc() {
    // all  controls valie changes action
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
  public SelectedValueSVPAppr: string = '';
  public isVisiblePartner: boolean = false;
  public isReqPartner: boolean = false;
    public isReqInHandOf: boolean = false;
  setDefaultValue(data: any) {
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
      else if (data?.IsInHandOffer == 'Y' && data?.StatusID == null) {
         isofferInhand = 1;
         OfferInHandCTC = data?.OfferInHandAmount != null ? data?.OfferInHandAmount : 0;
         this.showOfferInHandCTC(1);
         this.isReqInHandOf = true;
      }
      else{
        isofferInhand = 0;
        this.isReqInHandOf = false;
        this.showOfferInHandCTC(0);
      }
    this.showSelectedValueOfferBy = true;
    this.showSelectedValuePMAppr = true;
    this.showSelectedValueDHAppr = true;
    this.showSelectedValueSVPAppr = true;
    this.SelectedValueOfferBy =
      this.offerAprDt.OfferID === null ? data.offeredby.Id : data.offeredBy;
    this.SelectedValuePMAppr = data.PM_Approver ? data.PM_Approver : null;
    // this.SelectedValueDHAppr = data.DH_Approver ? data.DH_Approver : null;
    // this.SelectedValueSVPAppr = data.SVPApprover ? data.SVPApprover : null;
    this.CountryId = this.candData?.countryId;
    this.billingCurrencyControl.patchValue(this.candData?.CurrencyId);
    this.sendForApprovalForm.patchValue(
      {
        DesignationId:
          this.offerAprDt.OfferID === null
            ? data._designation.Id
            : data.designationId,
        JobFamilyID: this.offerAprDt.OfferID === null ? null : data.JobFamilyID,
        //gradeId: this.offerAprDt.OfferID === null ? parseInt(this.candData?.gradeIdM?this.candData?.gradeIdM:'0') : data.gradeId,
        gradeBand: this.offerAprDt.OfferID === null ? null : data.gradeBandId,
        ctc: data.CTC,
        variablePay: data?.variablePayId != null ? data?.variablePayId : null,
        RelocationExp: parseInt(data.RelocationExp) ? data.RelocationExp : null,
        TravelExp: parseInt(data.TravelExp) ? data.TravelExp : null,
        joiningBonus: parseInt(data.joiningBonus) ? data.joiningBonus : null,
        NoticeBuyOut: parseInt(data.NoticeBuyOut) ? data.NoticeBuyOut : null,
        RetentionBonus: parseInt(data.RetentionBonus)
          ? data.RetentionBonus
          : null,
        TAGLead_Approver: data.PM_Approver ? data.PM_Approver : null,
        TAGHead_Approver: data.TAG_HeadApprover ? data.TAG_HeadApprover : null,
        DH_Approver: data.DH_Approver ? data.DH_Approver : null,
        SVP_Approver: data.SVPApprover ? data.SVPApprover : null,
        COO_Approver: data.COOApprover ? data.COOApprover : null,
        FunctionHead: data.G5FH ? data.G5FH : null,
        JustificationBucketId: data.JustificationBucketId
          ? data.JustificationBucketId
          : null,
        DateOfJoining:
          this.offerAprDt.OfferID === null
            ? new Date(this.candData.doj)
            : new Date(data.DateOfJoining),
        CandidateTypeID:
          this.offerAprDt.OfferID === null ? null : data.CandidateTypeID,
        SalaryType: this.offerAprDt.OfferID === null ? 1 : data.SalaryType,
        // JoiningLocationID: this.offerAprDt.OfferID === null ? null : data.JoiningLocationID,
        JoiningLocationID: this.candData?.JoiningLocationId
          ? this.candData?.JoiningLocationId
          : null,
        // DivisionID: (this.candData?.DivisionIdOffer ? this.candData?.DivisionIdOffer  : null),
        billingCurrencyId:
          this.offerAprDt.OfferID === null ? 2 : data.billingCurrencyID,
        billingRateHrCurrency:
          this.offerAprDt.OfferID === null
            ? this.candData?.billingRateHrCurrency
            : data.billingRateHrCurrency,
        billableHoursDay:
          this.offerAprDt.OfferID === null ? 8 : data.billableHoursDay,
        projectBuffer:
          this.offerAprDt.OfferID === null
            ? null
            : data.projectBufferInPercent || null,
        NonReimbursableTravelCost:
          this.offerAprDt.OfferID === null
            ? null
            : data.nonReimbursableTravelCostUsd || null,
        projectSpecificCost:
          this.offerAprDt.OfferID === null
            ? null
            : data.projectSpecificCostUsd || null,
        reHire: this.offerAprDt.OfferID === null ? null : data.reHire,
        remarks: this.offerAprDt.OfferID === null ? null : data.Remarks,
        Revenue: this.offerAprDt?.Revenue == null ? null : data?.Revenue,
        OtherHiringCost:
          this.offerAprDt?.OtherCost == null ? null : data?.OtherCost,
        OfferReleasedFor: data.OfferReleasedFor ? data.OfferReleasedFor : null,

        IsOfferInHand: isofferInhand,
        OfferInHandCTC:OfferInHandCTC ? OfferInHandCTC : null,
      },
      { emitEvent: false }
    );

    this.minDateEnd =
      this.offerAprDt.OfferID === null
        ? new Date(this.candData.doj)
        : new Date(data.DateOfJoining);
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
      ServiceAndMarkup.patchValue(data?.ServiceAndMarkup);
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
   // this.getVariablePayList(data?.cid, data?.CubeID, data?.gradeId);
    //this.variablePayHideShow(data?.gradeId);
   // this.getControl('variablePay').patchValue(data?.variablePayPercent);
       this.getVariableDetailsByGrade(data?.gradeId);
    this.showOfferInHandCTC(data?.IsOfferInHand);
    // }
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
    let ContractCompletionDate = this.getControl(
      'ContractCompletionDate'
    ).value;
    if (CandidateTypeID == 2) {
      ContractCompletionDate = this.getControl('ContractCompletionDate').value;
    } else if (CandidateTypeID == 6 || CandidateTypeID == 1) {
      ContractCompletionDate = this.getControl('lwdDate').value;
    }
    let joiningdate = new Date(event.value);
    this.showhideJustificstionDuration6MonthAbove(
      CandidateTypeID,
      joiningdate,
      ContractCompletionDate
    );
  }

  /***
   * change date
   */
  changeDateCompletion(type: string, event: any) {
    let CandidateTypeID = this.getControl('CandidateTypeID').value;
    let joiningdate = this.getControl('DateOfJoining').value;
    let ContractCompletionDate = new Date(event.value);
    this.showhideJustificstionDuration6MonthAbove(
      CandidateTypeID,
      joiningdate,
      ContractCompletionDate
    );
  }

  /***
   * hide show contract extended 6month above
   */
  public isContractLimitExtend: boolean = false;
  public durationContract: any = {};
  showhideJustificstionDuration6MonthAbove(
    CandidateTypeID: number,
    joiningdate: any,
    ContractCompletionDate: any
  ) {
    if (joiningdate && ContractCompletionDate) {
      this.durationContract = this.calculateDuration(
        joiningdate,
        ContractCompletionDate
      );

      if (
        CandidateTypeID == 2 ||
        CandidateTypeID == 6 ||
        CandidateTypeID == 1
      ) {
        // Create a new date that is 6 months after the joining date
        let sixMonthsAfterJoiningDate = new Date(joiningdate);
        sixMonthsAfterJoiningDate.setMonth(joiningdate.getMonth() + 6);

        // Check if the contract completion date is greater than 6 months after the joining date
        if (
          ContractCompletionDate &&
          new Date(ContractCompletionDate) > sixMonthsAfterJoiningDate
        ) {
          this.isContractLimitExtend = true;
          this.getControl('ContractExtensionRemarks').setValidators([
            Validators.required,
          ]);
        } else {
          this.getControl('ContractExtensionRemarks').reset();
          this.getControl('ContractExtensionRemarks').clearValidators();
          this.isContractLimitExtend = false;
        }
      } else {
        this.getControl('ContractExtensionRemarks').reset();
        this.getControl('ContractExtensionRemarks').clearValidators();
        this.isContractLimitExtend = false;
      }
    } else {
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
    } else {
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

    this.hideVandOtherContract(id);
   // this.variablePayHideShow(null);

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
    this.getGradeBand(e.value);
    this.getRoleByTalentCube(this.getControl('CubeID').value, e.value);
    let gradeId = e.value;

    // if(this.employmentTypeId == 3 || this.getControl('CandidateTypeID').value == 3){
    this.getVariablePayList(
      this.data.cid,
      this.getControl('CubeID').value,
      gradeId
    );
   // this.variablePayHideShow(gradeId);
    this.variablePayList = [];
    this.getControl('variablePay').reset();
        this.getVariableDetailsByGrade(gradeId);
    //  }
    //this.getVariablePayList(this.data.cid, this.getControl('CubeID').value, gradeId);
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
  /**to hide show variable pay on grade 4 and above */
  variablePayHideShow(grade: number) {
    this.isG4AndAbove = this._commonMethodServe.validationGradeAboveG4AndAbove(
      grade ? grade : this.getControl('gradeId').value
    );
    if (
      this.employmentTypeId == 3 ||
      this.getControl('CandidateTypeID').value == 3
    ) {
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
  getGradeBandId(e: any) { }

  /**
   *
   * @param e get Cub Cluster Id
   */
  public filterCubeList: any = {};
  getCubeClusterID(e): any {
    this.filterCubeList = this.talentCubeList.filter(
      (r) => r.CubeId == e.value
    )[0];
    this.getRoleByTalentCube(e.value, this.getControl('gradeId').value);
    // this.variablePayHideShow(0);
    this.getVariablePayList(
      this.data.cid,
      this.getControl('CubeID').value,
      this.getControl('gradeId').value
    );
    this.variablePayList = [];
    this.getControl('variablePay').reset();
  }

  /***
   * get CTC value changes
   */
  getCTC() { }
  /***
   * get ApproverList
   */

  public DPApproverList: any = [];
  public GDLApproverList: any = [];
  public COOLApproverList: any = [];
  public funcHeadLevelApproverList: any = [];
  getAllApproverList() {
    let userEmp = this._storage.getUserEmpId();
    let data = {
      empId: parseInt(userEmp),
      Division: this.divisionID,
      cid: this.data.cid,
      ReqTypeId: this.candData?.RequirementTypeId,
    };
    forkJoin([
      this._globalApiServe.getApproverList(
        data.empId,
        1,
        data.Division,
        data.cid,
        data.ReqTypeId
      ),
      this._globalApiServe.getApproverList(
        data.empId,
        2,
        data.Division,
        data.cid,
        data.ReqTypeId
      ),
      this._globalApiServe.getApproverList(
        data.empId,
        3,
        data.Division,
        data.cid,
        data.ReqTypeId
      ),
      this._globalApiServe.getFunctionHeadApproverList(),
    ]).subscribe((res) => {
      this.DPApproverList = res[0]['data'];
      this.GDLApproverList = res[1]['data'];
      this.COOLApproverList = res[2]['data'];
      this.funcHeadLevelApproverList = res[3]['FuncHeadLevel'];
    });
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
  public isPresidentCOOApprShow: boolean = false;
  public approverMsgMissing: string = '';
  public approverLength: number = 0;
  public aprvCountDataList: any = [];
  getApproverCont(
    gradeID: number,
    gradeBand: number,
    ctc: number,
    cubeID: number,
    ExpYear: number,
    ExpMonth: number,
    CandidateTypeID: string,
    divisionID: number,
    joiningBonus: number = 0,
    isLoad: boolean = false
  ) {
    let DH_Approver = this.getControl('DH_Approver');
    let SVP_Approver = this.getControl('SVP_Approver');
    let COO_Approver = this.getControl('COO_Approver');
    let JFCategory = this.getControl('JfCateg').value;
  }

  //submit sendapproval
  sendApprovalSubmit(form: UntypedFormGroup, action: string) {
    form.markAllAsTouched();

    this.approverControl.markAsTouched();
    // if (this.approverControl.invalid) {
    //   this._share.showAlertErrorMessage.next('Minimum 3 Approver required.Please select atleast 1 approver from dropdown.');
    //   return
    // }
    if (form.valid) {
      let empId = this._storage.getUserEmpId();
      let formValue = form.value;

      // formValue['DivisionID'] = this.divisionID;
      formValue['cid'] = this.data.cid;
      formValue['OfferID'] =
        this.offerAprDt.OfferID === null ? 0 : this.offerAprDt.OfferID;
      formValue['Action'] = action;
      formValue['offerGivenBy'] = empId;
      if (formValue['DateOfJoining']) {
        formValue['DateOfJoining'] = GlobalMethod.formatDate(
          formValue['DateOfJoining']
        );
      }
      if (formValue['ContractCompletionDate']) {
        formValue['ContractCompletionDate'] = GlobalMethod.formatDate(
          formValue['ContractCompletionDate']
        );
      }

      if (formValue['lwdDate']) {
        formValue['ContractCompletionDate'] = GlobalMethod.formatDate(
          formValue['lwdDate']
        );
      }
      if (
        this.offerAprDt.StatusID === 20 ||
        this.offerAprDt.StatusID === 25 ||
        this.offerAprDt.StatusID === 40 ||
        this.offerAprDt.StatusID === 45 ||
        this.offerAprDt.StatusID === 60 ||
        this.offerAprDt.StatusID === 80 ||
        this.offerAprDt.StatusID === 30 ||
        this.offerAprDt.StatusID === 35 ||
        this.offerAprDt.StatusID === 50 ||
        this.offerAprDt.StatusID === 55 ||
        this.offerAprDt.StatusID === 70 ||
        this.offerAprDt.StatusID === 90 ||
        this.offerAprDt.StatusID === 120 ||
        this.offerAprDt.StatusID === 140 ||
        this.offerAprDt.StatusID === 180 ||
        this.offerAprDt.StatusID === 160 ||
        this.offerAprDt.StatusID === 100 ||
        this.offerAprDt.StatusID === 220
      ) {
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
      let FieldIDs = formValue?.FieldIDs;
      formValue['FieldIDs'] = '';
      if (FieldIDs && FieldIDs.length != 0) {
        formValue['FieldIDs'] = FieldIDs.toString();
      }

      formValue['isConsentInHandCTCDoc'] = formValue['isConsentInHandCTCDoc']?1:0;

      // if (this.filterCubeList?.ClusterId) {
      //   formValue['CubeClusterID'] = this.filterCubeList?.ClusterId;
      // }
      // if (this.RoleTalentCube?.RoleId) {
      //   formValue['CubeRoleID'] = this.RoleTalentCube?.RoleId;
      // }

      this._offerService
        .addUpdateOfferApprovalSupport(formValue)
        .subscribe((res) => {
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
        });
    } else {
      this._share.showAlertErrorMessage.next(
        'Please fill all mandatory fields.'
      );
    }
  }
   changeCheckHROffer(e: any) {
    if (e.checked == false) {
      this.getControl('isConsentInHandCTCDoc').reset();
    }

  }
  /** is offer in hand change  */
  
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
  if (IsOfferInHand == 1 || IsOfferInHand == 0) {
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

    /** is offer in hand change  */
    public isOfferInHandCTCReq: boolean = false;
    getOfferInHand(e: any) {
      this.showOfferInHandCTC(e.value);
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

  /**
   * show interview round details
   * @param data
   */
  openfeedbackInfoModal(data: any) {
    const dialogRef = this.dialog.open(FeedbackRoundDetailsComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback'],
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
