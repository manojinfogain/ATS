import { Component, Inject, OnInit } from '@angular/core';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { HttpClient } from '@angular/common/http';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';

@Component({
  selector: 'app-candidate-profile-pic-int',
  templateUrl: './candidate-profile-pic-int.component.html',
  styleUrls: ['./candidate-profile-pic-int.component.scss']
})
export class CandidateProfilePicIntComponent implements OnInit {
  name = ''
  bgvDataColum = [
    //'fileName', 'action'
  ];
  public bgvData: any = [];
  isMultiProfile:boolean = false;
  public roundId:number;
  public cid:number;
  constructor(
    public dialogRef: MatDialogRef<CandidateProfilePicIntComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private http: HttpClient,
    private _share: ShareService
  ) { }

  ngOnInit() {
    // this.getDetails();
    this.isMultiProfile = this.data?.isMultiProfile;
    this.roundId = this.data?.roundId
    this.cid = this.data?.cid

   // this.getProfilePic();
  }
  public image: any;
  getProfilePic() {
    this.http.get(`${environment.apiMainUrlNet}interview/DownloadProfilePicture?RoundId=${this.data.roundId}`, { headers: { 'Content-Type': 'image/jpg' }, responseType: 'blob' }).subscribe(
      res => {
        const reader = new FileReader();
        reader.onload = (e) => this.image = e.target.result;
        reader.readAsDataURL(new Blob([res]));
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }

  

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

}
