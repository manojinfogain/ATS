import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from '../authentication/user-auth.service';
import { GetSetStorageService } from '../services/get-set-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor( private _router:Router,private _authServe:UserAuthService,private _storage:GetSetStorageService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this._authServe.isloggedIn() === false){
        this._router.navigate(['/login']);
        this._storage.destroyAllStorage();
        return false;
      }
      return true;
  }
  
}
