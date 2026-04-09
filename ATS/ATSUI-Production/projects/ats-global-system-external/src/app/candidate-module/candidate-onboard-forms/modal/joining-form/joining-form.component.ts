import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { SignatureCaptureComponent } from 'projects/ats-global-system-external/src/app/common-sharing/modal/signature-capture/signature-capture.component';
import { GlobalMethod } from 'projects/ats-global-system-external/src/app/core/common/global-method';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { CandidateService } from '../../../candidate.service';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';


@Component({
  selector: 'app-joining-form',
  templateUrl: './joining-form.component.html',
  styleUrls: ['./joining-form.component.scss']
})
export class JoiningFormComponent implements OnInit {
  public todayDate = new Date();
  public currTime = this.todayDate.getHours()+':'+this.todayDate.getMinutes();
  public joiningReportForm: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    public dialogRef: MatDialogRef<JoiningFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _candidateServe: CandidateService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.getSignatureIfExist();
  }

  ngAfterViewInit() {
  }

// check if sign exist for this form
  getSignatureIfExist() {
    if(this.data?.SignatureFilePath){
      this.http.get(`${environment.apiMainUrlNet}Candidate/Downloadfiles?filePath=${this.data?.SignatureFilePath}`, { responseType: 'blob' }).subscribe(
        res => {
          let reader = new FileReader();
          let imgUrl
          reader.readAsDataURL(res);
          reader.onload = () => {
            imgUrl = reader.result;
            this.signImage = imgUrl.replace('data:application/octet-stream;base64,', 'data:image/png;base64,');       
            this.signFileName = this.data?.SignatureFileName;
            this.signFilePath = this.data?.SignatureFilePath;
          }
        },
        (error) => {
          // this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
   }
  }

  //init form
  formInit() {
    this.joiningReportForm = this._fb.group({
    })
  }

  //get control name
  getControl(name: string) {
    return this.joiningReportForm.get(name);
  }

  public signFileName:string = '';
  public signFilePath:string = '';
  signImage:any;
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
        if (result?.signImage) {
          this.signImage = result?.signImage;
          this.signFileName = result?.signFileName;
          this.signFilePath = result?.signFilePath;
        }
      }
    )
  }

  /***
   * submit joining report form
   */
  
   submitJoiningReportForm(form: any) {
    
        form.markAllAsTouched();
        if (this.joiningReportForm.valid) {
          if(this.signImage){
            let body = {};
          //  body['cid'] = this.data?.candidatePersonalDetails?.cid;
          body['Candidateid'] = this.data?.candidateId;
            body['FormId'] = this.data?.formTypeId;
            body['signFileName'] = this.signFileName;
            body['signFilePath'] = this.signFilePath;
            body['JoiningReportFillDate'] = GlobalMethod.formatDate(this.todayDate);
            body['JoiningReportDate'] = GlobalMethod.formatDate(this.todayDate);
            body['JoiningReportTime'] = this.currTime;
            body['status'] = 'D';
            this._candidateServe.updateJoiningForm(body).subscribe(
              res => {
                this._share.showAlertSuccessMessage.next(res);
                this.dialogRef.close(true);
              }
            );
          }else{
            this._share.showAlertErrorMessage.next('Please sign this document.');  
          }    
        }
        else {
          this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
        }
    
  }

   /***
   * close modal
   */
   closeModal(): void {
    this.dialogRef.close();
  }


}
