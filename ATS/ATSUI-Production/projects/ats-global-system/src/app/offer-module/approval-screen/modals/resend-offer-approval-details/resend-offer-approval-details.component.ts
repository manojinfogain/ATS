import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { forkJoin } from 'rxjs';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { HttpClient } from '@angular/common/http';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OfferService } from '../../../offer.service';
import { RecruiApprovDocumentsModalComponent } from '../../../modals/recrui-approv-documents-modal/recrui-approv-documents-modal.component';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';

@Component({
  selector: 'app-resend-offer-approval-details',
  templateUrl: './resend-offer-approval-details.component.html',
  styleUrls: ['./resend-offer-approval-details.component.scss']
})
export class ResendOfferApprovalDetailsComponent implements OnInit {
  public bgvData: any = [];
  public candData: any = [];
  public allRoundList: any = [];
  public selectedList: any = [];
  public gradeList: any = [];
  public offerAprDt: any = [];
  public approvalData: any = [];
  displayedColumns = ['approverType', 'approverName', 'ActionTaken', 'ActionTakenOn', 'ActionTakenBy', 'remarks', 'documents'];
  displayedColumns1 = ['status', 'updatedBy', 'updatedOn', 'declineCatg', 'remarks'];
  displayedColumnsBgv = ['fileName', 'action'];
  public wefNewApprovMatrxDt = new Date('2023-04-22');
  public FilterCtrlTAG: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlTAGhead: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public searchInputTagHead: string;
  public resendForApprovalForm: UntypedFormGroup = new UntypedFormGroup({});
  public isRemarkReq: boolean = false;
  isApproversVisible: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ResendOfferApprovalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _offerService: OfferService,
    public dialog: MatDialog,
    private http: HttpClient,
    private _share: ShareService,
    private _globalApiServe: GlobalApisService,
    private _fb: UntypedFormBuilder,
    private _storage: GetSetStorageService
  ) { }

  ngOnInit(): void {
    this.sendApprovalForm();
    this.getCandidateDetails();
    this.getTagLeadApproverList(this.data.DivisionId);
  }

  public candStatusHistory: any = [];
  public referredPendingApprovers: any = [];
  getCandidateDetails() {
    forkJoin([
      this._interviewStatus.getCandidateDetails(this.data.cid),
      this._offerService.getSelectedCandidateDetails(this.data.cid),
      this._offerService.getCandidateOfferAprDetails(this.data.cid),
      this._offerService.getCandidateApprovalDetails(this.data.cid),
      this._offerService.getCandidateStatusHistory(this.data.cid),
      this._offerService.getReferredOrPendingApprover(this.data.cid)
    ]).subscribe(
      res => {
        this.allRoundList = res[0];
        this.candData = res[1]['data'][0];
        this.offerAprDt = res[2]['data'][0];
        this.bgvData = res[2]['BGVAtt'];
        this.approvalData = res[3]['data'];
        this.candStatusHistory = res[4]['data'];
        this.referredPendingApprovers = res[5]['data'];
        this.selectedList = this.allRoundList.roundList.filter(d => d?.interviewType?.Id === 4 && d?.InterViewStatus?.Id === 4);
        this.getAllApproverList();
        this.getApproversCountAndPatchValue(this.offerAprDt, this.approvalData, this.referredPendingApprovers);
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
          val=>{
            this.searchInputTagHead = val
          }
        )
      }
    )
  }

  //no of approvers to resend
  public isTag_ApproverReq: boolean = false;
  public isTag_ApproverShow: boolean = false;
  public isTagHead_ApproverReq: boolean = false;
  public isTagHead_ApproverShow: boolean = false;
  public isDH_ApproverReq: boolean = false;
  public isDH_ApproverShow: boolean = false;
  public isSvp_ApproverReq: boolean = false;
  public isSvp_ApproverShow: boolean = false;
  public isPresidentCOOApprShow: boolean = false;
  public isCDOApprShow: boolean = false;
  public isFunctionHeadApproverShow: boolean = false;
  getApproversCountAndPatchValue(offerApprDet: any, approvalDt: any, refPendingApprovers: any) {
    let referrdIndex;
    let arrApproversDet;
    let tagLeadEmpId;
    let tagHeadEmpId;
    let DHEmpId;
    let SVPEmpId;
    let COOEmpId;
    let FuncHeadEmpId;
    let CDOEmpId;
    tagLeadEmpId = refPendingApprovers?.filter(d => d?.ApproverType == 1)[0]?.Approver;
    tagHeadEmpId = refPendingApprovers?.filter(d => d?.ApproverType == 5)[0]?.Approver;
    DHEmpId = refPendingApprovers?.filter(d => d?.ApproverType == 2)[0]?.Approver;
    SVPEmpId = refPendingApprovers?.filter(d => d?.ApproverType == 3)[0]?.Approver;
    COOEmpId = refPendingApprovers?.filter(d => d?.ApproverType == 4)[0]?.Approver;
    FuncHeadEmpId = refPendingApprovers?.filter(d => d?.ApproverType == 6)[0]?.Approver;
    CDOEmpId = refPendingApprovers?.filter(d => d?.ApproverType == 7)[0]?.Approver;
    let TagLead_Approver = this.getControl('TAGLead_Approver');
    let TAGHead_Approver = this.getControl('TAGHead_Approver');
    let DH_Approver = this.getControl('DH_Approver');
    let SVP_Approver = this.getControl('SVP_Approver');
    let COO_Approver = this.getControl('COO_Approver');
    let CDO_Approver = this.getControl('CDO_Approver');
    let FH_Approver = this.getControl('FunctionHead');
    let remarksCtrl = this.getControl('remarks');
    if (this.data?.callType == 1) {
      if (offerApprDet?.StatusID == 30) {
        this.isApproversVisible = true;
        this.isRemarkReq = true;
        this.isTag_ApproverShow = true;
        if (tagHeadEmpId) {
          this.isTagHead_ApproverShow = true;
        }
        if (DHEmpId) {
          this.isDH_ApproverShow = true;
        }
        if (SVPEmpId) {
          this.isSvp_ApproverShow = true;
        }
        if (COOEmpId) {
          this.isPresidentCOOApprShow = true;
        }
        if (COOEmpId) {
          this.isPresidentCOOApprShow = true;
        }
        if (FuncHeadEmpId) {
          this.isFunctionHeadApproverShow = true;
        }        
        if (CDOEmpId) {
          this.isCDOApprShow = true;
        }
        setTimeout(() => {
          TagLead_Approver.patchValue(tagLeadEmpId);
          TAGHead_Approver.patchValue(tagHeadEmpId);
          this.getControl('DH_Approver').patchValue(DHEmpId);
          this.getControl('SVP_Approver').patchValue(SVPEmpId);
          this.getControl('COO_Approver').patchValue(COOEmpId);
          this.getControl('FunctionHead').patchValue(FuncHeadEmpId);
          this.getControl('CDO_Approver').patchValue(CDOEmpId);
        }, 1000);
      } else if (offerApprDet?.StatusID == 35) {
        this.isApproversVisible = true;
        this.isRemarkReq = true;
        this.isTag_ApproverShow = false;
        this.isTagHead_ApproverShow = true;
        if (DHEmpId) {
          this.isDH_ApproverShow = true;
        }
        if (SVPEmpId) {
          this.isSvp_ApproverShow = true;
        }
        if (COOEmpId) {
          this.isPresidentCOOApprShow = true;
        }
        if (FuncHeadEmpId) {
          this.isFunctionHeadApproverShow = true;
        }     
        if (CDOEmpId) {
          this.isCDOApprShow = true;
        }
        TagLead_Approver.clearValidators();
        TagLead_Approver.reset();
        setTimeout(() => {
          TAGHead_Approver.patchValue(tagHeadEmpId);
          this.getControl('DH_Approver').patchValue(DHEmpId);
          this.getControl('SVP_Approver').patchValue(SVPEmpId);
          this.getControl('COO_Approver').patchValue(COOEmpId);
          this.getControl('FunctionHead').patchValue(FuncHeadEmpId);
          this.getControl('CDO_Approver').patchValue(CDOEmpId);
        }, 1000);
      }else
       if (offerApprDet?.StatusID == 50 || offerApprDet?.StatusID == 55) {
        this.isApproversVisible = true;
        this.isRemarkReq = true;
        this.isTag_ApproverShow = false;
        this.isTagHead_ApproverShow = false;
        this.isDH_ApproverShow = true;
        if (SVPEmpId) {
          this.isSvp_ApproverShow = true;
        }
        if (COOEmpId) {
          this.isPresidentCOOApprShow = true;
        }
        if (FuncHeadEmpId) {
          this.isFunctionHeadApproverShow = true;
        } 
        if (CDOEmpId) {
          this.isCDOApprShow = true;
        }
        TagLead_Approver.clearValidators();
        TagLead_Approver.reset();
        TAGHead_Approver.clearValidators();
        TAGHead_Approver.reset();
        setTimeout(() => {
          this.getControl('DH_Approver').patchValue(DHEmpId);
          this.getControl('SVP_Approver').patchValue(SVPEmpId);
          this.getControl('COO_Approver').patchValue(COOEmpId);
          this.getControl('FunctionHead').patchValue(FuncHeadEmpId);
          this.getControl('CDO_Approver').patchValue(CDOEmpId);
        }, 1000);
      } 
      else if (offerApprDet?.StatusID == 155) {
        this.isApproversVisible = true;
        this.isRemarkReq = true;
        this.isTag_ApproverShow = false;
        this.isTagHead_ApproverShow = false;
        this.isDH_ApproverShow = false;
        this.isFunctionHeadApproverShow = true;
      //  this.isSvp_ApproverShow = true;
      if (SVPEmpId) {
        this.isSvp_ApproverShow = true;
      }
        if (COOEmpId) {
          this.isPresidentCOOApprShow = true;
        }
        TagLead_Approver.clearValidators();
        TagLead_Approver.reset();
        TAGHead_Approver.clearValidators();
        TAGHead_Approver.reset();
        DH_Approver.clearValidators();
        DH_Approver.reset();
        FH_Approver.clearValidators();
        FH_Approver.reset();
        setTimeout(() => {
          this.getControl('SVP_Approver').patchValue(SVPEmpId);
          this.getControl('COO_Approver').patchValue(COOEmpId);
          this.getControl('FunctionHead').patchValue(FuncHeadEmpId);
        }, 1000);
      } 
      else if (offerApprDet?.StatusID == 70) {
        this.isApproversVisible = true;
        this.isRemarkReq = true;
        this.isTag_ApproverShow = false;
        this.isTagHead_ApproverShow = false;
        this.isDH_ApproverShow = false;
        this.isFunctionHeadApproverShow = false;
        this.isSvp_ApproverShow = true;
        if (COOEmpId) {
          this.isPresidentCOOApprShow = true;
        }
        if (CDOEmpId) {
          this.isCDOApprShow = true;
        }
        TagLead_Approver.clearValidators();
        TagLead_Approver.reset();
        TAGHead_Approver.clearValidators();
        TAGHead_Approver.reset();
        DH_Approver.clearValidators();
        DH_Approver.reset();
        FH_Approver.clearValidators();
        FH_Approver.reset();
        setTimeout(() => {
          this.getControl('SVP_Approver').patchValue(SVPEmpId);
          this.getControl('COO_Approver').patchValue(COOEmpId);
          this.getControl('CDO_Approver').patchValue(CDOEmpId);
        }, 1000);
      } else if (offerApprDet?.StatusID == 90) {
        this.isApproversVisible = true;
        this.isRemarkReq = true;
        this.isTag_ApproverShow = false;
        this.isTagHead_ApproverShow = false;
        this.isDH_ApproverShow = false;
        this.isSvp_ApproverShow = false;
        this.isFunctionHeadApproverShow = false;
        this.isPresidentCOOApprShow = true;
        if (CDOEmpId) {
          this.isCDOApprShow = true;
        }
        TagLead_Approver.clearValidators();
        TagLead_Approver.reset();
        TAGHead_Approver.clearValidators();
        TAGHead_Approver.reset();
        DH_Approver.clearValidators();
        DH_Approver.reset();
        SVP_Approver.clearValidators();
        SVP_Approver.reset();
        FH_Approver.clearValidators();
        FH_Approver.reset();
        setTimeout(() => {
          this.getControl('COO_Approver').patchValue(COOEmpId);
          this.getControl('CDO_Approver').patchValue(CDOEmpId);
        }, 1000);
      }else if (offerApprDet?.StatusID == 75) {
        this.isApproversVisible = true;
        this.isRemarkReq = true;
        this.isTag_ApproverShow = false;
        this.isTagHead_ApproverShow = false;
        this.isDH_ApproverShow = false;
        this.isSvp_ApproverShow = false;
        this.isFunctionHeadApproverShow = false;
        this.isPresidentCOOApprShow = false;
        this.isCDOApprShow = true;
        TagLead_Approver.clearValidators();
        TagLead_Approver.reset();
        TAGHead_Approver.clearValidators();
        TAGHead_Approver.reset();
        DH_Approver.clearValidators();
        DH_Approver.reset();
        SVP_Approver.clearValidators();
        SVP_Approver.reset();
        FH_Approver.clearValidators();
        FH_Approver.reset();
        COO_Approver.clearValidators();
        COO_Approver.reset()
        setTimeout(() => {
          this.getControl('CDO_Approver').patchValue(CDOEmpId);
        }, 1000);
       }
       else {
        this.isApproversVisible = false;
        this.isRemarkReq = false;
        remarksCtrl.clearValidators();
        remarksCtrl.reset();
        TagLead_Approver.clearValidators();
        TagLead_Approver.reset();
        TAGHead_Approver.clearValidators();
        TAGHead_Approver.reset();
        DH_Approver.clearValidators();
        SVP_Approver.clearValidators();
        COO_Approver.clearValidators();
        CDO_Approver.clearValidators();
        DH_Approver.reset();
        SVP_Approver.reset();
        COO_Approver.reset()
        CDO_Approver.reset()
        this.isTag_ApproverShow = false;
        this.isTagHead_ApproverShow = false;
        this.isDH_ApproverShow = false;
        this.isSvp_ApproverShow = false;
        this.isPresidentCOOApprShow = false;
        this.isCDOApprShow = false;
      }
    } else if (this.data?.callType == 2) { // to change pending approvers
      if (offerApprDet?.StatusID == 20) {
        this.isApproversVisible = true;
        this.isRemarkReq = true;
        this.isTag_ApproverShow = true;
        if (tagHeadEmpId) {
          this.isTagHead_ApproverShow = true;
        }
        if (DHEmpId) {
          this.isDH_ApproverShow = true;
        }
        if (SVPEmpId) {
          this.isSvp_ApproverShow = true;
        }
        if (COOEmpId) {
          this.isPresidentCOOApprShow = true;
        }
        if (FuncHeadEmpId) {
          this.isFunctionHeadApproverShow = true;
        }
        if (CDOEmpId) {
          this.isCDOApprShow = true;
        }
        setTimeout(() => {
          TagLead_Approver.patchValue(tagLeadEmpId);
          TAGHead_Approver.patchValue(tagHeadEmpId);
          this.getControl('DH_Approver').patchValue(DHEmpId);
          this.getControl('SVP_Approver').patchValue(SVPEmpId);
          this.getControl('COO_Approver').patchValue(COOEmpId);
          this.getControl('FunctionHead').patchValue(FuncHeadEmpId);
          this.getControl('CDO_Approver').patchValue(CDOEmpId);
        }, 1000);
      } else if (offerApprDet?.StatusID == 25) {
        this.isApproversVisible = true;
        this.isRemarkReq = true;
        this.isTag_ApproverShow = false;
        this.isTagHead_ApproverShow = true;
        if (DHEmpId) {
          this.isDH_ApproverShow = true;
        }
        if (SVPEmpId) {
          this.isSvp_ApproverShow = true;
        }
        if (COOEmpId) {
          this.isPresidentCOOApprShow = true;
        }
        if (FuncHeadEmpId) {
          this.isFunctionHeadApproverShow = true;
        }
        if (CDOEmpId) {
          this.isCDOApprShow = true;
        }
        TagLead_Approver.clearValidators();
        TagLead_Approver.reset();
        setTimeout(() => {
          TAGHead_Approver.patchValue(tagHeadEmpId);
          this.getControl('DH_Approver').patchValue(DHEmpId);
          this.getControl('SVP_Approver').patchValue(SVPEmpId);
          this.getControl('COO_Approver').patchValue(COOEmpId);
          this.getControl('FunctionHead').patchValue(FuncHeadEmpId);
          this.getControl('CDO_Approver').patchValue(CDOEmpId);
        }, 1000);
      } else
       if (offerApprDet?.StatusID == 40 || offerApprDet?.StatusID == 45) {
        this.isApproversVisible = true;
        this.isRemarkReq = true;
        this.isTag_ApproverShow = false;
        this.isTagHead_ApproverShow = false;
        this.isDH_ApproverShow = true;
        if (SVPEmpId) {
          this.isSvp_ApproverShow = true;
        }
        if (COOEmpId) {
          this.isPresidentCOOApprShow = true;
        }
        if (FuncHeadEmpId) {
          this.isFunctionHeadApproverShow = true;
        }
        if (CDOEmpId) {
          this.isCDOApprShow = true;
        }
        TagLead_Approver.clearValidators();
        TagLead_Approver.reset();
        TAGHead_Approver.clearValidators();
        TAGHead_Approver.reset();
        setTimeout(() => {
          this.getControl('DH_Approver').patchValue(DHEmpId);
          this.getControl('SVP_Approver').patchValue(SVPEmpId);
          this.getControl('COO_Approver').patchValue(COOEmpId);
          this.getControl('FunctionHead').patchValue(FuncHeadEmpId);
          this.getControl('CDO_Approver').patchValue(CDOEmpId);
        }, 1000);
      } else if (offerApprDet?.StatusID == 60) {
        this.isApproversVisible = true;
        this.isRemarkReq = true;
        this.isTag_ApproverShow = false;
        this.isTagHead_ApproverShow = false;
        this.isDH_ApproverShow = false;
        this.isFunctionHeadApproverShow = false
        this.isSvp_ApproverShow = true;
        if (COOEmpId) {
          this.isPresidentCOOApprShow = true;
        }
        if (CDOEmpId) {
          this.isCDOApprShow = true;
        }
        TagLead_Approver.clearValidators();
        TagLead_Approver.reset();
        TAGHead_Approver.clearValidators();
        TAGHead_Approver.reset();
        DH_Approver.clearValidators();
        DH_Approver.reset();
        FH_Approver.clearValidators();
        FH_Approver.reset();
        setTimeout(() => {
          this.getControl('SVP_Approver').patchValue(SVPEmpId);
          this.getControl('COO_Approver').patchValue(COOEmpId);
          this.getControl('CDO_Approver').patchValue(CDOEmpId);
        }, 1000);
      } else if (offerApprDet?.StatusID == 80) {
        this.isApproversVisible = true;
        this.isRemarkReq = true;
        this.isTag_ApproverShow = false;
        this.isTagHead_ApproverShow = false;
        this.isDH_ApproverShow = false;
        this.isSvp_ApproverShow = false;
        this.isFunctionHeadApproverShow = false;
        this.isPresidentCOOApprShow = true;
        if (CDOEmpId) {
          this.isCDOApprShow = true;
        }
        TagLead_Approver.clearValidators();
        TagLead_Approver.reset();
        TAGHead_Approver.clearValidators();
        TAGHead_Approver.reset();
        DH_Approver.clearValidators();
        DH_Approver.reset();
        SVP_Approver.clearValidators();
        SVP_Approver.reset();
        FH_Approver.clearValidators();
        FH_Approver.reset();
        setTimeout(() => {
          this.getControl('COO_Approver').patchValue(COOEmpId);
          this.getControl('CDO_Approver').patchValue(CDOEmpId);
        }, 1000);
      } else if(offerApprDet?.StatusID == 65){
        this.isApproversVisible = true;
        this.isRemarkReq = true;
        remarksCtrl.clearValidators();
        remarksCtrl.reset();
        TagLead_Approver.clearValidators();
        TagLead_Approver.reset();
        TAGHead_Approver.clearValidators();
        TAGHead_Approver.reset();
        DH_Approver.clearValidators();
        SVP_Approver.clearValidators();
        COO_Approver.clearValidators();
        DH_Approver.reset();
        SVP_Approver.reset();
        COO_Approver.reset();
        this.isTag_ApproverShow = false;
        this.isTagHead_ApproverShow = false;
        this.isDH_ApproverShow = false;
        this.isSvp_ApproverShow = false;
        this.isPresidentCOOApprShow = false;
        this.isCDOApprShow = true;
        setTimeout(() => {
          this.getControl('CDO_Approver').patchValue(CDOEmpId);
        }, 1000);
      } 
      else {
        this.isApproversVisible = false;
        this.isRemarkReq = false;
        remarksCtrl.clearValidators();
        remarksCtrl.reset();
        TagLead_Approver.clearValidators();
        TagLead_Approver.reset();
        TAGHead_Approver.clearValidators();
        TAGHead_Approver.reset();
        DH_Approver.clearValidators();
        SVP_Approver.clearValidators();
        COO_Approver.clearValidators();
        CDO_Approver.clearValidators();
        DH_Approver.reset();
        SVP_Approver.reset();
        COO_Approver.reset();
        CDO_Approver.reset();
        this.isTag_ApproverShow = false;
        this.isTagHead_ApproverShow = false;
        this.isDH_ApproverShow = false;
        this.isSvp_ApproverShow = false;
        this.isPresidentCOOApprShow = false;
        this.isCDOApprShow = false;
      }
    } else {

    }
    TagLead_Approver.updateValueAndValidity();
    TAGHead_Approver.updateValueAndValidity();
    DH_Approver.updateValueAndValidity();
    SVP_Approver.updateValueAndValidity();
    COO_Approver.updateValueAndValidity();    
    CDO_Approver.updateValueAndValidity();
    remarksCtrl.updateValueAndValidity();
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

  /***
  * open documents popup
  */
  documentsDownload(data: any) {
    data['final'] = true;
    data['param'] = `cid=${this.data.cid}&ActionTakenBy=${data?.ApproverType == 0 ? 'R' : 'A'}&ActionId=${data.id}`;
    const dialogRef = this.dialog.open(RecruiApprovDocumentsModalComponent, {
      panelClass: ['ats-model-wrap', 'bgv-modal'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  //
  sendApprovalForm() {
    this.resendForApprovalForm = this._fb.group({
      TAGLead_Approver: [null],
      TAGHead_Approver: [null],
      DH_Approver: [null],
      SVP_Approver: [null],
      COO_Approver: [null],
      FunctionHead: [null],
      CDO_Approver: [null],
      remarks: [null, [Validators.required]],
    })
  }

  /*
  get control Method*/
  getControl(name: string) {
    return this.resendForApprovalForm.get(name);
  }

  //to identify approval based on old/ new matrix w.e.f 22-04-2023. 
  getDiff(e: any) {
    let addDt = new Date(e?.AddedOn);
    if (addDt.getTime() < this.wefNewApprovMatrxDt.getTime()) {
      return true;
    } else {
      return false;
    }

  }

  /***
   * get ApproverList
   */

  public DPApproverList: any = [];
  public GDLApproverList: any = [];
  public COOLApproverList: any = [];
  public funcHeadLevelApproverList: any = [];
  public CDOApproverList: any = [];
  getAllApproverList() {
    let userEmp = this._storage.getUserEmpId();
    let data = {
      empId: parseInt(userEmp),
      Division: this.data?.DivisionID,
      cid: this.data.cid,
      ReqTypeId: this.candData?.RequirementTypeId
    }
    forkJoin([
      this._globalApiServe.getApproverList(data.empId, 1, data.Division, data.cid, data.ReqTypeId),
      this._globalApiServe.getApproverList(data.empId, 2, data.Division, data.cid, data.ReqTypeId),
      this._globalApiServe.getApproverList(data.empId, 3, data.Division, data.cid, data.ReqTypeId),
      this._globalApiServe.getApproverList(data.empId, 4, data.Division, data.cid, data.ReqTypeId),
      this._globalApiServe.getApproverList(data.empId, 7, data.Division, data.cid, data.ReqTypeId)
    ]).subscribe(
      res => {
        this.DPApproverList = res[0]['data'];
        this.GDLApproverList = res[1]['data'];
        this.COOLApproverList = res[2]['data'];
        this.funcHeadLevelApproverList = res[3]['data'];
        this.CDOApproverList = res[4]['data'];
      }
    )
  }

  //submit resend approval
  resendApprovalSubmit(form: UntypedFormGroup) {
    
    form.markAllAsTouched();
    if (form.valid) {
      let formValue = form.value;
      formValue['cid'] = this.data.cid;
      this._offerService.resendOfferApproval(formValue).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res.Message);
          this.dialogRef.close(true);

        }
      )
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  //submit change approver
  changeApproverSubmit(form: UntypedFormGroup) {
    
    form.markAllAsTouched();
    if (form.valid) {
      let formValue = form.value;
      formValue['cid'] = this.data.cid;
      this._offerService.cahngeApprovers(formValue).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res.Message);
          this.dialogRef.close(true);

        }
      )
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }


}

