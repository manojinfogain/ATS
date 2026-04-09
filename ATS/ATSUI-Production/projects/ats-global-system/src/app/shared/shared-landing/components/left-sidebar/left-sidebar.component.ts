import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { COMMON_CONST, SPECIALACCESSUSER } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
declare var $: any;
@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit, AfterViewInit,OnDestroy {
  commonconst = COMMON_CONST;
  imgPath = this.commonconst.imgPath;
  LogoInfo: string;
  LogoSmall: string;
  iconPath: string;
  isHideMenu: boolean;
  isCandMenu: boolean;
  public isHrLogin:boolean = false;
  public isRecLogin:boolean = false;
  public isPanelLogin:boolean = false;
  public isSuperAdminlogin:boolean = false;
  public isCanLogin:boolean = false;
  public isVendorLogin:boolean = false;
  public isRecAdminLogin:boolean = false;
  public isHideSidebar:boolean = false;
  public sidebarSubs:Subscription;
  public specialLogin:boolean = false;
  public isApproverLogin:boolean = false;
  constructor( private _router:Router,private _share:ShareService,private _storage:GetSetStorageService) {
    this.LogoInfo = this.imgPath + "Infogain_Logo.png";
    this.LogoSmall = this.imgPath + "lms_infogain_Logo_icon.png";
    this.isHideMenu = true;
    this.isCandMenu =false;
  }
  ngOnInit() {
    $(".main-wrapper").addClass("small-left-bar");
    this.hideHeaderSideBar();
  }
  ngOnDestroy(){
    if(this.sidebarSubs){
      this.sidebarSubs.unsubscribe();
    }
  }

   /*** Hide Content Method  ***/
   hideHeaderSideBar() {
    /**** on route change Method ****/ 
    this._router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.menuhideControl();
        let url = e.url.substr(e.url.lastIndexOf('/') + 1);
        if(url == "" || url == "login" || url == "change-password"){
          this.isHideSidebar = false;
        }
        else{
          this.isHideSidebar = true;
        }
      }
    });
    this.sidebarSubs = this._share.hideSideBarHeader.subscribe(
      get=>{
        if(get == true){
          this.isHideSidebar = false;
        }
      }
    )

  }
  
  menuhideControl(){
    const getTokenRole:string = this._storage.getUserRole();
    let user = this._storage.getSetUserData();
    if (getTokenRole == "1") {
     this.isHrLogin =true;
     this.isRecLogin = false;  
     this.isPanelLogin = false;
     this.isSuperAdminlogin = false;
     this.isRecAdminLogin = false;
     this.isVendorLogin = false;
     this.isApproverLogin = false;
    }
    else if (getTokenRole == "2") {
      this.isHrLogin =false;
      this.isRecLogin = true;
      this.isPanelLogin = false;
      this.isSuperAdminlogin = false;
      this.isRecAdminLogin = false;
      this.isVendorLogin = false;
      this.isApproverLogin = false;
       if(user?.otherRoles?.IsApprover === 'Y'){
        this.isApproverLogin = true;
      }
     }
     else if (getTokenRole == "4") {
      // this.isHrLogin =false;
      // this.isRecLogin = false;
      // this.isPanelLogin = true;
      // this.isSuperAdminlogin = false;
      // this.isRecAdminLogin = false;
      // this.isVendorLogin = false;
      // this.isApproverLogin = false;
      if(getTokenRole == "4" && user?.otherRoles?.IsApprover === 'Y'){
        this.panelAndApproverLogin();
      }
      else{
       this.panelLogin();
      }
     }
     else if (getTokenRole == "5") {
      this.isHrLogin = false;
      this.isRecLogin = false;
      this.isPanelLogin = false;
      this.isRecAdminLogin = false;
      this.isSuperAdminlogin = true;
      this.isVendorLogin = false;
      this.isApproverLogin = false;
      if(user?.otherRoles?.IsApprover === 'Y'){
        this.isApproverLogin = true;
      }
     }
     else if (getTokenRole == "6") {
      this.isHrLogin = false;
      this.isRecLogin = false;
      this.isPanelLogin = false;
      this.isSuperAdminlogin = false;
      this.isRecAdminLogin = true;
      this.isVendorLogin = false;
      this.isApproverLogin = false;
     }
     else if(user?.UserType === 'E'){
      this.isHrLogin = false;
      this.isRecLogin = false;
      this.isPanelLogin = false;
      this.isSuperAdminlogin = false;
      this.isRecAdminLogin = false;
      this.isApproverLogin = false;
      this.isVendorLogin = true;
     }
     else if(user?.otherRoles?.IsApprover === 'Y'){
      this.isHrLogin = false;
      this.isRecLogin = false;
      this.isPanelLogin = false;
      this.isSuperAdminlogin = false;
      this.isRecAdminLogin = false;
      this.isVendorLogin = false;
      this.isApproverLogin = true;
     }
    else{
    }

    let empId= this._storage.getUserEmpId();
    let  isUserValid = SPECIALACCESSUSER.offerAccesRight.filter(r=> r.empId === parseInt(empId));
    if (isUserValid.length !== 0){ 
      this.specialLogin = true;
    }
    else{
      this.specialLogin = false;
    }

  }

  panelLogin(){
      this.isHrLogin =false;
      this.isRecLogin = false;
      this.isPanelLogin = true;
      this.isSuperAdminlogin = false;
      this.isRecAdminLogin = false;
      this.isVendorLogin = false;
      this.isApproverLogin = false;
  }
  panelAndApproverLogin(){
    this.isHrLogin =false;
    this.isRecLogin = false;
    this.isPanelLogin = true;
    this.isSuperAdminlogin = false;
    this.isRecAdminLogin = false;
    this.isVendorLogin = false;
    this.isApproverLogin = true;
}
  ngAfterViewInit() {
    this.setMenuSubmenu();
  }

  setMenuSubmenu(){
    $(".infoconnect-nav ul ul").before("<span class='show_sub'></span>");
    $(".infoconnect-nav ul ul").prev().prev().addClass("menuClick");
    $(".menuClick,.show_sub").click(function () {
      $(this).parents("li").find(".submenu").slideToggle();
      $(this).parent().toggleClass('activeIcon active');
    });
  }
  setHeightFuncs(): void {
    let docHeight = $(".header-wrapper").outerHeight();
    $(".info-connect-body-wrapper").css("margin-top", docHeight);
  }
  smallHead(): void {
    $(".main-wrapper").addClass("small-left-bar");
   // this.setMenuSubmenu();
  }
  bigHead(): void {
    $(".main-wrapper").removeClass("small-left-bar");
    this.setMenuSubmenu();
  }

}
