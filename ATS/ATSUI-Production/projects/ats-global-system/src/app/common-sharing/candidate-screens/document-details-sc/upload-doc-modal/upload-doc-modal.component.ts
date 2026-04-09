import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { FILE_UPLOAD } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { ExternalUserGlobalApiService } from 'projects/ats-global-system/src/app/core/services/external-user-global-api.service';
import { CandidateService } from 'projects/ats-global-system/src/app/candidate-module/candidate.service';
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
  constructor(
    public dialogRef: MatDialogRef<UploadDocModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _messageService: ShareService,
    private _commonMethodServe: GlobalCommonMethodService,
    private _exGlobal: ExternalUserGlobalApiService,
    private _candidateserve:CandidateService
  ) { }

  ngOnInit(): void {
    this.getSubChildDocType();
    /* Initiate the form structure */
    this.docUploadForm = this._fb.group({
      uploadDocGroup: this._fb.array([])
    });
    if (this.data?.element.id == 3) {
      for (let i = 0; i <= 2; i++) {
        this.uploadDocGroup.push(this.initItemRow(this.data?.element, i + 1,11+i));
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

  /*** dynamic control for form */
  initItemRow(data, uniqId,docTypeId:number=0) {
    return this._fb.group({
      file: [null, Validators.required],
      subCateg: [data.id ? data.id : null],
      uniqId: [uniqId],
      documentType: [data.id == 3?docTypeId:null, Validators.required]
    }
    )
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
      const file = event.target.files[0];
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

  selectionDoc(index:number){
    let getDocumetType = this.uploadDocGroup['controls'][index]['controls'].documentType.value;
    let uniqId = this.uploadDocGroup['controls'][index]['controls'].uniqId.value;
    this.formFieldData.forEach((element, index) => {
      if (element.uniqId === uniqId) {
        this.formFieldData[index].documentType = getDocumetType;
      }
    });
  }

  submitdocUploadForm(form: UntypedFormGroup) {
    if (form.valid) {
      let apiCalls:any = [];
      for(let i=0;i<this.formFieldData.length; i++){
        let formData = new FormData();
        formData.append('docCategId',this.formFieldData[i]?.categId);
        formData.append('docSubCategId',this.formFieldData[i]?.subCategId);
        formData.append('docSubChildCategId',this.formFieldData[i]?.documentType);
        formData.append('file',this.formFieldData[i]?.file);
        apiCalls.push(this._candidateserve.uploadDocuments(formData))
      }
      forkJoin([...apiCalls]).subscribe(
        res=>{
          this.dialogRef.close(this.data['element']);
        }
      )

    }


  }

  /***
   * close modal
   */
  closeModal(): void {
    this.dialogRef.close();
  }

}
