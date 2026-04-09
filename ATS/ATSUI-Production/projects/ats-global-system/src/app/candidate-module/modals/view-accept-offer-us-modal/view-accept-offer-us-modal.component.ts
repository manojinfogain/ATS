import { Component, Inject, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CandidateService } from '../../candidate.service';
import { SignatureCaptureComponent } from '../../../common-sharing/modals/signature-capture/signature-capture.component';
import { SignatureGlobalCComponent } from '../../../common-sharing/modals/signature-global-c/signature-global-c.component';
import { GlobalMethod } from '../../../core/common/global-method';
import { ShareService } from '../../../core/services/share.service';
import { FormControModalComponent } from '../form-contro-modal/form-contro-modal.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-accept-offer-us-modal',
  templateUrl: './view-accept-offer-us-modal.component.html',
  styleUrls: ['./view-accept-offer-us-modal.component.scss'],
  providers: [DatePipe]
})
export class ViewAcceptOfferUsModalComponent implements OnInit {
  public formAppearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  public verificationForm: UntypedFormGroup = new UntypedFormGroup({});
  public isHideAll: boolean = true;
  public offerTemplates: any = [];
  constructor(
    public dialogRef: MatDialogRef<ViewAcceptOfferUsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _candServe: CandidateService,
    private elRef: ElementRef, private renderer: Renderer2,
    public dialog: MatDialog,
    private _share: ShareService,
    public datepipe: DatePipe
  ) {
  }

  public step: number = 0;
  setStep(index: number) {
    this.step = index;
  }


