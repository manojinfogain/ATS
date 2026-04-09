import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { DashboardService } from '../../dashboard.service';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import saveAs from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { ScheduleInterviewComponent } from '../schedule-interview/schedule-interview.component';
import { InrerviewsService } from 'projects/ats-global-system/src/app/interview-module/inrerviews.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { JdPanelConfirmationModalComponent } from 'projects/ats-global-system/src/app/interview-module/modals/jd-panel-confirmation-modal/jd-panel-confirmation-modal.component';
import { ScreenRejectModalGlobalComponent } from 'projects/ats-global-system/src/app/common-sharing/modals/screen-reject-modal-global/screen-reject-modal-global.component';
import { ScreenRejectModalComponent } from '../screen-reject-modal/screen-reject-modal.component';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { CandidateCommonApiService } from '../../../core/services/candidate-common-api.service';
import { COMMON_CONST, labelResumeRating } from '../../../core/constant/common.const';
import { ViewResumeAiRatingDetailsComponent } from '../../../common-sharing/modals/view-resume-ai-rating-details/view-resume-ai-rating-details.component';
import { UpdatescreenstatusmodalComponent } from '../../../common-sharing/modals/updatescreenstatusmodal/updatescreenstatusmodal.component';

@Component({
  selector: 'app-view-cskill',
  templateUrl: './view-cskill.component.html',
  styleUrls: ['./view-cskill.component.scss']
})
export class ViewCskillComponent implements OnInit {
  displayedColumns = ['Candidate Name', 'Email ID', 'Phone No.', 'Location', 'Primary Skill', 'Secondary Skill', 'Primary Skill Experience', 'Total Experience','orgName', 'assignee', 'ScreenStatus', 'ScreenRejectReason','Rating', 'Document'];
  blob: any;
  url: any;
  public candidateList: any = [];
  public searchInput: string;
  public isloader: boolean = false;
  public resumeBaseUrl: string = COMMON_CONST.cskillBaseUrl;
  public paginationData: any;
  public pazeOption: any = [9, 25, 50, 100];
  public pazeSize: any = 9;
  public actionRightUser: boolean = false;
  public labelResumeRating:any =labelResumeRating
  constructor(
    public _dashServe: DashboardService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewCskillComponent>,
    public dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private _globalMethodServe: GlobalCommonMethodService,
    public _intService: InrerviewsService,
    private _interCommon: InterviewCommonService,
    private getLocInfo: GetLocationInfo,
    private _candidateCommon: CandidateCommonApiService
  ) { }

  ngOnInit() {
    /**dob column for India location */
    // if (this.getLocInfo.isLocationIndia()){
    //   this.displayedColumns.splice(7, 0, 'dob')
    // }
    /**
      * get List Profile
      */
     console.log(this.data)
    this.getProfileCandList(1, this.pazeSize, null);
    this.actionRightUser = this._globalMethodServe.requistionActionControlRight(this.data?.list?.data);

  }

  getProfileCandList(page, pageSize, search) {
    let queryString = `page=${page}&pageSize=${pageSize}${search ? '&search=' + search : ''}`;
    this._dashServe.viewCkill(this.data.thIds.talent_id, queryString).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }

  /**
 * pagination method
 * @param pageEvent
 */
  getPagingData(pageEvent: any) {
    this.getProfileCandList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null);
  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    this.searchInput = e;
    this.getProfileCandList(1, this.pazeSize, e);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  downloadFile() {
    window.open('file://ipagshareserver/Resumes/33456/download.png', '_blank')
  }

