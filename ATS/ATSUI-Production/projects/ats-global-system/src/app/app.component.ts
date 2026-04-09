import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { UserAuthService } from './core/authentication/user-auth.service';
import { AtsCommonFuncService } from './core/common/ats-common-func.service';
import { GlobalCommonMethodService } from './core/common/global-common-method.service';
import { NotificationCommonService } from './core/services/notification-common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ats-global-system';
  constructor( 
    private _router:Router,
    private _userAuth:UserAuthService,
    private _spinner:NgxSpinnerService,
    private _atsCommon:AtsCommonFuncService,
    private _notificServe:NotificationCommonService
    ){}

  ngOnInit():void{
 //   this._spinner.show();
 
    this._atsCommon.addClasLocationWise();
    this._router.events.subscribe(e =>{
      if(e instanceof NavigationStart){
       this._spinner.show();
      }
      if(e instanceof NavigationEnd){
         this._spinner.hide();
         this._userAuth.getUserDetails();
          if(environment.isNotification){
            this._notificServe.getNotificationCount();
          }
         
     }
    })
  }  
}
