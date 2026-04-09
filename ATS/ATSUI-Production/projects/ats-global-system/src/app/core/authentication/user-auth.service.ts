import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'projects/ats-global-system/src/app/authentication-module/authentication.service';
import { GlobalCommonMethodService } from '../common/global-common-method.service';
import { GetSetStorageService } from '../services/get-set-storage.service';
import { ShareService } from '../services/share.service';
import { AuthenticationCommonService } from './authentication-common.service';
import { FullfillmentdatelapseTalentModalComponent } from '../../common-sharing/modals/fullfillmentdatelapse-talent-modal/fullfillmentdatelapse-talent-modal.component';
import { BannerPreviewModalComponent } from '../../common-sharing/modals/banner-preview-modal/banner-preview-modal.component';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  userData: any = [];
  exp: any;
  constructor(
    private _authServe: AuthenticationCommonService,
    private _storage: GetSetStorageService,
    private _share: ShareService,
    private _matDialog: MatDialog,
    private _router: Router,
    private _globalCommonMethod: GlobalCommonMethodService,
    private _userAuthCommon: AuthenticationService
  ) { }

  /**** get User Info */
  getUserDetails() {
    const token = this._storage.getToken();
    const tokenTemp = this._storage.getTokenExTemp();
    if (token || tokenTemp) {
      this._authServe.getUser().subscribe(
        res => {
          this._storage.setUserData(res);
          this._storage.setUserType(res['UserType']);
          this._share.userData.next(res);
          this.sessionConfig();
          if (res?.isLoginTalentDate == 'N') {
            this.onpenTalentListModal();
          }
        }
      )

      // let model:string = window.localStorage.setItem('isBanner','Y');
      //  let isBanner:string = window.localStorage.getItem('isBanner');
      //  if(!isBanner){
      //   this.onpenImagModal();
      //   window.localStorage.setItem('isBanner','Y');
      //  }


    }
  }

  onpenTalentListModal() {
    const dialogRef = this._matDialog.open(FullfillmentdatelapseTalentModalComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'view-profile-popup', 'add-profile-popup', 'unused-cskill-profile-poup'],
      data: {},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      let user = this._storage.getSetUserData();
      if (user?.isLoginTalentDate == 'Y') {
        this.redirectToPage();
      }

    });
  }


  onpenImagModal() {
    const dialogRef = this._matDialog.open(BannerPreviewModalComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'view-profile-popup', 'add-profile-popup', 'banner-profile-modal'],
      data: {},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      // let user = this._storage.getSetUserData();
      // if(user?.isLoginTalentDate == 'Y'){
      //   this.redirectToPage();
      // }

    });
  }


  redirectMethod() {
    let user = this._storage.getSetUserData();
    this._globalCommonMethod.getSetLocation();
    this._share.updateLocation.next(true);
    this._share.updateSideBarMenu.next(true);
    if (user?.IsPasswordChanged === 'N') {
      this._router.navigate(['/change-password']);
    }
    else {
      // if(user?.TalentDateLapseCount > 0){
      //   this.onpenTalentListModal();
      // }
      // else{
      //   this.redirectToPage();
      // }
      this.redirectToPage();

    }
  }

  logOutAts() {
    this._storage.destroyAllStorage();
    this._share.sessionExp.next(false);
    this._storage.setAction('1');
    this._router.navigate(['/login']);
  }

  logOutOffice365App() {
    this._storage.destroyAllStorage();
    this._share.sessionExp.next(false);
    this._storage.setAction('1');
    this._userAuthCommon.logOutOffice365();
    // this._router.navigate(['/login']);
  }

  logOutAtsUnAuth() {
    this._storage.destroyAllStorage();
    this._share.sessionExp.next(false);
    // this._storage.setAction('1');
    this._router.navigate(['/login']);
  }

  removeClassBody() {
    setTimeout(() => {
      document.body.classList.remove("login-page-main");
    }, 1000);
  }

  redirectToPage() {
    /***
      *  return url
      */
    let returnUrl = JSON.parse(sessionStorage.getItem('returnUrl'));
    sessionStorage.removeItem('returnUrl');
    if (returnUrl) {
      if (returnUrl?.pathname == '/' || returnUrl?.pathname == '') {
        /**
       * default route
       */
        this.defaultLoginMethod();
      }
      else {
        this.returnUrlValidation(returnUrl);
      }
    }
    else {
      this.defaultLoginMethod();
    }
  }


  defaultLoginMethod() {
    let user = this._storage.getSetUserData();
    let userRole = user.RoleId;

    /**
     * partner
     */
    if (user?.UserType === 'E') {
      this.removeClassBody();
      if (userRole == 3) {
        this._router.navigate(['candidate-screen']);
      }
      else {

        this._router.navigate(['partner/dashboard']);
      }
    }
    /**
     * Admin/Recruiter Admin/Recruiter
     */
    else if (userRole === 2 || userRole === 5 || userRole === 6 || userRole === 10) {
      this.removeClassBody();
      this._router.navigate(["/home"]);
    }
    /***
    * ISS/HR
    */
    else if (userRole === 7 || userRole === 1) {
      this.removeClassBody();

      if (userRole === 7 && user?.otherRoles?.IsIssAssestDelivery === 'Y') {
        this._router.navigate(['/candidate-verification']);
      }
      else if (userRole === 7 && user?.otherRoles?.IsIssEmailUpdate === 'Y') {
        this._router.navigate(['/pipeline-joinee-candidate']);
      }
      else {
        this._router.navigate(['/pipeline-joinee-candidate']);
      }
    }
    /**
     * HR ADMIN
     */
    else if (userRole === 8) {
      this.removeClassBody();
      this._router.navigate(['/candidate-connect']);
    }

    /**
     * HR ADMIN
     */
    else if (userRole === 9) {
      this.removeClassBody();
      this._router.navigate(['/onboard-candidate']);
    }
    /**
     * other Role
     */
    else if (userRole === 0 || userRole === '0') {
      if (user?.otherRoles?.IsInterviewer === 'Y') {
        this.removeClassBody();
        this._router.navigate(['/interview-feedback']);
      }
      else if (user?.otherRoles?.IsTagLeadApprover === 'Y') {
        this.removeClassBody();
        this._router.navigate(['/partner-talentId-list']);
      }
      else if (user?.otherRoles?.IsApprover === 'Y') {
        this.removeClassBody();
        this._router.navigate(['offer-approval']);
      }
      else if (user?.otherRoles?.IsDH === 'Y') {
        this.removeClassBody();
        this._router.navigate(['dashboard/du']);
      }
      else if (user?.otherRoles?.IsBUHead === 'Y') {
        this.removeClassBody();
        this._router.navigate(['dashboard/bu']);
      }
      else if (user?.otherRoles?.IsAO === 'Y') {
        this.removeClassBody();
        this._router.navigate(['dashboard/account']);
      }
      else if (user?.otherRoles?.IsPM === 'Y') {
        this.removeClassBody();
        this._router.navigate(['dashboard/pm']);
      }
      else if (user?.otherRoles?.IsHiringManager === 'Y') {
        this.removeClassBody();
        this._router.navigate(['dashboard/hiring-manager']);
      }
      else if (user?.otherRoles?.IsHRBP === 'Y') {
        this.removeClassBody();
        this._router.navigate(['/buddy-screen']);
      }
      else if (user?.otherRoles?.IsIJP === 'Y') {
        this.removeClassBody();
        this._router.navigate(['talent/internal-job-opportunity']);
      }
      else {
        this._share.showAlertErrorMessage.next('You are not an authorized User.');
      }
    }

    else {
      this._share.showAlertErrorMessage.next('You are not an authorized User.');
    }
  }
  /**
   * 
   * @param returnUrl 
   */
  returnUrlValidation(returnUrl: any) {
    let extractUrl = returnUrl.pathname.replace(/\//g, ' ').split(' ');
    let removePrefixUrl = [];
    for (let i = 0; i < extractUrl.length; i++) {
      if (extractUrl[i] == "") {
      }
      else {
        removePrefixUrl.push(extractUrl[i])
      }
    }
    let validUrl = removePrefixUrl.join('/');
    let param = returnUrl.query.substring(1);
    let queryString: any;
    /**
    * convert to object
    */
    if (param) {
      queryString = Object.fromEntries(new URLSearchParams(param));
      // queryString = JSON.parse('{"' + decodeURI(param).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    }

    this._router.navigate([validUrl], { queryParams: queryString });
  }



  sessionConfig(): void {
    const timeSet = 50 * 60 * 1000;
    const MsgConf = {
      type: 1,
      msg: "Session has been expired. Please log in again."
    }
    window.onblur = () => {
      this.exp = setTimeout(() => {
        this._storage.destroyAllStorage();
        this._share.sessionExp.next(true);
        this._storage.setAction('1');
        this._matDialog.closeAll();
        this._router.navigate(['login']);
      }, timeSet);
    }
    window.onfocus = () => {
      clearTimeout(this.exp);
    }
  }
  /***
   * isLogged In
   */
  isloggedIn() {
    if (this._storage.getToken()) {
      return true
    }
    else {
      return false
    }
  }

  /**
   * 
   * @returns supersdmin
   */
  getRoleId() {
    let user = this._storage.getSetUserData();
    let userRole = user.RoleId;
    return userRole;
  }
  /**
   * 
   * @returns supersdmin
   */
  isSuperAdmin() {
    let user = this._storage.getSetUserData();
    if (user) {
      let userRole = user.RoleId;
      if (userRole === 5) {
        return true
      }
      else {
        return false
      }
    }
  } t

  /**
   * 
   * @returns supersdmin
   */
  isAdminRenuTeam() {
    let user = this._storage.getSetUserData();
    if (user) {
      let userRole = user.RoleId;
      if (userRole === 10) {
        return true
      }
      else {
        return false
      }
    }
  }

  isRecruiterAdmin() {
    let user = this._storage.getSetUserData();
    if (user) {
      let userRole = user.RoleId;
      if (userRole === 6) {
        return true
      }
      else {
        return false
      }
    }

  }

  isRecruiter() {
    let user = this._storage.getSetUserData();
    if (user) {
      let userRole = user.RoleId;
      if (userRole === 2) {
        return true
      }
      else {
        return false
      }
    }

  }

  isISS() {
    let user = this._storage.getSetUserData();
    if (user) {
      let userRole = user.RoleId;
      if (userRole === 7) {
        return true
      }
      else {
        return false
      }
    }

  }



  isHr() {
    let user = this._storage.getSetUserData();
    if (user) {
      let userRole = user.RoleId;
      if (userRole === 1) {
        return true
      }
      else {
        return false
      }
    }
  }

  isVendorLogin() {
    let user = this._storage.getSetUserData();
    if (user?.UserType === 'E') {
      return true
    }
    else {
      return false
    }
  }
  isApproverLogin() {
    let user = this._storage.getSetUserData();
    if (user?.otherRoles?.IsApprover === 'Y') {
      return true
    }
    else {
      return false
    }
  }

  isDelegationAdmin() {
    let user = this._storage.getSetUserData();
    if (user?.otherRoles?.IsDelegationAdmin === 'Y') {
      return true
    }
    else {
      return false
    }
  }

  /***
   * other role access
   */
  getUserOtherRole(data: any) {
    let otherRoleToArray: any = [];
    if (data?.IsDelegationAdmin === 'Y') {
      let obj = { IsDelegationAdmin: 'Y' };
      otherRoleToArray.push('IsDelegationAdmin');

    }
    if (data?.IsPM === 'Y') {
      otherRoleToArray.push('IsPM');
    }
    if (data?.IsAO === 'Y') {
      let obj = { IsAO: 'Y' };
      otherRoleToArray.push('IsAO');
    }
    if (data?.IsApprover === 'Y') {
      let obj = { IsApprover: 'Y' };
      otherRoleToArray.push('IsApprover');
    }
    if (data?.IsBUHead === 'Y') {
      let obj = { IsBUHead: 'Y' };
      otherRoleToArray.push('IsBUHead');
    }
    if (data?.IsDH === 'Y') {
      let obj = { IsDH: 'Y' };
      otherRoleToArray.push('IsDH');
    }
    if (data?.IsDelegationAdmin === 'Y') {
      let obj = { IsDelegationAdmin: 'Y' };
      otherRoleToArray.push('IsDelegationAdmin');
    }
    if (data?.IsHiringManager === 'Y') {
      let obj = { IsHiringManager: 'Y' };
      otherRoleToArray.push('IsHiringManager');
    }
    if (data?.IsInterviewer === 'Y') {
      let obj = { IsInterviewer: 'Y' };
      otherRoleToArray.push('IsInterviewer');
    }
    if (data?.IsTagLeadApprover === 'Y') {
      let obj = { IsTagLeadApprover: 'Y' };
      otherRoleToArray.push('IsTagLeadApprover');
    }
    if (data?.IsGDL === 'Y') {
      let obj = { IsGDL: 'Y' };
      otherRoleToArray.push('IsGDL');
    }
    if (data?.IsWMG === 'Y') {
      let obj = { IsWMG: 'Y' };
      otherRoleToArray.push('IsWMG');
    }
    if (data?.IsFinance === 'Y') {
      let obj = { IsFinance: 'Y' };
      otherRoleToArray.push('IsFinance');
    }
    if (data?.IsIJP === 'Y') {
      let obj = { IsIJP: 'Y' };
      otherRoleToArray.push('IsIJP');
    }
    if (data?.IsTAG === 'Y') {
      let obj = { IsTAG: 'Y' };
      otherRoleToArray.push('IsTAG');
    }
    if (data?.IsRM === 'Y') {
      let obj = { IsRM: 'Y' };
      otherRoleToArray.push('IsRM');
    }

    if (data?.IsUSHrRole === 'Y') {
      let obj = { IsUSHrRole: 'Y' };
      otherRoleToArray.push('IsUSHrRole');
    }
    if (data?.IsJDEditableRight === 'Y') {
      let obj = { IsJDEditableRight: 'Y' };
      otherRoleToArray.push('IsJDEditableRight');
    }
    if (data?.IsRenuTeam === 'Y') {
      let obj = { IsRenuTeam: 'Y' };
      otherRoleToArray.push('IsRenuTeam');
    }
    if (data?.IsProfileApprover === 'Y') {
      let obj = { IsProfileApprover: 'Y' };
      otherRoleToArray.push('IsProfileApprover');
    }
    if (data?.IsPartnerApprover === 'Y') {
      let obj = { IsPartnerApprover: 'Y' };
      otherRoleToArray.push('IsPartnerApprover');
    }
    if (data?.IsPanelAccess === 'Y') {
      let obj = { IsPanelAccess: 'Y' };
      otherRoleToArray.push('IsPanelAccess');
    }
    if (data?.IsHRBP === 'Y') {
      let obj = { IsHRBP: 'Y' };
      otherRoleToArray.push('IsHRBP');
    }
    if (data?.IsIssAssestDelivery === 'Y') {
      let obj = { IsIssAssestDelivery: 'Y' };
      otherRoleToArray.push('IsIssAssestDelivery');
    }
    if (data?.IsVideoComparisonReport === 'Y') {
      let obj = { IsVideoComparisonReport: 'Y' };
      otherRoleToArray.push('IsVideoComparisonReport');
    }
    //role for US salary deviation report
    if (data?.IsUatReportAccess === 'Y') {
      let obj = { IsUatReportAccess: 'Y' };
      otherRoleToArray.push('IsUatReportAccess');
    }
    /**hr access for kochi */
     if (data?.IsHRAccess === 'Y') {
      let obj = { IsHRAccess: 'Y' };
      otherRoleToArray.push('IsHRAccess');
    }
     if (data?.IsBizOpsSecondary === 'Y') {
      let obj = { IsBizOpsSecondary: 'Y' };
      otherRoleToArray.push('IsBizOpsSecondary');
    }
      if (data?.IsPipeLineAdmin === 'Y') {
      let obj = { IsPipeLineAdmin: 'Y' };
      otherRoleToArray.push('IsPipeLineAdmin');
    }

    
    return otherRoleToArray;
  }

  getAuthOtherRole(loggedRole: any, accessRole: any) {
    if (loggedRole?.IsAO == accessRole?.IsAO) {
      return true;
    }
    else {
      return false;
    }
  }
}
