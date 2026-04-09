import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'projects/ats-global-system-external/src/app/authentication-module/authentication.service';
import { GlobalCommonMethodService } from '../common/global-common-method.service';
import { GetSetStorageService } from '../services/get-set-storage.service';
import { ShareService } from '../services/share.service';
import { AuthenticationCommonService } from './authentication-common.service';
import { DeclarationConsentModalComponent } from '../../common-sharing/modal/declaration-consent-modal/declaration-consent-modal.component';
import { PreventBgvScreenModalComponent } from '../../common-sharing/modal/prevent-bgv-screen-modal/prevent-bgv-screen-modal.component';

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
    private _userAuthCommon: AuthenticationService,
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
          this._storage.setIsFinalStatud(res['FinalStatus']);
          this._share.userData.next(res);
          this.sessionConfig();
        }
      )

    }
  }

  consentModalOpen() {
      let userData = this._storage.getSetUserData();
      let IsDeclarationDone = this._storage.getIsDeclarationDone();
      if (userData && userData?.IsDeclarationDone === 0 || IsDeclarationDone === 0) {
        let elm = { title: 'Your Information & Privacy Consent' };
        elm['candidateId'] = userData?.CandidateId;
        const dialogRef = this._matDialog.open(
          DeclarationConsentModalComponent,
          {
            width: '100vw',
            height: '100vh',
            maxWidth: '100vw',
            panelClass: 'consent-full-screen-dialog',
            data: elm,
            disableClose: true,
          }
        );
        dialogRef.afterClosed().subscribe((res) => {
          if (res) {
            this.getUserDetails();
          }
        });
      }
     
    }

    
  isEAFSubmittedModalOpen(isFinalSubmit: boolean = false) {
      if (!isFinalSubmit && (this._router?.url == '/upload-bgv-documents') ) {
        let elm = { title: 'Complete Employment Application Form First' };
        const dialogRef = this._matDialog.open(PreventBgvScreenModalComponent, {
          panelClass: ['ats-model-wrap', 'onboard-consent-modal'],
          data: elm,
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe((res) => {
          if (res) {
            this.getUserDetails();
          }
        });
      }
     
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
    debugger

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
    debugger
    let user = this._storage.getSetUserData();
    let userRole = user?.RoleId;
    let authUserType = user?.AuthUserType;

    /**
     * partner
     */
    if (user?.UserType === 'E') {
      this.removeClassBody();
      if (userRole == 3 || userRole == 13) {
        this._router.navigate(['employment-application-form']);
       
      }
      else {

        this._router.navigate(['ext/dashboard']);
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
      queryString = JSON.parse('{"' + decodeURI(param).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
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
