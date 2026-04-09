import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { CandidateService } from '../../../candidate.service';
import { SignatureCaptureLibComponent } from 'projects/ats-lib/src/lib/components/modals/signature-capture-lib/signature-capture-lib.component';
import { GlobalMethod } from 'projects/ats-global-system-external/src/app/core/common/global-method';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CandidateSignatureModel } from 'projects/ats-global-system-external/src/app/core/models/common-model';
import { GetSetStorageService } from 'projects/ats-global-system-external/src/app/core/services/get-set-storage.service';

@Component({
  selector: 'app-day-one-form-modal',
  templateUrl: './day-one-form-modal.component.html',
  styleUrls: ['./day-one-form-modal.component.scss']
})
export class DayOneFormModalComponent implements OnInit {
  @ViewChild("ndaLateralFormCom", { static: false }) ndaLateralFormCom;
  @ViewChild("ndaLateralNNTFormCom", { static: false }) ndaLateralNNTFormCom;
  @ViewChild("traineesDCTNDAFormCom", { static: false }) traineesDCTNDAFormCom;
  @ViewChild("traineesDCTNDAFormComNNT", { static: false }) traineesDCTNDAFormComNNT;
  @ViewChild("Day1FormTemp", { static: false }) Day1FormTemp;
  @ViewChild("codeconductbusiness", { static: false }) codeconductbusiness;
  CandidateSignatureModel: CandidateSignatureModel = new CandidateSignatureModel();
  private candidateId = this._storage.getCandidateId();
  constructor(
    public dialogRef: MatDialogRef<DayOneFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _candidateServe: CandidateService,
    private http: HttpClient,
    private _storage: GetSetStorageService
  ) { }

  ngOnInit(): void {
    this.data;

    this.getSignatureIfExist();
    this.getCandidatePersonalDetails();
  }

  public candidatePersonalDetails: any = {};
  //get candidate personal details
  getCandidatePersonalDetails() {
    this._candidateServe.getCandidatePersonalDetails(this.candidateId).subscribe(
      res => {
        this.candidatePersonalDetails = res['data'][0];
      }
    )
  }

  public signimagesrc: string = '';
  getLatestSignatureDataPageWise(event: any) {
    debugger
    this.signPrevData = event?.SignData;
    debugger
  }


