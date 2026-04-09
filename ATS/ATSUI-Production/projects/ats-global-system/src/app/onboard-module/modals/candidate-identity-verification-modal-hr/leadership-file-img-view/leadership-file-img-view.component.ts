import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { PreviewMediaFileModalComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/preview-media-file-modal/preview-media-file-modal.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';

@Component({
  selector: 'app-leadership-file-img-view',
  templateUrl: './leadership-file-img-view.component.html',
  styleUrls: ['./leadership-file-img-view.component.scss']
})
export class LeadershipFileImgViewComponent implements OnInit {

  @Input() public filePath: string = '';
  @Input() public fileData: any = {};
  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fileData['isLeadership'] = 'Y'
  }

  ngAfterViewInit(): void {
    if (this.fileData?.fileType == 'P') {
      if (this.fileData?.sharePointIdVideo) {
        this.http.get(`${environment.apiMainUrlNet}Common/downloadSharePointFile?id=${this.fileData?.sharePointIdVideo}&fileName=${this.fileData?.fileName}`, { responseType: 'blob' }).subscribe(
          res => {
            let reader = new FileReader();
            reader.readAsDataURL(res);
            reader.onload = () => {
              this.pathSrc = reader.result;
            }
          },
          (error) => {
            // this._share.showAlertErrorMessage.next('Something went wrong');
          }
        )
      }
      else {
        this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${this.fileData?.filePath}`, { responseType: 'blob' }).subscribe(
          res => {
            let reader = new FileReader();
            reader.readAsDataURL(res);
            reader.onload = () => {
              this.pathSrc = reader.result;
            }
          },
          (error) => {
            // this._share.showAlertErrorMessage.next('Something went wrong');
          }
        )
      }
    }

  }

  /***
 * 
 */

  previewVideo() {
    if (this.fileData?.sharePointIdVideo) {
      this.http.get(`${environment.apiMainUrlNet}Common/downloadSharePointFile?id=${this.fileData?.sharePointIdVideo}&fileName=${this.fileData?.fileName}`, { responseType: 'blob' }).subscribe(
        res => {
          let reader = new FileReader();
          reader.readAsDataURL(res);
          reader.onload = () => {
            this.pathSrc = reader.result;
            this.previewImageVideo(this.fileData);
          }
        },
        (error) => {
          // this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }
    else {
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${this.fileData?.filePath}`, { responseType: 'blob' }).subscribe(
        res => {
          let reader = new FileReader();
          reader.readAsDataURL(res);
          reader.onload = () => {
            this.pathSrc = reader.result;
            this.previewImageVideo(this.fileData);
          }
        },
        (error) => {
          // this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }
  }
  previewImageVideo(data: any = {}) {
    data['file'] = this.pathSrc;
    data['isDownload'] = true;
    let pClass: any = [];
    if (this.fileData?.fileType == 'P') {
      pClass = ['ats-model-wrap', 'ats-preview-media-model', 'ats-preview-media-model-img']
    }
    else {
      pClass = ['ats-model-wrap', 'ats-preview-media-model']
    }

    const dialogRef = this.dialog.open(PreviewMediaFileModalComponent,
      {
        data: data,
        // disableClose: true,
        width: '500px',
        height: 'auto',
        panelClass: pClass,
        backdropClass: 'mop-image-crop-modal-overlay'
      }
    );
    dialogRef.afterClosed().subscribe(results => {

    });
  }

  public pathSrc: any;
  downloadOfferletter() {
    // this.videOpen(this.pathSrc);
  }

}
