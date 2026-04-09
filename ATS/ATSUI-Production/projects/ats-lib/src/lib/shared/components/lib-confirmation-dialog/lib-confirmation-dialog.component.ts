import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'lib-confirmation-dialog',
  templateUrl: './lib-confirmation-dialog.component.html',
  styleUrls: ['./lib-confirmation-dialog.component.scss']
})
export class LibConfirmationDialogComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
  }

}
