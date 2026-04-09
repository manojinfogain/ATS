import { Injectable } from "@angular/core";
import { GlobalCommonMethodService } from "./global-common-method.service";
import { GetSetStorageService } from "../services/get-set-storage.service";
@Injectable({
    providedIn: 'root'
})
export class GetLocationInfo {
    constructor(private _globalCommonMethod: GlobalCommonMethodService,
        private _storage: GetSetStorageService
    ) {

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
            locationData?.locId == 11 ||
            locationData?.locId == 23) {
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

      /***
  * India Location
  */
      isLocationIndiaById(locationId: number = null) {

        if (locationId == 1 ||
            locationId == 2 ||
            locationId == 4 ||
            locationId == 5 ||
            locationId == 10 ||
            locationId == 16 ||
            locationId == 11 ||
            locationId == 21 ||
            locationId == 23) {
            return true
        }
        else {
            false
        }
    }


     /***
  * User India Location
  */
     isUserLocationIndia(UserData: any = null) {
        if (UserData == null) {
            UserData = this._storage.getSetUserData();
        }

        if (UserData?.LocationID == 1 ||
            UserData?.LocationID == 2 ||
            UserData?.LocationID == 4 ||
            UserData?.LocationID == 5 ||
            UserData?.LocationID == 10 ||
            UserData?.LocationID == 16 ||
            UserData?.LocationID == 11 ||
            UserData?.LocationID == 23) {
            return true
        }
        else {
            false
        }
    }

    /***
 * India Location
 */
    isUserLocationUS(UserData: any = null) {
        if (UserData == null) {
            UserData = this._storage.getSetUserData();
        }

        if (UserData?.LocationID == 3) {
            return true
        }
        else {
            false
        }
    }

            /***
         * India Location IDs
         */
        getIndiaLocationIds(): number[] {
            return [1, 2, 4, 5, 10, 11, 16, 23];
        }
}