  downloadWithoutZip() {
    const zip = new JSZip();
    zip.file("nested/",);
    console.log(this.candidateList)
    for (let i = 0; i < this.candidateList.length; i++) {
      zip.file(this.candidateList[i].resume_name, this.resumeBaseUrl + this.candidateList[i].resume_name);
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
      if (content) {
        FileSaver.saveAs(content, 'AllResume.zip');
      }
    });
    this.isloader = false;
  }
  downloadAll = async () => {
    const zip = new JSZip();
    // create a file and a folder
    zip.file("Hello.pdf", "Hello World\n");
    // zip.file("nested/", window.open('https://infogain.com/rest/resume/602110d7e570d-form_position_id_PankajKumar_Pankaj_2021.doc'));
    //zip.folder("nested").file('https://infogain.com/rest/resume/602110d7e570d-form_position_id_PankajKumar_Pankaj_2021.doc');
    zip.generateAsync({ type: 'uint8array' }).then((content) => {
      if (content) {
        FileSaver.saveAs(content, 'AllResume');
      }
    });
  };

  test() {
    const urls = [
      'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf'
    ];
    const zip = new JSZip();
    let count = 0;
    const zipFilename = "evidence.zip";
    let http = this.http;
    urls.forEach(async function (url) {
      const urlArr = url.split('/');
      const filename = urlArr[urlArr.length - 1];
      http.get(url, { responseType: 'arraybuffer' }).subscribe(
        res => {
          const file = res;
          zip.file(filename, file, { binary: true });
          count++;
          if (count === urls.length) {
            zip.generateAsync({ type: 'blob' }).then(function (content) {
              saveAs(content, zipFilename);
            });
          }
        }
      )
      // try {
      //   const file = await JSZipUtils.getBinaryContent(url)
      //   zip.file(filename, file, { binary: true});
      //   count++;
      //   if(count === urls.length) {
      //     zip.generateAsync({type:'blob'}).then(function(content) {
      //       saveAs(content, zipFilename);
      //     });
      //   }
      // } catch (err) {
      //   console.log(err);
      // }
    });
  }


  scheduleInterview(elm) {
    let param = {
      appliedid: elm.id,
      profileid: elm.profileid,
      talentId: this.data.thIds.talent_id,
      thId: this.data.thIds.th_id,
      addExist: true,
      name: elm.name,
      mobile: elm.contact_no,
      email: elm.email,
      totalExp: elm.total_experience,
      totalExpMonth: elm.total_months,
      releventExp: null,
      primarySkill: null
    }
    // let queryParam = btoa(JSON.stringify(param));
    let queryParam = this._globalMethodServe.encryptData(param);
    this.router.navigate(['/interview-schedule'], { queryParams: { query: queryParam } });
    this.dialogRef.close();
    this.dialog.closeAll();

  }

  //method for schedule intervew based on Jd , panel available condition
  schedulIntHandler(elm: any) {
    if(this.data?.thIds?.isTidDormant != 'D'){
      this._interCommon.getJDPanelAvailableDetails(this.data?.thIds?.th_id).subscribe(
        res => {
          let data = res['data'][0];
          if (data.JDAvailable == 'Y' && data.PanelAvailable == 'Y') {
            this.scheduleCskillInterview(elm)
          }
          else {
            elm['th_id'] = this.data?.thIds?.th_id;
            // elm['th_id']=this.data?.thIds;
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
      title: 'Schedule Interview Alert',
      autoHide: false,
      msg: `
     <p>${msg} as Talent Id is Dormant.</p>`
    });
  }

  scheduleCskillInterview(elm: any) {
    /**get candidate personal details specific api */
    let candidateData: any = [];
    this._candidateCommon.getCandidateDetailsProfile(null, elm?.id, elm?.profileid).subscribe(
      res => {
        candidateData = res['data'][0];
        // elm['dob'] = candidateData?.dob
        // this.openScheduleModalcodeMethod(elm);
        let data = {
          title: 'Schedule Interview',
          profileId: this.data.list?.id,
          candidate: {
            talentId: this.data.thIds.talent_id,
            thId: this.data.thIds.th_id,
            addExist: true,
            name: elm.name,
            firstName: elm.name,
            mobile: elm.contact_no,
            email: elm.email,
            profileid: elm.profileid,
            appliedid: elm.id,
            //
            releventExp: candidateData.releventExp,
            releventExpMonth: candidateData.releventExpMonth,
            primarySkill: candidateData.Skillid,
            country: candidateData.CountryID,
            //  totalExp: elm.total_experience,
            //  totalExpMonth: elm.total_months,
            // candidateType: elm.contractID,
            //genderId: elm?.genderId,
            //education: elm.eduQualificationId,
            // currCompany: elm.currentCompanyId,
            //currencyType: elm.currency_type,
            // tentativeJoinDate: elm.tentativeJoinDate,

            //cityId: elm.CityID,
            // currentCtc: elm.current_ctc,
            //expCtc: elm.expected_ctc,
            // dob: candidateData?.dob
          }
        }
        const dialogRef = this.dialog.open(ScheduleInterviewComponent, {
          //'add-profile-popup'
          width: '80vh',
          panelClass: ['ats-model-wrap', 'schedule-interview', 'schedule-interview-modal'],
          data: data,
          disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // this.jumpFirstPage = false;
            // this.jumpFirstPage = true;
            this.getProfileCandList(1, this.pazeSize, this.searchInput ? this.searchInput : null);
          }
        });
      })
    /**ends */
  }

  //open confirmation popup
  openConfirmationModal(element: any) {
    // element['title'] = "Confirmation for JD available and panel available";
    const dialogRef = this.dialog.open(JdPanelConfirmationModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: this.data.thIds,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scheduleCskillInterview(element);
      }
    });
  }

  /**screen reject */
  // screenRejectMethod(elm:any){
  //   elm['title'] =`Screen Reject - ${elm?.name}`;
  //   elm['profileId'] = elm?.profileid;
  //   elm['pId'] = elm?.id;
  //   const dialogRef = this.dialog.open(ScreenRejectModalGlobalComponent, {
  //     width: '500px',
  //     panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate'],
  //     data: elm,
  //     disableClose: true
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //   this.jumpFirstPage = false;
  //     //  this.jumpFirstPage = true;
  //      // this.getProfileCandList(1, this.pazeSize, this.searchInput ? this.searchInput : null);
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
          elm?.StatusId == 20 ? 'Pre Screen Select' : 'Screen Reject';
        elm['title'] = `${scrrenSS}- ${elm?.name}`;
        elm['profileId'] = elm?.profileid;
        elm['pId'] = elm?.id;
        elm['name'] = elm?.name;
        elm['email'] = elm?.email;
        elm['statusId'] = elm?.StatusId;
        const dialogRef = this.dialog.open(UpdatescreenstatusmodalComponent, {
          width: '500px',
          panelClass: ['ats-model-wrap', 'screen-status-update-modal'],
          data: elm,
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
                this.getProfileCandList(1, this.pazeSize, this.searchInput ? this.searchInput : null);
          } else {
          }
        });
      }

  //screen reject  new method
  screenRejectMethod(elm: any) {
    if (elm?.isScreenRejected === 1) {
      elm['title'] = ` Are you sure you want to Activate ${elm?.name}?`;
      elm['profileId'] = elm?.profileid;
      elm['pId'] = elm?.id;
      const dialogRef = this.dialog.open(ScreenRejectModalComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'talent-transfers-mod', 'active-inc-modal'],
        data: elm,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // this.jumpFirstPage = false;
          // this.jumpFirstPage = true;
          this.getProfileCandList(1, this.pazeSize, this.searchInput ? this.searchInput : null);
        }
        else {
        }
      });
    }
    else {
      elm['title'] = `Screen Reject - ${elm?.name}`;
      elm['profileId'] = elm?.profileid;
      elm['pId'] = elm?.id;

      const dialogRef = this.dialog.open(ScreenRejectModalGlobalComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate'],
        data: elm,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // this.jumpFirstPage = false;
          // this.jumpFirstPage = true;
          this.getProfileCandList(1, this.pazeSize, this.searchInput ? this.searchInput : null);
        }
        else {
        }
      });
    }
  }

  /**class for color changes */
  screenRejectColor(elm: any) {
    if (elm?.isScreenRejected === 0) {
      return 'forScreenRejectColor';
      // } else  {
      // this.statusSelected === 'step4' || this.statusSelected === 'step5'){
      //     return 'inactive';
      //}
    }
  }

   /***
  * download file
  */
   downloadResume(data:any) {
   // this._globalMethodServe.downloadFileCskill(this.resumeBaseUrl+data?.resume_name, data?.resume_name);
   if(data.cid){
    this._globalMethodServe.downloadResume(data.cid,"");
   }
   else if(data.id){
    this._globalMethodServe.downloadResume("",data.id);
   }
  }

  /***
      * view ai rating details
      */
       openCandidateRatingDetailsModal(elm: any ={}) {
          elm['title'] = labelResumeRating?.modalViewResumeRatingTitle;
          elm['isProfileInterview'] = 0;
          elm['id'] = elm.id;
          const dialogRef = this.dialog.open(ViewResumeAiRatingDetailsComponent, {
            panelClass: ['ats-model-wrap', 'ats-rating-dtp-modal'],
            data: elm,
            width: '500px'
          });
        }

}
