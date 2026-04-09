import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalCommonMethodService } from 'projects/ats-global-system-external/src/app/core/common/global-common-method.service';
import { ONB_FILE_UPLOAD } from 'projects/ats-global-system-external/src/app/core/constant/common.const';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { CandidateService } from '../../../candidate.service';
import { GlobalMethod } from 'projects/ats-global-system-external/src/app/core/common/global-method';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { saveAs } from "file-saver";
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-upload-forms-modal',
  templateUrl: './upload-forms-modal.component.html',
  styleUrls: ['./upload-forms-modal.component.scss']
})
export class UploadFormsModalComponent implements OnInit {
  public downloadUploadForm: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    public dialogRef: MatDialogRef<UploadFormsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _http:HttpClient,
    private _share: ShareService,
    private _candidateServe: CandidateService,
    private _commonMethodServe: GlobalCommonMethodService
  ) { }

  ngOnInit(): void {
    this.formInit();
  }

  //init form
  formInit() {
    this.downloadUploadForm = this._fb.group({
      uploadForm: [null,[Validators.required]]
    })
    
  }

  //get control name
  getControl(name: string) {
    return this.downloadUploadForm.get(name);
  }

  public uploadForm: any;
  // public base64File: any;
  fileUpload(event) {
    this.uploadForm = '';
    let allowedExtensions;
    if(this.data?.formTypeId == 32 ){      
      allowedExtensions = /(\.jpg|\.JPG|\.jpeg|\.JPEG|\.png|\.PNG|\.pdf|\.PDF)$/i;
    }else{
      allowedExtensions = /(\.doc|\.DOC|\.dot|\.DOT|\.PDF|\.pdf|\.DOCX|\.docx|\.xlsx)$/i;
    }
    let file = event.target.files[0];
    let fileName = file?.name;
    this.getControl('uploadForm').markAsTouched();
    if (!allowedExtensions.exec(fileName)) {
      if(this.data?.formTypeId == 32 ){   
        this._share.showAlertErrorMessage.next('Please upload file type .jpg\.JPG\.jpeg\.JPEG\.png\.PNG\.pdf\.PDF only.');
      }else{
        this._share.showAlertErrorMessage.next('Please upload file type .doc\.DOC\.dot\.DOT\.PDF\.pdf\.DOCX\.docx\.xlsx only.');
      }
      event.target.value = "";
      this.uploadForm = '';
      return false;
    }
    else if (file.size > ONB_FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 5MB.');
      event.target.value = "";
      this.uploadForm = '';
      return false;
    }
    else {
      this.uploadForm = file;
      //
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const blob = this._commonMethodServe.base64toBlob(reader.result);
      }
    }
  }

  /***
   * submit pending docs undertaking form
   */
   submitDownloadUploadForm(form: any) {
    
    form.markAllAsTouched();
    if (this.downloadUploadForm.valid) {
      let body = new FormData();
      //body.append('cid', this.data?.candidatePersonalDetails?.cid);
      body.append('Candidateid', this.data?.candidateId);
      body.append('formId', this.data?.formTypeId);
      body.append('File', this.uploadForm);
      body.append('status', 'D');
      this._candidateServe.formUpload(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      );
    }
    else {
      this._share.showAlertErrorMessage.next('Please upload the required form.');
    }
  }

  /***
   * downloadDocuments
   */
  downloadDocuments() {
    let today = new Date();
    let todayDate = GlobalMethod.formatDate(today);
    this._http.get(`${environment.apiMainUrlNet}Candidate/downloadDocsFormCommon?formId=${this.data?.formTypeId}&Candidateid=${this.data?.candidateId}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, this.data?.documentsName);
        setTimeout(() => {
          this._share.showAlertSuccessMessage.next('File downloaded successfully.')
        }, 1000);
      }
    )
  }

// download 
dwnloadForm(){
  window.open(window.location.href, "_blank");
  let fileName:string = '';
  let filePath:string = '';
   this.data;
   
  if(this.data['formTypeId'] == 7){
    fileName = 'PF_FORM_11.dot';
    filePath= 'assets/docs/onboarding-forms/PF_FORM_11.dot'
  }
  else if(this.data['formTypeId'] == 8){
    fileName = 'FORM2PF.DOT';
    filePath= 'assets/docs/onboarding-forms/FORM2PF.DOT'
  }
  else if(this.data['formTypeId'] == 9){
    fileName = 'FORM_F.doc';
    filePath= 'assets/docs/onboarding-forms/FORM_F.doc'
  }
  else if(this.data['formTypeId'] == 10){
    fileName = 'Form_1.doc';
    filePath= 'assets/docs/onboarding-forms/Form_1.doc'
  }
  else if(this.data['formTypeId'] == 11){
    fileName = 'FORM_Q.DOCX';
    filePath= 'assets/docs/onboarding-forms/FORM_Q.DOCX'
  }
  else if(this.data['formTypeId'] == 12){
    fileName = 'SEZ_Form_Template-Admin_team.doc';
    filePath= 'assets/docs/onboarding-forms/SEZ_Form_Template-Admin_team.doc'
  }
  else if(this.data['formTypeId'] == 27){
    fileName = 'Food_Card_Application_NNT.xlsx';
    filePath= 'assets/docs/onboarding-forms/Food_Card_Application_NNT.xlsx'
  }
  else if(this.data['formTypeId'] == 28){
    fileName = 'Form_I_Payment_of_Wages_NNT.docx';
    filePath= 'assets/docs/onboarding-forms/Form_I_Payment_of_Wages_NNT.docx'
  }
  else if(this.data['formTypeId'] == 29){
    fileName = 'EPF_Form_11_OpenFile_NNT.docx';
    filePath= 'assets/docs/onboarding-forms/EPF_Form_11_OpenFile_NNT.docx'
  }
  let link = document.createElement("a");
    link.target = '_blank';
    link.href = filePath;
    document.body.appendChild(link);
    link.download = fileName;
    link.click();
    document.body.removeChild(link);
}
   /***
   * close modal
   */
   closeModal(): void {
    this.dialogRef.close();
  }


}