  // check if sign exist for this form
  getSignatureIfExist() {
    let signType = 'C';
    let id: 1;
    if (this.data?.SignatureFilePath) {
      debugger
      // Candidate/Downloadfiles?filePath=${this.data?.SignatureFilePath}
      this.http.get(`${environment.apiMainUrlNet}Candidate/downloadSignature?id=${this.data?.Id}&signType=${signType}`, { responseType: 'blob' }).subscribe(
        res => {
          let reader = new FileReader();
          let imgUrl
          reader.readAsDataURL(res);
          reader.onload = () => {
            imgUrl = reader.result;
            // this.signImage = imgUrl.replace('data:application/octet-stream;base64,', 'data:image/png;base64,');
            // this.signFileName = this.data?.SignatureFileName;
            // this.signFilePath = this.data?.SignatureFilePath;
            this.signPrevData = {
              signImage: imgUrl.replace('data:application/octet-stream;base64,', 'data:image/png;base64,'),
              signFileName: this.data?.SignatureFileName,
              signFilePath: this.data?.SignatureFilePath,
              isFromDB: true
            }
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
  public formId: number = 0;
  signImage: any;
  public signPrevData: any = {};
  OpenPadSignature(event) {
    this.formId = event?.formId
    let element

    const dialogRef = this.dialog.open(SignatureCaptureLibComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-signature-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
debugger
        if (result?.signImage) {
          // this.signImage = result?.signImage;
          // this.signFileName = result?.signFileName;
          // this.signFilePath = result?.signFilePath;
          this.signPrevData = {
            signImage: result?.signImage,
            signFileName: result?.signFileName,
            signFilePath: result?.signFilePath
          }
        }
      }
    )
  }

  FinalSubmit() {
    debugger
    let Day1FormTemp = this.Day1FormTemp?.CandidateSignatureModel;
    let signLabel = 'Signature missing on page';
    /**14 for Anti Corruption & Anti Bribery Policy  */
    if (this.data?.formTypeId == 14) {
      // let signLabel= 'Signature missing on page';
      if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else if (Day1FormTemp?.page5 == null || Day1FormTemp?.page5 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 5');
      }
      else if (Day1FormTemp?.page6 == null || Day1FormTemp?.page6 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 6');
      }
      else if (Day1FormTemp?.page7 == null || Day1FormTemp?.page7 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 7');
      }
      else if (Day1FormTemp?.page8 == null || Day1FormTemp?.page8 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 8');
      }
      else if (Day1FormTemp?.page9 == null || Day1FormTemp?.page9 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 9');
      }
      else {
        this.SaveDocsDay1();
      }
    }
    /**15 Code of Conduct & Business Ethics Policy 15 */
    if (this.data?.formTypeId == 15) {
      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else if (Day1FormTemp?.page5 == null || Day1FormTemp?.page5 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 5');
      }
      else if (Day1FormTemp?.page6 == null || Day1FormTemp?.page6 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 6');
      }
      else if (Day1FormTemp?.page7 == null || Day1FormTemp?.page7 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 7');
      }
      else if (Day1FormTemp?.page8 == null || Day1FormTemp?.page8 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 8');
      }
      else if (Day1FormTemp?.page9 == null || Day1FormTemp?.page9 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 9');
      }
      else if (Day1FormTemp?.page10 == null || Day1FormTemp?.page10 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 10');
      }
      else {
        this.SaveDocsDay1();
      }
    }
    /**16 Conflict of Interest Policy */
    if (this.data?.formTypeId == 16) {
      if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else if (Day1FormTemp?.page5 == null || Day1FormTemp?.page5 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 5');
      }
      else if (Day1FormTemp?.page6 == null || Day1FormTemp?.page6 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 6');
      }
      else {
        this.SaveDocsDay1();
      }
    }
    /**13 Acceptable use of asset policy */
    if (this.data?.formTypeId == 13) {
      // if(Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == ''){
      //   this._share.showAlertErrorMessage.next(signLabel + ' 1');
      //  }
      //else
      if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else {
        this.SaveDocsDay1();
      }
    }
    /**17 NDA Lateral NNT  */
    if (this.data?.formTypeId == 17) {
      // let signLabel= 'Signature missing on page';

      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else {
        this.SaveDocsDay1();
      }
    }
    /**18 NDA Lateral */
    if (this.data?.formTypeId == 18) {
      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else
        if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
          this._share.showAlertErrorMessage.next(signLabel + ' 2');
        }
        else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
          this._share.showAlertErrorMessage.next(signLabel + ' 3');
        }
        else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
          this._share.showAlertErrorMessage.next(signLabel + ' 4');
        }
        else {
          this.SaveDocsDay1();
        }
    }
    /**19 netapp NDA */
    if (this.data?.formTypeId == 19) {
      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else
        if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
          this._share.showAlertErrorMessage.next(signLabel + ' 2');
        }
        else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
          this._share.showAlertErrorMessage.next(signLabel + ' 3');
        }
        else {
          this.SaveDocsDay1();
        }
    }
    /**20 POSH Banglore Policy  */
    if (this.data?.formTypeId == 20) {
      // let signLabel= 'Signature missing on page';
      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else if (Day1FormTemp?.page5 == null || Day1FormTemp?.page5 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 5');
      }
      else if (Day1FormTemp?.page6 == null || Day1FormTemp?.page6 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 6');
      }
      else if (Day1FormTemp?.page7 == null || Day1FormTemp?.page7 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 7');
      }
      else {
        this.SaveDocsDay1();
      }
    }
    /**21 POSH Mumbai Policy  */
    if (this.data?.formTypeId == 21) {
      // let signLabel= 'Signature missing on page';
      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else if (Day1FormTemp?.page5 == null || Day1FormTemp?.page5 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 5');
      }
      else if (Day1FormTemp?.page6 == null || Day1FormTemp?.page6 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 6');
      }
      else if (Day1FormTemp?.page7 == null || Day1FormTemp?.page7 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 7');
      }
      else {
        this.SaveDocsDay1();
      }
    }

