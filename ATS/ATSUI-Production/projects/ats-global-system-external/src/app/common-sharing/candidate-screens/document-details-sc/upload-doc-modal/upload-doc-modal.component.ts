import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { FILE_UPLOAD } from 'projects/ats-global-system-external/src/app/core/constant/common.const';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system-external/src/app/core/common/global-common-method.service';
import { ExternalUserGlobalApiService } from 'projects/ats-global-system-external/src/app/core/services/external-user-global-api.service';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-upload-doc-modal',
  templateUrl: './upload-doc-modal.component.html',
  styleUrls: ['./upload-doc-modal.component.scss']
})
export class UploadDocModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  displayedColumns: string[] = ['docType', 'fileUp', 'action'];

  public docUploadForm: UntypedFormGroup;
  public formFieldData: any = [];
  public  acceptedFile:string =".pdf,.png,.PNG,.jpg,.jpeg,.msg";
  public employmentDetailsList:any=[];
  constructor(
    public dialogRef: MatDialogRef<UploadDocModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _messageService: ShareService,
    private _commonMethodServe: GlobalCommonMethodService,
    private _exGlobal: ExternalUserGlobalApiService,
    private _candidateserve: CandidateService,
    private _share: ShareService
  ) { }
 
  public isCurrentCom:boolean = false;
  ngOnInit(): void {
    this.data;
    
    if(this.data?.element?.categId === 1 || this.data?.element?.categId === 2){
        this.isCurrentCom = true;
    }
    else{
      this.isCurrentCom = false;
    }
    this.getSubChildDocType();
    this.getEmploymentDetails();
    this.getAddedEducationDeails();
  
    /* Initiate the form structure */
    this.docUploadForm = this._fb.group({
      uploadDocGroup: this._fb.array([]),
    //  Organisation:[null]
    });
    if(this.data?.element?.id == 6){
      this.acceptedFile=".png,.PNG,.jpg,.jpeg"; 
    }
    // this.uploadDocGroup.push(this.initItemRow(this.data?.element, 1));
    // let obj = { categId: this.data?.element?.categId, subCategId: this.data?.element?.id, uniqId: 1, documentType: 0 };
    // this.formFieldData.push(obj);
    let loopNum:number = 1;
    if (this.data?.element.id == 1 ) {
      if(this.data?.prevEmpRecords?.length == 1 || (this.data?.prevEmpRecords?.length == 2 && ((!this.data?.isprevEmp1AppUploaded && this.data?.isprevEmp2AppUploaded) || (this.data?.isprevEmp1AppUploaded && !this.data?.isprevEmp2AppUploaded)))){
        loopNum = 1;
      }else{
        loopNum = this.data?.prevEmpRecords?.length;
      }
      for (let i = 0; i < loopNum; i++) {
        this.uploadDocGroup.push(this.initItemRow(this.data?.element, i + 1));
        let obj = { categId: this.data?.element?.categId, subCategId: this.data?.element?.id, uniqId: i + 1,documentType:0 };
        this.formFieldData.push(obj);
      }
    }else if(this.data?.element.id == 2){
      if(this.data?.prevEmpRecords?.length == 1 || (this.data?.prevEmpRecords?.length == 2 && ((!this.data?.isprevEmp1ExpUploaded && this.data?.isprevEmp2ExpUploaded) || (this.data?.isprevEmp1ExpUploaded && !this.data?.isprevEmp2ExpUploaded)))){
        loopNum = 1;
      }else{
        loopNum = this.data?.prevEmpRecords?.length;
      }
      for (let i = 0; i < loopNum; i++) {
        this.uploadDocGroup.push(this.initItemRow(this.data?.element, i + 1));
        let obj = { categId: this.data?.element?.categId, subCategId: this.data?.element?.id, uniqId: i + 1,documentType:0 };
        this.formFieldData.push(obj);
      }
    }
    else {
      this.uploadDocGroup.push(this.initItemRow(this.data?.element, 1));
      let obj = { categId: this.data?.element?.categId, subCategId: this.data?.element?.id, uniqId: 1,documentType:0 };
      this.formFieldData.push(obj);
    }

    // this.uploadDocGroup.push(this._fb.group({ file: '' }))
  }

  /**
   * Fetches added education details for the candidate
   */
  public educationDetailsList: any = [];
