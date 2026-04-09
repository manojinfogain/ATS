import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  public isHideCancel:boolean = true;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    if(this.data?.isHideCancel == 0){
      this.isHideCancel = this.data?.isHideCancel;
    }

  }

}
