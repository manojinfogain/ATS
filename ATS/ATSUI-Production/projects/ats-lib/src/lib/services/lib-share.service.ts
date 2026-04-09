import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibShareService {

  constructor() { }
  /*** display error message */
  public showAlertErrorMessage = new Subject<any>();
  /*** display success message  */
  public showAlertSuccessMessage = new Subject<any>();
   /*** loading */
  public isLoading = new Subject<boolean>();
   /*** userdata */
  public userData = new Subject<any>();

   /*** notification Count */
   public notificationCount = new Subject<any>();

  public sessionExpMessage = new Subject<any>();

  public showAuthMessage = new Subject<any>();

  public hideFooter = new Subject<boolean>();

  /*** hide sidebar */
  public hideSideBarHeader = new Subject<boolean>();
  public hideSideBar = new Subject<boolean>();

  public sessionExp = new BehaviorSubject<boolean>(false);

  public isSkillUpdated = new BehaviorSubject<boolean>(false);
  public hideTopRightMenu = new Subject<boolean>();
  public updateLocation = new BehaviorSubject<boolean>(false);
  public updateSideBarMenu = new BehaviorSubject<boolean>(false);

  public detectSwitchLoc = new Subject<boolean>();

  public activeTabDetection = new Subject<boolean>();
  public otherTabSubmit = new Subject<boolean>();
  public isFinalSubmit = new Subject<boolean>();
  public referredBackSubmit = new Subject<boolean>();
}
