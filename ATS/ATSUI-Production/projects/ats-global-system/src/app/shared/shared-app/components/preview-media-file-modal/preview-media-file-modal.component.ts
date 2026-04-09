import { Component, Inject, OnInit,ViewChild,ElementRef } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OnboardService } from 'projects/ats-global-system/src/app/onboard-module/onboard.service';

@Component({
  selector: 'app-preview-media-file-modal',
  templateUrl: './preview-media-file-modal.component.html',
  styleUrls: ['./preview-media-file-modal.component.scss']
})
export class PreviewMediaFileModalComponent implements OnInit {
  @ViewChild("videoPlayer", { static: false }) videoplayer?: ElementRef;
  public isVideoPaused:boolean = false;
  public IsLoaderVisible:boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PreviewMediaFileModalComponent>,
    private _onboardServ: OnboardService,
    private _share: ShareService
  ) { }

  ngOnInit(): void {
    if(this.data?.isVoiceMatch == 'Y'){
      this.checkVoiceImprint(this.data?.profileVid);
    }
  }

  /***
   * checkVoiceImprint
   */
  public isVoiceMatchStatus:boolean = false;
  public videoMatchPercent:any = 0;
  public isVideoMatchSuc:string = 'T';
  checkVoiceImprint(techVideo:any ={}){
    debugger
    this.IsLoaderVisible = true;
    let bodyFormData = new FormData();
    bodyFormData.append("file1", this.data.filesData);  
    bodyFormData.append("techvidId", techVideo.sharePointIdVideo);
    bodyFormData.append("techvidName",techVideo.fileName);
    let body = {
      "cid": 0,
      "file1":  this.data?.videoMatchFile,
      // "file2": HRVideo,
      // "techvidId": techVideo.isLeadership ==='Y' ? techVideo.SharePointIdVideo  :techVideo.sharePointIdVideo,
      // "techvidName":techVideo.isLeadership ==='Y' ? techVideo.VideoName: techVideo.fileName
      "techvidId": techVideo.sharePointIdVideo,
      "techvidName":techVideo.fileName
    }
    //this.data.filesData =null;
    if(this.data.filesData){
   this._onboardServ.CheckVideoCompare(bodyFormData).subscribe(
      res => {
        this.IsLoaderVisible = false;
        
        if(res?.status == 'true'){
          this.isVoiceMatchStatus = true;
          this.videoMatchPercent = parseFloat(res?.message).toFixed(2);
          this.isVideoMatchSuc = 'Y'
        }
        else{
          this.isVoiceMatchStatus = false;
          this.isVideoMatchSuc = 'V'
          this._share.showAlertErrorMessage.next(res?.message);
        }
      },
      (er)=>{
        this.isVideoMatchSuc = 'F'
        this.IsLoaderVisible = false;  
        this.isVoiceMatchStatus = false;
      }
    )
    }
    else{
         this._onboardServ.checkVoiceImprint(body).subscribe(
      res => {
        this.IsLoaderVisible = false;
        
        if(res?.status == 'true'){
          this.isVoiceMatchStatus = true;
          this.videoMatchPercent = parseFloat(res?.message).toFixed(2);
          this.isVideoMatchSuc = 'Y'
        }
        else{
          this.isVoiceMatchStatus = false;
          this.isVideoMatchSuc = 'V'
          this._share.showAlertErrorMessage.next(res?.message);
        }
      },
      (er)=>{
        this.isVideoMatchSuc = 'F'
        this.IsLoaderVisible = false;  
        this.isVoiceMatchStatus = false;
      }
    )
    }
 
  }

  get video(): HTMLVideoElement {
    return this.videoplayer?.nativeElement;
  }

  get videoContainer(): HTMLElement {
    return this.videoplayer?.nativeElement;
  }
  /***
   * play /paused change
   */
  whenPlay(){
    if (this.video.paused) {
      this.isVideoPaused = false;
    }
    else{
      this.isVideoPaused = true;
    }
  }

/***
   * play /paused toggle
   */
  playPause() {
    let myVideo: any = this.videoplayer?.nativeElement;
    if (this.video.paused) {
      this.isVideoPaused = true;
      this.video.play();
    }
    else{
      this.video.pause();
      this.isVideoPaused = false;
    }
  }

  makeBig() {
    this.video.width = 560;
  }

  makeSmall() {
    this.video.width = 320;
  }

  makeNormal() {
    this.video.width = 420;
  }

  skip(value:number) {
    this.video.currentTime += value;
  }

  restart() {
    let video: any = this.videoplayer?.nativeElement;
    this.video.currentTime = 0;
  }

  onFullscreen() {
    if (this.videoContainer.requestFullscreen) {
      this.videoContainer.requestFullscreen();
    } else if ((this.video as any).mozRequestFullScreen) {
      (this.videoContainer as any).mozRequestFullScreen();
    } else if ((this.video as any).webkitRequestFullscreen) {
      (this.videoContainer as any).webkitRequestFullscreen();
    } else if ((this.video as any).msRequestFullscreen) {
      (this.videoContainer as any).msRequestFullscreen();
    }
  }

  downloadVideo(data :any):void{
    let link = document.createElement("a");
    link.download = data['fileName'];
    //link.target = '_blank';
    link.href =data['file'];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  

  /***
   * close Modal
   */
  closeModal(): void {
    
    if(this.data?.isVoiceMatch == 'Y'){
       this.dialogRef.close({videoMatchPercent:this.videoMatchPercent,isVoiceMatch:this.isVoiceMatchStatus?this.data?.isVoiceMatch:'N',isVideoMatchSuc:this.isVideoMatchSuc});
    }
    else{
      this.dialogRef.close(false);
    }
   
  }

}
