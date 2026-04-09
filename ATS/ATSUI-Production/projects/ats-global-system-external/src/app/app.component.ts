import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAuthService } from './core/authentication/user-auth.service';
import { AtsCommonFuncService } from './core/common/ats-common-func.service';
import { ConfigService } from './core/services/config.service';
import { DeclarationConsentModalComponent } from './common-sharing/modal/declaration-consent-modal/declaration-consent-modal.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from './core/services/get-set-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ats-global-system-external';
  constructor(
    private _router: Router,
    private _userAuth: UserAuthService,
    private _spinner: NgxSpinnerService,
    private _atsCommon: AtsCommonFuncService,
    private dialog: MatDialog,
    private _storage:GetSetStorageService
  ) {}

  ngOnInit(): void {
    //   this._spinner.show();

    this._atsCommon.addClasLocationWise();
    this._router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        this._spinner.show();
      }
      if (e instanceof NavigationEnd) {
        this._spinner.hide();
        this._userAuth.getUserDetails();
      //  this.consentModalOpen();
      }
    });
  }

  consentModalOpen() {
    let userData = this._storage.getSetUserData();
    // if (userData && userData?.IsDeclarationDone === 0) {
    //   let elm = { title: 'Your Information & Privacy Consent' };
    //   const dialogRef = this.dialog.open(DeclarationConsentModalComponent, {
    //     panelClass: ['ats-model-wrap', 'onboard-consent-modal'],
    //     data: elm,
    //     disableClose: true,
    //   });
    //   dialogRef.afterClosed().subscribe((res) => {
    //     if (res) {
          this._userAuth.getUserDetails();
    //     }
    //   });
    // }
   
  }
}
