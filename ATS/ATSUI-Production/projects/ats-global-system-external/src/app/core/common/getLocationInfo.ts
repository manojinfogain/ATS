import { Injectable } from "@angular/core";
import { GlobalCommonMethodService } from "./global-common-method.service";
@Injectable({
    providedIn: 'root'
})
export class GetLocationInfo {
    constructor(private _globalCommonMethod: GlobalCommonMethodService) {

    }
    /***
  * India Location
  */
    isLocationIndia(locationData: any = null) {
        if (locationData == null) {
            locationData = this._globalCommonMethod.getSetLocation();
        }

        if (locationData?.locId == 1 ||
            locationData?.locId == 2 ||
            locationData?.locId == 4 ||
            locationData?.locId == 5 ||
            locationData?.locId == 10 ||
            locationData?.locId == 16 ||
            locationData?.locId == 11) {
            return true
        }
        else {
            false
        }
    }

    /***
 * India Location
 */
    isLocationUS(locationData: any = null) {
        if (locationData == null) {
            locationData = this._globalCommonMethod.getSetLocation();
        }

        if (locationData?.locId == 3) {
            return true
        }
        else {
            false
        }
    }
}