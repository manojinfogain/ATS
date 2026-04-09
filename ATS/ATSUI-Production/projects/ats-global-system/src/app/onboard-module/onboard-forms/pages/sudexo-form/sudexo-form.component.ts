import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Input, Inject } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { SignatureCaptureComponent } from 'projects/ats-global-system/src/app/common-sharing/modals/signature-capture/signature-capture.component';
import { COMPANY_LOC } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { OnboardService } from '../../../onboard.service';

@Component({
  selector: 'app-sudexo-form',
  templateUrl: './sudexo-form.component.html',
  styleUrls: ['./sudexo-form.component.scss']
})
export class SudexoFormComponent implements OnInit {
  @Input() data:any = {};
  public joinLocAddr:string = '';
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<SudexoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public matData: any,
    public dialog: MatDialog,
    private _onboardServ: OnboardService,
    ) { }

  ngOnInit(): void {
    this.getSignatureIfExist();
    this.getHRSignatureIfExist();
    this.getCompanyAddr();
  }

  getCompanyAddr(){
    if(this.data?.candidatePersonalDetails?.JoiningLocationID == 4){
      this.joinLocAddr = COMPANY_LOC.ADDR_BANGLORE;
    }else if(this.data?.candidatePersonalDetails?.JoiningLocationID == 1){
      this.joinLocAddr = COMPANY_LOC.ADDR_NOIDA;
    }else if(this.data?.candidatePersonalDetails?.JoiningLocationID == 5){
      this.joinLocAddr = COMPANY_LOC.ADDR_MUMBAI;
    }else if(this.data?.candidatePersonalDetails?.JoiningLocationID == 2){
      this.joinLocAddr = COMPANY_LOC.ADDR_PUNE;
    }else if(this.data?.candidatePersonalDetails?.JoiningLocationID == 16){
      this.joinLocAddr = COMPANY_LOC.ADDR_GURUGRAM_ADT;
    }else{

    }
  }

  
  signImage: any;
  getSignatureIfExist() {
    let signType= 'C'
    if(this.data?.sodexoFormDetails?.SignatureFilePath){
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
    if (this.data?.sodexoFormDetails?.HRSignatureFilePath) {
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

  public signFileName:string = '';
  public signFilePath:string = '';
  signImageHR:any;
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
