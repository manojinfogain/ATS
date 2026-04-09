import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { SignatureCaptureComponent } from 'projects/ats-global-system-external/src/app/common-sharing/modal/signature-capture/signature-capture.component';
import { GlobalMethod } from 'projects/ats-global-system-external/src/app/core/common/global-method';
import { ExternalUserGlobalApiService } from 'projects/ats-global-system-external/src/app/core/services/external-user-global-api.service';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { CandidateService } from '../../../candidate.service';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { colorSets } from '@swimlane/ngx-charts';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-undertaking-pending-docs',
  templateUrl: './undertaking-pending-docs.component.html',
  styleUrls: ['./undertaking-pending-docs.component.scss']
})
export class UndertakingPendingDocsComponent implements OnInit {
  public pendingDocsUndertakingForm: UntypedFormGroup = new UntypedFormGroup({});
  public pendingDocForm: UntypedFormGroup;
  public todayDate = new Date();
  public fullName: string = `${(this.data?.candidatePersonalDetails?.FirstName ? this.data?.candidatePersonalDetails?.FirstName : '')} ${(this.data?.candidatePersonalDetails?.MiddleName ? this.data?.candidatePersonalDetails?.MiddleName : '')} ${(this.data?.candidatePersonalDetails?.LastName ? this.data?.candidatePersonalDetails?.LastName : '')}`;

  public docSubCategList: any = [];
  public candSign: any = {};
  public fetchedPendingDocList = [];
  public isOrganizationVisible:boolean = false;
  displayedColumns = ['docName','orgName', 'submissionDate'];
  constructor(
    public dialogRef: MatDialogRef<UndertakingPendingDocsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _exGlobal: ExternalUserGlobalApiService,
    private _share: ShareService,
    private _candidateServe: CandidateService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getOnboardingFormDetailsById();
    this.getDocumentsSubCategoryList();
    this.formInit();
    this.getSignatureIfExist();
  }

  ngAfterViewInit() {
  }

  public childSubCategList = [];
  getDocumentsSubCategoryList() {
    forkJoin([
      this._exGlobal.getDocumentsSubCategoryMaster(),
      this._exGlobal.getDocumentsChildSubcategoryMaster()
    ]).subscribe(
      res => {
        // this.docSubCategList = res[0]['data'];
        let docSubCategListTemp = res[0]['data'];
        this.childSubCategList = res[1]['data']?.filter(f => f.id != 24 && f.id != 20);
        let filterById = [9,10,11,12,13,14,15];
        let filteredDocSubCategList = docSubCategListTemp?.filter(t => {
          return filterById?.indexOf(t?.id) != -1;
        });
        this.docSubCategList = filteredDocSubCategList;
      }
    )
  }

  /***
   * get child Document
   */
  docChildCategListFunc(categId: any, Id: number = null) {
    let filt = this.childSubCategList.filter(f => f.subCategId == categId);
    let filtById = [];
    this.fetchedPendingDocList.forEach(t => {
      filtById.push(t?.DocId);
    })
    let filterByStatus = filt.filter(t => {
      return filtById.indexOf(t.id) == -1;
    });
    if (Id != null) {
      return filt;
    } else {
      return filterByStatus;

    }
  } 


  getOnboardingFormDetailsById() {
    this._candidateServe.getOnboardingFormDetailsById(this.data?.formTypeId).subscribe(
      res => {
        this.fetchedPendingDocList = res['pendingdocs'];
        if (this.fetchedPendingDocList?.length == 0) {
          this.addrowDoc();
        } else {
          setTimeout(() => {
            this.fetchedPendingDocList.forEach(ele => {
              let t = this.childSubCategList?.filter(d => d?.id == ele?.DocId);
              ele['categ'] = t[0]?.subCategId;
              this.pendingDocumentsGroup.push(this.initItemRow(ele));
            });
            if (this.pendingDocumentsGroup.length != 0) {
              for (let i = 0; i < this.pendingDocumentsGroup.length; i++) {
                this.addValidation(i);
              }
            }
          }, 500);
        }
      })
  }

