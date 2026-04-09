import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormGroupName, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ExternalUserGlobalApiService } from 'projects/ats-global-system-external/src/app/core/services/external-user-global-api.service';
import { UploadDocModalComponent } from './upload-doc-modal/upload-doc-modal.component';
import { forkJoin } from 'rxjs';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { GlobalMethod } from '../../../core/common/global-method';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { saveAs } from "file-saver";
import { DocumentViewModalComponent } from '../../modal/document-view-modal/document-view-modal.component';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { ViewInstructionModalComponent } from '../../modal/view-instruction-modal/view-instruction-modal.component';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
@Component({
  selector: 'app-document-details-sc',
  templateUrl: './document-details-sc.component.html',
  styleUrls: ['./document-details-sc.component.scss']
})
export class DocumentDetailsScComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  @Input() public uploadedDocumentLists: any = [];
  // @Input() public employmentData: any = [];
  @Input() public prevEmploymentData: any = [];
  @Input() public uploadedDocuments: any = [];
  public docUploadForm: UntypedFormGroup;
  public documentMasterListGroup: UntypedFormGroup = new UntypedFormGroup({});
  displayedColumns: string[] = ['categ', 'subcateg', 'docType','action'];
  dataSource: [];
  documentMasterTable: any = [];
  public requireDocsId:any = [13,6,5,4,3,9,10,11,14]; //sub category ID's
  public prevEmpRecords:any = [];
  public prevEmpUploadedRecords:any = [];
  public prev1EmpId:number = 0;
  public prev2EmpId:number = 0;
  public isSalarySlipUploaded:boolean = false;
  private candidateId:string = '';
  @Input() isLeadershipOnboard:boolean = false;
  constructor(
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _exGlobal: ExternalUserGlobalApiService,
    private _candidateServe: CandidateService,
    private _share: ShareService,
    private _http:HttpClient,
    private _globalMethod:GlobalCommonMethodService,
    private _storage: GetSetStorageService
  ) { }
  public isFinalSumbit:boolean = false;
  public isAvpAbove:boolean = false;
  ngOnInit(): void { 
   // this.requireDocsId=[];
    let user = this._storage.getSetUserData();
   this.candidateId =  this._storage.getCandidateId();
    this.prevEmpRecords = this.prevEmploymentData;
    this.prev1EmpId = this.prevEmploymentData[0]?.id;
    this.prev2EmpId = this.prevEmploymentData[1]?.id;
    this.isprevEmp1AppUploaded = this.uploadedDocumentLists?.filter(f=> f?.docCategId == 2 && f?.OrgId == this.prev1EmpId && (f?.documentType == 7 || f?.documentType == 8))?.length != 0 ? true : false;
    this.isprevEmp1ExpUploaded = this.uploadedDocumentLists?.filter(f=> f?.docCategId == 2 && f?.OrgId == this.prev1EmpId && (f?.documentType == 9 || f?.documentType == 10))?.length != 0 ? true : false;
    this.isprevEmp2AppUploaded = this.uploadedDocumentLists?.filter(f=> f?.docCategId == 2 && f?.OrgId == this.prev2EmpId && (f?.documentType == 7 || f?.documentType == 8))?.length != 0 ? true : false;
    this.isprevEmp2ExpUploaded = this.uploadedDocumentLists?.filter(f=> f?.docCategId == 2 && f?.OrgId == this.prev2EmpId && (f?.documentType == 9 || f?.documentType == 10))?.length != 0 ? true : false;
    this.isSalarySlipUploaded = this.uploadedDocumentLists?.filter(f=> f?.docCategId == 1 && f?.documentType == 11)?.length < 3 ? false : true;
   
    /***
     * AVP Above
     */
    if(user?.IsAVPUp== 'Y'){
      // Remove document IDs  from the requireDocsId array based on the condition
     // this.requireDocsId = this.requireDocsId.filter((id: number) => id !== 13);
      const idsToRemove = [13];
      this.requireDocsId = this.requireDocsId.filter((id: number) => !idsToRemove.includes(id));
   
      if(this.prevEmpRecords?.length != 0 && (!this.isprevEmp1ExpUploaded ||  !this.isprevEmp2ExpUploaded)){      
        this.requireDocsId.push(2);
      }
    }
    /***
     * for other
     */
    else{
      if(this.prevEmpRecords?.length != 0 && (!this.isprevEmp1AppUploaded ||  !this.isprevEmp2AppUploaded)){    
        this.requireDocsId.push(1);
      }
      if(this.prevEmpRecords?.length != 0 && (!this.isprevEmp1ExpUploaded ||  !this.isprevEmp2ExpUploaded)){      
        this.requireDocsId.push(2);
      }
    }
    this.getDocumentList();
    if(this._globalMethod.isFinalSubmit()){
      this.isFinalSumbit= true;
     // this.displayedColumns.pop();
    }
    this.docUploadForm = this._fb.group({
      uploadDocGroup: this._fb.array([])
    });
    //this.instructview();
  }

  /*** dynamic control for form */
  initItemRow(data, isMandatory: boolean = false) {
    if (isMandatory) {
      return this._fb.group({
        categ: [data.categId ? data.categId : null, Validators.required],
        subCateg: [data.id ? data.id : null, Validators.required],
        isMandatory:[1]
      }
      )
    }
    else {
      return this._fb.group({
        categ: [null],
        subCateg: [null],
        isMandatory:[0]
      }
      )
    }

  }

  /////////  ////////
  get uploadDocGroup() {
    return this.docUploadForm.get('uploadDocGroup') as UntypedFormArray;
  }
  ///////////End ////////////////
  submit() {

  }
  /***
   * get Document category List
   */
  public docCategList: any = [];
  public docSubCategList: any = [];
  getDocumentList() {
    forkJoin([
      this._exGlobal.getDocumentsCategoryMaster(),
      this._exGlobal.getDocumentsSubCategoryMaster(),
      // this._candidateServe.getCanddiateDocumentList()
    ]).subscribe(
      res => {
        this.docCategList = res[0]['data'];
        this.docSubCategList = res[1]['data']?.sort(({sequencePriority:a},{sequencePriority:b}) => a-b);
        // this.docCategListFunc();
        this.getDocListmand();
      }
    )
  }

  /***
   * get Uploaded Doc
   */
  public isPanUploaded:boolean=false;
  getCandDocList(page:boolean = false){
    this._candidateServe.getCanddiateDocumentList(this.candidateId).subscribe(
      res=>{
        this.uploadedDocumentLists = res['data'];
        let filt = this.uploadedDocumentLists?.filter(d => d?.documentType == 27);
        if(filt?.length == 0){
          this.isPanUploaded = false;
        }else{          
          this.isPanUploaded = true;
        }
        this.isSalarySlipUploaded = this.uploadedDocumentLists?.filter(f=> f?.docCategId == 1 && f?.documentType == 11)?.length < 3 ? false : true;
        if(page == true){
          this._share.activeTabDetection.next(true);
          this.uploadDocGroup.clear()
          /***
           * refresh mand lisr after update
           */
          this.getDocumentList();
        }
      }
    )
  }
  /***
   * get sub Document
   */
  docCategListFunc(categId: any, index: number = null) {
    let filt;
    if(this.isSalarySlipUploaded){
      filt = this.docSubCategList.filter(f => f.categId == categId && f?.id != 3);
    }else{
      filt = this.docSubCategList.filter(f => f.categId == categId);
    }
    return filt;
  }

  /***
   * add row to upload Document
   */

  addrowUploadDoc() {
    // this.documentMasterTable.push({isMandatory:true})
    this.uploadDocGroup.push(this.initItemRow({ id: null, isMandatory: 0 }, false));
  }

  /***
 * on  delate row
 */
  deleteRow(index: number) {
    const control = this.uploadDocGroup;
    control.removeAt(index);
  }

  /**
   * get Selected List
   */
  public isprevEmp1AppUploaded:boolean = false;
  public isprevEmp1ExpUploaded:boolean = false;
  public isprevEmp2AppUploaded:boolean = false;
  public isprevEmp2ExpUploaded:boolean = false;
  getDocListmand(subCategIds: any = []) {
   // requireDocsId
   if(this.uploadedDocumentLists.length == 0){
    subCategIds = this.requireDocsId;
   }
   else{
    let getDcIds = this.uploadedDocumentLists.map(a => a.docSubCategId);
    let filtgetDcIds = this.requireDocsId.filter(t => {
      return !getDcIds.includes(t)
    });
    this.prev1EmpId = this.prevEmploymentData[0]?.id;
    this.prev2EmpId = this.prevEmploymentData[1]?.id;
    this.isprevEmp1AppUploaded = this.uploadedDocumentLists?.filter(f=> f?.docCategId == 2 && f?.OrgId == this.prev1EmpId && (f?.documentType == 7 || f?.documentType == 8))?.length != 0 ? true : false;
    this.isprevEmp1ExpUploaded = this.uploadedDocumentLists?.filter(f=> f?.docCategId == 2 && f?.OrgId == this.prev1EmpId && (f?.documentType == 9 || f?.documentType == 10))?.length != 0 ? true : false;
    this.isprevEmp2AppUploaded = this.uploadedDocumentLists?.filter(f=> f?.docCategId == 2 && f?.OrgId == this.prev2EmpId && (f?.documentType == 7 || f?.documentType == 8))?.length != 0 ? true : false;
    this.isprevEmp2ExpUploaded = this.uploadedDocumentLists?.filter(f=> f?.docCategId == 2 && f?.OrgId == this.prev2EmpId && (f?.documentType == 9 || f?.documentType == 10))?.length != 0 ? true : false;
    if(this.prevEmpRecords?.length == 2 && (!this.isprevEmp1AppUploaded ||  !this.isprevEmp2AppUploaded)){      
      filtgetDcIds.push(1);
    }
    if(this.prevEmpRecords?.length == 2 && (!this.isprevEmp1ExpUploaded ||  !this.isprevEmp2ExpUploaded)){      
      filtgetDcIds.push(2);
    }
    subCategIds=filtgetDcIds;
   }
    let getFilterDocs = [];
    if (subCategIds.length != 0) {
      getFilterDocs = this.docSubCategList.filter(t => {
        return subCategIds.indexOf(t.id) !== -1;
      });
      this.documentMasterTable = getFilterDocs.map(m => ({ ...m, isMandatory: 1 }));
      
      for (let i = 0; i < this.documentMasterTable.length; i++) {
        this.uploadDocGroup.push(this.initItemRow(this.documentMasterTable[i], true));
      }


      // let pushFilterd = [];
      // for(let i=0; i<getFilterDocs.length;i++){
      //   let obj = {
      //   categId:getFilterDocs[i].categId,
      //   suCategId:getFilterDocs[i].id
      //   }
      //   this.dataSource.push(obj);

      // }
    }
    
    this.addrowUploadDoc();
  }

  getId(e: any, index: number) {   
    this.uploadDocGroup['controls'][index]['controls'].subCateg.reset();
    this.docCategListFunc(e.value, index);
  }

  /***
  * add Family Member
  */
  uploadDocumentModal(index: number = 0) {
    let rowGroup = this.uploadDocGroup['controls'][index]['controls'];
    if (rowGroup.categ.invalid || rowGroup.categ.value == null) {
      this._share.showAlertErrorMessage.next('Please select Category.')
    }
    else if (rowGroup.subCateg.invalid || rowGroup.subCateg.value == null) {
      this._share.showAlertErrorMessage.next('Please select Sub Category.')
    }
    else {
      let getReqDocName = this.docSubCategList.filter(f => f.id == rowGroup.subCateg.value);

      let element: any = {};
      element['docSubCategList'] = this.docSubCategList;
      element['element'] = { categId: rowGroup.categ.value, id: rowGroup.subCateg.value, index: index };
      element['title'] = rowGroup.subCateg?.value == 9 || rowGroup.subCateg?.value == 10 ||
                         rowGroup.subCateg?.value == 11 || rowGroup.subCateg?.value == 12 ? `Upload ${getReqDocName[0].Name} Documents` : `Upload ${getReqDocName[0].Name}`;
      element['isPanUploaded'] = this.isPanUploaded;
      let panelClassPop = ['ats-model-wrap', 'uplaod-doc-modal'];
      if(rowGroup.categ.value == 1 || rowGroup.categ.value == 2){
        element['prevEmpRecords'] = this.prevEmpRecords;
        element['prevEmpRecordsUploadedList'] = this.uploadedDocumentLists?.filter(f=> f?.docCategId == 2);
        element['isprevEmp1AppUploaded'] = this.isprevEmp1AppUploaded;
        element['isprevEmp1ExpUploaded'] = this.isprevEmp1ExpUploaded;
        element['isprevEmp2AppUploaded'] = this.isprevEmp2AppUploaded;
        element['isprevEmp2ExpUploaded'] = this.isprevEmp2ExpUploaded        
        element['NumSalSlipUploaded'] = this.uploadedDocumentLists?.filter(f=> f?.docCategId == 1 && f?.documentType == 11)?.length;
        panelClassPop = ['ats-model-wrap', 'uplaod-doc-modal','uplaod-doc-modal-l'];
      }
      const dialogRef = this.dialog.open(UploadDocModalComponent, {
        width: '500px',
        panelClass: panelClassPop,
        data: element,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(
        result => {
          if (result) {
            this.deleteRow(result['index']);
            this.getCandDocList(true);
          }
        }
      )
    }

  }
  /***
   * Delete Document
   */
  deleteDoc(element:any){
         
         const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          panelClass: 'ats-confirm',
          data: {
            headerText: 'Alert',
            message: ` Are you sure you want to delete?`,
            buttonText: {
              ok: "Yes",
              cancel: "No"
            },
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
             this._candidateServe.deleteDocuments(element.id).subscribe(
              res=>{
                 this._share.showAlertSuccessMessage.next(res);
                 this.getCandDocList(true);
                //  this.uploadDocGroup.clear()
                //  setTimeout(() => {
                //   this.getDocumentList();
                //  }, 1000);
                 
              }
             )
          }
        });
  }

  deleteRowSuc() {
    const control = this.uploadDocGroup;
    
   // if (control.length != 0) {
      for(let i=0; i <control.length; i++)
      this.uploadDocGroup.clear()
   // }
  }

   /***
   * downloadDocuments
   */
    downloadDocuments(elm:any) {
      let today = new Date();
      let todayDate = GlobalMethod.formatDate(today);
      this._http.get(`${environment.apiMainUrlNet}Candidate/DownloadDocument?docId=${elm.id}&Candidateid=${this.candidateId ? this.candidateId : ''}`, { responseType: 'blob' }).subscribe(
        res => {
          saveAs(res, elm?.documentName);
          this._share.showAlertSuccessMessage.next('File downloaded successfully.')
        }
      )
    }

    /***
     * preview Document
     */
    previewDocument(elm:any){
      const dialogRef = this.dialog.open(DocumentViewModalComponent, {
        panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
        data: elm,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%'
      });
      dialogRef.afterClosed().subscribe(
        res => {
          if (res) {
          }
        }
      );
    }

    /***
     * preview 
     */
     instructview(){
      let elm = {title:'Document required'}
      const dialogRef = this.dialog.open(ViewInstructionModalComponent, {
        panelClass: ['ats-model-wrap', 'uplaod-doc-modal'],
        data: elm,
        disableClose: false
      });
      dialogRef.afterClosed().subscribe(
        res => {
          if (res) {
          }
        }
      );
    }

}


