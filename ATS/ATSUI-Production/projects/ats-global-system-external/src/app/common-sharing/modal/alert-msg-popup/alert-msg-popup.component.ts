import { Component, OnInit,Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-alert-msg-popup',
  templateUrl: './alert-msg-popup.component.html',
  styleUrls: ['./alert-msg-popup.component.scss']
})
export class AlertMsgPopupComponent implements OnInit {

  public isHideCancel:boolean = true;
  public isShowOk:boolean = false;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    if(this.data?.isHideCancel == 0){
      this.isHideCancel = this.data?.isHideCancel;
    }
    if(this.data?.isShowOk == 1){
      this.isShowOk = this.data?.isShowOk;
    }

  }

}
