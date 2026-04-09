import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { SignatureCaptureComponent } from 'projects/ats-global-system/src/app/common-sharing/modals/signature-capture/signature-capture.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { OnboardService } from '../../../onboard.service';

@Component({
  selector: 'app-undertaking-current-address',
  templateUrl: './undertaking-current-address.component.html',
  styleUrls: ['./undertaking-current-address.component.scss']
})
export class UndertakingCurrentAddressComponent implements OnInit {

  @Input() data: any = {}
  public fullName: string = `${(this.data?.candidatePersonalDetails?.FirstName ? this.data?.candidatePersonalDetails?.FirstName : '')} ${(this.data?.candidatePersonalDetails?.MiddleName ? this.data?.candidatePersonalDetails?.MiddleName : '')} ${(this.data?.candidatePersonalDetails?.LastName ? this.data?.candidatePersonalDetails?.LastName : '')}`;
  public addressLine1: string;
  public addressLine2: string
  // public candSign: any = {};
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<UndertakingCurrentAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public matData: any,
    public dialog: MatDialog,
    private _onboardServ: OnboardService,
  ) { }

  ngOnInit(): void {
    this.getSignatureIfExist();
    this.getHRSignatureIfExist();
    this.addressLine1 = `${(this.data?.candidatePersonalDetails?.AddressLine1 ? this.data?.candidatePersonalDetails?.AddressLine1 : '')},
  ${(this.data?.candidatePersonalDetails?.AddressLine2 ? this.data?.candidatePersonalDetails?.AddressLine2 : '')},${(this.data?.candidatePersonalDetails?.AddressLine3 ? this.data?.candidatePersonalDetails?.AddressLine3 : '')}`;
    this.addressLine2 = `${(this.data?.candidatePersonalDetails?.cr_city ? this.data?.candidatePersonalDetails?.cr_city : '')},
  ${(this.data?.candidatePersonalDetails?.cr_state ? this.data?.candidatePersonalDetails?.cr_state : '')},${(this.data?.candidatePersonalDetails?.cr_countryName ? this.data?.candidatePersonalDetails?.cr_countryName : '')},${(this.data?.candidatePersonalDetails?.cr_postalCode ? this.data?.candidatePersonalDetails?.cr_postalCode : '')}`;
  }

  signImage: any;
  getSignatureIfExist() {
    let signType= 'C'
    if (this.data?.currAddrFormDetails?.SignatureFilePath) {
      // Dashboard/downloadFile?filelocation=${this.data?.currAddrFormDetails?.SignatureFilePath}
      this.http.get(`${environment.apiMainUrlNet}OnBoard/downloadSignature?id=${this.data?.Id}&signType=${signType}`, { responseType: 'blob' }).subscribe(
        res => {
          let reader = new FileReader();
          let imgUrl
          reader.readAsDataURL(res);
          reader.onload = () => {
            imgUrl = reader.result;
            this.signImage = imgUrl.replace('data:application/octet-stream;base64,', 'data:image/png;base64,');

          }
        },
        (error) => {
          // this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }
  }

  getHRSignatureIfExist() {
    let signType= 'H'
    if (this.data?.currAddrFormDetails?.HRSignatureFilePath) {
      this.http.get(`${environment.apiMainUrlNet}OnBoard/downloadSignature?id=${this.data?.Id}&signType=${signType}`, { responseType: 'blob' }).subscribe(
        res => {
          let reader = new FileReader();
          let imgUrl
          reader.readAsDataURL(res);
          reader.onload = () => {
            imgUrl = reader.result;
            this.signImageHR = imgUrl.replace('data:application/octet-stream;base64,', 'data:image/png;base64,');

          }
        },
        (error) => {
          // this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }
  }

  public signFileName: string = '';
  public signFilePath: string = '';
  signImageHR: any;
  signt(element: any = {}): void {
    element['titleSignModal'] = " Add Signature";

    const dialogRef = this.dialog.open(SignatureCaptureComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-signature-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result?.signImageHR) {
          this.signImageHR = result?.signImageHR;
          this.signFileName = result?.signFileName;
          this.signFilePath = result?.signFilePath;
          let body = {};
          // body['cid'] = this.data?.candidatePersonalDetails?.cid;
          body['Candidateid'] = this.data?.candidatePersonalDetails?.candidateId;
          body['FormId'] = this.data?.formTypeId;
          body['signFileName'] = result?.signFileName;
          body['signFilePath'] = result?.signFilePath;
          this._onboardServ.HrSignatureOnForms(body).subscribe(
            res => {
              // this._share.showAlertSuccessMessage.next(res);
              // this.dialogRef.close(true);
              console.log(res)
            },
            (error) => {
              // this._share.showAlertErrorMessage.next('Something went wrong');
            }
          );
        }
      }
    )
  }

}
