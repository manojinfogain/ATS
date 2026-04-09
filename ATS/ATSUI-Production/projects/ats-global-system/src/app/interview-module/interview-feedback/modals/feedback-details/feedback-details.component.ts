import { Component, Inject, OnInit } from '@angular/core';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { HttpClient } from '@angular/common/http';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CandidateProfilePicIntComponent } from 'projects/ats-global-system/src/app/common-sharing/interview/candidate-profile-pic-int/candidate-profile-pic-int.component';
import { DownloadSalaryDocumentModalComponent } from '../download-salary-document-modal/download-salary-document-modal.component';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { PreviewMediaFileModalComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/preview-media-file-modal/preview-media-file-modal.component';
import { OnboardService } from 'projects/ats-global-system/src/app/onboard-module/onboard.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { InrerviewsService } from '../../../inrerviews.service';
import { CandidateCommonApiService } from 'projects/ats-global-system/src/app/core/services/candidate-common-api.service';
import { ViewCoderbyteReportComponent } from '../view-coderbyte-report/view-coderbyte-report.component';
import { get } from 'http';
@Component({
  selector: 'app-feedback-details',
  templateUrl: './feedback-details.component.html',
  styleUrls: ['./feedback-details.component.scss']
})
export class FeedbackDetailsComponent implements OnInit {
  displayedColumns = ['Traits', 'comments', 'Rating'];
  displayedColumns1 = ['Areas', 'Rating'];
  displayedColumnsGenAI = ['Areas', 'RatingPanel', 'RatingAI'];
  ScreeningdisplayedColumns = ['Skills', 'Proficiency', 'Exp'];
  displayedColumns2 = ['QuestionAuto', 'AutoQAns', 'Rating'];
  displayedColumns3 = ['QuestionAuto', 'AutoQAns', 'Rating', 'RatingAI'];
  public candidateData: any = [];
  public roundDataList: any = [];
  public GenAIResponsesList: any = [
    { Area: "Leadership", Rating: "2.5" },
    { Area: "Role Fitment", Rating: "3.5" },
    { Area: "Team Collaboration", Rating: "3" },
    { Area: "Technical Proficiency", Rating: "4" },
    { Area: "Client Interface", Rating: "2" },
    { Area: "Sentiment Orientation", Rating: "Neutral" }
  ];
  public GenAIResponsesListModel: any = []
  public userData: any = {};
  public profilePics: any = [];
  public profileVid: any = [];
  public profileIds: any = [];
  public profileIdsHRRnd: any = [];
  public isLocIndia: boolean = true;
  public feedbackDetails: any = [];
  public FeedbackTitle = 'Detailed feedback';
  constructor(
    public dialogRef: MatDialogRef<FeedbackDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private http: HttpClient,
    private dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _onboardServ: OnboardService,
    private _GlobCommon: GlobalCommonMethodService,
    private getLocInfo: GetLocationInfo,
    private _intServe: InrerviewsService,
    private _candidateCommonSer: CandidateCommonApiService
  ) { }

  public locationData: any = {};
  public videocompData: any = {};
  public sendingDataFrmInt: any = [];



  public AIAutoQuestFeedbackData: any = [];
  public isAssessmentCombineRating: boolean = false;
  public isAifeedbackCombineRating: boolean = false;
  ngOnInit() {

    if (this.data?.candidateData?.requirementTypeId == 6) {
      this.FeedbackTitle = 'Recommendation'
    }

    this.candidateData = this.data.candidateData;
    this.roundDataList = this.data.roundList;
    this.GenAIResponsesList = this.roundDataList?.AIAreaRating;
   // this.GenAIResponsesListModel = this.GenAIResponsesList;
   if (this.roundDataList?.AIAreaRating.length > 0) {
    this.isAssessmentCombineRating = true;
    this.GenAIResponsesListModel= this._GlobCommon.mergeAIAndPanelAssessmentData(this.roundDataList?.areas,this.roundDataList?.AIAreaRating);
   }
   if (this.roundDataList?.AIQuestRating.length > 0) {
    this.isAifeedbackCombineRating = true;
    this.AIAutoQuestFeedbackData = this._GlobCommon.mergeAIQuestRating(this.roundDataList?.autoQuestionFeedback,this.roundDataList?.AIQuestRating);
   }
   debugger

    // Object.keys(this.GenAIResponsesList[0]).forEach(key => { 
    //  this.GenAIResponsesListModel.push({Area:this.getAreaName(key),Rating:this.GenAIResponsesList[0][key]});
    // } );     
    // console.log(this.GenAIResponsesListModel);
    // debugger
    this.getProfileDetails(this.candidateData?.cid);

    this.userData = this._storage.getSetUserData();
    // this.getVideoIdPath(this.roundDataList?.RoundId);
    this.getVideoIdPath(this.candidateData?.cid, this.roundDataList?.RoundId);
    this.sendingDataFrmInt['cid'] = this.candidateData?.cid;
    this.sendingDataFrmInt['roundId'] = this.roundDataList?.RoundId;
    this.getFeedbackDetails(this.candidateData?.cid, this.roundDataList?.RoundId);
    this.locationData = this.getLocInfo;
    this.isLocIndia = this.getLocInfo.isLocationIndia(null) ? true : false;
    if (this.isLocIndia) {
      this._intServe.getVideoComparisonInfoByRoundId(this.candidateData?.cid, this.roundDataList?.RoundId).subscribe(
        res => {
          this.videocompData = res['data'][0];
        }
      )
    }

  }

  getAreaName(key) {
    if (key == 'TransLeadership') {
      return 'Leadership';
    } else if (key == 'TransRoleFitment') {
      return 'Role Fitment';
    } else if (key == 'TransTeamCollaboration') {
      return 'Team Collaboration';
    } else if (key == 'TransTechnicalProficiency') {
      return 'Technical Proficiency';
    } else if (key == 'TransClientInterface') {
      return 'Client Interface';
    } else if (key == 'TransSentimentOrientation') {
      return 'Sentiment Orientation ';
    } else if (key == 'Communication') {
      return 'Communication';
    } else if (key == 'Confidence') {
      return 'Confidence';
    }
  }

  /**get profile details api */
  public candidateProfDetails: any = [];
  getProfileDetails(cid: number) {
    this._candidateCommonSer.getCandidateDetailsProfile(cid, null, null).subscribe(
      res => {
        this.candidateProfDetails = res['data'][0];
      }
    )
  }

  /**getting detailed feedback quesionnaire  */
  public isNewQuestionnaireFeedback: Boolean = false;
  getFeedbackDetails(cid: number, roundId: number) {
    this._intServe.getFeedbackQuesionnaire(cid, roundId).subscribe(
      res => {
        this.feedbackDetails = res['data'][0];
        if (res['data'].length == 1) {
          if (this.feedbackDetails?.statusId == 5 || this.feedbackDetails?.statusId == 7 || this.feedbackDetails?.statusId == 10) {
            this.isNewQuestionnaireFeedback = true;
          } else {
            this.isNewQuestionnaireFeedback = false;
          }
        }
      }
    )
  }
  /***
     * download file 
     */
  dwnloadFileSingle(data) {

    // let resumeName = this._GlobCommon.removeLastExtension(data?.testAttachment);
    // this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${encodeURIComponent(data.Path)}`, { responseType: 'blob' }).subscribe(
    //   res => {
    //     saveAs(res, resumeName);
    //   }
    // )
    let resumeName = this._GlobCommon.removeLastExtension(data?.testAttachment);
    this.http.get(`${environment.apiMainUrlNet}Interview/downloadInterviewDocument?cid=${this.data?.candidateData?.cid}&roundid=${this.data?.roundList.RoundId}&docType=${data?.testAttachmentKey}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, resumeName);
      }
    )


  }

  /***
   * download file 
   */
  dwnloadFileSingleOffer(data) {
    this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${data.OfferLetterAttPath + '/' + data.OfferLetterAtt}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, data.OfferLetterAtt);
      }
    )
  }

  /***
     * download salary doc of candidate 
     */
  downloadSalaryDocumentModal(data) {
    data['title'] = 'Download Salary Supporting Documents'
    data['cid'] = this.candidateData.cid;
    const dialogRef = this.dialog.open(DownloadSalaryDocumentModalComponent, {
      panelClass: ['ats-model-wrap', 'bgv-modal'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  /***
   * open candidate pic popup
   */
  viewCandidatePictureModal() {
    //  data['final'] = true;
    //  data['param'] = `cid=${this.data.cid}&ActionTakenBy=${data?.ApproverType == 0?'R':'A'}&ActionId=${data.id}`;
    const dialogRef = this.dialog.open(CandidateProfilePicIntComponent, {
      panelClass: ['ats-model-wrap', 'canidate-profil-picture-modal'],
      data: {
        roundId: this.roundDataList.RoundId,
        name: this.candidateData.Name,
        roundList: this.data.roundList,
        // Type: this.data.roundList?.interviewType?.Type
      },
      // data: {roundId:21774,
      // name:this.candidateData.Name
      // }

      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }



  // getVideoIdPath(roundId: number) {
  //   this._onboardServ.getVideoIdentityProfilePic(`RoundId=${roundId}`).subscribe(
  //     res => {
  //       this.profilePics = res['profilePic'][0];
  //       // this.profileVid = res['profileVid'][0];
  //       // this.profileIds = res['profileId'][0];
  //     }

  //   )
  // }

  //   get id/video files for current round
  getVideoIdPath(cid: number, roundId: number) {
    this._onboardServ.getVideoIdentityProfilePic(`cid=${cid}`).subscribe(
      res => {
        // this.profilePics = res['profilePic'][0];
        let curVid = res['profileVid'].filter(d => d.RoundId == roundId);
        this.profileVid = curVid[0];
        let curId = res['profileId'].filter(d => (d.RoundId == roundId && d.IsHRFinal != 'Y'));
        let curIdHRRnd = res['profileId'].filter(d => d.IsHRFinal == 'Y');
        this.profileIds = this.roundDataList?.interviewType.Id === 1 ? curId[0] : curIdHRRnd[0];
      }
    )
  }

  openReportModal(elm: any) {
    // elm['title'] = elm?.Name + '';
    // elm['title'] = 'Report';
    const dialogRef = this.dialog.open(ViewCoderbyteReportComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: this.data?.candidateData,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

  //   view/download candidate video
  DownloadTrans(fileData: any) {
    if (fileData?.sharePointIdTransScript) {
      this.http.get(`${environment.apiMainUrlNet}Common/downloadSharePointFile?id=${fileData?.sharePointIdTransScript}&fileName=${fileData?.FileNameTransScript}`, { responseType: 'blob' }).subscribe(
        res => {
          saveAs(res, fileData?.FileNameTransScript);
        },
        (error) => {
          // this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }
  }

  //   view/download candidate video
  viewVideo(fileData: any) {
    if (fileData?.sharePointIdVideo) {
     this.http
       .get(
         `${environment.apiMainUrlNet}Common/downloadSharePointFile?id=${fileData?.sharePointIdVideo}&fileName=${encodeURIComponent(fileData?.fileName)}`,
         { responseType: 'blob' },
       )
       .subscribe((res) => {
         const videoUrl = URL.createObjectURL(res);

         let data = {
           file: videoUrl,
           fileType: 'V',
           fileName: fileData.fileName,
         };

         const dialogRef = this.dialog.open(PreviewMediaFileModalComponent, {
           data: data,
           width: '500px',
           height: 'auto',
           panelClass: ['ats-model-wrap', 'ats-preview-media-model'],
           backdropClass: 'mop-image-crop-modal-overlay',
         });
       });
    }
    else {
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${fileData?.filePath}`, { responseType: 'blob' }).subscribe(
        res => {
          let reader = new FileReader();
          reader.readAsDataURL(res);
          reader.onload = () => {
            // this.pathSrc = reader.result;
            let data = {
              file: reader.result,
              fileType: 'V',
              fileName: fileData.fileName
            }
            const dialogRef = this.dialog.open(PreviewMediaFileModalComponent,
              {
                data: data,
                // disableClose: true,
                width: '500px',
                height: 'auto',
                panelClass: ['ats-model-wrap', 'ats-preview-media-model'],
                backdropClass: 'mop-image-crop-modal-overlay'
              }
            );
          }
        },
        (error) => {
          // this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }

  }

  //   view/download candidate ID Proof
  viewIDProof(data: any) {
    this._GlobCommon.downloadGovtIdDocument(data?.cid, data?.fileName);
  }


  isVideoVisibble(data: any) {
    if (data?.interviewType?.Id === 2 && data?.interviewBy == 'I' ||
      data?.interviewType?.Id === 4 && data?.interviewBy == 'I' ||
      data?.interviewType?.Id === 5 && data?.interviewBy == 'I' ||
      data?.interviewType?.Id === 6 && data?.interviewBy == 'I' ||
      data?.interviewType?.Id === 1 && this.profileVid?.fileName) {
      return true
    }
    else {
      return false
    }
  }

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

}
