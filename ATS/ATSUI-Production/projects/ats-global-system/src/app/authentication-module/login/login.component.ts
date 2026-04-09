import { Component, OnDestroy, OnInit } from '@angular/core';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { AuthenticationService } from '../authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { UserAuthService } from 'projects/ats-global-system/src/app/core/authentication/user-auth.service';
import { AuthenticationCommonService } from 'projects/ats-global-system/src/app/core/authentication/authentication-common.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { Subscription } from 'rxjs';
import { TitleConfigService } from 'projects/ats-global-system/src/app/core/services/title-config.service';
import { ILogin } from 'projects/ats-global-system/src/app/core/models/common-model';
import { userDetails } from 'projects/ats-global-system/src/app/core/models/user-details-model';
import { environment } from 'projects/ats-global-system/src/environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  commonconst = COMMON_CONST;
  imgPath = this.commonconst.imgPath;
  leftBigImg: string;
  leftBigImgcopy: string;
  loginLogo: string;
  isOpen: boolean;
  isClose: boolean;
  hideShowPassword: boolean;
  userData: any;
  error: string;
  isLoading: boolean;
  isLoadingHorz: boolean;
  isLoginErrorShow: boolean;
  username: string;
  password: string;
  myInnerHeight: number;
  public sessionSubs: Subscription;
  public year:number = new Date().getFullYear();
  appearance:string ='legacy';
  constructor(
    private _loginServe: AuthenticationService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _userAuth: UserAuthService,
    private _userAuthCommon: AuthenticationCommonService,
    private _share: ShareService,
    private _activeRouter: ActivatedRoute,
    private _titleService: TitleConfigService,
    private _router: Router,
  ) {
    this.leftBigImg = this.imgPath + "login_img.jpg";
    this.leftBigImgcopy = this.imgPath + "login-bg-new.png";
    this.loginLogo = this.imgPath + "Infogain_Logo2.png";
    this.isClose = false;
    this.isOpen = true;
    this.hideShowPassword = true;
    this.isLoading = false;
    this.isLoadingHorz = false;

  }

  /**
   * handler login wuth MS
   */
  loginOffice() {
    if(environment.name == 'Production'){
      this._loginServe.loginOffice365();
    } 
  }

  /***
  * office Ms login 
  */
  SLoginOffice(code: string) {
    this.isLoading = true;
    this.isLoadingHorz = true;
    this._loginServe.LoginUser(null, null, code).subscribe(res => {
      this.userData = res;
      this._storage.saveToken(res.access_token)
      this.isLoginErrorShow = false;
      this._storage.setLoginType('M');
      this.getDetailsUser();
    },
      (error) => {
        this.isLoading = false;
        this.isLoadingHorz = false;
        this.error = error.error.error_description;
        this.isLoginErrorShow = true;
      })
  }
  /***
   * SSO Login
   */
  SLogin(token: string) {
    this.isLoading = true;
    this.isLoadingHorz = true;
    this._loginServe.LoginUser(null, token).subscribe(res => {
      this.userData = res;
      this._storage.saveToken(res.access_token)
      this.isLoginErrorShow = false;
      this.getDetailsUser();
    },
      (error) => {
        this.isLoading = false;
        this.isLoadingHorz = false;
        this.error = error.error.error_description;
        this.isLoginErrorShow = true;
      })
  }

  ngOnInit() {
    let getToken= this._storage.getToken(); 
    let getParam = this._activeRouter.snapshot.queryParams;
    let userType = this._storage.getUserType();
    let getAction = this._storage.getAction(); 
    if (getParam['code']) {
      this.SLoginOffice(getParam['code']);
      this._storage.destroyUserType();
    }
    else if(getToken){
      this.getDetailsUser();
     // return
    }
    else if(getAction == '1'){
      this._storage.destroyAction();
      this._storage.destroyAllStorage();
     }
     else if (userType == "I") {
      this._storage.destroyAllStorage();
      if(environment.defaultSSO){
        this._storage.destroyUserType();
        this.loginOffice();
      }
      
    }
    else{
      this._storage.destroyAllStorage();
    }

    this._share.hideSideBarHeader.next(true);
    this.dialog.closeAll();
    // $(".main-wrapper").addClass("small-left-bar");
    
    this._share.userData.next([]);
    //this._share.hideSideBarHeader.next(true);
    document.addEventListener("keydown", this.keyDownTextField, false);
    //addClass
    document.body.classList.add("login-page-main");
    document.body.classList.remove("candidate-log-main");
    this.sessionSubs = this._share.sessionExp.subscribe(
      get => {
        if (get === true) {
          this.isLoginErrorShow = true;
          this.error = "Session has expired. Please log in again";
        }
      }
    )

    this.setTitle();
    /**
     * get SSO Token
     */
    let queryParam = this._activeRouter['snapshot']?.queryParams?.token;
    if (queryParam) {
      this.SLogin(queryParam);
    }
  }

  setTitle() {
    this._titleService.setTitle(this._activeRouter['snapshot'].data['title']);
  }

  ngOnDestroy() {
    if (this.sessionSubs) {
      this.sessionSubs.unsubscribe();
    }
  }

  getDetailsUser(userType:string = 'I') {       
    this._userAuthCommon.getUser().subscribe(
      (res: userDetails) => {        
        this._storage.setUserEmpId(res.EmpNewId);
        this._storage.setUserRole(res.RoleId);
        this._storage.setUserData(res);
        this._storage.setUserEmail(res.MailID);
        if(userType == 'E'){    
          //otp redirect          
          this._router.navigate(['mfa-otp-verification']);
        }else{        
          this._userAuth.redirectMethod();
        }
      },
      (error) => {
        this.isLoading = false;
        this.isLoadingHorz = false;
        this.error = error.error.message;
        this.isLoginErrorShow = true;
      }
    )
  }

  infoConnectLogin(user: string, pass: string) {
    document.body.classList.remove("auth-page-main");
    this._storage.setUserName(user);
    if (user == undefined || user == "" || user == null) {
      this.error = "Please Enter Username";
      this.isLoginErrorShow = true;
      return false;
    }
    if (pass == undefined || pass == "" || pass == null) {
      this.error = "Please Enter Password";
      this.isLoginErrorShow = true;
      return false;
    }
    else {
      this.isLoading = true;
      this.isLoadingHorz = true;
      let body: ILogin = {
        password: pass,
        userName: user,
      }
      this._loginServe.LoginUser(body).subscribe(res => {
        this.userData = res;       
        const userNameA: string[] = body.userName.split('@');
        if (   userNameA.length > 1 &&   userNameA[1].toLowerCase() !== 'infogain.com' &&   userNameA[1].toLowerCase() !== 'igglobal.com' )
        {          
          this._storage.saveTokenExTemp(res.access_token)
          this.isLoginErrorShow = false;
          this.getDetailsUser('E');
        }else{
          this._storage.saveToken(res.access_token)
          this.isLoginErrorShow = false;
          this.getDetailsUser('I');
        }
      },

      

        (err: HttpErrorResponse) => {
         
            if (err.error.statusCode == "404") {
              this.error = err.error.error_description;
              this.isLoginErrorShow = true;
              this.isLoading = false;
              this.isLoadingHorz = false;
            }
            else if (err.status == 0) {
              this.error = " Server Error";
              this.isLoginErrorShow = true;
              this.isLoading = false;
              this.isLoadingHorz = false;
            }
            else {
              this.error = err.error.error_description;
              this.isLoginErrorShow = true;
              this.isLoading = false;
              this.isLoadingHorz = false;
            }
         
          // console.warn(err);
         

        }
      );


    }
  }
  keyDownTextField(e) {
    let keyCode = e.keyCode;
    if (keyCode == 13) {
      document.getElementById('btnLogin').click();
    } else {
    }
  }
  setHeightFunc(): void {
    let winHeight = window.innerHeight;
    let bar = '' + winHeight;
  
    this.myInnerHeight = winHeight;
  }

  eyeSlashClick(): void {
    this.isOpen = true;
    this.isClose = false;
    this.hideShowPassword = true;
  }
  eyeClickOpen(): void {
    this.isClose = true;
    this.isOpen = false;
    this.hideShowPassword = false;
  }
  hideErrorButton() {
    this.isLoginErrorShow = false;
  }

}
