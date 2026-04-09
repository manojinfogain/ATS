import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { DashboardService } from '../../dashboard.service';
import { AddProfileFormComponent } from '../add-profile-form/add-profile-form.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { HttpClient } from '@angular/common/http';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { ScheduleInterviewComponent } from '../schedule-interview/schedule-interview.component';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { JdPanelConfirmationModalComponent } from 'projects/ats-global-system/src/app/interview-module/modals/jd-panel-confirmation-modal/jd-panel-confirmation-modal.component';
import { ScreenRejectModalComponent } from '../screen-reject-modal/screen-reject-modal.component';
import { ScreenRejectModalGlobalComponent } from 'projects/ats-global-system/src/app/common-sharing/modals/screen-reject-modal-global/screen-reject-modal-global.component';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { CandidateCommonApiService } from '../../../core/services/candidate-common-api.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ViewResumeAiRatingDetailsComponent } from '../../../common-sharing/modals/view-resume-ai-rating-details/view-resume-ai-rating-details.component';
import { labelResumeRating } from '../../../core/constant/common.const';
import { ResumeAssesmentModalComponent } from '../resume-assesment-modal/resume-assesment-modal.component';
import { UpdateprofileDetailsComponent } from '../updateprofile-details/updateprofile-details.component';
import { ViewApplicantDetailsModalComponent } from '../view-applicant-details-modal/view-applicant-details-modal.component';
import { UpdatescreenstatusmodalComponent } from '../../../common-sharing/modals/updatescreenstatusmodal/updatescreenstatusmodal.component';
@Component({
  selector: 'app-view-profile-list',
  templateUrl: './view-profile-list.component.html',
  styleUrls: ['./view-profile-list.component.scss']
})
export class ViewProfileListComponent implements OnInit {
  displayedColumns = [];
  public candidateList: any = [];
  public searchInput: string;
  public isloader: boolean = false;
  public paginationData: any;
  public pazeOption: any = [9, 25, 50, 100];
  public pazeSize: any = 9;
  public jumpFirstPage: boolean = false;
  public actionRightUser: boolean = false;
  public labelResumeRating:any =labelResumeRating
  constructor(
    public _dashServe: DashboardService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewProfileListComponent>,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private _globalMethodServe: GlobalCommonMethodService,
    private _interCommon: InterviewCommonService,
    private getLocInfo: GetLocationInfo,
    private _candidateCommon: CandidateCommonApiService,
     private _fb: UntypedFormBuilder
  ) { }
     public locationData: any = {};
    public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
    public isResetFilter: boolean = false;
    public sortParam: any = '';
    public isResetSearch: boolean = false;
  ngOnInit() {
    this.showColumnsLocWise();
    this.filterFormInit();
    this.locationData = this.getLocInfo;
    debugger
    if (this.data.list.id == 4) {
      this.displayedColumns = ['Candidate Name', 'Email ID', 'Phone No.', 'primarySkill', 'secondarySkill', 'totalExperience', 'releventExperience','Rating', 'referedOn', 'referedBy', 'ScreenStatus', 'ScreenRejectReason','CandidateStatus', 'action'];
      if (this.getLocInfo.isLocationIndia()) {
        this.displayedColumns.splice(7, 0, 'dob');
        if(this.data?.IsRenuTeam == 'Y'){
          this.displayedColumns.splice(this.displayedColumns.length - 1, 0, 'approver', 'approvalStatus');
        }
      }
    }
     else if(this.data?.list?.IsFromNaukri === 'Y') {      
      this.filterFormInit();
      this.displayedColumns = ['Candidate Name', 'Email ID', 'Phone No.', 'primarySkill', 'secondarySkill', 'totalExperience', 'releventExperience', 'action'];
      if (this.getLocInfo.isLocationIndia()) {
        this.displayedColumns.splice(7, 0, 'dob','ScreenStatus', 'ScreenRejectReason','ranking','dumpedOn');
        if(this.data?.IsRenuTeam == 'Y'){
          this.displayedColumns.splice(this.displayedColumns.length - 1, 0, 'approver', 'approvalStatus');
        }
      }
    }

    else {
      this.displayedColumns = ['Candidate Name', 'Email ID', 'Phone No.', 'primarySkill', 'secondarySkill', 'totalExperience', 'releventExperience','CandidateStatus','action'];
      if (this.getLocInfo.isLocationIndia()) {
        this.displayedColumns.splice(7, 0, 'dob');
        if(this.data?.IsRenuTeam == 'Y'){
          this.displayedColumns.splice(this.displayedColumns.length - 1, 0, 'approver', 'approvalStatus');
        }
      }
    }
    if(this.data?.isAIVisible == 1){
         this.displayedColumns.splice(this.displayedColumns.length - 1, 0,'Rating');
    }

    
    


    /**
     * get List Profile
     */
    this.getProfileCandList(1, this.pazeSize, null,this.sortParam);
    this.actionRightUser = this._globalMethodServe.requistionActionControlRight(this.data?.list?.data);

  }

