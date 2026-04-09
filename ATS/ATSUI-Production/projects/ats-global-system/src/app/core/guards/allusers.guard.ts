import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from '../authentication/user-auth.service';
import { GetSetStorageService } from '../services/get-set-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AllusersGuard  {
  constructor(private _router: Router, private _authServe: UserAuthService, private _storage: GetSetStorageService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this._authServe.isRecruiterAdmin() === true || 
    this._authServe.isRecruiter() === true || 
    this._authServe.isSuperAdmin() === true ||
    this._authServe.isAdminRenuTeam() === true ||
    this._authServe.isHr() === true
    ) {
      return true
    }
    else {
     // this._storage.destroyAllStorage();
      this._router.navigate(['/login']);
      return false
    }
  }

}
