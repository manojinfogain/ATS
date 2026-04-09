import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { FILE_UPLOAD } from '../../../core/constant/common.const';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import { ShareService } from '../../../core/services/share.service';
import { PreviewMediaFileModalComponent } from '../../../shared/shared-app/components/preview-media-file-modal/preview-media-file-modal.component';
import { OnboardService } from '../../onboard.service';
import { InrerviewsService } from '../../../interview-module/inrerviews.service';
import { VideoUploadGuidelineComponent } from '../../../common-sharing/modals/video-upload-guideline/video-upload-guideline.component';
import { VideoMatchOnboardAlertComponent } from '../video-match-onboard-alert/video-match-onboard-alert.component';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { G5AboveCpmmon } from '../../../core/common/g5AboveCommon';
@Component({
  selector: 'app-candidate-identity-verification-modal-hr',
  templateUrl: './candidate-identity-verification-modal-hr.component.html',
  styleUrls: ['./candidate-identity-verification-modal-hr.component.scss']
})
export class CandidateIdentityVerificationModalHrComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CandidateIdentityVerificationModalHrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private _onboardServ: OnboardService,
    private _share: ShareService,
    private _GlobCommon: GlobalCommonMethodService,
    private _fb: UntypedFormBuilder,
    private http: HttpClient,
    private _storage: GetSetStorageService,
    public _intServe: InrerviewsService
  ) { }


  public profilePics: any = [];
  public profileVid: any = [];
  public profileRecentVideo: any = [];
  public profileIds: any = [];
  public HrVerificationForm: UntypedFormGroup = new UntypedFormGroup({});
  public HrVrfData: any = {};
  public userData: any = {};
  public isCandidateVerificationForm: boolean = false;
  public isEmpVerificationForm: boolean = false;
  public isRMVerificationForm: boolean = false;
  public isIssVerificationForm: boolean = false;
  public videoConsentPlaceholderAgre: string = '';
  public videoConsentPlaceholderDesAgre: string = '';
  public leadershipVideoDetails: any = {};
  public isG7AndAbove: boolean = false;
  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    /***
    * FormInit
    */

    this.HrVerificationForm = this._fb.group(
      {
        file: [null],
        IsConsent: [null],
        remarks: [null],
        onboardingMode: ['I', Validators.required],
        onboardingConsent: [null]
      }
    );
    /***
     * Init API
     */
    let candidateId = this.data?.candidateId;
    debugger
    const queryParams: any = `Candidateid=${candidateId}`;
    this._onboardServ.getVideoIdentityProfilePic(queryParams).subscribe(
      res => {
        this.profilePics = res['profilePic'];
        this.profileVid = res['profileVid'];
        this.profileIds = res['profileId'];
        this.profileRecentVideo = res['profileRecentVideo'];
        if (this.profileVid?.length !== 0) {
          this.isPrevVidAvl = true;
        } else {
          this.isPrevVidAvl = false;
        }
      }

    )
    this._onboardServ.getVideoProfilePicOnboard(candidateId).subscribe(
      res => {
        this.HrVrfData = res['data'][0];
        if ((!this.HrVrfData?.IsConsent && this.data?.type == 'C') && this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y') {
          this.isCandidateVerificationForm = true;
          this.isEmpVerificationForm = false;
          this.isRMVerificationForm = false;
          this.isIssVerificationForm = false;
          this.videoConsentPlaceholderAgre = ``;
        }
        else if ((!this.HrVrfData?.EmpIsConsent && this.data?.type == 'E') && this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y') {
          this.isEmpVerificationForm = true;
          this.isCandidateVerificationForm = false;
          this.isRMVerificationForm = false;
          this.isVirtual = true;
          this.isInPerson = false;
          this.isIssVerificationForm = false;
          this.getControl('onboardingMode').clearValidators();
          this.getControl('onboardingMode').updateValueAndValidity();

          this.getControl('onboardingConsent').clearValidators();
          this.getControl('onboardingConsent').updateValueAndValidity();

          this.consenttextOk = `I confirm that the employee is the same as the one who was onboarded.`;
          this.consenttextNotOk = `I confirm that the employee is <strong>NOT</strong> the same as the one who was onboarded.`;
          this.leaderConsenttextOk = `I have verified candidate picture and declare that these are aligned with candidate.`
          this.leaderConsenttextNotOk = `I have verified candidate picture and declare that these are <strong>NOT</strong> aligned with candidate.`
        }
        else if ((!this.HrVrfData?.RMIsConsent && this.data?.type == 'RM') && this.userData?.otherRoles?.IsRM == 'Y') {
          this.isRMVerificationForm = true;
          this.isEmpVerificationForm = false;
          this.isCandidateVerificationForm = false;
          this.isIssVerificationForm = false;
          //  this.isVirtual = true;
          this.isInPerson = true;
          // this.getControl('onboardingMode').clearValidators();
          // this.getControl('onboardingMode').updateValueAndValidity();

          this.getControl('onboardingConsent').clearValidators();
          this.getControl('onboardingConsent').updateValueAndValidity();

          this.consenttextOk = `I confirm that the employee matches with the pictures and videos that are available in the system.`;
          this.consenttextNotOk = `I confirm that the employee does <strong>NOT</strong> match with the pictures and videos that are available in the system.`;
        }
        else if ((!this.HrVrfData?.ISSIsConsent && this.data?.type == 'IS') && this.userData?.RoleId == 7) {
          this.isIssVerificationForm = true;
          this.isRMVerificationForm = false;
          this.isEmpVerificationForm = false;
          this.isCandidateVerificationForm = false;
          //  this.isVirtual = true;
          this.isInPerson = true;
          // this.getControl('onboardingMode').clearValidators();
          // this.getControl('onboardingMode').updateValueAndValidity();

          this.getControl('onboardingConsent').clearValidators();
          this.getControl('onboardingConsent').updateValueAndValidity();

          this.consenttextOk = `I confirm that the employee interacting with ISS team regarding allotment of company assets corresponds to available pictures and videos of the employee.`;
          this.consenttextNotOk = `I confirm that the employee interacting with ISS team regarding allotment of company assets does <strong>NOT</strong> correspond to available pictures and videos of the employee.`;
        }
        else {
          this.isCandidateVerificationForm = false;
          this.isEmpVerificationForm = false
        }

      }
    )


    this.getOnboardingMode(this.getControl('onboardingMode'));

  }

  //on change of onboarding mode
  public isPrevVidAvl: boolean = false;
  public isVirtual: boolean = false;
  public isInPerson: boolean = false;
  getOnboardingMode(modeVal: any) {
    let fileCtrl = this.getControl('file');
    let IsConsentCtrl = this.getControl('IsConsent');
    let onboardingConsentCtrl = this.getControl('onboardingConsent');
    let remarksCtrl = this.getControl('remarks');
    if (modeVal.value == 'V') {
      this.isVirtual = true;
      this.isInPerson = false;
      fileCtrl.addValidators([Validators.required]);
      IsConsentCtrl.addValidators([Validators.required]);
      onboardingConsentCtrl.clearValidators();
      onboardingConsentCtrl?.reset();
    } else if (modeVal.value == 'I') {
      this.isVirtual = false;
      this.isInPerson = true;
      fileCtrl.clearValidators();
      fileCtrl?.reset();
       IsConsentCtrl.clearValidators();
       IsConsentCtrl?.reset();
      remarksCtrl.clearValidators();
      debugger
      if (this.data?.type == 'C') {
        IsConsentCtrl?.reset();
        onboardingConsentCtrl.addValidators([Validators.required]);
      } else {
        IsConsentCtrl.addValidators([Validators.required]);
      }
    } else {
      this.isVirtual = false;
      this.isInPerson = false;
    }
    fileCtrl.updateValueAndValidity();
    IsConsentCtrl.updateValueAndValidity();
    remarksCtrl.updateValueAndValidity();
    onboardingConsentCtrl.updateValueAndValidity();
  }


  getControl(name: string) {
    return this.HrVerificationForm.get(name);
  }

  /**
   * download
   */
  downloadId(data: any) {
    this._GlobCommon.downloadFileCommon(data?.filePath, data?.fileName);
  }
  /**
   * 
   * @param fileData 
   */
  viewVideoHr(fileData: any, type: string) {
    let sharePointIdVideo: any = '';
    let filePathVideo: any = '';

    if (type == 'O') {
      sharePointIdVideo = fileData?.sharePointIdVideo ? fileData?.sharePointIdVideo : '';
      filePathVideo = fileData?.FilePathVideo ? fileData?.FilePathVideo : '';
    }
    else if (type == 'E') {
      sharePointIdVideo = fileData?.EmpsharePointIdVideo ? fileData?.EmpsharePointIdVideo : '';
      filePathVideo = fileData?.EmpFilePathVideo ? fileData?.EmpFilePathVideo : '';
    }
    else if (type == 'H') {
      sharePointIdVideo = fileData?.EmpsharePointIdVideo ? fileData?.EmpsharePointIdVideo : '';
      filePathVideo = fileData?.EmpFilePathVideo ? fileData?.EmpFilePathVideo : '';
    }
    else if (type == 'RM') {
      sharePointIdVideo = fileData?.RMsharePointIdVideo ? fileData?.RMsharePointIdVideo : '';
      filePathVideo = fileData?.RMFilePathVideo ? fileData?.RMFilePathVideo : '';
    }
    else if (type == 'IS') {
      sharePointIdVideo = fileData?.ISSsharePointIdVideo ? fileData?.ISSsharePointIdVideo : '';
      filePathVideo = fileData?.ISSFilePathVideo ? fileData?.ISSFilePathVideo : '';
    }
    if (sharePointIdVideo) {
      this.http.get(`${environment.apiMainUrlNet}Common/downloadSharePointFile?id=${sharePointIdVideo}&fileName=${fileData?.FileNameVideo}`, { responseType: 'blob' }).subscribe(
        res => {
          let reader = new FileReader();
          reader.readAsDataURL(res);
          reader.onload = () => {
            // this.pathSrc = reader.result;
            let data = {
              file: reader.result,
              fileType: 'V'
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
    else {
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${filePathVideo}`, { responseType: 'blob' }).subscribe(
        res => {
          let reader = new FileReader();
          reader.readAsDataURL(res);
          reader.onload = () => {
            // this.pathSrc = reader.result;
            let data = {
              file: reader.result,
              fileType: 'V'
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

  /**
   * 
   */
  consentUp(e: any) {
    if (e.value == 'N') {
      this.getControl('remarks').addValidators([Validators.required]);
    }
    else {
      this.getControl('remarks').clearValidators();
    }

    this.getControl('remarks').updateValueAndValidity();
  }

  /***
   * 
   */

  public consenttextOk = `I have verified candidate picture, video and government ID and declare that these
  are aligned with candidate.`
  public consenttextNotOk = `I have verified candidate picture, video and government ID and declare
  that these
  are <strong>NOT</strong> aligned with candidate.`
  public leaderConsenttextOk = `I have verified candidate picture and declare that these
  are aligned with candidate.`
  public leaderConsenttextNotOk = `I have verified candidate picture and declare
  that these are <strong>NOT</strong> aligned with candidate.`
  previewImageVideo(data: any = {}) {
    let pClass: any = [];
    if (data?.fileType == 'P') {
      pClass = ['ats-model-wrap', 'ats-preview-media-model', 'ats-preview-media-model-img']
    }
    else {
      pClass = ['ats-model-wrap', 'ats-preview-media-model', 'ats-preview-media-voice']
    }

    const dialogRef = this.dialog.open(PreviewMediaFileModalComponent,
      {
        data: data,
        disableClose: true,
        width: '500px',
        height: 'auto',
        panelClass: pClass,
        backdropClass: 'mop-image-crop-modal-overlay'
      }
    );
    dialogRef.afterClosed().subscribe(results => {
      if (results) {
        this.VoiceMatchData = results;
        if (this.VoiceMatchData?.videoMatchPercent < 50) {
          const dialogRefAlert = this.dialog.open(ConfirmationDialogComponent, {
            panelClass: 'ats-confirm',
            disableClose: true,
            data: {
              headerText: 'Video Match Result alert',
              message: `Video Match score is less than 50%. Do you want to send it to IT Team?`,
              buttonText: {
                ok: "Yes",
                cancel: "No"
              },
            }
          });
          dialogRefAlert.afterClosed().subscribe(results => {
            if (results) {
              this.consenttextOk = `As the Video comparisons mapping is less than 50%,  but i have  verified candidate picture, video and government ID and declare  that these are aligned with candidate.`;
              let body = {};
              //body['cid'] = this.data.cid;
              if (this.data?.isLeadershipActive == 'Y') {
                body['Candidateid'] = this.data.candidateId;
              } else {
                body['Candidateid'] = this.data.candidateId;
              }
              body['videoMatchPercent'] = this.VoiceMatchData?.videoMatchPercent || 0;
              // body['videoMatch'] = this.VoiceMatchData?.isVideoMatchSuc;
              if (this.data.type == 'C') {
                this._onboardServ.sendEmailtoITTeamOnboardVideoResult(body).subscribe(
                  res => {
                    this._share.showAlertSuccessMessage.next(res);
                  }
                )
              }
              else {
                this._onboardServ.SendEmailtoITTeamEmployeeVideoFail(body).subscribe(
                  res => {
                    this._share.showAlertSuccessMessage.next(res);
                  }
                )
              }

            }
          })

        }

      }
    });
  }


  /***
   * default value 
   */

  public VoiceMatchData: any = { videoMatchPercent: 0, isVoiceMatch: 'N', isVideoMatchSuc: 'T' };
  videoMatchDefault() {
    this.VoiceMatchData = { videoMatchPercent: 0, isVoiceMatch: 'N', isVideoMatchSuc: 'T' };
  }

  /** Method - picture and videos capture input condition wise - if leadership && Grade g7 and above only picture capture - else videos */
  videoPicUploadHandle(event: any, type: string) {
    if (type == 'P') {
      this.fileUpCandPicture(event);
    } else {
      this.videoUpload(event);
    }

  }
  /***
   * 
   */
  public canVidName: any;
  public canVidSrc: any;
  public fileSize: number;
  public videoFile:any;
  async videoUpload(event) {
    let allowedExtensions = /(\.mp4|\.MP4|\.mp4)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;
    this.canVidName = fileName;
    this.fileSize = file.size;
    this.videoFile = file;
    this.videoMatchDefault();
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type  MP4 only.');
      event.target.value = "";
      this.canVidSrc = '';
      this.videoFile = '';
      this.getControl('file').reset();
      return false;
    }
    if (file.size > FILE_UPLOAD.VIDEO_FILE_SIZE) {
      this._share.showAlertErrorMessage.next('File  cannot be greater than 50MB.');
      event.target.value = "";
      this.canVidSrc = '';
       this.videoFile = '';
      this.getControl('file').reset();
      return false;
    }
    else {
      const video = document.createElement('video');
      video.src = window.URL.createObjectURL(file);
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        let videoDurtion: number = parseInt(video.duration.toFixed(0));
        if (videoDurtion > 300) {
          this._share.showAlertErrorMessage.next('Video duration can not be greater than 5 minutes.');
        }
        else {
          this.canVidSrc = file;
           this.videoFile = file
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.canVidSrc = reader?.result.toString()?.replace(/^data:.+;base64,/, '');
            let data = {
              fileName: fileName,
              fileType: 'V',
              interviewType: '',
              isUpload: true,
              file: reader.result,
              //src type 1 = from interview feedback & 2 =  from onbording module 
              srcType: 2,
              videoMatchFile: this.canVidSrc,
              filesData: file
            }

            // let body = {
            //   cid:19893,
            //   RoundId: 23953,
            //   fileVideo: this.canVidSrc ,
            //   FileNameVideo: file.name,
            //   FileSizeVideo: file.size
            // }
            // this._intServe.uplaodVideoToSharePointInt(body).subscribe(
            //   res => {
            //   }
            // )
            // if (this.data?.isLeadership == 'Y') {
            //   data['isVoiceMatch'] = 'Y';
            //   data['profileVid'] = this.profileRecentVideo[0];
            //   this.previewImageVideo(data);
            // } else {

            // }
            if (this.profileRecentVideo.length !== 0) {
              data['isVoiceMatch'] = 'Y';
              data['profileVid'] = this.profileRecentVideo[0];
              this.previewImageVideo(data);
              // this.checkVoiceImprint(this.profileVid[0],this.canVidSrc);
            }
            else {
              // this._share.showAlertErrorMessage.next("Previous video is not available for comparison")
              data['isVoiceMatch'] = 'N';
              this.previewImageVideo(data);
            }


          }
        }
      }


    }
  }


  // public candidateID: any;
  public canVidNameLeader: any;
  public canPicSrcLeader: any;
  public fileSizeLeader: number;
  public picFile:any;
  // public canVidSrcLeader: any;
  fileUpCandPicture(event) {
    this.canPicSrcLeader = '';
    let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;
    this.canVidNameLeader = file?.name;
    this.fileSizeLeader = file.size;
    this.picFile = file;
    //this.validatorCheckBoxConsent(false);
    // this.isConsentSign = false;

    // this.UploadCandId.markAsTouched();
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type jpg/jpeg/png only.');
      event.target.value = "";
      this.canPicSrcLeader = '';
        this.picFile = '';
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 15MB.');
      event.target.value = "";
      this.canPicSrcLeader = '';
        this.picFile = '';
      return false;
    }
    else {
      this.canPicSrcLeader = file;
        this.picFile = file;
      //
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // const blob = this._commonMethodServe.base64toBlob(reader.result);
        this.canPicSrcLeader = reader.result.toString().replace(/^data:.+;base64,/, '');
        let data = {
          cid: this.data.cid,
          // RoundId: this.candidteRoundDetails.RoundId,
          fileID: this.canPicSrcLeader,
          FileNameID: file.name,
          // IdType: this.idTypeControl?.value,
          // IdNumber: this.idNumberControl?.value
        }
        let reqType = 1;
        // this.uploadCandIdVideoToServer(data, this.UploadCandId, reqType);
      }
    }
  }

  /***
   * VideoUploadGuideline
   */

  VideoUploadGuideline(element: any = {}) {
    element['title'] = "Video Recording Guidelines";
    element['docName'] = "Video Recording Guidelines";
    element['path'] = "\\\\ipagfileserver\\photos\\ATS\\ImpDocs\\ats-user-guideline\\Video-Guidelines.pdf";
    const dialogRef = this.dialog.open(VideoUploadGuidelineComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: element,
      disableClose: true
    });
  }

  /***
   * checkVoiceImprint
   */
  checkVoiceImprint(techVideo: any = {}, HRVideo: any) {

    let cb = {
      "cid": 0,
      "file1": this.canVidSrc,
      "file2": HRVideo,
      "techvidId": techVideo.sharePointIdVideo,
      "techvidName": techVideo.fileName
    }
    this._onboardServ.checkVoiceImprint(cb).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true)
      }
    )
  }

  /**
   * submit
   */
  submitRequest(form: UntypedFormGroup) {
    form.markAllAsTouched();
    debugger
    if (form.valid) {
      let body = form.value;
      let formData = new FormData();
      if (this.data?.isLeadershipActive == 'Y') {
        body['Candidateid'] = this.data.candidateId;
        formData.append("Candidateid", this.data.candidateId);
      } else {
        body['Candidateid'] = this.data.candidateId;
        formData.append("Candidateid", this.data.candidateId);
      }
      //candidateId = this.data?.isLeadershipActive == 'Y' ? this.data.CandidateId : this.data.Candidateid
      if (this.isVirtual) {
        body['videoMatchPercent'] = this.VoiceMatchData?.videoMatchPercent || 0;
        formData.append("videoMatchPercent", this.VoiceMatchData?.videoMatchPercent || 0);
        body['videoMatch'] = this.VoiceMatchData?.isVideoMatchSuc;
        formData.append("videoMatch", this.VoiceMatchData?.isVideoMatchSuc);
      }
      if (this.canVidSrc) {
        body['fileVideo'] = this.canVidSrc;
        formData.append("fileVideo", this.videoFile);
        body['FileNameVideo'] = this.canVidName;
          formData.append("FileNameVideo", this.canVidName);
        body['FileSizeVideo'] = this.fileSize;
          formData.append("FileSizeVideo", this.fileSize.toString());
        body['FileType'] = 'V';
        formData.append("FileType", 'V');
      }
      if (this.canPicSrcLeader) {
        body['fileVideo'] = this.canPicSrcLeader;
        formData.append("fileVideo", this.picFile);
        body['FileNameVideo'] = this.canVidNameLeader; 
        formData.append("FileNameVideo", this.canVidNameLeader);
        body['FileSizeVideo'] = this.fileSizeLeader;
        formData.append("FileSizeVideo", this.fileSizeLeader.toString());
        body['FileType'] = 'P';
        formData.append("FileType", 'P');
      }
      if(body.IsConsent){
        formData.append("IsConsent", body.IsConsent);
      }
      if (body.onboardingConsent) {
        body['IsConsent'] = body?.onboardingConsent ? 'Y' : 'N';
        formData.append("IsConsent", body?.onboardingConsent ? 'Y' : 'N');
      }
      // if (body.onboardingMode) {
      body['OnboardingMode'] = body?.onboardingMode == 'V' ? 2 : 1;
      formData.append("OnboardingMode", body?.onboardingMode == 'V' ? '2' : '1');
      // }
      if (!body.remarks) {
        delete body['remarks'];
      }
   
      delete body['onboardingConsent'];
      delete body['onboardingMode'];
      delete body['file'];
      if (this.data?.type == 'C') {
        this._onboardServ.candidateIdentificationByHR(formData).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true)
          }
        )
      } else {
        if (this.data?.type == 'E') {
          body['type'] = 'H7';
          formData.append("type", 'H7');
          body['OnboardingMode'] = 2;
          formData.set("OnboardingMode", '2');
        }
        if (this.data?.type == 'RM') {
          body['type'] = 'RM';
          formData.append("type", 'RM');
        }
        if (this.data?.type == 'IS') {
          body['type'] = 'IS';
          formData.append("type", 'IS');
        }
        this._onboardServ.AddEmployeeVideoMatchDetails(formData).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true)
          }
        )
      }
    }
    else {
      if (this.getControl('file').invalid) {
        this._share.showAlertErrorMessage.next('Please upload candidate video.')
      }
      else if (this.getControl('IsConsent').invalid) {
        this._share.showAlertErrorMessage.next('Please  provide your consent.')
      }
      else if (this.getControl('remarks').invalid) {
        this._share.showAlertErrorMessage.next('Please  enter remarks.')
      }
      else {
        this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
      }
    }

  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
