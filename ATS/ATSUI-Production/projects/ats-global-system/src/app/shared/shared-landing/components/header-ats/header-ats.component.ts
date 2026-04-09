import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuthService } from 'projects/ats-global-system/src/app/core/authentication/user-auth.service';
import { AtsCommonFuncService } from 'projects/ats-global-system/src/app/core/common/ats-common-func.service';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
@Component({
  selector: 'app-header-ats',
  templateUrl: './header-ats.component.html',
  styleUrls: ['./header-ats.component.scss']
})
export class HeaderAtsComponent implements OnInit {
  public userDataLog: any = [];
  public sidebarSubs: Subscription;
  public userDataSubs: Subscription;
  public updateLocsubs: Subscription;
  public topRightMenuSubs: Subscription;
  isHeaderShow: boolean = false;
  public locationData: any = {};
  public env:any = environment;
  public showLocMenu:boolean = true;
  constructor(
    private _storage: GetSetStorageService,
    private _share: ShareService,
    private _router: Router,
    private _globalApiServe: GlobalApisService,
    private _globalCommonMethod: GlobalCommonMethodService,
    private _userAuth:UserAuthService,
    private getLocInfo:GetLocationInfo,
    private _atsCommon:AtsCommonFuncService
  ) { }

  

  ngOnInit(): void {
    this.setUserData();
    this.hideHeaderSideBar();
    //this.getLocation();
    this.updateLocsubs = this._share.updateLocation.subscribe(
      get=>{
        this.locationData = this._globalCommonMethod.getSetLocation();
        let userData = this._storage.getSetUserData();
        this.showLocMenu = true;
        if(userData?.UserType == 'E'){
          this.showLocMenu = false;
        }
      }
    )
   
  }

  /***
   * location Change
   */
  switchLocation(data: any) {
    this.locationData = {
      locId: data.LocID,
      locName: data.LocName
    }

    this._storage.saveLocationData(this.locationData);
    this._share.updateSideBarMenu.next(true);
    if(this.getLocInfo.isLocationIndia(this.locationData)|| this.getLocInfo.isLocationUS(this.locationData)){
     let url = this._router.url;
     if(url == '/coming-soon'){
      this._userAuth.redirectToPage();
     }
    }
    else{
      this._router.navigate(['coming-soon']);
    }

    this._share.detectSwitchLoc.next(true);
    this._atsCommon.addClasLocationWise();
  }

  public locationList: any = [];
  getLocation() {
    const token = this._storage.getToken();
    if(token){
      this._globalApiServe.getLocationList().subscribe(
        res => {
        let filterById = [1,2,3,4,5,6,11,10,16,23];
        let dataRes = res['data'];
        let filterByStatus = dataRes.filter(t => {
          return filterById.indexOf(t.LocID) !== -1;
        });
          this.locationList = filterByStatus.sort();
          
        }
      );
    }
    
  }
  public profilepic: string;
  public isMsLogin:boolean = false;
  /***
   * setUserDaata
   */
  setUserData() {
    this.userDataSubs = this._share.userData.subscribe(
      dataUser => {
        this.userDataLog = dataUser;
        this.profilepic = 'https://aspire.infogain.com/ImageHandler1.ashx?n=' + dataUser?.Photo;  
        let getLoginType = this._storage.getLoginType();
        if(getLoginType === "M"){
          this.isMsLogin = true;
        }
        else{
          this.isMsLogin = false;
        }
       
      }
    )
  }

  /*** Hide Content Method  ***/
  public hideMenu: boolean = true;
  public isShowForMFAScreen: boolean = true;
  hideHeaderSideBar() {
    /**** on route change Method ****/
    this._router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.getLocation();
        let url = e.url.substr(e.url.lastIndexOf('/') + 1);

        if (url == "" || url == "login") {
          this.isHeaderShow = false;
        }
        else {
          this.isHeaderShow = true;
        }
        if (url == "mfa-otp-verification"){
          this.isShowForMFAScreen = true;
        }
        else {
          this.isShowForMFAScreen = false;
        }
      }
    });
    this.sidebarSubs = this._share.hideSideBarHeader.subscribe(
      get => {
        if (get == true) {
          this.isHeaderShow = false;
        }
      }
    )

    this.topRightMenuSubs = this._share.hideTopRightMenu.subscribe(
      get => {
        if (get == true) {
          this.hideMenu = false;
        }

      }
    )

  }

  logOutATS() {
    this._userAuth.logOutAts();
    //this._userAuth.logOutOffice365App();

  }
  logOutMsOff() {
    // this._storage.destroyAllStorage();
    // this._share.sessionExp.next(false);
    // this._storage.setAction('1');
    // this._router.navigate(['/login']);
    //this._userAuth.logOutAts();
    this._userAuth.logOutOffice365App();

  }


  ngOnDestroy() {
    if (this.sidebarSubs) {
      this.sidebarSubs.unsubscribe();
    }
    if (this.userDataSubs) {
      this.userDataSubs.unsubscribe();
    }
    if (this.topRightMenuSubs) {
      this.topRightMenuSubs.unsubscribe();
    }
    if(this.updateLocsubs){
      this.updateLocsubs.unsubscribe();
    }
  }

}
