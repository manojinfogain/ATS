
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
  selector: 'app-view-accept-offer-ind-modal',
  templateUrl: './view-accept-offer-ind-modal.component.html',
  styleUrls: ['./view-accept-offer-ind-modal.component.scss'],
  providers: [DatePipe]
})
export class ViewAcceptOfferIndModalComponent implements OnInit {

  public formAppearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  public verificationForm: UntypedFormGroup = new UntypedFormGroup({});
  public isHideAll: boolean = true;
  public offerTemplates: any = [];
  constructor(
    public dialogRef: MatDialogRef<ViewAcceptOfferIndModalComponent>,
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

    


    /**offer letter */
    if (insertSign) {
      document.getElementById('Insert-Sign').onclick = (e) => this.signt();
    }
    if (signimg) {
      document.getElementById('up-img').onclick = (e) => this.signt();
    }
  


  }


  public isRecruiterAction: boolean = false;
  public isHRAction: boolean = false;
  public OfferHTml: string;
  public signatureHtml: string = `
  <div class="td-colun-div">
                            <button  type="button" class="btn btn-simple-ats mb-ml quadrat"
                                id="Insert-Sign">
                                e-signature
                            </button>
                            <div class="sign-wrap" id="sign-img-sec" style="display:none">
                                <img  id="sign-img"/>
                                <i class="fa fa-edit" id="up-img" style="display:none"></i>
                            </div>
                        </div>
  `

  public signatureHtmlAnex: string = `
  <div class="td-colun-div">
                            <div class="sign-wrap" id="sign-img-sec-Anx" style="display:none">
                                <img  id="sign-img-Anx"/>
                            </div>
                        </div>
  `

  


  ngAfterViewInit() {
    // this.viewAcceptOfferModal(this.data)
    // this.data.paramCid
    this._candServe.GetOfferTemplates(this.data?.key).subscribe(
      res => {
        // this.offerTemplates = res = ['data']
        let d = res['data'][0];
        this.OfferHTml = d?.OfferTemplate.replace(/%%candidatesign%%/g, this.signatureHtml)
                         .replace(/%%candidatesignAnx%%/g, this.signatureHtmlAnex)
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

          let signImageAnx = document.getElementById("sign-img-Anx") as HTMLImageElement;
          let signimgsecAnx = document.getElementById("sign-img-sec-Anx") as HTMLImageElement;
          signImageAnx.src = result?.signImageHR;
          signimgsecAnx.style.display = 'inline-block';

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
     if(!this.signImageHR){
      this._share.showAlertErrorMessage.next('Please sign the offer letter first.')
    }
    else{
      let body = {};
      let offerLetterSign = this.signImageHR.replace("data:image/png;base64,", "");
      body['offersignFileBase64'] = offerLetterSign
      //body['offersignFileBase64'] = this.signImageHR;
      body['offersignFileName'] = this.signFileName;
      body['param'] = this.data.paramCid;
    //  body['JoiningDate'] = GlobalMethod.formatDate(this.data.joiningDate);
      body['AuthKey'] = this.data.AuthKey;
      // body['param'] = this.data.paramCid;
      // body['param'] = this.data.paramCid;
      this._candServe.CandidateSubmitOfferAcceptIndia(body).subscribe(
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
