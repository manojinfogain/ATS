import { AfterContentInit, AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'lib-view-instruction-modal',
  templateUrl: './lib-view-instruction-modal.component.html',
  styleUrls: ['./lib-view-instruction-modal.component.scss']
})
export class LibViewInstructionModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LibViewInstructionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _http: HttpClient,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }
  closeModal(): void {
    this.dialogRef.close();
  }
}
