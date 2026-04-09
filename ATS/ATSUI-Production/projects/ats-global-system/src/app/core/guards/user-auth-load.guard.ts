import { Injectable } from '@angular/core';
import { UrlSegment, UrlTree, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from '../authentication/user-auth.service';
import { GetSetStorageService } from '../services/get-set-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthLoadGuard  {
  constructor( private _router:Router,private _authServe:UserAuthService,private _storage:GetSetStorageService){}
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this._authServe.isloggedIn() === false){
      this._router.navigate(['/login']);
     // this._storage.destroyAllStorage();
     //this._storage.destroyAction();
      /**
         * return url 
         */
       const returnUrl = {
        origin:window.location.origin,
        pathname:window.location.pathname,
        href:window.location.href,
        query:window.location.search,
      }
      window.sessionStorage.setItem('returnUrl',JSON.stringify(returnUrl))
      return false;
    }
    return true;
  }

}