  getSignatureIfExist() {
    let signType= 'C'
    if (this.data?.SignatureFilePath) {
      debugger
      this.http.get(`${environment.apiMainUrlNet}Candidate/downloadSignature?id=${this.data?.Id}&signType=${signType}`, { responseType: 'blob' }).subscribe(
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

  /////////  ////////
  get pendingDocumentsGroup() {
    return this.pendingDocsUndertakingForm.get('pendingDocuments') as UntypedFormArray;
  }
  ///////////End ////////////////

  /***
   * add row to add Document
   */

  addrowDoc() {
    this.pendingDocumentsGroup.push(this.initItemRow());
  }

  /***
 * on  delate row
 */
  deleteRow(index: number) {
    const control = this.pendingDocumentsGroup;
    control.removeAt(index);
  }

  /***
 * on  delate record
 */
  deleteRecord(id: number, index: number) {
    const control = this.pendingDocumentsGroup;
    control.removeAt(index);
    this._candidateServe.DeleteUndertakingPendingDoc(id).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
      }
    )
  }


  deleteRowSuc() {
    const control = this.pendingDocumentsGroup;
    
    for (let i = 0; i < control.length; i++)
      this.pendingDocumentsGroup.clear()
  }

  /*** dynamic control for form */
  initItemRow(data: any = null) {
    if (data) {
      return this._fb.group({
        Id: [data?.id ? data?.id : null],
        Organization: [data?.Organization ? data?.Organization : null],
        categ: [data?.categ ? data?.categ : null],
        DocId: [data?.DocId ? data?.DocId : null],
        SubmissionDate: [data?.SubmissionDate ? data?.SubmissionDate : null],
      });
    } else {
      return this._fb.group({
        Id: [null],
        Organization: [null],
        categ: [null,[Validators.required]],
        DocId: [null,[Validators.required]],
        SubmissionDate: [null,[Validators.required]],
      }
      );
    }

  }

  //init form
  formInit() {
    this.pendingDocsUndertakingForm = this._fb.group({
      candidateName: [this.fullName, [Validators.required]],
      remarks: [this.data?.Remarks],
      pendingDocuments: this._fb.array([])
    });
  }

  addValidation(index: number) {
    let pendingDoc1Ctrl = this.pendingDocumentsGroup['controls'][index]['controls'].categ;
    let pendingChildDocCtrl = this.pendingDocumentsGroup['controls'][index]['controls'].DocId;
    let SubmissionDateCtrl = this.pendingDocumentsGroup['controls'][index]['controls'].SubmissionDate;
    let OrganizationCtrl = this.pendingDocumentsGroup['controls'][index]['controls'].Organization;
    // pendingChildDocCtrl.setValidators([Validators.required]);
    if (pendingDoc1Ctrl.value == 1 || pendingDoc1Ctrl.value == 2 || pendingDoc1Ctrl.value == 3 || pendingDoc1Ctrl.value == 7 ||
      pendingDoc1Ctrl.value == 8 || pendingDoc1Ctrl.value == 13 || pendingDoc1Ctrl.value == 14) {
        this.isOrganizationVisible = true;
      OrganizationCtrl.setValidators([Validators.required]);
    } else {
      this.isOrganizationVisible = false;
      OrganizationCtrl.clearValidators();
    }
    if (pendingDoc1Ctrl.value || SubmissionDateCtrl.value || pendingChildDocCtrl.value || OrganizationCtrl.value) {
      pendingDoc1Ctrl.setValidators([Validators.required]);
      SubmissionDateCtrl.setValidators([Validators.required]);
      pendingChildDocCtrl.setValidators([Validators.required]);
    } else {
      pendingDoc1Ctrl.clearValidators();
      SubmissionDateCtrl.clearValidators();
      pendingChildDocCtrl.clearValidators();
    }
    pendingDoc1Ctrl.updateValueAndValidity();
    SubmissionDateCtrl.updateValueAndValidity();
    OrganizationCtrl.updateValueAndValidity();
    pendingChildDocCtrl.updateValueAndValidity();
  }


  //get control name
  getControl(name: string) {
    return this.pendingDocsUndertakingForm.get(name);
  }

  /***
   * submit pending docs undertaking form
   */
  submitPendingDocsUndertakingForm(form: any) {
    form.markAllAsTouched();
    this.pendingDocumentsGroup.markAllAsTouched();
    if (this.pendingDocumentsGroup.valid && this.pendingDocsUndertakingForm.valid) {
      if (this.signImage) {
        let pendingDocList = form.value.pendingDocuments.filter(d => d.Id == null);
        
        Object.keys(pendingDocList).forEach(key => {
          pendingDocList[key]['SubmissionDate'] = GlobalMethod.formatDate(pendingDocList[key]['SubmissionDate']);
        })
        let body = {};
        // body['cid'] = this.data?.candidatePersonalDetails?.cid;
        body['Candidateid'] = this.data?.candidateId;
        body['FormId'] = this.data?.formTypeId;
        body['signFileName'] = this.signFileName;
        body['signFilePath'] = this.signFilePath;
        body['JoiningReportFillDate'] = GlobalMethod.formatDate(this.todayDate);
        body['pendingDocuments'] = pendingDocList;
        body['status'] = 'D';
        body['remarks'] = form.value['remarks'];
        this._candidateServe.updateUndertakingPendingDocForm(body).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        );
      } else {
        this._share.showAlertErrorMessage.next('Please sign this document.');
      }
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  public signFileName: string = '';
  public signFilePath: string = '';
  signImage: any;
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
  * close modal
  */
  closeModal(): void {
    this.dialogRef.close();
  }

}
