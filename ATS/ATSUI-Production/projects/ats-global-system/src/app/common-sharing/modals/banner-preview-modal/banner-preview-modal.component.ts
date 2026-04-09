import { Component, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-banner-preview-modal',
  templateUrl: './banner-preview-modal.component.html',
  styleUrls: ['./banner-preview-modal.component.scss']
})
export class BannerPreviewModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BannerPreviewModalComponent>,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 7000);
  }

}
