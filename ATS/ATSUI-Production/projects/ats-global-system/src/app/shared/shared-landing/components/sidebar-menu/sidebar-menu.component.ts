import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { SPECIALACCESSUSER } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { B } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  panelOpenState = false;
  isHideMenu: boolean;
  isCandMenu: boolean;
  public MenuHideProd: boolean = true;
  public IsBuddyAssign:boolean=false;
  public isHrLogin: boolean = false;
  public isHrKochiLogin: boolean = false;
  public isRecLogin: boolean = false;
  public isPanelLogin: boolean = false;
  public isSuperAdminlogin: boolean = false;
  public isCanLogin: boolean = false;
  public isVendorLogin: boolean = false;
  public isRecAdminLogin: boolean = false;
  public isHideSidebar: boolean = false;
  public sidebarSubs: Subscription;
  public sidebarSubs1: Subscription;
  public specialLogin: boolean = false;
  public exceptionLogin: boolean = false;
  public isApproverLogin: boolean = false;
  public isDHLogin: boolean = false;
  public isBULogin: boolean = false;
  public isPMLogin: boolean = false;
  public isHRBPLogin: boolean = false;
  public isHMLogin: boolean = false;
  public isAOLogin: boolean = false;
  public isIssLogin: boolean = false;
  public IsIssAssestDlLogin: boolean = false;
  public IsIssEmailUpLogin: boolean = false;
  public isHrAdminLogin: boolean = false;
  public isHrPayrollLogin: boolean = false;
  public IsTagLeadApprover: boolean = false;
  public IsPartnerApprover: boolean = false;
  public isGDLLogin: boolean = false;
  public isWmgLogin: boolean = false;
  public isFinanceLogin: boolean = false;
  public IsIJP: boolean = false;
  public IsJDEditableRight: boolean = false;
  public IsTag: boolean = false;
  public IsUSHrRole: boolean = false;
  public hideLocWise: boolean = true;
  public updateLocsubs: Subscription;
  public locationData: any = {};
  public isRenuTeam: boolean = false;
  public isAdminRenuTeamlogin: boolean = false;
  public IsRM: boolean = false;
  public isProfileApprover: boolean = false;
  public IsAdminProfileTransferLogin:boolean = false;
  public isPanelAccess: boolean = false;
  public IsVideoComparisonReportAccess: boolean = false;
  public IsUatReportAccess: boolean = false;
  public IsBizOpsSecondary: boolean = false;
  public IsPipeLineAdminAccess: boolean = false;

  @ViewChild('sidebar', { static: true }) sidebarElm: ElementRef;
  constructor(
    private _router: Router,
    private _share: ShareService,
    private _storage: GetSetStorageService,
    private _globalCommonMethod: GlobalCommonMethodService,
    private getLocInfo: GetLocationInfo,
  ) { }

  ngOnInit(): void {
    this.hideHeaderSideBar();
    this.updateLocsubs = this._share.updateSideBarMenu.subscribe(
      get => {
        this.locationData = this._globalCommonMethod.getSetLocation();
      }
    )
  }

  public isToolTipDisable: boolean = false;
  public TooltipPosition: string = 'right';
  funcOver(event) {
    event.stopPropagation();
    this.isToolTipDisable = true;
    document.body.classList.remove('small-side-bar');

  }

  functOut(event) {
    event.stopPropagation();

    document.body.classList.add('small-side-bar');
  }
  ngAfterViewInit(): void {
    document.body.classList.add('small-side-bar');
    this.sidebarElm.nativeElement.addEventListener('click', this.funcOver.bind(this));
    //this.sidebarElm.nativeElement.addEventListener('mouseleave', this.functOut.bind(this));
  }

  MenuHandler(event: any) {
    event.stopPropagation();
    document.body.classList.add('small-side-bar');
    this.isToolTipDisable = false;
  }

  closeMenu(event: any) {
    event.stopPropagation();
    this.isToolTipDisable = false;
    document.body.classList.add('small-side-bar');
  }
  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    this.isToolTipDisable = false;
    document.body.classList.add('small-side-bar');
  }

  /*** Hide Content Method  ***/
  hideHeaderSideBar() {
    /**** on route change Method ****/
    this._router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.menuhideControl();
        let url = e.url.substr(e.url.lastIndexOf('/') + 1);
        if (url == "" || url == "login" || url == "change-password" || url == "offer-accept" || url == "mfa-otp-verification") {
          this.isHideSidebar = false;
        }
        else {
          this.isHideSidebar = true;
        }
      }
    });
    this.sidebarSubs = this._share.hideSideBarHeader.subscribe(
      get => {
        if (get == true) {
          this.isHideSidebar = false;
        }
      }
    )

    this.sidebarSubs1 = this._share.hideSideBar.subscribe(
      get => {
        if (get == true) {
          this.isHideSidebar = false;
        }
      }
    )

  }

  public userData: any = {};
  public IsDelegationAdmin: boolean = false;
  menuhideControl() {
    let user = this._storage.getSetUserData();
    const getTokenRole = user?.RoleId;
    this.IsDelegationAdmin = user?.otherRoles?.IsDelegationAdmin === 'Y' ? true : false;
    this.isHrLogin = false;
    this.isHrKochiLogin = false;
    this.isHrAdminLogin = false;
    this.isHrPayrollLogin = false;
    this.isRecLogin = false;
    this.isPanelLogin = false;
    this.isSuperAdminlogin = false;
    this.isAdminRenuTeamlogin = false;
    this.isRecAdminLogin = false;
    this.isVendorLogin = false;
    this.isCanLogin = false;
    this.isApproverLogin = false;
    this.isDHLogin = false;
    this.isBULogin = false;
    this.isPMLogin = false;
    this.isHRBPLogin = false;
    this.isHMLogin = false;
    this.isAOLogin = false;
    this.IsBizOpsSecondary = false;
    this.isIssLogin = false;
    this.IsIssAssestDlLogin = false;
    this.IsIssEmailUpLogin = false;
    this.IsTagLeadApprover = false;
    this.IsPartnerApprover = false;
    this.isGDLLogin = false;
    this.isWmgLogin = false;
    this.IsUSHrRole = false;
    this.isFinanceLogin = false;
    this.IsIJP = false;
    this.IsJDEditableRight = false;
    this.IsTag = false;
    this.isRenuTeam = false;
    this.IsRM = false;
    this.IsBuddyAssign=false;
    this.isProfileApprover = false;
    this.IsAdminProfileTransferLogin = false
    this.isPanelAccess = false;
    this.IsVideoComparisonReportAccess = false;
    this.IsUatReportAccess = false;
    this.IsPipeLineAdminAccess = false;

    if (getTokenRole == "1" || getTokenRole == 1) {
      this.isHrLogin = true;
      this.otherRolesUser();
    }
    else if (getTokenRole == "8" || getTokenRole == 8) {
      this.isHrAdminLogin = true;
      this.otherRolesUser();
    }
    else if (getTokenRole == "9" || getTokenRole == 9) {
      this.isHrPayrollLogin = true;
      this.otherRolesUser();
    }
    else if (getTokenRole == "2" || getTokenRole == 2) {
      this.isRecLogin = true;
      this.otherRolesUser();
      // if (user?.otherRoles?.IsApprover === 'Y') {
      //   this.isApproverLogin = true;
      // }
    }
    // else if (getTokenRole == "4") {
    //   if (getTokenRole == "4" && user?.otherRoles?.IsApprover === 'Y') {
    //     this.panelAndApproverLogin();
    //     this.loginDuBuHm(user);
    //   }
    //   else {
    //     this.panelLogin();
    //     this.loginDuBuHm(user);
    //   }
    // }
    else if (getTokenRole == "5" || getTokenRole == 5) {
      this.isSuperAdminlogin = true;
      this.otherRolesUser();
      // if (user?.otherRoles?.IsApprover === 'Y') {
      //   this.isApproverLogin = true;
      // }
    }
    else if (getTokenRole == "10" || getTokenRole == 10) {
      this.isAdminRenuTeamlogin = true;
      this.otherRolesUser();
    }
    else if (getTokenRole == "6" || getTokenRole == 6) {
      this.isRecAdminLogin = true;
      this.otherRolesUser();
    }

    else if (getTokenRole == "7" || getTokenRole == 7) {
      this.isIssLogin = true;
      this.otherRolesUser();
    }

    else if (getTokenRole == "0" || getTokenRole == 0) {
      this.otherRolesUser();
    }

    else if (getTokenRole == "3" || getTokenRole == 3) {
      this.otherRolesUser();
    }
    else {
    }

    let empId = this._storage.getUserEmpId();
    let isUserValid = SPECIALACCESSUSER.offerAccesRight.filter(r => r.empId === parseInt(empId));
    if (isUserValid.length !== 0) {
      this.specialLogin = true;
    }
    else {
      this.specialLogin = false;
    }
    let isUserValidException = SPECIALACCESSUSER.exceptionAccessRight.filter(r => r.empId === parseInt(empId));
    if (isUserValidException.length !== 0) {
      this.exceptionLogin = true;
    }
    else {
      this.exceptionLogin = false;
    }

  }
  /**
   * other Roles
   */
  otherRolesUser() {
    let user = this._storage.getSetUserData();
    
    const getTokenRole = user?.RoleId;
    if (user?.UserType === 'E') {
      if (getTokenRole == "3" || getTokenRole == 3) {
        this.isCanLogin = true;
      }
      else {
        this.isVendorLogin = true;
      }
    }

    if (user?.otherRoles?.IsInterviewer === 'Y') {
      this.isPanelLogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    if (user?.otherRoles?.IsTagLeadApprover === 'Y') {
      this.IsTagLeadApprover = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    if (user?.otherRoles?.IsApprover === 'Y') {
      this.isApproverLogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    if (user?.otherRoles?.IsDH === 'Y') {
      this.isDHLogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }

    if (user?.otherRoles?.IsBUHead === 'Y') {
      this.isBULogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }


    if (user?.otherRoles?.IsAO === 'Y') {
      this.isAOLogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    /**secondary biz ops */
    if (user?.otherRoles?.IsBizOpsSecondary === 'Y') {
      this.IsBizOpsSecondary = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }

    if (user?.otherRoles?.IsPM === 'Y') {
      this.isPMLogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    /**Hriring Manager */
    if (user?.otherRoles?.IsHiringManager === 'Y') {

      this.isHMLogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }

     /**Buddy */
     if (user?.otherRoles?.IsHRBP === 'Y') {
      this.isHRBPLogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
     
    }
    /**GDL */
    if (user?.otherRoles?.IsGDL === 'Y') {
      this.isGDLLogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    /**WMG */
    if (user?.otherRoles?.IsWMG === 'Y') {
      this.isWmgLogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    /**finance */
    if (user?.otherRoles?.IsFinance === 'Y') {
      this.isFinanceLogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }

     /**IsIJP */
     if (user?.otherRoles?.IsIJP === 'Y') {
      this.IsIJP = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }

    if (user?.otherRoles?.IsTAG === 'Y') {
      this.IsTag = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    if (user?.otherRoles?.IsRM === 'Y') {
      this.IsRM = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    if (user?.otherRoles?.IsProfileApprover === 'Y') {
      this.isProfileApprover = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    if (user?.otherRoles?.IsRenuTeam === 'Y') {
      this.isRenuTeam = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    if (user?.otherRoles?.IsUSHrRole === 'Y') {
      this.IsUSHrRole = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    if (user?.otherRoles?.IsJDEditableRight === 'Y') {
      this.IsJDEditableRight = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    if (user?.otherRoles?.IsPartnerApprover === 'Y') {
      this.IsPartnerApprover = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    if (user?.otherRoles?.IsIssAssestDelivery === 'Y') {
      this.IsIssAssestDlLogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    if (user?.otherRoles?.IsIssEmailUpdate === 'Y') {
      this.IsIssEmailUpLogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    if (user?.otherRoles?.IsAdminProfileTransfer === 'Y') {
      this.IsAdminProfileTransferLogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    if (user?.otherRoles?.IsPanelAccess === 'Y') {
      this.isPanelAccess = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    if (user?.otherRoles?.IsVideoComparisonReport === 'Y') {
      this.IsVideoComparisonReportAccess = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    // for US salary deviation report
     if (user?.otherRoles?.IsUatReportAccess === 'Y') {
      this.IsUatReportAccess = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
     if (user?.otherRoles?.IsHRAccess === 'Y') {
      this.isHrKochiLogin = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
     if (user?.otherRoles?.IsPipeLineAdmin === 'Y') {
      this.IsPipeLineAdminAccess = true;
      this.isVendorLogin = false;
      this.isCanLogin = false;
    }
    
  }
  /***
   * dashboard reports Role Wise Hide Show
   */
  loginDuBuHm(user: any) {
    if (user?.otherRoles?.IsBUHead === 'Y') {
      this.isBULogin = true;
    }

    else if (user?.otherRoles?.IsBUHead === 'Y') {
      this.isBULogin = true;
    }

    else if (user?.otherRoles?.IsAO === 'Y') {
      this.isAOLogin = true;
    }
    else if (user?.IsBizOpsSecondary === 'Y') {
      this.IsBizOpsSecondary = true;
    }

    else if (user?.otherRoles?.IsPM === 'Y') {
      this.isPMLogin = true;
    }
    else if (user?.otherRoles?.IsHiringManager === 'Y') {
      this.isHMLogin = true;
    }
  }
  panelLogin() {
    this.isHrLogin = false;
    this.isHrKochiLogin = false;
    this.isHrAdminLogin = false;
    this.isRecLogin = false;
    this.isPanelLogin = true;
    this.isSuperAdminlogin = false;
    this.isRecAdminLogin = false;
    this.isVendorLogin = false;
    this.isApproverLogin = false;
    this.isDHLogin = false;
    this.isGDLLogin = false;
    this.isBULogin = false;
    this.isPMLogin = false;
    this.isHMLogin = false;
    this.isAOLogin = false;
    this.IsBizOpsSecondary = false;
    this.isIssLogin = false;
    this.IsAdminProfileTransferLogin = false;
  }
  panelAndApproverLogin() {
    this.isHrLogin = false;
    this.isHrKochiLogin = false;
    this.isHrAdminLogin = false;
    this.isRecLogin = false;
    this.isPanelLogin = true;
    this.isSuperAdminlogin = false;
    this.isRecAdminLogin = false;
    this.isVendorLogin = false;
    this.isApproverLogin = true;
    this.isDHLogin = false;
    this.isGDLLogin = false;
    this.isBULogin = false;
    this.isPMLogin = false;
    this.isHMLogin = false;
    this.isAOLogin = false;
    this.IsBizOpsSecondary = false;
    this.isIssLogin = false;
    this.IsAdminProfileTransferLogin = false;
  }

  ngOnDestroy() {
    if (this.sidebarSubs) {
      this.sidebarSubs.unsubscribe();
    }
    if (this.sidebarSubs1) {
      this.sidebarSubs1.unsubscribe();
    }
    this.sidebarElm.nativeElement.removeEventListener('click', this.funcOver.bind(this));
    // this.sidebarElm.nativeElement.removeEventListener('mouseleave', this.functOut.bind(this));
  }


  /***
   * India Location
   */
  isLocationIndia(locationData: any) {
    return this.getLocInfo.isLocationIndia(locationData);
  }

  /***
   * US Location
   */
  isLocationUS(locationData: any) {
    return this.getLocInfo.isLocationUS(locationData);
  }
}