  public isHideNextButton: boolean = false;
  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }


  ngOnInit(): void {
    //this.openFormCtrlModal();
    //this.GetOfferTemplates();
  }
  
  public priorCompanyCtrl:any;
  public priorCompanyDateCtrl:any;
  public priorCompanyOtherCtrl:any;
  ngAfterViewChecked() {
    const insertSign = document.getElementById('Insert-Sign');
    const signimg = document.getElementById('up-img');

    const insertSignAgr = document.getElementById('Insert-Sign-agr');
    const signimgAgr = document.getElementById('up-img-agr');
    this.priorCompanyDateCtrl = document.getElementById('priorCompanyDate');
    this.priorCompanyCtrl = document.getElementById('priorCompany');
    this.priorCompanyOtherCtrl = document.getElementById('priorCompanyOther');

    /**offer letter */
    if (insertSign) {
      document.getElementById('Insert-Sign').onclick = (e) => this.signt();
    }
    if (signimg) {
      document.getElementById('up-img').onclick = (e) => this.signt();
    }
    /**emp agreement */
    if (insertSignAgr) {
      document.getElementById('Insert-Sign-agr').onclick = (e) => this.signtAgr();
    }
    if (signimgAgr) {
      document.getElementById('up-img-agr').onclick = (e) => this.signtAgr();
    }
    if(this.priorCompanyDateCtrl ){
      this.priorCompanyDateCtrl.onclick = (e) => this.openFormCtrlModal();
    }
    if(this.priorCompanyDateCtrl ){
      this.priorCompanyCtrl.onblur = (e) => this.priorCompanyCtrlFunc(e);
    }
    if(this.priorCompanyOtherCtrl ){
      this.priorCompanyOtherCtrl.onblur = (e) => this.priorCompanyOtherCtrlFunc(e);
    }


  }

  priorCompanyCtrlFunc(e:any){
    let val = e.target.value;
    if(val){
      this.priorCompanyCtrl.classList.remove('error-ct');
      this.priorCompanyCtrl.parentElement.parentElement.classList.remove('error-ctp');
    }
  }

  priorCompanyOtherCtrlFunc(e:any){
    let val = e.target.value;
    if(val){
      this.priorCompanyOtherCtrl.classList.remove('error-ct');
      this.priorCompanyOtherCtrl.parentElement.parentElement.classList.remove('error-ctp');
    }
  }
  /** getting offer templates  */
  // public offerTemplates: any = [];
  // GetOfferTemplates() {
  //   this._candServe.GetOfferTemplates(26073).subscribe(
  //     res => {
  //       this.offerTemplates = res = ['data']
  //       
  //     }
  //   )
  // }

  public isRecruiterAction: boolean = false;
  public isHRAction: boolean = false;
  public OfferHTml: string;
  public signatureHtml: string = `
  <div class="td-colun-div">
                            <button  type="button" class="btn btn-simple-ats mb-ml"
                                id="Insert-Sign">
                                Insert Sign
                            </button>
                            <div class="sign-wrap" id="sign-img-sec" style="display:none">
                                <img  id="sign-img"/>
                                <i class="fa fa-edit" id="up-img" style="display:none"></i>
                            </div>
                        </div>
  `

  /**emp agreement hmtl */
  public EmployeeAgreementHTml: string;
  public signatureEmployeeAgreeementHtml: string = `
  <div class="td-colun-div">
                            <button  type="button" class="btn btn-simple-ats mb-ml"
                                id="Insert-Sign-agr">
                                Insert Sign
                            </button>
                            <div class="sign-wrap" id="sign-img-sec-agr" style="display:none">
                                <img  id="sign-img-agr"/>
                                <i class="fa fa-edit" id="up-img-agr" style="display:none"></i>
                            </div>
                        </div>
  `
  public priorCompany: string = `
  <input type="text" id="priorCompany" name="priorCompany" placeholder="Enter Details here" class="input-agr">
  `
  public priorCompanyDate: string = `
  <input type="text" id="priorCompanyDate" name="priorCompanyDate" placeholder="Choose Date" class="input-agr" readonly>
  `
  public priorCompanyOther: string = `
  <input type="text" id="priorCompanyOther" name="priorCompanyOther" placeholder="Enter Details here" class="input-agr">
  `


  ngAfterViewInit() {
    // this.viewAcceptOfferModal(this.data)
    // this.data.paramCid
    this._candServe.GetOfferTemplates(this.data?.key).subscribe(
      res => {
        // this.offerTemplates = res = ['data']
        let d = res['data'][0];
        this.OfferHTml = d?.OfferTemplate.replace(/%%candidatesign%%/g, this.signatureHtml);
        this.EmployeeAgreementHTml = d?.EmployeeAgreement.replace(/%%candidatesign%%/g, this.signatureEmployeeAgreeementHtml);
        this.EmployeeAgreementHTml = this.EmployeeAgreementHTml.replace(/%%priorCompany%%/g, this.priorCompany)
                                                                .replace(/%%priorCompanyDate%%/g, this.priorCompanyDate)
                                                                .replace(/%%priorCompanyOther%%/g, this.priorCompanyOther);
        // this.OfferHTml = d?.OfferTemplate;
        //  this.EmployeeAgreementHTml = d?.EmployeeAgreement;

      }
    )

  }

  /***
   * open otp modal
   */
  public  priorCompanyDateVal:any;
  openFormCtrlModal(elm: any = {}) {
    elm['title']="Choose Date"
    const dialogRef = this.dialog.open(FormControModalComponent, {
      panelClass: ['ats-model-wrap', 'otp-modal','datepicker-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.priorCompanyDateCtrl.classList.remove('error-ct');
          this.priorCompanyDateCtrl.parentElement.parentElement.classList.remove('error-ctp');
          this.priorCompanyDateVal = result;
          let transformdate =this.datepipe.transform(result, 'dd MMMM YYYY');
          this.priorCompanyDateCtrl.value = transformdate;
         
        }
      }
    )
  }

  /**offer letter */
  public signFileName: string = '';
  public signFilePath: string = '';
  signImageHR: any;
  signt(element: any = {}): void {
    element['titleSignModal'] = " Add Signature";

    const dialogRef = this.dialog.open(SignatureGlobalCComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-signature-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result?.signImageHR) {

          let signImage = document.getElementById("sign-img") as HTMLImageElement;
          let InsertImage = document.getElementById("Insert-Sign") as HTMLImageElement;
          let editSign = document.getElementById("up-img") as HTMLImageElement;
          let signimgsec = document.getElementById("sign-img-sec") as HTMLImageElement;
          signImage.src = result?.signImageHR;
          InsertImage.style.display = 'none';

          editSign.style.display = 'inline-block';
          signimgsec.style.display = 'inline-block';
          this.signImageHR = result?.signImageHR;
          this.signFileName = result?.signFileName;
          // this.signFilePath = result?.signFilePath;

        }
      }
    )
  }


  /**employee agreement signature */
  public signFileNameAgr: string = '';
  public signFilePathAgr: string = '';
  signImageHRAgr: any;
  signtAgr(element: any = {}): void {
    element['titleSignModal'] = " Add Signature";

    const dialogRef = this.dialog.open(SignatureGlobalCComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-signature-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result?.signImageHR) {

          let signImage = document.getElementById("sign-img-agr") as HTMLImageElement;
          let InsertImage = document.getElementById("Insert-Sign-agr") as HTMLImageElement;
          let editSign = document.getElementById("up-img-agr") as HTMLImageElement;
          let signimgsec = document.getElementById("sign-img-sec-agr") as HTMLImageElement;
          signImage.src = result?.signImageHR;
          InsertImage.style.display = 'none';
          signimgsec.style.display = 'inline-block';
          editSign.style.display = 'inline-block';
          this.signImageHRAgr = result?.signImageHR;
          this.signFileNameAgr = result?.signFileName;
          // this.signFilePath = result?.signFilePath;
        }
      }
    )
  }



  getControl(name: string) {
    return this.verificationForm.get(name);
  }


  /**
   * final submit 
   */
  submitRequest(form: UntypedFormGroup) {
    let priorCompanyDate= this.priorCompanyDateCtrl;
    let priorCompany= this.priorCompanyCtrl;
    let priorCompanyOtherCtrl= this.priorCompanyOtherCtrl;

     if(!this.signImageHR){
      this._share.showAlertErrorMessage.next('Please sign the offer letter first.')
    }
    else if(!priorCompany || priorCompany?.value == ''){
      this._share.showAlertErrorMessage.next('Please fill Employee Agreement mandatory fields.');
      this.priorCompanyCtrl.classList.add('error-ct');
      this.priorCompanyCtrl.parentElement.parentElement.classList.add('error-ctp');
    }
    else if(!priorCompanyDate || priorCompanyDate?.value == ''){
      this._share.showAlertErrorMessage.next('Please fill Employee Agreement mandatory fields.');
      this.priorCompanyDateCtrl.classList.add('error-ct');
      this.priorCompanyDateCtrl.parentElement.parentElement.classList.add('error-ctp');
    }

    else if(!priorCompanyOtherCtrl || priorCompanyOtherCtrl?.value == ''){
      this._share.showAlertErrorMessage.next('Please fill Employee Agreement mandatory fields.');
      this.priorCompanyOtherCtrl.classList.add('error-ct');
      this.priorCompanyOtherCtrl.parentElement.parentElement.classList.add('error-ctp');
    }
    else if(!this.signImageHRAgr){
      this._share.showAlertErrorMessage.next('Please sign the agreement letter.')
    }
    else{
      let body = {};
      let OfferAcceptDate = new Date();
    let OfferAcceptTime = OfferAcceptDate.getHours() + ':'+ OfferAcceptDate.getMinutes()+ ':'+ OfferAcceptDate.getSeconds();
      let offerLetterSign = this.signImageHR.replace("data:image/png;base64,", "");
      let agreementLetterSign = this.signImageHRAgr.replace("data:image/png;base64,", "");
      body['PriorCompanyDate'] = GlobalMethod.formatDate(this.priorCompanyDateVal);
      body['PriorCompany'] = priorCompany.value;
      body['PriorCompanyOther'] = priorCompanyOtherCtrl.value;
      body['param'] = this.data.paramCid;
      body['offersignFileBase64'] = offerLetterSign
      //body['offersignFileBase64'] = this.signImageHR;
      body['offersignFileName'] = this.signFileName;
      body['AgreementsignFileBase64'] = agreementLetterSign
      body['AgreementsignFileName'] = this.signFileNameAgr;
  //    body['JoiningDate'] = GlobalMethod.formatDate(this.data.joiningDate);
      body['AuthKey'] = this.data.AuthKey;
      body['OfferAcceptDateUTC'] = GlobalMethod.convertToUTCDate(OfferAcceptDate);
        
      body['OfferAcceptTimeZone'] =GlobalMethod.getTimezone();
      body['OfferAcceptOffsetDate'] =GlobalMethod.getOffset().toString();
      body['PriorCompDateAgreementUTC'] = GlobalMethod.convertToUTCDate(this.priorCompanyDateVal);
      body['PriorCompDateAgreementTimeZone'] =GlobalMethod.getTimezone();
      body['PriorCompDateAgreementOffSetDate'] =GlobalMethod.getOffset().toString();
      body['ModifiedOnUTC'] = GlobalMethod.convertToUTCDate(OfferAcceptDate);
      
      body['ModifiedOnTimeZone'] =GlobalMethod.getTimezone();
      body['ModifiedOnOffsetDate'] =GlobalMethod.getOffset().toString();
      // body['param'] = this.data.paramCid;
      // body['param'] = this.data.paramCid;
      this._candServe.CandidateSubmitOfferAcceptUS(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res.message);
          // this.dialogRef.close(true);
          this.dialogRef.close({type:'A'});
        }
      )
    }

    // if (this.signImageHR) {
    //   if (this.signImageHRAgr) {
    //     // let param = `param=${this.data?.paramCid}&otp=${1234}&status=140&joiningDate=${GlobalMethod.formatDate(this.data.joiningDate)}`
       
    //   } else {
    //     this._share.showAlertErrorMessage.next('Please sign the agreement letter.')
    //   }
    // }
    // else {
    //   this._share.showAlertErrorMessage.next('Please sign the offer letter first.')
    // }


  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
