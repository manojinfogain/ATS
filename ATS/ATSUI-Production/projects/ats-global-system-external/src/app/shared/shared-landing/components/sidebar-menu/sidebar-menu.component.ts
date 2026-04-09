import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetLocationInfo } from 'projects/ats-global-system-external/src/app/core/common/getLocationInfo';
import { GlobalCommonMethodService } from 'projects/ats-global-system-external/src/app/core/common/global-common-method.service';
import { GetSetStorageService } from 'projects/ats-global-system-external/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  panelOpenState = false;
  isHideMenu: boolean;
  isCandMenu: boolean;

  public isCanLogin: boolean = false;
  public isHideSidebar: boolean = false;
  public sidebarSubs: Subscription;
  public sidebarSubs1: Subscription;
  public hideLocWise: boolean = true;
  public updateLocsubs: Subscription;
  public locationData: any = {};
  public onBoardFormsList: any = []

  @ViewChild('sidebar', { static: true }) sidebarElm: ElementRef;
  constructor(
    private _router: Router,
    private _share: ShareService,
    private _storage: GetSetStorageService,
    private _globalCommonMethod: GlobalCommonMethodService,
    private getLocInfo: GetLocationInfo,
    private _candidateServe: CandidateService,
  ) { }

  ngOnInit(): void {
    this.hideHeaderSideBar();
    this.updateLocsubs = this._share.updateSideBarMenu.subscribe(
      get => {
        this.locationData = this._globalCommonMethod.getSetLocation();
      }
    );
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
        if (url == "" || url == "login" || url == "change-password" || url == "offer-accept" || url == "forgot-password" || url == "otp-verification") {
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
  public isOnboardFormEnable:boolean = false;
  public isUploadBgvDocEnable:boolean = false;
  public isDay1FormEnable:boolean = false;
  public isEnablePendingDocs:boolean = false;
  public isAppointLetterEnable:boolean = false;
  public IsDelegateRecruiter:boolean = false;
  menuhideControl() {
    let user = this._storage.getSetUserData();
    const IsDay1Form = user?.IsDay1Form;
    const IsOnboardForm = user?.IsOnboardForm;
    //const IsDelegateRecruiter = user?.RoleId == 3 ? true : false;
    const IsBGVFormEnabled = user?.ISBGVFormsEnable;
    this.isCanLogin = false;
    this.isOnboardFormEnable = false;
    // this.isUploadBgvDocEnable = true;
    this.isDay1FormEnable =  false;
    this.isEnablePendingDocs = false;
    this.isAppointLetterEnable = false;
    this.IsDelegateRecruiter = false;
    debugger
    if(IsOnboardForm === 'Y'){
     this.isOnboardFormEnable = true;
    }
    if(IsDay1Form === 'Y'){
      this.isDay1FormEnable = true;
    }
    if(user?.IsEnablePendingDocs === 'Y'){
      this.isEnablePendingDocs = true;
    }
    if(user?.IsEnableAppointLet === 'Y'){
      this.isAppointLetterEnable = true;
    }
     if(IsBGVFormEnabled === 'Y'){
     this.isUploadBgvDocEnable = true;
    }
    /**delegator role 13 for leadership */
    if(user?.RoleId === 13){
      this.IsDelegateRecruiter = true;
      this.isOnboardFormEnable = false;
      this.isDay1FormEnable = false;
      this.isAppointLetterEnable = false;
      this.isEnablePendingDocs = false;
    }
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
