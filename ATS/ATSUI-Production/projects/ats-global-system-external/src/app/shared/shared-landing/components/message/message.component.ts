import { Component, OnInit,Inject, OnDestroy } from '@angular/core';
import { MatLegacyDialog as MatDialog,MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Subscription } from 'rxjs';
import {MatLegacySnackBar as MatSnackBar,MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition,MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition,MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,MatLegacySnackBarRef as MatSnackBarRef} from '@angular/material/legacy-snack-bar';
import { ShareService } from '../../../../core/services/share.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit,OnDestroy {
  durationInSeconds = 4;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  public msgErrorSubscription:Subscription;
  public msgSucSubscription:Subscription;
  public msgSessionSubscription:Subscription;
  constructor(
    private _snackBar: MatSnackBar,
    private _share:ShareService
  ) { }

  ngOnInit(): void {
    /***
     * success alert
     */
    this.msgSucSubscription = this._share.showAlertSuccessMessage.subscribe(
      get=>{
        this.alertModalSuc(get);
      }
    );
     /***
     * error alert
     */
    this.msgErrorSubscription = this._share.showAlertErrorMessage.subscribe(
      get=>{
        this.alertModalError(get);
      }
    );
    /***
     * sesssion
     */
    this.msgSessionSubscription = this._share.sessionExpMessage.subscribe(
      get=>{
        if(get){
          this.sessionModalError(get);
        }
      }
    );
  }
 /**
  * success
  * @param data 
  */
  alertModalSuc(data){
    this._snackBar.openFromComponent(MessageSnackBarComponent, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass:'ats-snackbar',
      data:data
    });
  }
  /**
   * Error
   * @param data 
   */
  alertModalError(data){
    this._snackBar.openFromComponent(MessageSnackBarErrorComponent, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass:'ats-snackbar',
      data:data
    });
  }

  sessionModalError(data){
    this._snackBar.openFromComponent(MessageSnackBarErrorComponent, {
      duration: 10 * 60 * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass:'ats-snackbar',
      data:data
    });
  }
  ngOnDestroy(){
    if(this.msgSucSubscription){
      this.msgSucSubscription.unsubscribe();
    }
    if(this.msgErrorSubscription){
      this.msgErrorSubscription.unsubscribe();
    }
    if(this.msgSessionSubscription){
      this.msgSessionSubscription.unsubscribe();
    }
  }

}

@Component({
  selector: 'message-snackbar-success',
  templateUrl: './html/message-snackbar.html',
})
export class MessageSnackBarComponent implements OnInit {
  public msg:string;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,private _snackRef: MatSnackBarRef<MessageSnackBarComponent>,) { }
  ngOnInit(): void {
    this.msg = this.data;
  }
  hideSnack():void{ 
    this._snackRef.dismiss();
  }

}


@Component({
  selector: 'message-snackbar-error',
  templateUrl: './html/message-snackbar-error.html',
})

export class MessageSnackBarErrorComponent implements OnInit {
  public msg:string;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,private _snackRef: MatSnackBarRef<MessageSnackBarErrorComponent>,) { }
  ngOnInit(): void {
    this.msg = this.data;
  }
  hideSnack():void{ 
    this._snackRef.dismiss();
  }

}
