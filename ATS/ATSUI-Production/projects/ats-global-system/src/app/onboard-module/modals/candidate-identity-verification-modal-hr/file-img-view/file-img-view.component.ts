import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { PreviewMediaFileModalComponent } from '../../../../shared/shared-app/components/preview-media-file-modal/preview-media-file-modal.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
@Component({
  selector: 'app-file-img-view',
  templateUrl: './file-img-view.component.html',
  styleUrls: ['./file-img-view.component.scss']
})
export class FileImgViewComponent implements OnInit, AfterViewInit {
  @Input() public filePath: string = '';
  @Input() public fileData: any = {};
  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    debugger
    if(this.fileData?.fileType == 'P'){
      if(this.fileData?.sharePointIdVideo){
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
     else{
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

  previewVideo(){
    if(this.fileData?.sharePointIdVideo){
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
   else{
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
    let pClass:any =[];
    if(this.fileData?.fileType == 'P'){
      pClass=['ats-model-wrap', 'ats-preview-media-model','ats-preview-media-model-img']
    }
    else{
      pClass=['ats-model-wrap', 'ats-preview-media-model']
    }
    
    const dialogRef = this.dialog.open(PreviewMediaFileModalComponent,
      {
        data: data,
       // disableClose: true,
        width: '500px',
        height: 'auto',
        panelClass:pClass ,
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
