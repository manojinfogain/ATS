import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { OnboardService } from '../../../onboard.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';

@Component({
  selector: 'app-resend-day1-form',
  templateUrl: './resend-day1-form.component.html',
  styleUrls: ['./resend-day1-form.component.scss']
})
export class ResendDay1FormComponent implements OnInit {

  public isHideCancel:boolean = true;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    if(this.data?.isHideCancel == 0){
      this.isHideCancel = this.data?.isHideCancel;
    }

  }
}
