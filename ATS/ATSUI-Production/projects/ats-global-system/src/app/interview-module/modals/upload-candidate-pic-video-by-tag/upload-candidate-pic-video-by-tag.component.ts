import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { FILE_UPLOAD } from '../../../core/constant/common.const';
import { InterviewStatusService } from '../../../core/services/interview-status.service';
import { ShareService } from '../../../core/services/share.service';
import { PreviewMediaFileModalComponent } from '../../../shared/shared-app/components/preview-media-file-modal/preview-media-file-modal.component';
import { InrerviewsService } from '../../inrerviews.service';
import { VideoUploadGuidelineComponent } from '../../../common-sharing/modals/video-upload-guideline/video-upload-guideline.component';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-upload-candidate-pic-video-by-tag',
  templateUrl: './upload-candidate-pic-video-by-tag.component.html',
  styleUrls: ['./upload-candidate-pic-video-by-tag.component.scss']
})
export class UploadCandidatePicVideoByTagComponent implements OnInit {
  public upladFilesForm: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    public dialogRef: MatDialogRef<UploadCandidatePicVideoByTagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _intServe: InrerviewsService,
    private _interviewStatus: InterviewStatusService,
    private _globalCommonMethod: GlobalCommonMethodService
  ) { }


  public candidateData: any = [];
  public candidteRoundDetails: any = {};
  public roundDetails:any = [];
  ngOnInit(): void {
    /***
     * get Details
     */
    if (this.data) {
     
      this._interviewStatus.getCandidateDetails(this.data.cid).subscribe(
        res => {
          this.candidateData = res;
          if (res.roundList.length != 0) {
            this.candidteRoundDetails = res.roundList.filter(list => list.IsCurrentRound == 'Y')[0];
          }
        }
      )

      this._interviewStatus.GetRoundByCid(this.data.cid).subscribe(
        res => {
          this.roundDetails = res;
        }
      )
    }
    /***
     * FormInit
     */

    this.upladFilesForm = this._fb.group(
      {
        fileVideo: [null, Validators.required],
        IsConsent: [null, Validators.required],
        fileTranscript: [null]
      }
    )
  }
  ngAfterViewInit() {
    if(this.data?.statusData?.IsTranscriptEnable == 'Y'){
      this.isTranscriptMandatory = true;
    }
  }



  /***
   * video upload
   */
  public canVidName: any;
  public canVidSrc: any;
  public vidFile: any;
  public fileSize: number;
  async videoUpload(event) {
    let allowedExtensions = /(\.mp4|\.MP4|\.mp4)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;
    this.canVidName = fileName;
    this.fileSize = file.size;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type  MP4 only.');
      event.target.value = "";
      this.canVidSrc = '';
      this.getControl('fileVideo').reset();
      return false;
    }
    if (file.size > FILE_UPLOAD.VIDEO_FILE_SIZE) {
      this._share.showAlertErrorMessage.next('File  cannot be greater than 50MB.');
      event.target.value = "";
      this.canVidSrc = '';
      this.getControl('fileVideo').reset();
      return false;
    }
    else {
      const video = document.createElement('video');
      video.src = window.URL.createObjectURL(file);
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        let videoDurtion: number = parseInt(video.duration.toFixed(0));
        if (videoDurtion > 60*5) {
          this._share.showAlertErrorMessage.next('Video duration cannot be greater than 5 minutes.');
        }
        else {
          this.canVidSrc = file;
          this.vidFile= file;
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.canVidSrc = reader.result.toString().replace(/^data:.+;base64,/, '');
            let data = {
              fileName: fileName,
              fileType: 'V',
              interviewType: '',
              isUpload: true,
              file: reader.result,
              srcType: 3
            }
             this.previewImageVideo(data);
          }
        }
      }
    }
  }

  /***
   * 
   */
  previewImageVideo(data: any = {}) {
    let pClass: any = [];
    if (data?.fileType == 'P') {
      pClass = ['ats-model-wrap', 'ats-preview-media-model', 'ats-preview-media-model-img']
    }
    else {
      pClass = ['ats-model-wrap', 'ats-preview-media-model']
    }

    const dialogRef = this.dialog.open(PreviewMediaFileModalComponent,
      {
        data: data,
        width: '500px',
        height: 'auto',
        panelClass: pClass,
        backdropClass: 'mop-image-crop-modal-overlay'
      }
    );
  }

  getControl(name: string) {
    return this.upladFilesForm.get(name);
  }

  /**
   * submit
   */
  isTranscriptMandatory: boolean = false;
  submitRequest(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      let body = form.value;
      body['cid'] = this.data.cid;
      // && this.canTransSrc
      if (this.canVidSrc) {
        body['fileVideo'] = this.canVidSrc;
        body['FileNameVideo'] = this.canVidName;
        body['FileSizeVideo'] = this.fileSize;
        body['RoundId'] = this.candidteRoundDetails.RoundId;
        body['IsConsent'] = body['IsConsent'] ? 1 : 0;
          if(this.roundDetails.PrevSharePointIdVideo){
            body['isVideoCompare'] = 'Y';
          }
        let tboy = new FormData();
         tboy.append('fileVideo',this.vidFile);
         tboy.append('cid',this.data.cid)
         tboy.append('FileNameVideo',this.canVidName);
         tboy.append('FileSizeVideo',this.fileSize.toString())
         tboy.append('RoundId',this.candidteRoundDetails.RoundId);
         tboy.append('IsConsent',this.data.cid)
         if(this.roundDetails.PrevSharePointIdVideo){
         // body['isVideoCompare'] = 'Y';
          tboy.append('isVideoCompare','Y')
        }
        if(this.data?.interviewTypeId == 2 && this.isTranscriptMandatory == true){          
          let transBody = new FormData();
          transBody.append('cid',this.data.cid);
          transBody.append('RoundId',this.candidteRoundDetails.RoundId);
          transBody.append('fileTrans',this.canTransSrc);
          transBody.append('Talent_id',this.data.th_id)
          transBody.append('FileNameTrans',this.canTransName);
          transBody.append('FileSizeTrans',this.fileSizeTrans.toString())
          let apiCalls: any = [];
          apiCalls.push(this._intServe.uplaodVideoToSharePointIntf(tboy));
          // apiCalls.push(this._intServe.uplaodVideoToSharePointIntf(tboy));
          apiCalls.push(this._intServe.uplaodTranscriptToSharePointIntf(transBody));
          // this._intServe.uplaodVideoToSharePointIntf(tboy).subscribe(
          //   res => {
          //     this._share.showAlertSuccessMessage.next(res);
          //     this.dialogRef.close(true);
          //     if(this.roundDetails.PrevSharePointIdVideo){
          //       this._globalCommonMethod.showMessagedisplay({
          //         title: 'Video image comparison processing started',
          //         msg: `
          //         <p>video comparison processing has been started. It will take 5 -10 minutes. Thanks for your patience.</p>
          //        `
          //       });
          //     }
              
          //   }
          // )
          forkJoin([...apiCalls]).subscribe(
            res=>{
              console.log(res);
              // let vidRes = res[0];
              // let transRes = res[1];
              this._share.showAlertSuccessMessage.next('Documents Uploaded Successfully.');
              this.dialogRef.close(true);
              if(this.roundDetails.PrevSharePointIdVideo){
                this._globalCommonMethod.showMessagedisplay({
                  title: 'Video image comparison processing started',
                  msg: `
                  <p>video comparison processing has been started. It will take 5 -10 minutes. Thanks for your patience.</p>
                 `
                });
              }  
            }
          )
        }else{
          this._intServe.uplaodVideoToSharePointIntf(tboy).subscribe(
            res => {
              this._share.showAlertSuccessMessage.next(res);
              this.dialogRef.close(true);
              if(this.roundDetails.PrevSharePointIdVideo){
                this._globalCommonMethod.showMessagedisplay({
                  title: 'Video image comparison processing started',
                  msg: `
                  <p>video comparison processing has been started. It will take 5 -10 minutes. Thanks for your patience.</p>
                 `
                });
              }              
            }
          )
        }
      }
    }
    else {
      if (this.getControl('fileVideo').invalid) {
        this._share.showAlertErrorMessage.next('Please upload candidate video.')
      }
      else if (this.getControl('IsConsent').invalid) {
        this._share.showAlertErrorMessage.next('Please  provide your consent.')
      }
      else if (this.getControl('fileTranscript').invalid && this.data?.interviewTypeId == 2) {
        this._share.showAlertErrorMessage.next('Please upload transcript.')
      }
      else{
        this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
      }
    }

  }
  closeModal(): void {
    this.dialogRef.close();
  }

  // download trim guidelines
  dwnloadTrimGuideline(element: any ={}){
    // let link = document.createElement("a");
    //   link.target = '_blank';
    //   link.href = 'assets/docs/trim-video.pdf';
    //   document.body.appendChild(link);
    //   link.download = 'trim-video-guideline.pdf';
    //   link.click();
    //   document.body.removeChild(link);
    element['title'] = "View video Trim & Upload guidelines";
    element['docName'] = "View video Trim & Upload guidelines";
    element['path'] = "\\\\ipagfileserver\\photos\\ATS\\ImpDocs\\ats-user-guideline\\trim-video-guideline.pdf";
    const dialogRef = this.dialog.open(VideoUploadGuidelineComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: element,
      disableClose: true
    });
  }

  
   /***
   * VideoUploadGuideline
   */

   VideoUploadGuideline(element: any ={}) {
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

  public canTransName: any;
  public canTransSrc: any;
  public fileSizeTrans: number;
  async transcriptUpload(event) {
    let allowedExtensions = /(\.docx|\.DOCX)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;
    this.canTransName = fileName;
    this.fileSizeTrans = file.size;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type .docx only.');
      event.target.value = "";
      this.canTransSrc = '';
      this.getControl('fileTranscript').reset();
      return false;
    }
    if (file.size > FILE_UPLOAD.VIDEO_FILE_SIZE) {
      this._share.showAlertErrorMessage.next('File  cannot be greater than 50MB.');
      event.target.value = "";
      this.canTransSrc = '';
      this.getControl('fileTranscript').reset();
      return false;
    }
    else {
          this.canTransSrc = file;
    }
  }

}
