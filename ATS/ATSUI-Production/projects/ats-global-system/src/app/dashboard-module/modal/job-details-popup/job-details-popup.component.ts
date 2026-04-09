import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { DashboardService } from '../../dashboard.service';
import { AddProfileFormComponent } from '../add-profile-form/add-profile-form.component';
import { ViewCskillComponent } from '../view-cskill/view-cskill.component';
import { ViewProfileListComponent } from '../view-profile-list/view-profile-list.component';
import { Router } from '@angular/router';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { UnusedCskillProfileListComponent } from '../unused-cskill-profile-list/unused-cskill-profile-list.component';
import { PartnerCandidateListsComponent } from '../partner-candidate-lists/partner-candidate-lists.component';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { InterviewCommonService } from '../../../core/services/interview-common.service';
import { JdPanelConfirmationModalComponent } from '../../../interview-module/modals/jd-panel-confirmation-modal/jd-panel-confirmation-modal.component';
import { ResumeAssesmentModalComponent } from '../resume-assesment-modal/resume-assesment-modal.component';
import { HttpClient } from '@angular/common/http';
import { ViewProfileListHisAssestComponent } from '../view-profile-list-his-assest/view-profile-list-his-assest.component';
import { ViewAllProfilesModalComponent } from '../view-all-profiles-modal/view-all-profiles-modal.component';
@Component({
  selector: 'app-job-details-popup',
  templateUrl: './job-details-popup.component.html',
  styleUrls: ['./job-details-popup.component.scss']
})
export class JobDetailsPopupComponent implements OnInit {
  public viewdatajob: any;
  public viewdatajobdes: any;
  public isLess: boolean = true;
  public isMore: boolean = false;
  public actionReadText: string = "Read more";
  public classToggled: boolean = false;
  public profilelistFrom: any = [];
  public totalProfile: Number = 0;
  public CSkillCount: number = 0;
  public userData: any = {};
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<JobDetailsPopupComponent>,
    public dialog: MatDialog,
    public _dashServe: DashboardService,
    private router: Router,
    private _globalMethodServe: GlobalCommonMethodService,
    private _storage: GetSetStorageService,
    private _share: ShareService,
    private getLocInfo:GetLocationInfo,
    private _intCommonServe: InterviewCommonService,
    private http:HttpClient
  ) { }
  public jobDescHtml:string = '';
  public isVisibleUploadScreen: boolean = false;
  ngOnInit() {
    this.userData = this._storage.getSetUserData();
     if (this.getLocInfo.isLocationIndia()) {
       this.isIndiaLocation = true;
        this.isUsLocation = false;
     }
      else {
        this.isUsLocation = true;
        this.isIndiaLocation = false;
      }

    if (this.data) {
      this.viewdatajob = this.data.job_description.substring(0, 148).replace(/&amp/g, "").replace(/;#34;/g, "").replace(/;amp;/g, ",").replace(/\?/g, "");
      let fks = `Angular required. Should have knowledge of database.`;
      // let viewdatajobdes = this.data.job_description.trim().split(".").map(item => item.trim().replace(/&amp/g, "").replace(/;#34;/g," ").replace(/;amp;/g,",").replace(/\?/g, ""));
      let viewdatajobdes = this.data.job_description.trim().split('\r\n').map(item => item.trim().replace(/&amp/g, " ").replace(/\?/g, ""));
      this.viewdatajobdes = viewdatajobdes;
      if( this.data.job_description){
        this.jobDescHtml=  GlobalMethod.htmlUnescape( this.data.job_description);
      }
    }
    
    //for cskill 
    this._dashServe.viewCskillCount(this.data.talent_id).subscribe(
      res => {
        this.CSkillCount = parseInt(res.Count);
        /***
  * get list
  */
        this.getProfileList(this.data.th_id);
      }
    )

  }

  /**
   * 
   * @param data action right
   * @returns 
   */
  RequisionActionRight(data:any){
    return  this._globalMethodServe.requistionActionControlRight(data);
  }


  /***
      * get list
      */
  public isUsLocation: boolean = false;
  public isListProfile: boolean = false;
  public isIndiaLocation: boolean = false;
  getProfileList(id) {
    this._dashServe.getallProfileCount(id).subscribe(
      res => {
      //  this.profilelistFrom = res;
      this.isListProfile = true;
      let datal = res['data'];
        let total = datal.map(Count => Count.totalCount).reduce((num, Count) => Count + num);
        this.totalProfile = parseInt(total);

        if (environment.locationWise) {
          if (this.getLocInfo.isLocationIndia()) {
            this.profilelistFrom = this._globalMethodServe.getProfileListIndia(datal);
          //  this.isUsLocation = false;
          //  this.isIndiaLocation = true;
          }
          else {
            this.profilelistFrom = this._globalMethodServe.getProfileListUs(datal);
          //  this.isUsLocation = true;
           // this.isIndiaLocation = false;
          }
        }
        else {
          this.profilelistFrom = this._globalMethodServe.getProfileListIndia(datal);
        }
      }
    )
  }
  /***
   * readmore/less
   */
  myFunction() {
    if (this.isLess === true) {
      this.isMore = true;
      this.isLess = false;
      this.actionReadText = "Read less"
    } else {
      this.isMore = false;
      this.isLess = true;
      this.actionReadText = "Read more"
    }
  }
  /***
   * show hide
   */
  showToggle() {
    this.classToggled = !this.classToggled;
  }
  /***
   * close dialog
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /***
   * open upload profile modal
   */
  openUploadProfileModal(list: any) {
    let data = {
      title: 'Upload Profile',
      list: list,
      thIds: this.data,
      type: 'add',
      profileId:list?.id
    }
    if(this.data.isTidDormant != 'D'){
      this.openModalProfileAddForm(data);
    }else{
      let msg = 'Profile Cannot be added';
      this.dormantTidMsgDisplay(msg);
      // this._globalMethodServe.showMessagedisplay({
      //   title: 'Add Profile Alert',
      //   autoHide: false,
      //   msg: ` <p>Profile Cannot be added as Talent Id is Dormant.</p>`
      // });
    }
  }

  /***
  * open modal method for job
  */

  openModalProfileAddForm(data: any) {
    data['type'] = 1;
    data['IsRenuTeam']=data?.thIds?.IsRenuTeam;
    const dialogRef = this.dialog.open(AddProfileFormComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-profile-popup'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProfileList(this.data.th_id);
      }
    });
  }

  viewProfileListAssesst(data:any) {
    debugger
     let body = {
      title: 'Profile',
      list: data,
      thIds: this.data,
      IsRenuTeam:this.data?.IsRenuTeam,
      assign: this.RequisionActionRight(this.data) === true ? true:false,
      ISFromNaukri : data?.IsFromNaukri ?  data?.IsFromNaukri : 'N',
    }
     const dialogRef = this.dialog.open(ViewProfileListHisAssestComponent, {
         // width: '650px',
          panelClass: ['ats-model-wrap','ats-model-full-screen', 'view-profile-popup', 'add-profile-popup'],
          data: body,
          disableClose: true,
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%'
        });
  }

  /***
   * view profile
   */

  viewProfileList(data:any,titleScreen?:string) {
    let title = "";
    if(titleScreen == 'T'){
      title = 'Total Profiles'+' - '+data?.profile_name+' - '+this.data?.talent_id;
    }
    if(titleScreen == 'A'){
      title = 'Profiles assessed by AI'+' - '+data?.profile_name+' - '+this.data?.talent_id;
    }
     if(titleScreen == 'P'){
      title = 'Pre-screened profiles'+' - '+data?.profile_name+' - '+this.data?.talent_id;
    }
    let body = {
      type:titleScreen,
      title: title,
      list: data,
      thIds: this.data,
      IsRenuTeam:this.data?.IsRenuTeam,
      assign: this.RequisionActionRight(this.data) === true ? true:false,
      isAIVisible:this.data?.IsRenuTeam === 'N' && this.isIndiaLocation?1:0,
       ISFromNaukri : data?.IsFromNaukri ?  data?.IsFromNaukri : 'N',
    }
    if (data.id == 3) {
      const dialogRef = this.dialog.open(ViewCskillComponent, {
     //   width: '650px',
        panelClass: ['ats-model-wrap','ats-model-full-screen', 'view-profile-popup', 'add-profile-popup'],
        data: body,
        disableClose: true,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%'
      });
      if (this.CSkillCount != 0) {

      }
    }

    else if (data.id == 5 && this.data?.IsRenuTeam != 'Y') {
      const dialogRef = this.dialog.open(PartnerCandidateListsComponent, {
      //  width: '650px',
        panelClass: ['ats-model-wrap','ats-model-full-screen', 'view-profile-popup', 'unused-cskill-profile-poup', 'ats-model-lg'],
        data: body,
        disableClose: true,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%'
      });
    }
    else {
     // if (data.candidateCount != 0) {
        const dialogRef = this.dialog.open(ViewProfileListComponent, {
         // width: '650px',
          panelClass: ['ats-model-wrap','ats-model-full-screen', 'view-profile-popup', 'add-profile-popup'],
          data: body,
          disableClose: true,
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%'
        });
     // }
    }

  }

  /***
   * modal open method
   */
   openModalForJdPanel(data: any): void {
    if(data?.isTidDormant != 'D'){
      this._intCommonServe.getJDPanelAvailableDetails(data.th_id).subscribe(
        res => {
          let dataJd = res['data'][0];
          if (dataJd.JDAvailable == 'Y' && dataJd.PanelAvailable == 'Y') {
            this.navigateTo();
          }
          else {
            //redirecting to jd and panel confirmation page
            data['th_id'] = data.th_id;
            this.openConfirmationModal(data)
          }
        }
      )
    }else{
      let msg = 'Interview Cannot be scheduled';
      this.dormantTidMsgDisplay(msg);
      // this._globalMethodServe.showMessagedisplay({
      //   title: 'Schedule Interview Alert',
      //   autoHide: false,
      //   msg: `
      //  <p>Interview Cannot be scheduled as Talent Id is Dormant.</p>`
      // });
    }
  }

  dormantTidMsgDisplay(msg:string){
    this._globalMethodServe.showMessagedisplay({
      title: 'Schedule Interview Alert',
      autoHide: false,
      msg: `
     <p>${msg} as Talent Id is Dormant.</p>`
    });
  }

  openConfirmationModal(element: any) {
    const dialogRef = this.dialog.open(JdPanelConfirmationModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: element,
      disableClose: true,

    });
    //after popup close, selected page will open
    dialogRef.afterClosed().subscribe(result => {
      if (result) {       
          this.navigateTo();      
      }
    });
  }
  
  //navigate interview page
  navigateTo() {
    let params = { talentId: this.data.talent_id, thId: this.data.th_id };
    let queryParam = this._globalMethodServe.encryptData(params);
    this.router.navigate(['/interview-schedule'], { queryParams: { query: queryParam } });
    this.dialogRef.close();
  }

  openModalAllProfileDetails(data: any) {
      data['assign'] =this.RequisionActionRight(this.data) === true ? true:false;
      data['title'] = 'Total Profiles - '+data?.talent_id;
      const dialogRef = this.dialog.open(ViewAllProfilesModalComponent, {
        // width: '650px',
        panelClass: [
          'ats-model-wrap',
          'ats-model-full-screen',
          'view-profile-all-modal',
        ],
        data: data,
        disableClose: true,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
      });
    }

  uploadedFilesMap: { [filename: string]: File } = {};
  @ViewChild('fileInput') fileInput!: ElementRef;
  onFilesSelected(event: Event,profileData:any): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
  
    const files: File[] = Array.from(input.files);

     //  Check if more than 7 files are selected
  if (files.length > 7) {
    
   // alert('You can upload a maximum of 7 resumes only.');
    this._share.showAlertErrorMessage.next('You can upload a maximum of 7 resumes only.');
    this.fileInput.nativeElement.value = '';
    return;
  }
   // Max file size check (5 MB)
   const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
   if (oversizedFiles.length > 0) {
    // alert('Each resume must be less than or equal to 5MB.');
     this._share.showAlertErrorMessage.next('Each resume must be less than or equal to 5MB.');
     this.fileInput.nativeElement.value = '';
     return;
   }
  
    // Store files temporarily mapped by filename for later use
    this.uploadedFilesMap = {};
    files.forEach(file => {
      this.uploadedFilesMap[file.name] = file;
    });
  
    const formData = new FormData();
    const fileNames = files.map(file => file.name);
  
    files.forEach(file => {
      formData.append('resumes', file, file.name); // send for parsing only
    });
  
    formData.append('th_id',this.data?.th_id);
    //formData.append('th_id','116147');
    formData.append('filenames', fileNames.join(','));
  
    const url = `${environment.apiMainUrlNet}/interview/UploadMultipleResumesToParse`;
  
    this.http.post<any>(url, formData).subscribe({
      next: (response) => {
        const resumeData = response?.Resumes || [];
  
        // Map parsed response with original files by filename
        const mappedResumes = resumeData.map((res: any) => ({
          ...res,
          file: this.uploadedFilesMap[res.filename] || null
        }));
        debugger
       
        const data: any = {
          parsedResumes: mappedResumes,
          filenames: response?.Recommendation,
          profileData:{profileId:profileData?.id,cid:0,thid:this.data?.th_id,talent_id:this.data?.talent_id},
          data: this.data,
          isProfileExist: false,
           title:'Profiles - '+profileData?.profile_name
        };
  
        this.openResumeAssesmentModal(data);
      },
      error: (err) => {
        this.fileInput.nativeElement.value = '';
        console.error('Error uploading resumes:', err);
      }
    });
  }

   openResumeAssesmentModal(data:any ={}): void {
      const dialogRef = this.dialog.open(ResumeAssesmentModalComponent, {
      //  width: '650px',
        panelClass: ['ats-model-wrap','resume-assesment-popup', 'ats-model-full-screen'],
        data: data,
        //disableClose: true,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getProfileList(this.data.th_id);
        }
      });
    }
}
