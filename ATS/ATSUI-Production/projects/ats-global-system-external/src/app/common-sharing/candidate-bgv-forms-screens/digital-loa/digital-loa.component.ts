import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { SignatureCaptureComponent } from '../../modal/signature-capture/signature-capture.component';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../../../candidate-module/candidate.service';
import { GlobalMethod } from '../../../core/common/global-method';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { Subscription } from 'rxjs';
import { ShareService } from '../../../core/services/share.service';

@Component({
  selector: 'app-digital-loa',
  templateUrl: './digital-loa.component.html',
  styleUrls: ['./digital-loa.component.scss']
})
export class DigitalLoaComponent implements OnInit {


  public BGVLOATabSubmitSubs: Subscription;
  @Input() public candidatePersonalDetails: any = {};
  @Input() public currentDigitalLOAForm: UntypedFormGroup = new UntypedFormGroup({});
  public today = GlobalMethod?.formatDate(new Date());
  public otherTabSubmitSubs: Subscription;
  public isFinalSumbit: boolean = false;
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private _fb: UntypedFormBuilder,
    private _candidateServe: CandidateService,
    private _globalMethod: GlobalCommonMethodService,
    private _share: ShareService,
  ) { }

  ngOnInit(): void {
    this.InitCurrentDigitalLOAForm();
    this.getPersonalDetails();
    this.BGVLOATabSubmitSubs = this._share.BGVLOATabSubmit.subscribe(
      get => {
        if (get) {
          setTimeout(() => {
      if (this._globalMethod.isBGVFinalSubmit()) {
        this.isFinalSumbit = true;
      }
    }, 500);
        }
      }
    );
    this.otherTabSubmitSubs = this._share.BGVLOATabSave.subscribe(
      get => {       
        if (get) {  
        this.getPersonalDetails();
        }
      }
    )
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this._globalMethod.isBGVFinalSubmit()) {
        this.isFinalSumbit = true;
      }
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.otherTabSubmitSubs) {
      this.otherTabSubmitSubs.unsubscribe();
    }
    if (this.BGVLOATabSubmitSubs) {
      this.BGVLOATabSubmitSubs.unsubscribe();
    }
  }

  InitCurrentDigitalLOAForm() {
    this.currentDigitalLOAForm = this._fb.group({
      Id: [null],
      CandidateName: [null, Validators.required],
      ConsentGivenDate: [null, Validators.required],
      SignatureFileName: [null, Validators.required],
      SignatureFilePath: [null],
    })
  }


  public signFileName: string = '';
  public signFilePath: string = '';
  signImage: any;
  public data: any = {
    isEditable: true,
    // SignatureFilePath: '',
    // SignatureFileName: '',
    candidatePersonalDetails:{
      cid: this.candidatePersonalDetails?.Cid,
      Candiddateid: this.candidatePersonalDetails?.candidateId,
      FirstName: this.candidatePersonalDetails?.CandidateName,
    }
  };
  //  cid: this.data?.candidatePersonalDetails?.cid,
  //       signFileBase64: base64Img,
  //       signFileName: `${this.data?.candidatePersonalDetails?.FirstName}_${this.data?.candidatePersonalDetails?.cid}_${this.nameDate}.png`
  getSignatureIfExist() {
    if (this.addedDigitalLOAInfo?.SignatureFilePath) {
      this.http.get(`${environment.apiMainUrlNet}Candidate/Downloadfiles?filePath=${this.addedDigitalLOAInfo?.SignatureFilePath}`, { responseType: 'blob' }).subscribe(
        res => {
          let reader = new FileReader();
          let imgUrl
          reader.readAsDataURL(res);
          reader.onload = () => {
            imgUrl = reader.result;
            this.signImage = imgUrl.replace('data:application/octet-stream;base64,', 'data:image/png;base64,');
            this.signFileName = this.addedDigitalLOAInfo?.SignatureFileName;
            this.signFilePath = this.addedDigitalLOAInfo?.SignatureFilePath;
          }          
          this.setAddedValueToForm(this.addedDigitalLOAInfo);
        },
        (error) => {
          // this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }
  }


  signt(element: any = {}): void {
    element['titleSignModal'] = " Add Signature";
    element['candidatePersonalDetails'] = {
      cid: this.candidatePersonalDetails?.Cid,
      Candidateid: this.candidatePersonalDetails?.candidateId,
      FirstName: this.candidatePersonalDetails?.CandidateName,
    };
    element['candidateId'] = this.candidatePersonalDetails?.candidateId;
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
        this.candidatePersonalDetails['SignatureFileName'] = this.signFileName;
        this.candidatePersonalDetails['SignatureFilePath'] = this.signFilePath;
        this.candidatePersonalDetails['ConsentGivenDate'] = new Date();
        this.setValueToForm(this.candidatePersonalDetails);
      }
    )
  }

  /**
   * get PAersonal
   */
  public addedDigitalLOAInfo: any = [];
  getPersonalDetails(type: string = 'N') {
    this._candidateServe.GetBGVLOADetails().subscribe(
      res => {
        this.addedDigitalLOAInfo = res['data'][0];
        if (this.addedDigitalLOAInfo?.ID) {
          this.getSignatureIfExist();
        }
        else {
          // this.setValueToForm(this.candidatePersonalDetails);
        }

      }
    )
  }

   /***
    * set value form 
    */
   setValueToForm(data: any) {
     this.currentDigitalLOAForm.patchValue({       
       "Id": data?.ID ? data?.ID : null,
       "CandidateName": data?.CandidateName ? data?.CandidateName : null,
       "ConsentGivenDate": data?.ConsentGivenDate ? GlobalMethod.formatDate(data?.ConsentGivenDate) : null,
       "SignatureFileName": data?.SignatureFileName ? data?.SignatureFileName : null,
       "SignatureFilePath": data?.SignatureFilePath ? data?.SignatureFilePath : null,
     });
   }
   /***
    * set value form 
    */
   setAddedValueToForm(data: any) {  
     this.currentDigitalLOAForm.patchValue({       
       "Id": data?.ID ? data?.ID : null,
       "CandidateName": data?.CandidateName ? data?.CandidateName : null,
       "ConsentGivenDate": data?.ConsentGivenDate ? GlobalMethod.formatDate(data?.ConsentGivenDate) : null,
       "SignatureFileName": data?.SignatureFileName ? data?.SignatureFileName : null,
       "SignatureFilePath": data?.SignatureFilePath ? data?.SignatureFilePath : null,
     });
   }

}
