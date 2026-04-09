import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-common-image-preview-modal',
  templateUrl: './common-image-preview-modal.component.html',
  styleUrls: ['./common-image-preview-modal.component.scss']
})
export class CommonImagePreviewModalComponent implements OnInit {
  
  public roundId:number;
  constructor(
    public dialogRef: MatDialogRef<CommonImagePreviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _share: ShareService
  ) { }

  ngOnInit() {
   this.getProfilePic();
  }

  public image: any;
  getProfilePic() {
    if(this.data?.picSource){
      const reader = new FileReader();
      reader.onload = (e) => this.image = e.target.result;
      reader.readAsDataURL(new Blob([this.data?.picSource]));
    }else{
      this._share.showAlertErrorMessage.next('Something went wrong');
    }
  }  

  // download pic 
  downloadPic(img:any){
    saveAs(img, this.data?.fileName);
  }

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

}
