import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { BgvConfirmationDownloadComponent } from 'projects/ats-global-system/src/app/offer-module/modals/bgv-confirmation-download/bgv-confirmation-download.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { HttpClient } from '@angular/common/http';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OfferService } from 'projects/ats-global-system/src/app/offer-module/offer.service';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { ApprovalConfirmationDocumentDownloadComponent } from 'projects/ats-global-system/src/app/offer-module/modals/approval-confirmation-document-download/approval-confirmation-document-download.component';
@Component({
  selector: 'app-candidate-details-info',
  templateUrl: './candidate-details-info.component.html',
  styleUrls: ['./candidate-details-info.component.scss']
})
export class CandidateDetailsInfoComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() public candData: any = [];
  @Input() public detailsType: string = 'cd';
  @Input() public allRoundList: any = [];
  @Input() public offerAprDt: any = [];
  @Input() public approvalData: any = [];
  @Input() public data: any = [];
  @Input() public salaryGridShow: boolean = false;
  public location: any = [];
  public userData: any = {};
  public JfCategList: any = CONSTANTS.JfCategList;
  public aprvCountDataList: any = {};
  public isVisibleForUs: boolean = false;
  public isVisibleForIndia: boolean = false;

  public isC2cAndDCActive: boolean = false;
  public isC2cFieldsActive: boolean = false;
  public isG4AndAbove: boolean = false;
  public isC2cActive: boolean = false;
  // public isCorpToCorpActive: boolean = false;
  @Input() public talentDetails: any = {};
  constructor(
    public dialog: MatDialog,
    private _globalApiServe: GlobalApisService,
    private _storage: GetSetStorageService,
    private http: HttpClient,
    private _share: ShareService,
    private _offerService: OfferService,
    private getLocInfo: GetLocationInfo,
    private _commonMethodServe: GlobalCommonMethodService
  ) { }

  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    this.showFieldsForUs();

  }


  variablePayHideShow(grade: number) {

    // if (this.isG4AndAbove) {
    //   this.isVariablePay = true;
    //   this.getControl('variablePay')?.addValidators([Validators.required]);
    // } else {
    //   this.getControl('variablePay')?.clearValidators();
    //   this.isVariablePay = false;
    // }
    // this.getControl('variablePay')?.updateValueAndValidity();
  }

  /**showing fileds for usa and ind */
  showFieldsForUs() {
    // const locId = this._globalCommonMethod.getSetLocation().locId;
    /**3 for USA */
    if (this.getLocInfo.isLocationUS()) {
      this.isVisibleForUs = true;
      this.isVisibleForIndia = false;
    } else {
      this.isVisibleForIndia = true;
      this.isVisibleForUs = false;
    }
  }
  public techL1Round: any;
  public hideVarianceSal: boolean = true;
  public IsHiringWithSalaryGrid: boolean = true;
  ngOnChanges(changes: SimpleChanges): void {

    this.showHideFieldsC2CBase()
    this.isG4AndAbove = this._commonMethodServe.validationGradeAboveG4AndAbove(this.offerAprDt?.gradeId);
    if (this.allRoundList.length != 0) {
      let getTechL1Round = this.allRoundList.roundList.filter(b => (b.interviewType.Id === 2 && b.InterViewStatus.Id === 7) || b.interviewType.Id === 2 && b.InterViewStatus.Id === 10);
      this.techL1Round = getTechL1Round[0]?.InterviewDate;
    }

    if (this.offerAprDt.JoiningLocationID) {
      this._globalApiServe.getLocationList(this.offerAprDt.JoiningLocationID).subscribe(
        res => {
          this.location = res['data'][0]
        }
      );
    }
    if (this.offerAprDt.CandidateTypeID) {
      //  if(this.offerAprDt.CandidateTypeID === 1 ||this.offerAprDt.CandidateTypeID === 2){
      //    this.hideVarianceSal = false;
      //  }
      //  else{
      //   this.hideVarianceSal = true
      //  }
    }


if(this.offerAprDt.IsRenuTeam){
  if(this.offerAprDt.IsRenuTeam == 'N'){
    this.hideVarianceSal = true;
    this.IsHiringWithSalaryGrid = true
  }
  else{
   this.hideVarianceSal = false;
   this.IsHiringWithSalaryGrid = false;
  }
}

if(this.offerAprDt.IsHiringWithoutSalaryGrid == 'Y'){
  if(this.offerAprDt.IsHiringWithoutSalaryGrid == 'Y'){
    this.IsHiringWithSalaryGrid = false
  }
  else{
    this.IsHiringWithSalaryGrid = true
  }
}







    if (this.salaryGridShow) {
      if (this.offerAprDt.length !== 0 && this.candData.length !== 0) {
        // if(this.data?.DivisionID == 2){
        //   this.getApproverCont(this.offerAprDt.gradeId, 0 , this.offerAprDt.CTC, this.offerAprDt.JobFamilyID || 0, this.candData.totalExpYear, this.candData.totalExpMonth,null,this.candData?.candidateTypeId,this.data.DivisionID,this.offerAprDt?.joiningBonus,this.candData?.RequirementTypeId,this.offerAprDt?.PracticeId);
        // }else{
        //   this.getApproverCont(this.offerAprDt.gradeId,this.offerAprDt.gradeBandId, this.offerAprDt.CTC, this.offerAprDt.JobFamilyID || 0, this.candData.totalExpYear, this.candData.totalExpMonth,this.offerAprDt?.JobFamilyCategory || null,this.candData?.candidateTypeId,this.data.DivisionID,this.offerAprDt?.joiningBonus,this.candData?.RequirementTypeId,this.offerAprDt?.PracticeId);
        // }
      }
    }

    // getApproverCont(gradeID: number,gradeBand: number, ctc: number, jobFamilyId: number, ExpYear: number, ExpMonth: number, jfCateg:string, cndtype:string, div:number,joiningBonus:number= 0,RequirementTypeId:number=0,PracticeId:number=0) {
  }

  /**showing for other and hiding for c2c 14 and direct contractor 1010*/
  showHideFieldsC2CBase() {
    this.offerAprDt?.CandidateTypeID;

    if (this.offerAprDt?.CandidateTypeID) {
      if (this.offerAprDt?.CandidateTypeID == 14 || this.offerAprDt?.CandidateTypeID == 1010) {
        this.isC2cAndDCActive = true;
        if(this.offerAprDt?.CandidateTypeID == 14){
          this.isC2cFieldsActive = true;
        }else{
          this.isC2cFieldsActive = false;
        }
      } else {
        this.isC2cAndDCActive = false;
      }
    }

  }
  ngAfterViewInit(): void {
  }

  /**
    * show interview round details
    * @param data
    */
  openfeedbackInfoModal(data: any) {
    data['final'] = true;
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

  hideVarienceSalary(elm: any) {
    if (this.offerAprDt.length != 0) {
      if (
        elm?.CandidateTypeID != 1 ||
        elm?.CandidateTypeID != 2) {
        return false
      }
      else {
        return true
      }
    }


  }

  hideshowBgv(elm: any) {
    if (
      elm?.OfferStatusID == 120 ||
      elm?.OfferStatusID == 140 ||
      elm?.OfferStatusID == 160 ||
      elm?.OfferStatusID == 180 ||
      elm?.OfferStatusID == 200 ||
      elm?.OfferStatusID == 220) {
      return true
    }
    else {
      return false
    }
  }

  //bgv modal
  bgvDownldModal(data: any) {
    data['final'] = true;
    const dialogRef = this.dialog.open(BgvConfirmationDownloadComponent, {
      panelClass: ['ats-model-wrap', 'bgv-modal'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  //appr doc modal
  apprDocDownldModal(data: any) {
    data['final'] = true;
    const dialogRef = this.dialog.open(ApprovalConfirmationDocumentDownloadComponent, {
      panelClass: ['ats-model-wrap', 'bgv-modal'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  getApproverCont(gradeID: number, gradeBand: number, ctc: number, jobFamilyId: number, ExpYear: number, ExpMonth: number, jfCateg: string, cndtype: string, div: number, joiningBonus: number = 0, RequirementTypeId: number = 0, PracticeId: number = 0) {
    this._offerService.getApprovalCount(gradeID, gradeBand, ctc, jobFamilyId, ExpYear, ExpMonth, jfCateg, cndtype, div, joiningBonus, RequirementTypeId, PracticeId).subscribe
      (
        res => {
          this.aprvCountDataList = res['data'][0];
        }
      )
  }

  /***
    * download file
    */
  dwnloadFileSingle(data:any) {
    if (data?.ProfileId == 3) {
      this._commonMethodServe.downloadFileCskill(data?.resume_path, data?.c_resume);
    }
    else {
      data.cid ? this._commonMethodServe.downloadResume(data.cid,"") : this._commonMethodServe.downloadResume("", data.id)
     // this._commonMethodServe.downloadFileCommon(data?.resume_path, data?.c_resume);
    }
  }

   /***
    * download file
    */
  dwnloadFileOfferIn(data:any) {
    debugger
    this.http.get(`${environment.apiMainUrlNet}offer/DownloadOfferInHandDocument?cid=${data.cid}`, { responseType: 'blob' }).subscribe(
        res => {
          saveAs(res,this._commonMethodServe.removeLastExtension(this.offerAprDt?.OfferInHandFileName));
        },
        (error) => {
          this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
  }

  isInfogainUrl(url: string) {
    let c_skillProfilePath = 'https://www.infogain.com';
    if(url?.toLowerCase().includes(c_skillProfilePath)){
      return true;
    }else{
      return false;
    }
  }

}
