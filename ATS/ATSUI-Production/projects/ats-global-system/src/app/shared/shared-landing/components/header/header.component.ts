import { Component, OnDestroy, OnInit } from '@angular/core';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { NavigationEnd, Router } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { SearchCandidateService } from 'projects/ats-global-system/src/app/core/services/search-candidate.service';
import { debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,OnDestroy {
  commonconst = COMMON_CONST;
  imgPath = this.commonconst.imgPath;
  setProf: string;
  name: string;
  nameUser: string;
  isHeaderShow: boolean;
  profile: string;
  LogoInfo: string;
  LogoSmall: string;
  searchControl = new UntypedFormControl();
  resultListData: any;
  isDropdownShow: boolean;
  IsDropdownLoader: boolean;
  getValsearch: string;
  ifValidEnter: boolean;
  ifLenth: boolean;
  minMsg: string;
  isPopCandidate: boolean;
  candidateData: any;
  isHideSearch: boolean;
  isAppLoader: boolean;
  public userDataLog:any = [];
  public sidebarSubs:Subscription;
  public userDataSubs:Subscription;
  public topRightMenuSubs:Subscription;
  constructor(
    private _searchServe: SearchCandidateService,
    private router: Router,
    private _storage:GetSetStorageService,
    private _share:ShareService,
    private _router:Router) {
    this.setProf = this.imgPath + "no-profile-male.png";
    this.isHeaderShow = false;
    this.LogoInfo = this.imgPath + "Infogain_Logo.png";
    this.LogoSmall = this.imgPath + "lms_infogain_Logo_icon.png";
  }

  ngOnInit() {
   this.candidatesearchMethod();
   this.setUserData();
   this.hideHeaderSideBar();
  }

  ngOnDestroy(){
    if(this.sidebarSubs){
      this.sidebarSubs.unsubscribe();
    }
    if(this.userDataSubs){
      this.userDataSubs.unsubscribe();
    }
    if(this.topRightMenuSubs){
      this.topRightMenuSubs.unsubscribe();
    }
  }

   /*** Hide Content Method  ***/
   public hideMenu:boolean = true;
   hideHeaderSideBar() {
    /**** on route change Method ****/ 
    this._router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        let url = e.url.substr(e.url.lastIndexOf('/') + 1);
       
        if(url == "" || url == "login"){
          this.isHeaderShow = false;
        }
        else{
          this.isHeaderShow = true;
        }
      }
    });
    this.sidebarSubs =this._share.hideSideBarHeader.subscribe(
      get=>{
        if(get == true){
          this.isHeaderShow = false;
        }
      }
    )

    this.topRightMenuSubs = this._share.hideTopRightMenu.subscribe(
      get=>{
        if(get == true){
          this.hideMenu = false;
        }
        
      }
    )

  }
  /***
   * candidate Search Method
   */
  candidatesearchMethod(){
    this.searchControl.valueChanges
    .pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(
      val => {
        this.getValsearch = val;
        if (val.trim() == "" || val.trim().length <= 1) {
          this.resultListData = 0;
          this.isDropdownShow = false;
          this.ifValidEnter = false;
          return false;
        }
        let expr = /^[a-zA-Z0-9._@ ]*$/;
        if (!expr.test(val.trim())) {
          this.ifLenth = false;
          this.ifValidEnter = true;
          this.isDropdownShow = false;
          return false;
        }
        else {
          this.searchByInput(val);
        }
      }
    )
  }

  /***
   * setUserDaata
   */
  setUserData(){
   this.userDataSubs = this._share.userData.subscribe(
      dataUser=>{
        this.userDataLog =dataUser;
        this.hideSearch();
        this.isAppLoader = false;
        
      }
    )
  }

  hideSearch() {
    const getTokenRole = this._storage.getUserRole();
    let user = this._storage.getSetUserData();
    if(getTokenRole){
      if (getTokenRole == "3") {
        this.isHideSearch = false;
        let body = document.body;
        body.classList.add("candidate-log-main");
        document.body.classList.remove("login-page-main");
      }
      else if (getTokenRole == "4" && user?.otherRoles?.IsApprover != 'Y') {
        this.isHideSearch = false;
        let body = document.body;
        body.classList.add("candidate-log-main");
        document.body.classList.remove("login-page-main");
      }
      else {
        this.isHideSearch = true;
        document.body.classList.remove("login-page-main");
      }
    }
    
  }
  onBlure(): void {
    this.ifLenth = false;
    this.ifValidEnter = false;
  }
  closeDropDown() {
    this.isDropdownShow = false;
    this.searchControl.setValue('');
  }
  validValue(event) {
    let val = event.target.value;
    let expr = /^[a-zA-Z0-9._@ ]*$/;
    this.getValsearch = val;
    if (!expr.test(val.trim())) {
      this.ifLenth = false;
      this.ifValidEnter = true;
      this.isDropdownShow = false;
      return false;
    }
    else {
      this.ifValidEnter = false;
      this.minSearch(val);
    }
  }
  searchByInput(val) {
   // alert('search by input');
    this.IsDropdownLoader = true;
    this._searchServe.getCandidateDataBySearch(val.trim().replace(/\s\s+/g, ' ')).subscribe(
      res => {
        // console.log(res);
        this.IsDropdownLoader = false;
        this.isDropdownShow = true;
        this.resultListData = res;
        console.log(res);
        //  alert(val)
        this.getValsearch.trim() == "" || this.getValsearch.trim() == null ? this.isDropdownShow = false : this.isDropdownShow = true;
      },
      (error) => {
        console.warn(error);
        this.IsDropdownLoader = false;
      }
    )


  }
  minSearch(val) {
    if (val.trim().length === 1) {
      this.ifLenth = true;
      this.isDropdownShow = false;
      this.IsDropdownLoader = false;
      this.minMsg = "please enter one more word or number  to  search.";
      return false;
    }
    if (val.trim().length === 0) {
      this.ifLenth = true;
      this.isDropdownShow = false;
      this.IsDropdownLoader = false;
      this.minMsg = "please enter minimum two word or number  to  search.";
      return false;
    }
    else {
      this.ifLenth = false;
      this.IsDropdownLoader = true;
    }
  }
  //open popup
  openCandPopup(data) {
    console.log(data);
    this.candidateData = data;
    this.isPopCandidate = true;
  }

  close(): void {
    this.isPopCandidate = false;
  }

  logOut() {
    this._storage.destroyAllStorage();
    this._share.sessionExp.next(false);
    this.router.navigate(['/login']);
  }
}
