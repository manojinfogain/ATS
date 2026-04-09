import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import SignaturePad from 'signature_pad';
import { CandidateService } from '../../../candidate-module/candidate.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { ONB_FILE_UPLOAD } from '../../../core/constant/common.const';
import { ShareService } from '../../../core/services/share.service';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';

@Component({
  selector: 'app-signature-capture',
  templateUrl: './signature-capture.component.html',
  styleUrls: ['./signature-capture.component.scss']
})
export class SignatureCaptureComponent implements OnInit {
  signPad: any;
  public todayDate = new Date();
  public candSign: any = {};
  public nameDate:string = this.todayDate.toString().replace(' GMT+0530 (India Standard Time)','').replace(/ /g, '_').replace(/:/g,'_');
  @ViewChild('signPadCanvas', {static: false}) signaturePadElement:any;
  signImage:any;
  constructor(
    public dialogRef: MatDialogRef<SignatureCaptureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _candidateServe: CandidateService,
    private _share: ShareService,
    private _commonMethodServe: GlobalCommonMethodService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.setGetImage();
    
  }

  ngAfterViewInit() {
    this.signPad = new SignaturePad(this.signaturePadElement.nativeElement,{
      minWidth: 1,
      maxWidth: 1,
    });
  }

  saveSignPad() {
    if(this.signPad.isEmpty()){
      this._share.showAlertErrorMessage.next('Please sign first.');
    }
    else{
      const base64ImageData = this.signPad.toDataURL('image/png');
      this.signImage = base64ImageData;
      let base64Img = this.signImage.replace("data:image/png;base64,","");
      this.setGetImage(this.signImage);
      let signData = {
        // cid: this.data?.candidatePersonalDetails?.cid,
        Candidateid: this.data?.candidateId,
        signFileBase64: base64Img,
        signFileName: `${this.data?.candidatePersonalDetails?.FirstName}_${this.data?.candidatePersonalDetails?.cid}_${this.nameDate}.png` 
      }
      this._candidateServe.SaveCandidateSignature(signData).subscribe(
        res => {
          let sendData = {
            signImage: this.signImage,
            signFileName: res.signFileName,
            signFilePath: res.signFilePath
          }        
          this.dialogRef.close(sendData);
        }
      )
    }
   
   // this.signPad.toDataURL('image/png');
    //Here you can save your signature image using your API call.
  }
  clearSignPad() {
    this.signPad.clear();
  }

  undoSign() {
    const data = this.signPad.toData();
    if (data) {
      data.pop(); // remove the last step
      this.signPad.fromData(data);
    }
  }

  public SignList:any =[];
  setGetImage(img:string = null){
    this._candidateServe.getCandidateSignature(this.data?.candidateId).subscribe(
      res => {
        this.candSign = res['data'];
        this.candSign.forEach(element =>{
          this.http.get(`${environment.apiMainUrlNet}Candidate/Downloadfiles?filePath=${element?.signFilePath}`, { responseType: 'blob' }).subscribe(
            res => {
              let reader = new FileReader();
              let imgUrl
              reader.readAsDataURL(res);
              reader.onload = () => {
                imgUrl = reader.result;
                let data = {
                im : imgUrl.replace('data:application/octet-stream;base64,', 'data:image/png;base64,'),
                signFileName : element?.signFileName,
                signFilePath : element?.signFilePath
              }
              this.SignList.push(data);
            }
            }
          )
        });
      }
    );   

  }

  public uploadSign: any;
  public base64File: any;
  signUpload(event) {
    this.uploadSign = '';
    let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;
    // this.getControl('uploadSign').markAsTouched();
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type jpeg/jpg/png only.');
      event.target.value = "";
      this.uploadSign = '';
      return false;
    }
    else if (file.size > ONB_FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 5MB.');
      event.target.value = "";
      this.uploadSign = '';
      return false;
    }
    else {
      this.uploadSign = file;
      //
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const blob = this._commonMethodServe.base64toBlob(reader.result);
        this.base64File = reader.result.toString().replace(/^data:.+;base64,/, '');
        let signData = {
          // cid: this.data?.candidatePersonalDetails?.cid,
          Candidateid: this.data?.candidateId,
          signFileBase64: this.base64File,
          // signFileName: `${this.data?.candidatePersonalDetails?.FirstName}_${this.data?.candidatePersonalDetails?.cid}_${new Date()}` 
          signFileName: file?.name
        }
        this._candidateServe.SaveCandidateSignature(signData).subscribe(
          res => {
            let sendData = {
              signImage: reader.result.toString().replace(/^data:.+;base64,/, 'data:image/png;base64,'),
              signFileName: res.signFileName,
              signFilePath: res.signFilePath
            }
            this.dialogRef.close(sendData);
          }
        )
      }
    }
  }

  selectSign(elm:any){
        let sendData = {
          signImage: elm?.im,
          signFileName: elm?.signFileName,
          signFilePath: elm?.signFilePath
        }      
        this.dialogRef.close(sendData);
  }


  
   /***
   * close modal
   */
   closeModal(): void {
    this.dialogRef.close(null);
  }

}