   /**
* get filter value
* @param data
*/
getSortData(data: string) {
  debugger
  this.isResetSearch = true;
  this.isResetFilter = false;
  this.searchInput = '';
  this.sortParam = data;
//  this.resetPagination();
  this.getProfileCandList(1, this.pazeSize, this.searchInput, data);
}

/***
* filter form Init
*/
filterFormInit() {
  this.sortFormFilter = this._fb.group({
    RangeSlider: [[0, 5]],
     dateFrom: [null], //AppicantStartdate
    dateTo: [{ value: null, disabled: true }],//AppicantEnddate
  })
}

  /**show hide colum location wise */
  public isDobVisible: boolean = false;
  showColumnsLocWise() {
    if (this.getLocInfo.isLocationIndia()) {
      this.isDobVisible = true;

    }
    else if (this.getLocInfo.isLocationUS()) {
      this.isDobVisible = false;
    }


    else {

    }

  }

  /**show hide by location column mathod */
  hideByLoc() {
    let obj = {}
    if (this.isDobVisible == true) {
      obj['class'] = 'hide-col';
    }
    else {
      obj['class'] = 'tttt';
    }

    return obj;
  }
  /**
  *
  * @param data action right
  * @returns
  */
  RequisionActionRight(data: any) {
    return this._globalMethodServe.requistionActionControlRight(data);
  }
  /**
   * Method for get profile list
   * @param page
   * @param pageSize
   * @param search
   */
  getProfileCandList(page:number, pageSize:number, search:string, sortParam?: any,type?:string) {
    debugger
    let minRange = 0;
    let maxRange = 0;
    let RangeSliderVal = sortParam?.RangeSlider;
    type= this.data?.type;
    if(RangeSliderVal && RangeSliderVal.length !== 0){
       minRange = RangeSliderVal[0];
       maxRange = RangeSliderVal[1];
    }
   
    let queryString = `page=${page}&pageSize=${pageSize}&search=${search ? search : ''}${type? '&Type=' + type : ''}${minRange? '&RatingMin=' + minRange : ''}${maxRange ? '&RatingMax=' + maxRange : ''}`;
    this._dashServe.getProfileWiseCandidateList(this.data.list.id, this.data.thIds.th_id,this.data?.ISFromNaukri, queryString).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];
        this.isloader = false;
      }
    )
  }



  /**old method for active inactive / */
  //  openFormForReamrk(elm:any){
  //   if(elm?.isScreenRejected === 1){
  //     elm['title'] =` Are you sure you want to Activate ${elm?.name}?`;
  //   }
  //   else{
  //     elm['title'] =` Are you sure you want to Reject ${elm?.name}?`;
  //   }
  //   elm['type'] = 1;
  //   const dialogRef = this.dialog.open(ScreenRejectModalComponent, {
  //     width: '500px',
  //     panelClass: ['ats-model-wrap', 'talent-transfers-mod', 'active-inc-modal'],
  //     data: elm,
  //     disableClose: true
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.jumpFirstPage = false;
  //       this.jumpFirstPage = true;
  //       this.getProfileCandList(1, this.pazeSize, this.searchInput ? this.searchInput : null);
  //     }
  //     else {
  //     }
  //   });
  // }

   /***
     * Screen Reject Method
     */
    openScreenStatusUpdateModal(elm: any) {
      let scrrenSS =
        elm?.CandidateStatusId == 20 ? 'Pre Screen Select' : 'Screen Reject';
      elm['title'] = `${scrrenSS}- ${elm?.name}`;
      elm['profileId'] = elm?.profile_id;
      elm['pId'] = elm?.id;
      elm['name'] = elm?.name;
      elm['email'] = elm?.email;
      elm['statusId'] = elm?.CandidateStatusId;
      const dialogRef = this.dialog.open(UpdatescreenstatusmodalComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'screen-status-update-modal'],
        data: elm,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
                 this.jumpFirstPage = false;
                 this.jumpFirstPage = true;
                 this.getProfileCandList(
                   1,
                   this.pazeSize,
                   this.searchInput ? this.searchInput : null
                 );
        } else {
        }
      });
    }

  /**screen reject new mathod */
  screenRejectMethod(elm: any) {
    if (elm?.isScreenRejected === 1) {
      elm['title'] = ` Are you sure you want to Activate ${elm?.name}?`;
      elm['profileId'] = elm?.profile_id;
      elm['pId'] = elm?.id;
      const dialogRef = this.dialog.open(ScreenRejectModalComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'talent-transfers-mod', 'active-inc-modal'],
        data: elm,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.jumpFirstPage = false;
          this.jumpFirstPage = true;
          this.getProfileCandList(1, this.pazeSize, this.searchInput ? this.searchInput : null,this.sortParam);
        }
        else {
        }
      });
    }
    else {
      elm['title'] = `Screen Reject - ${elm?.name}`;
      elm['profileId'] = elm?.profile_id;
      elm['pId'] = elm?.id;
      const dialogRef = this.dialog.open(ScreenRejectModalGlobalComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate'],
        data: elm,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.jumpFirstPage = false;
          this.jumpFirstPage = true;
          this.getProfileCandList(1, this.pazeSize, this.searchInput ? this.searchInput : null,this.sortParam);
        }
        else {
        }
      });
    }
  }
  /**
   * pagination method
   * @param pageEvent
   */
  getPagingData(pageEvent: any) {
    this.getProfileCandList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null,this.sortParam);
  }

 
   /***
     * search
     */
  getSearchValueKey(e: any) {
    this.isResetSearch = false;
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getProfileCandList(1, this.pazeSize, e, this.sortParam);
  }

  /***
  * open upload profile modal
  */
  openUpdateProfileModal(list: any,title) {
    let data = {
      title: title,
      list: list,
      thIds: this.data,
      type: 2,
      IsRenuTeam: this.data?.thIds?.IsRenuTeam,
      profileId:list?.profile_id,
    }
    if(this.data.isTidDormant == 'D' && !this.isView(list)){
      let msg = 'Profile Cannot be updated';
      this.dormantTidMsgDisplay(msg);
    }else{
      const dialogRef = this.dialog.open(AddProfileFormComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'add-profile-popup'],
        data: data,
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.jumpFirstPage = false;
          this.jumpFirstPage = true;
          this.getProfileCandList(1, this.pazeSize, this.searchInput ? this.searchInput : null,this.sortParam);
        }
      });
    }
  }

  /***
  * open upload profile modal
  */
  openUpdateProfileModalFull(list: any) {
    let data = {
      title: 'Update Profile - ' + list?.name,
      list: list,
      thIds: this.data,
      type: 2,
      IsRenuTeam: this.data?.thIds?.IsRenuTeam,
      profileId:list?.profile_id,
    }
    if(this.data.isTidDormant == 'D' && !this.isView(list)){
      let msg = 'Profile Cannot be updated';
      this.dormantTidMsgDisplay(msg);
    }else{
      const dialogRef = this.dialog.open(UpdateprofileDetailsComponent, {
        panelClass: ['ats-model-wrap','ats-model-full-screen', 'update-profile-mdl'],
        data: data,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.jumpFirstPage = false;
          this.jumpFirstPage = true;
          this.getProfileCandList(1, this.pazeSize, this.searchInput ? this.searchInput : null);
        }
      });
    }
  }

  /***
* schedule inteview modal linkedin, employe refferal, Naukri, Social media sources
*/
  openScheduleInterview(elm: any) {
    /**get candidate personal details specific api */
    let candidateData: any = [];
    this._candidateCommon.getCandidateDetailsProfile(null, elm?.id, elm?.profile_id,elm?.IsFromNaukriAPI).subscribe(
      res => {
        candidateData = res['data'][0];
        // elm['dob'] = candidateData?.dob
        // this.openScheduleModalcodeMethod(elm);
        debugger     
        let data = {
          title: 'Schedule Interview',
          profileId: this.data.list?.id,
          IsRenuTeam:elm?.IsRenuTeam,
          candidate: {
            talentId: this.data.thIds.talent_id,
            thId: this.data.thIds.th_id,
            addExist: true,
            name: elm.name,
            firstName: elm.FirstName,
            middleName:  elm.MiddleName,
            lastName: elm.LastName,
            countryCode: candidateData.countryCode,
            mobile: elm.mobile_number,
            email: elm.email,
            totalExp: elm.totalExpInYear ? elm.totalExpInYear: (candidateData?.totalExp ? candidateData?.totalExp : null),
            totalExpMonth: elm.totalExpInMonth ? elm.totalExpInMonth: (candidateData?.totalExpMonth ? candidateData?.totalExpMonth : null),
            releventExp: elm.releventExpInYear? elm.releventExpInYear:  (candidateData?.releventExp ? candidateData?.releventExp : null),
            releventExpMonth: elm.releventExpInMonth ? elm.releventExpInMonth: (candidateData?.releventExpMonth ? candidateData?.releventExpMonth : null),
            primarySkill: candidateData.Skillid ? candidateData.Skillid : null,
            profileid: elm.profile_id,
            c_profileUniqId: elm.id,
            // country:elm.CountryID
            dob: candidateData.dob ? candidateData.dob : null,
            candidateType: candidateData.contractID ? candidateData.contractID : null,
            genderId: candidateData?.GenderId ? candidateData?.GenderId : null,
            education: candidateData.eduQualificationId ? candidateData.eduQualificationId : null,
            currCompany: candidateData.currentCompanyId ? candidateData.currentCompanyId : null,
            currencyType: candidateData.currency_type ? candidateData.currency_type : null,
            // tentativeJoinDate: elm.tentativeJoinDate,
            country: candidateData.CountryID ? candidateData.CountryID : null,
            cityId: candidateData.CityID ? candidateData.CityID : null,
            currentCtc: candidateData.current_ctc ? candidateData.current_ctc : (candidateData.currentSalary ? candidateData.currentSalary : null),
            expCtc: candidateData.expected_ctc ? candidateData.expected_ctc : null,
            SalaryType: candidateData.SalaryType ? candidateData.SalaryType : null,
            tentativeJoinDate: candidateData.TentativeJoiningDate ? new Date(candidateData.TentativeJoiningDate) : null,
              ApplicantUid: elm?.ApplicantUid ? elm?.ApplicantUid : null,
            IsFromNaukriAPI: elm?.IsFromNaukriAPI ? elm?.IsFromNaukriAPI : 'N',
          }
        }
        debugger
        const dialogRef = this.dialog.open(ScheduleInterviewComponent, {
          width: '80vh',
          panelClass: ['ats-model-wrap', 'schedule-interview', 'schedule-interview-modal'],
          data: data,
          disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.jumpFirstPage = false;
            this.jumpFirstPage = true;
            this.getProfileCandList(1, this.pazeSize, this.searchInput ? this.searchInput : null,this.sortParam);
          }
        });
      })
    /**ends */
  }
  /***
   * close
   */
  onNoClick() {
    this.dialogRef.close();
  }

  downloadFile() {
    window.open('file://ipagshareserver/Resumes/33456/download.png', '_blank')
  }

  /***
   * download file
   */
  dwnloadFileSingle(data) {
    let resumeName = this._globalMethodServe.removeLastExtension(data?.resume);
    if(data.cid){
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadResume?cid=${data.cid}`, { responseType: 'blob' }).subscribe(
        res => {
          saveAs(res, resumeName);
        }
      )
    }
    else{
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadResume?id=${data.id}`, { responseType: 'blob' }).subscribe(
        res => {
          saveAs(res, resumeName);
        }
      )
    }

  }

  /***
   *
   */

  toolTip(element:any) {
    if(
      element?.IsRenuTeam == 'Y' &&
      (element?.StatusApr == 'P' ||
       element?.StatusApr == 'A')

     )
     {
      return 'View Profile';
    }

    else{
      return 'Edit Profile';
    }
  }
  /***
   *
   */

  isView(element:any) {
    if(
      element?.IsRenuTeam == 'Y' &&
      (element?.StatusApr == 'P' ||
       element?.StatusApr == 'A')

     )
     {
      return true
    }

    else{
      return false
    }
  }

   /***
   *
   */

   isEditable(element:any) {
    if(
      this.data?.assign === true &&
        element?.IsRenuTeam == 'Y'
        //&&
     // (element?.StatusApr == 'R' ||  element?.StatusApr == null)

     )
     {
      return true;
    }
    else if(this.data?.assign === true &&
          element?.IsRenuTeam != 'Y' &&
          (element?.profile_id !== 4 || element?.profile_id !== 5)){
           return true;
    }
    else{
      return false;
    }
  }

   /***
   *
   */

   isRenuIntSchedule(element:any) {
    if(
      this.data?.assign === true &&
        element?.IsRenuTeam == 'Y' &&
        element?.StatusApr == 'A'

     )
     {
      return true;
    }
    else if(this.data?.assign === true &&
          element?.IsRenuTeam != 'Y'){
           return true;
    }
    else{
      return false;
    }
  }


  /**
   * navigate to schedule screen
   * @param elm
   */

  // method for js panel check and interview page open
  scheduleIntHandler(elm: any) {
    if(this.data?.thIds?.isTidDormant != 'D'){
      this._interCommon.getJDPanelAvailableDetails(this.data?.thIds?.th_id).subscribe(
        res => {
          let data = res['data'][0];
          if (data.JDAvailable == 'Y' && data.PanelAvailable == 'Y') {
            this.openScheduleInterview(elm)
          }
          else {
            elm['th_id'] = this.data?.thIds;
            this.openConfirmationModal(elm)
          }
        }

      )
    }else{
      let msg = 'Interview Cannot be scheduled';
      this.dormantTidMsgDisplay(msg);
    }

  }

  dormantTidMsgDisplay(msg:string){
    this._globalMethodServe.showMessagedisplay({
      title: 'Alert',
      autoHide: false,
      msg: `
     <p>${msg} as Talent Id is Dormant.</p>`
    });
  }

  //schedule interview
  scheduleInterview(elm) {

    let param = {
      talentId: this.data.thIds.talent_id,
      thId: this.data.thIds.th_id,
      addExist: true,
      name: elm.name,
      mobile: elm.mobile_number,
      email: elm.email,
      totalExp: elm.totalExpInYear,
      totalExpMonth: elm.totalExpInMonth,
      releventExp: elm.releventExpInYear,
      releventExpMonth: elm.releventExpInMonth,
      primarySkill: elm.pSkillID,
      profileid: elm.profile_id,
      c_profileUniqId: elm.id,
      dob: elm.dob
    }
    let queryParam = this._globalMethodServe.encryptData(param);
    this.router.navigate(['/interview-schedule'], { queryParams: { query: queryParam } });
    this.dialogRef.close();
    this.dialog.closeAll();
  }

  //open modal jd panel confirmation
  //open confirmation popup
  openConfirmationModal(element: any) {
    debugger
    // element['title'] = "Confirmation for JD available and panel available";
    const dialogRef = this.dialog.open(JdPanelConfirmationModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: this.data.thIds,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openScheduleInterview(element)
      }
    });
  }

  /***
        * view ai rating details
        */
         openCandidateRatingDetailsModal(elm: any ={}) {
          debugger
            elm['title'] = labelResumeRating?.modalViewResumeRatingTitle + ` - ${elm?.name}`;
            elm['isProfileInterview'] = 0;
            elm['id'] = elm.id;
            elm['name'] = elm?.name;
            elm['isDBFrom'] = true;
            elm['profileTypeId'] = elm?.profile_id;
            elm['profileSource'] = elm?.IsProfilesAI == 1 ? 'T' : elm?.profile_id ==15 ? 'J' : '';
            const dialogRef = this.dialog.open(ViewResumeAiRatingDetailsComponent, {
              panelClass: ['ats-model-wrap', 'ats-rating-dtp-modal'],
              data: elm,
              width: '500px'
            });
          }

        screenprofilesUn(data:any){
          debugger
          this._candidateCommon.getResumeAssesmentById(data?.id, 'T').subscribe(
            response=>{
               const resumeData = response?.Resumes || [];
  
        // Map parsed response with original files by filename
        // const mappedResumes = resumeData.map((res: any) => ({
        //   ...res,
        //   file: this.uploadedFilesMap[res.filename] || null
        // }));
        // debugger
      
        const ResumeData: any = {
          parsedResumes: resumeData,
          filenames: response?.Recommendation,
          profileData: {profileId:data?.profile_id,cid:data?.id,thid:this.data?.thIds?.th_id,talent_id:this.data?.thIds?.talent_id},
          data: this.data,
          title:''+data?.profile_name+ ' - ' + data?.name,
          isProfileExist: true
        };
         this.openResumeAssesmentModal(ResumeData);
            }
          )

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
               //   this.getProfileList(this.data.th_id);
                }
              });
            }

  openApplicantDetailsModal(element: any) {
    const dialogRef = this.dialog.open(ViewApplicantDetailsModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'view-cand-part-dt', 'ats-model-lg', 'animate__animated', 'animate__swing'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.openScheduleInterview(element)
      }
    });
  }

}