@Component({
  selector: '[apptrdocumentselect]',
  templateUrl: './tr-document-select-opt.html',
})
export class TrDocumentSelectOptComponents implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  @Input() public docCategList: any = [];
  @Input() public docSubCategList: any = [];
  @Input() public element: any;
  @Input() public formGroupNameIndex: number = 0;
  public docCategListIn: any = [];
  public docSubCategListIn: any = [];
  public docCategCtrl: UntypedFormControl = new UntypedFormControl([Validators.required]);
  public docSubCategCtrl: UntypedFormControl = new UntypedFormControl([Validators.required]);
  constructor(public dialog: MatDialog, private _share: ShareService) {
  }

  ngOnInit(): void {
    this.docCategListIn = this.docCategList;
    // this.docSubCategListIn= this.docSubCategList.filter(f=> f.categId == this.element?.categId);
    // this.docCategCtrl.patchValue(this.element.categId);
    // this.docSubCategCtrl.patchValue(this.element.id);
  }

  getId(e: any) {
    this.docSubCategListIn = this.docSubCategList.filter(f => f.categId == e.value);
  }

  uploadDocumentModal() {
    if (this.docCategCtrl.invalid) {
      this._share.showAlertErrorMessage.next('Please select Category.')
    }
    else if (this.docSubCategCtrl.invalid) {
      this._share.showAlertErrorMessage.next('Please select Sub Category.')
    }
    else {
      let getReqDocName = this.docSubCategList.filter(f => f.id == this.docSubCategCtrl.value);

      let element: any = {};
      element['docSubCategList'] = this.docSubCategList;
      element['element'] = this.element;
      element['title'] = `Upload ${getReqDocName[0].Name}`;
      const dialogRef = this.dialog.open(UploadDocModalComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'uplaod-doc-modal'],
        data: element,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(
        result => {
          if (result) {
          }
        }
      )
    }

  }
}