    /**22 POSH Pune Policy  */
    if (this.data?.formTypeId == 22) {
      // let signLabel= 'Signature missing on page';
      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else if (Day1FormTemp?.page5 == null || Day1FormTemp?.page5 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 5');
      }
      else if (Day1FormTemp?.page6 == null || Day1FormTemp?.page6 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 6');
      }
      else if (Day1FormTemp?.page7 == null || Day1FormTemp?.page7 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 7');
      }
      else {
        this.SaveDocsDay1();
      }
    }
    /**23 POSH Noida Policy  */
    if (this.data?.formTypeId == 23) {
      // let signLabel= 'Signature missing on page';
      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else if (Day1FormTemp?.page5 == null || Day1FormTemp?.page5 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 5');
      }
      else if (Day1FormTemp?.page6 == null || Day1FormTemp?.page6 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 6');
      }
      else if (Day1FormTemp?.page7 == null || Day1FormTemp?.page7 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 7');
      }
      else {
        this.SaveDocsDay1();
      }
    }
    /**30 POSH ADT  Policy  */
    if (this.data?.formTypeId == 30) {
      // let signLabel= 'Signature missing on page';
      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else if (Day1FormTemp?.page5 == null || Day1FormTemp?.page5 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 5');
      }
      else if (Day1FormTemp?.page6 == null || Day1FormTemp?.page6 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 6');
      }
      else if (Day1FormTemp?.page7 == null || Day1FormTemp?.page7 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 7');
      }
      else {
        this.SaveDocsDay1();
      }
    }
    /**31 POSH NNT Banglore Policy  */
    if (this.data?.formTypeId == 31) {
      // let signLabel= 'Signature missing on page';
      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else if (Day1FormTemp?.page5 == null || Day1FormTemp?.page5 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 5');
      }
      else if (Day1FormTemp?.page6 == null || Day1FormTemp?.page6 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 6');
      }
      else if (Day1FormTemp?.page7 == null || Day1FormTemp?.page7 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 7');
      }
      else {
        this.SaveDocsDay1();
      }
    }
    /**24 DCT Trainees NNT  */
    if (this.data?.formTypeId == 24) {
      // let signLabel= 'Signature missing on page';

      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else {
        this.SaveDocsDay1();
      }
    }
    /**25 DCT Trainees  */
    if (this.data?.formTypeId == 25) {
      // let signLabel= 'Signature missing on page';

      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else {
        this.SaveDocsDay1();
      }
    }
    /**35 DAP Form */
    if (this.data?.formTypeId == 35) {
      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else {
        this.SaveDocsDay1();
      }
    }

    if (this.data?.formTypeId == 45 || this.data?.formTypeId == 43 || this.data?.formTypeId == 44 || this.data?.formTypeId == 42 || this.data?.formTypeId == 41 ||this.data?.formTypeId == 48) {
      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else if (Day1FormTemp?.page5 == null || Day1FormTemp?.page5 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 5');
      }
      else {
        this.SaveDocsDay1();
      }
    }

    if (this.data?.formTypeId == 36 || this.data?.formTypeId == 37 || this.data?.formTypeId == 38 || this.data?.formTypeId == 39 || this.data?.formTypeId == 40) {
      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else {
        this.SaveDocsDay1();
      }
    }