getAddedEducationDeails() {
  this._candidateserve.getAddedEducationDetails().subscribe(
    res => {
      const allItems = res['data'] || [];
      this.educationDetailsList = allItems.filter(item => item.courseId !== 52 && item.courseId !== 12);
    },
    err => {
      this.educationDetailsList = [];
    }
  );
}


  
 /**get emp details */  
 public currentCompany:any={};
 public prevCompany1:any={};
 public prevCompany2:any={};
 public isCurrentCompAvailable:boolean = true;
 getEmploymentDetails(page:boolean = false) {
  this._candidateserve.getEmploymentDetails().subscribe(
    res => {
      // this.employmentDetailsList = res['data'];
      // this.currentCompany = this.employmentDetailsList.filter(x => x.employerType == 'C')[0];
      if(this.data?.element?.categId === 1){  
        this.employmentDetailsList = res['data']?.filter(x => x.employerType == 'C');
        if(this.employmentDetailsList?.length == 0){
          this.isCurrentCompAvailable = false;
        }else{
          this.isCurrentCompAvailable = true;
        }
        this.currentCompany = this.employmentDetailsList?.filter(x => x.employerType == 'C')[0];
        let organizationCtrl = this.docUploadForm['controls'].uploadDocGroup['controls'][0]['controls'].Organisation
        organizationCtrl.patchValue(this.currentCompany?.id);
        // organizationCtrl.disable();
      }else if(this.data?.element?.categId === 2){
        // this.employmentDetailsList = res['data']?.filter(x => x.employerType == 'P');
        // this.employmentDetailsList = this.data?.prevEmpRecords;   
        this.prevCompany1 = this.data?.prevEmpRecords?.filter(x => x.employerType == 'P')[0];
        this.prevCompany2 = this.data?.prevEmpRecords?.filter(x => x.employerType == 'P')[1];
        console.log(this.docUploadForm['controls'])
        if(this.data?.element?.id == 1){
          if(this.docUploadForm['controls'].uploadDocGroup['controls']?.length == 1){
            if(!this.data?.isprevEmp1AppUploaded){              
              this.employmentDetailsList = this.data?.prevEmpRecords?.filter(x => x.employerType == 'P' && x.id == this.prevCompany1?.id);   
              this.docUploadForm['controls'].uploadDocGroup['controls'][0]['controls'].Organisation?.patchValue(this.prevCompany1?.id);
            }else if(!this.data?.isprevEmp2AppUploaded){
              this.employmentDetailsList = this.data?.prevEmpRecords?.filter(x => x.employerType == 'P' && x.id == this.prevCompany2?.id);
              this.docUploadForm['controls'].uploadDocGroup['controls'][0]['controls'].Organisation?.patchValue(this.prevCompany2?.id);
            }else if(!this.data?.isprevEmp1AppUploaded && !this.data?.isprevEmp2AppUploaded){              
              this.employmentDetailsList = this.data?.prevEmpRecords?.filter(x => x.employerType == 'P');
              this.docUploadForm['controls'].uploadDocGroup['controls'][0]['controls'].Organisation?.patchValue(this.prevCompany1?.id);
              this.docUploadForm['controls'].uploadDocGroup['controls'][1]['controls'].Organisation?.patchValue(this.prevCompany2?.id);
            }
          }else
            if(this.docUploadForm['controls'].uploadDocGroup['controls']?.length == 2){         
              this.employmentDetailsList = this.data?.prevEmpRecords?.filter(x => x.employerType == 'P');
                this.docUploadForm['controls'].uploadDocGroup['controls'][0]['controls'].Organisation?.patchValue(this.prevCompany1?.id);
                this.docUploadForm['controls'].uploadDocGroup['controls'][1]['controls'].Organisation?.patchValue(this.prevCompany2?.id);
              }
          
        }
        else if(this.data?.element?.id == 2){
          if(this.docUploadForm['controls'].uploadDocGroup['controls']?.length == 1){
            if(!this.data?.isprevEmp1ExpUploaded){ 
              this.employmentDetailsList = this.data?.prevEmpRecords?.filter(x => x.employerType == 'P' && x.id == this.prevCompany1?.id);   
              this.docUploadForm['controls'].uploadDocGroup['controls'][0]['controls'].Organisation?.patchValue(this.prevCompany1?.id);
            }else if(!this.data?.isprevEmp2ExpUploaded){ 
              this.employmentDetailsList = this.data?.prevEmpRecords?.filter(x => x.employerType == 'P' && x.id == this.prevCompany2?.id);   
              this.docUploadForm['controls'].uploadDocGroup['controls'][0]['controls'].Organisation?.patchValue(this.prevCompany2?.id);
            }else if(!this.data?.isprevEmp1ExpUploaded && !this.data?.isprevEmp2ExpUploaded){ 
              this.employmentDetailsList = this.data?.prevEmpRecords?.filter(x => x.employerType == 'P');   
              this.docUploadForm['controls'].uploadDocGroup['controls'][0]['controls'].Organisation?.patchValue(this.prevCompany1?.id);
              this.docUploadForm['controls'].uploadDocGroup['controls'][1]['controls'].Organisation?.patchValue(this.prevCompany2?.id);
            }
          }else
            if(this.docUploadForm['controls'].uploadDocGroup['controls']?.length == 2){
                this.employmentDetailsList = this.data?.prevEmpRecords?.filter(x => x.employerType == 'P');  
                this.docUploadForm['controls'].uploadDocGroup['controls'][0]['controls'].Organisation?.patchValue(this.prevCompany1?.id);
                this.docUploadForm['controls'].uploadDocGroup['controls'][1]['controls'].Organisation?.patchValue(this.prevCompany2?.id);
              }
          
        }else{

        }
      }
    }
  )
}
  /*** dynamic control for form */
  initItemRow(data, uniqId, docTypeId: number = 0) {
    if(this.data?.element?.categId === 1 || this.data?.element?.categId === 2){
      return this._fb.group({
        file: [null, Validators.required],
        subCateg: [data.id ? data.id : null],
        uniqId: [uniqId],
        Organisation:[null,Validators.required],
        documentType: [{value: (!this.data?.isPanUploaded && data?.id == 5) ? 27 : null, disabled:(!this.data?.isPanUploaded && data?.id == 5) ? true : false}, Validators.required]
      }
      )
    }
    else if(this.data?.element?.categId === 3 && this.data?.element?.id != 9 && this.data?.element?.id != 10){
      debugger
      return this._fb.group({
        file: [null, Validators.required],
        subCateg: [data.id ? data.id : null],
        uniqId: [uniqId],
        CaurseId:[null,(this.data?.element?.categId == 3 && this.data?.element?.id != 9 && this.data?.element?.id != 10) ? Validators.required : []],
        documentType: [{value: (!this.data?.isPanUploaded && data?.id == 5) ? 27 : null, disabled:(!this.data?.isPanUploaded && data?.id == 5) ? true : false}, Validators.required]
      }
      )
    }
    else{
      return this._fb.group({
        file: [null, Validators.required],
        subCateg: [data.id ? data.id : null],
        uniqId: [uniqId],
       // Organisation:[null],
        documentType: [{value: (!this.data?.isPanUploaded && data?.id == 5) ? 27 : null, disabled:(!this.data?.isPanUploaded && data?.id == 5) ? true : false}, Validators.required]
      }
      )
    }
   
  }

  /***
   * get sub Child List
   */
  public subChildDocTypeList: any = [];
  public subChildDocTypeListIn: any = [];
  getSubChildDocType() {
    this._exGlobal.getDocumentsChildSubcategoryMaster().subscribe(
      res => {
        this.subChildDocTypeList = res['data'];
        this.subChildDocTypeListIn = this.subChildDocTypeList.filter(x => x.subCategId == this.data?.element?.id);

      }
    )
  }

  /////////  ////////
  get uploadDocGroup() {
    return this.docUploadForm.get('uploadDocGroup') as UntypedFormArray;
  }
  ///////////End ////////////////

  /***
  * select another image
  */
  fileChangeEvent(event: any, index: number): void {
    if (event.target.value) {
      const file = event.target.files;
      let displayName = file.name;
      let uniqueFileName = +new Date() + displayName;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const blob = this._commonMethodServe.base64toBlob(reader.result);
        if (blob.size > FILE_UPLOAD.FILE_SIZE) {
          this._messageService.showAlertErrorMessage.next("File uploaded cannot be greater than 15MB.",)
        }
        else {
          let getDocumetType = this.uploadDocGroup['controls'][index]['controls'].documentType.value;
          let uniqId = this.uploadDocGroup['controls'][index]['controls'].uniqId.value;
          this.formFieldData.forEach((element, index) => {
            if (element.uniqId === uniqId) {
              this.formFieldData[index].documentType = getDocumetType;
              this.formFieldData[index].file = file;
            }
          });
          this.uploadDocGroup['controls'][index]['controls'].file.patchValue('aa')
        }
      }
    }
  }

  fileUpload(event: any, index: number) {
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf|\.msg)$/i;
    let files = event.target.files;
    let allFiles = [];
    let fixSize = 5242880;
    let totalSalSlipsCount = 3 - parseInt(this.data?.NumSalSlipUploaded)
    if (files.length > totalSalSlipsCount &&  (this.data?.element?.id == 3 && this.data?.element?.categId == 1)) {
      this._share.showAlertErrorMessage.next('You can upload maximum of '+ totalSalSlipsCount  +' Document(s).');
      event.target.value = "";
      return false;
    } else {
      for (let i = 0; i < files.length; i++) {
        let fileName = files[i].name;
        if (!allowedExtensions.exec(fileName)) {
          this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type  jpeg/jpg/png/pdf/msg only.');
          event.target.value = "";
          return false;
        }
        else if (files[i].size > fixSize) {
          this._share.showAlertErrorMessage.next('Pease upload maximum 5MB file.');
          event.target.value = "";
          return false;

        }
        else {
          allFiles.push(files[i]);
        }

      }
      let getDocumetType = this.uploadDocGroup['controls'][index]['controls'].documentType.value;
      let uniqId = this.uploadDocGroup['controls'][index]['controls'].uniqId.value;
      this.formFieldData.forEach((element, index) => {
        if (element.uniqId === uniqId) {
          this.formFieldData[index].documentType = getDocumetType;
          this.formFieldData[index].file = allFiles;
        }
      });
      this.uploadDocGroup['controls'][index]['controls'].file.patchValue('aa')
    }
  }

  selectionDoc(index: number) {
    let getDocumetType = this.uploadDocGroup['controls'][index]['controls'].documentType.value;
    let uniqId = this.uploadDocGroup['controls'][index]['controls'].uniqId.value;
    this.formFieldData.forEach((element, index) => {
      if (element.uniqId === uniqId) {
        this.formFieldData[index].documentType = getDocumetType;
      }
    });
  }

  submitdocUploadForm(form: UntypedFormGroup) {
    if(this.data?.element?.id !== 1 && this.data?.element?.id !== 2){
      let docs = this.formFieldData[0]?.file;
      let orgName = form?.value?.uploadDocGroup[0].Organisation;
      let CaurseId = form?.value?.uploadDocGroup[0].CaurseId;
      debugger
      if (form.valid) {
        let apiCalls: any = [];
        let formData = new FormData();
        // formData.append('docCategId',this.formFieldData[0]?.categId);
        // formData.append('docSubCategId',this.formFieldData[0]?.subCategId);
        formData.append('documentId', this.formFieldData[0]?.documentType);
        if(orgName){
          formData.append('orgId',orgName)
        }
        else{
          formData.append('orgId','0')
        }
        if(CaurseId){
          formData.append('CaurseId',CaurseId)
        }
        
        //formData.append('file', this.formFieldData[0]?.file);
        for (let i = 0; i < docs.length; i++) {
          formData.append('File', this.formFieldData[0]?.file[i]);
        }
        // for(let i=0;i<this.formFieldData.length; i++){
        //   let formData = new FormData();
        //   formData.append('docCategId',this.formFieldData[i]?.categId);
        //   formData.append('docSubCategId',this.formFieldData[i]?.subCategId);
        //   formData.append('docSubChildCategId',this.formFieldData[i]?.documentType);
        //   formData.append('file',this.formFieldData[i]?.file);
        //   apiCalls.push(this._candidateserve.uploadDocuments(formData))
        // }
        this._candidateserve.uploadDocumentsBulk(formData).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(this.data['element']);

          }
        )
      }

    }else{
      this.formFieldData;
      debugger
      if (form.valid) {
        let apiCalls:any = [];
        for(let i=0;i<this.formFieldData.length; i++){
          let formData = new FormData();
          formData.append('documentId', this.formFieldData[i]?.documentType);
          formData.append('file',this.formFieldData[i]?.file[0]);
          formData.append('orgId',form?.value?.uploadDocGroup[i].Organisation ? form?.value?.uploadDocGroup[i].Organisation : 0)
          apiCalls.push(this._candidateserve.uploadDocumentsBulk(formData))
        }
        forkJoin([...apiCalls]).subscribe(
          res=>{
            this._share.showAlertSuccessMessage.next('Documents Uploaded Successfully.');
            this.dialogRef.close(this.data['element']);
          }
        )

      }
    }


  }
  getControl(name: string) {
    return this.docUploadForm.get(name);
  }

  /***
   * close modal
   */
  closeModal(): void {
    this.dialogRef.close();
  }

}
