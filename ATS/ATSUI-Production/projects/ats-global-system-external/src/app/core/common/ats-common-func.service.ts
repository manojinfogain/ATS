import { Injectable } from '@angular/core';
import { GetLocationInfo } from './getLocationInfo';
import { GlobalCommonMethodService } from './global-common-method.service';

@Injectable({
  providedIn: 'root'
})
export class AtsCommonFuncService {

  constructor(
    private _globalCommonMethod: GlobalCommonMethodService,
    private getLocInfo:GetLocationInfo
  ) { }

  //add class Loc Wise
  addClasLocationWise() {
    let loc = this._globalCommonMethod.getSetLocation();
    this.removeAllClass();
    if (this.getLocInfo.isLocationUS(loc)) {
       document.body.classList.add('us-ats');
    }
    else if (this.getLocInfo.isLocationIndia(loc)) {
      document.body.classList.add('in-ats');
   }
    else{
      
    }
  }
  //remove all boy\dy class
  removeAllClass(){
    document.body.classList.remove('us-ats','in-ats');
  }


  /**
   * Transfer Access
   */
  
}
