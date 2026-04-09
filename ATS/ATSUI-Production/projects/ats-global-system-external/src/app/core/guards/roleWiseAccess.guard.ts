import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from '../authentication/user-auth.service';
import { GetSetStorageService } from '../services/get-set-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RoleWiseAccessGuard implements CanActivate {
  constructor(private _router: Router, private _authServe: UserAuthService, private _storage: GetSetStorageService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let getRoles = route?.data?.role;
    let userRoleId = this._authServe.getRoleId();
    let otherRole:any= route?.data?.otherRole;
    let userData = this._storage.getSetUserData();
    let getLoggedOtherRole = this._authServe.getUserOtherRole(userData?.otherRoles);
    if (getRoles.length != 0 || otherRole.length !=0 ) {
      let isUserRoleExist = getRoles.filter(f => f === userRoleId);
      let isUserRoleOtherExist = otherRole.filter(t => {
        return getLoggedOtherRole.indexOf(t) !== -1;
      });
      
      if (isUserRoleExist.length != 0 || isUserRoleOtherExist.length != 0) {
        return true
      }
      else {
        this._storage.destroyAllStorage();
        this._router.navigate(['/login']);
        return false
      }
    }
    else {
      this._storage.destroyAllStorage();
      this._router.navigate(['/login']);
      return false
    }
  }

}
