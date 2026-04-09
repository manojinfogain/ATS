import { Component, OnInit,Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-alert-msg-modal',
  templateUrl: './alert-msg-modal.component.html',
  styleUrls: ['./alert-msg-modal.component.scss']
})
export class AlertMsgModalComponent implements OnInit {

 
  public isHideCancel:boolean = true;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    if(this.data?.isHideCancel == 0){
      this.isHideCancel = this.data?.isHideCancel;
    }

  }

}