    // kochi  impaqtive starts 
    //kochi posh 
    if (this.data?.formTypeId == 46) {
      
      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else if (Day1FormTemp?.page5 == null || Day1FormTemp?.page5 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 5');
      }
      else if (Day1FormTemp?.page6 == null || Day1FormTemp?.page6 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 6');
      }
      else if (Day1FormTemp?.page7 == null || Day1FormTemp?.page7 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 7');
      }
      else {
        this.SaveDocsDay1();
      }
      // this.SaveDocsDay1();
    }
    /**47 netapp NDA kochi */
    if (this.data?.formTypeId == 47) {
      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else
        if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
          this._share.showAlertErrorMessage.next(signLabel + ' 2');
        }
        else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
          this._share.showAlertErrorMessage.next(signLabel + ' 3');
        }
        else {
          this.SaveDocsDay1();
        }
    }
    /** lateral NDA  kochi  48*/
    // if (this.data?.formTypeId == 48) {
    //   if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
    //     this._share.showAlertErrorMessage.next(signLabel + ' 1');
    //   }
    //   else
    //     if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
    //       this._share.showAlertErrorMessage.next(signLabel + ' 2');
    //     }
    //     else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
    //       this._share.showAlertErrorMessage.next(signLabel + ' 3');
    //     }
    //     else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
    //       this._share.showAlertErrorMessage.next(signLabel + ' 4');
    //     }
    //     else {
    //       this.SaveDocsDay1();
    //     }
    // }

    /** trainee kochi impaqtive  */
    if (this.data?.formTypeId == 49) {
      // let signLabel= 'Signature missing on page';

      if (Day1FormTemp?.page1 == null || Day1FormTemp?.page1 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 1');
      }
      else if (Day1FormTemp?.page2 == null || Day1FormTemp?.page2 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 2');
      }
      else if (Day1FormTemp?.page3 == null || Day1FormTemp?.page3 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 3');
      }
      else if (Day1FormTemp?.page4 == null || Day1FormTemp?.page4 == '') {
        this._share.showAlertErrorMessage.next(signLabel + ' 4');
      }
      else {
        this.SaveDocsDay1();
      }
    }
    //kochi impaqtive ends
  }


  public todayDate = new Date();
  SaveDocsDay1() {
    let ndaLateralForm: UntypedFormGroup = this.ndaLateralFormCom?.ndaLateralForm;
    let ndaLateralFormVal = ndaLateralForm?.value;
    let ndaLateralFormNNT: UntypedFormGroup = this.ndaLateralNNTFormCom?.ndaLateralNNTForm;
    let ndaLateralFormValNNT = ndaLateralFormNNT?.value;
    let traineesDCTNDAForm: UntypedFormGroup = this.traineesDCTNDAFormCom?.traineesDCTNDAForm;
    let traineesDCTNDAFormVal = traineesDCTNDAForm?.value;
    let traineesDCTNDAFormNNT: UntypedFormGroup = this.traineesDCTNDAFormComNNT?.traineesDCTNDAFormNNT;
    let traineesDCTNDAFormValNNT = traineesDCTNDAFormNNT?.value;

    debugger
    if (this.signPrevData.signImage) {
      let body = {};
      debugger
      // body['FormId'] = this.formId;
      body['FormId'] = this.data?.formTypeId;
      body['signFileName'] = this.signPrevData.signFileName;
      body['signFilePath'] = this.signPrevData.signFilePath;
      body['status'] = 'D';
      if (ndaLateralFormVal) {
        if (ndaLateralFormVal['briefDesc']) {
          body['BriefDesc'] = ndaLateralFormVal['briefDesc'];
        }
        if (ndaLateralFormVal['remarks']) {
          body['RemarksFormDoc'] = ndaLateralFormVal['remarks'];
        }
      }
      if (ndaLateralFormValNNT) {
        if (ndaLateralFormValNNT['briefDesc']) {
          body['BriefDesc'] = ndaLateralFormValNNT['briefDesc'];
        }
        if (ndaLateralFormValNNT['remarks']) {
          body['RemarksFormDoc'] = ndaLateralFormValNNT['remarks'];
        }
      }
      if (traineesDCTNDAFormVal) {
        if (traineesDCTNDAFormVal['briefDesc']) {
          body['BriefDesc'] = traineesDCTNDAFormVal['briefDesc'];
        }
        if (traineesDCTNDAFormVal['remarks']) {
          body['RemarksFormDoc'] = traineesDCTNDAFormVal['remarks'];
        }
      }

      if (traineesDCTNDAFormValNNT) {
        if (traineesDCTNDAFormValNNT['briefDesc']) {
          body['BriefDesc'] = traineesDCTNDAFormValNNT['briefDesc'];
        }
        if (traineesDCTNDAFormValNNT['remarks']) {
          body['RemarksFormDoc'] = traineesDCTNDAFormValNNT['remarks'];
        }
      }
      this._candidateServe.AddUpdateDay1Sign(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      );
    } else {
      this._share.showAlertErrorMessage.next('Please sign this document.');
    }
  }

  /***
  * close modal
  */
  closeModal(): void {
    this.dialogRef.close();
  }

}
