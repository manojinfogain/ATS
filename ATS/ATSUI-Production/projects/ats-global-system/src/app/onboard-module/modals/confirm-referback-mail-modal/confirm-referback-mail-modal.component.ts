import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
@Component({
  selector: 'app-confirm-referback-mail-modal',
  templateUrl: './confirm-referback-mail-modal.component.html',
  styleUrls: ['./confirm-referback-mail-modal.component.scss']
})
export class ConfirmReferbackMailModalComponent implements OnInit {
  
  constructor(
    public dialogRef: MatDialogRef<ConfirmReferbackMailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService

  ) { }

  ngOnInit(): void {
  }

  
  closeModal(): void {
    this.dialogRef.close();
  }
}

