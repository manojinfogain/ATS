import { Component, Inject, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-day-one-form-modal-i',
  templateUrl: './day-one-form-modal-i.component.html',
  styleUrls: ['./day-one-form-modal-i.component.scss']
})
export class DayOneFormModalIComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DayOneFormModalIComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getSignatureIfExist();
  }

  // check if sign exist for this form
  public signPrevData: any = {};
  getSignatureIfExist() {
    if (this.data?.SignatureFilePath) {
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${this.data?.SignatureFilePath}`, { responseType: 'blob' }).subscribe(
        res => {
          let reader = new FileReader();
          let imgUrl
          reader.readAsDataURL(res);
          reader.onload = () => {
            imgUrl = reader.result;
            this.signPrevData = {
              signImage: imgUrl.replace('data:application/octet-stream;base64,', 'data:image/png;base64,'),
              signFileName: this.data?.SignatureFileName,
              signFilePath: this.data?.SignatureFilePath
            }
          }
        },
        (error) => {
          // this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }
  }

  printForm() {
    document.title = this.data?.Name
    window.print();
  }

  /***
  * close modal
  */
  closeModal(): void {
    this.dialogRef.close();
  }
}
