import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { CandidateSignatureModel } from 'projects/ats-global-system-external/src/app/core/models/common-model';
import { SignatureCaptureLibComponent } from '../modals/signature-capture-lib/signature-capture-lib.component';

@Component({
  selector: 'lib-dap-form',
  templateUrl: './dap-form.component.html',
  // styleUrls: ['./dap-form.component.scss']
})
export class DapFormComponent implements OnInit,OnChanges {
  public formId:number = 35;
  public pageTotal:number = 1;
  public rightTextHeader:string = '';
  public leftText:string = ''
  signImage:any;
  file:string=''
  @Input() public candidatePersonalDetails:any = {};
  @Input() public Day1FormData:any = {};
  @Input() public type:string = '';
  @Output() OpenPadSignature = new EventEmitter<any>();
  @Input() public  signPrevData:any = {};
  public signFileName:string = '';
  public signFilePath:string = '';
  public todayDate = new Date();
//   public addressLine1: string = '';
// public addressLine2: string = '';
  CandidateSignatureModel: CandidateSignatureModel = new CandidateSignatureModel();
  @Output() getLatestSignatureDataPageWise = new EventEmitter<any>();
  constructor(
    public dialog: MatDialog,
    private _candidateServeExt: CandidateService
    ) { }

  ngOnInit(): void {
    
  // this.addressLine1 = `${(this.candidatePersonalDetails?.AddressLine1 ? this.candidatePersonalDetails?.AddressLine1 : '')},
  // ${(this.candidatePersonalDetails?.AddressLine2 ? this.candidatePersonalDetails?.AddressLine2 : '')},${(this.candidatePersonalDetails?.AddressLine3 ? this.candidatePersonalDetails?.AddressLine3 : '')}`;
  // this.addressLine2 = `${(this.candidatePersonalDetails?.cr_city ? this.candidatePersonalDetails?.cr_city : '')},
  // ${(this.candidatePersonalDetails?.cr_state ? this.candidatePersonalDetails?.cr_state : '')},${(this.candidatePersonalDetails?.cr_countryName ? this.candidatePersonalDetails?.cr_countryName : '')},${(this.candidatePersonalDetails?.cr_postalCode ? this.candidatePersonalDetails?.cr_postalCode : '')}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.signPrevData?.isFromDB){
      this.updatedAllPageSign(this.signPrevData);
    }
  }

  public result:any = {};
  getLatestSignature(result:any){
    this.result =result;
    this.result['bodySign']=true;
    if(result?.isExist){
      this.updatedataSignWithNew(result);
    }
    else{
      if (result?.signImage) {
        let data= {};
        data['SignData']=result;        
       
        if(result.page === 1){
          this.CandidateSignatureModel.page1 =result?.signImage;
        }
  
         data['CandidateSignatureModel']=this.CandidateSignatureModel;
         this.updatedataSignWithExist(result);
  
         this.getLatestSignatureDataPageWise.emit(data)
      }
    }
  }

  getValueByObjectKey(){
    if(this.CandidateSignatureModel.page1){
      return  this.CandidateSignatureModel.page1;
    }
    else{
      return null
    }
  }

  updatedataSignWithExist(result:any){
    if(this.CandidateSignatureModel.page1){
      this.CandidateSignatureModel.page1 =result?.signImage;
    }
  }
  updatedataSignWithNew(result:any){   
    if(result?.page == 1){
      this.CandidateSignatureModel.page1 =result?.signImage;
    }
  }

  updatedAllPageSign(result:any){
    this.CandidateSignatureModel.page1 =result?.signImage;
  }

  signFinal(element: any = {}): void {
    if(this.result?.bodySign){
      this.CandidateSignatureModel.page1=this.result?.signImage;
    }
  }

  // signt(element: any = {}): void {
  //   element['formId'] =35;
  //   this.OpenPadSignature.emit(element);
  // }

  // public signFileName:string = '';
  // public signFilePath:string = '';
  // signImage:any;
  signt(element: any = {}): void {
    element['titleSignModal'] = " Add Signature";

    const dialogRef = this.dialog.open(SignatureCaptureLibComponent, {
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

  saveDoc(){
    if(this.signImage){
      let body = {};
      // body['cid'] = this.data?.candidatePersonalDetails?.cid;
      body['FormId'] = 35;
      body['signFileName'] = this.signFileName;
      body['signFilePath'] = this.signFilePath;
      // body['JoiningReportFillDate'] = GlobalMethod.formatDate(this.todayDate);
      // body['status'] = 'D';
      this._candidateServeExt.AddUpdateDay1Sign(body).subscribe(
        res => {
          // this._share.showAlertSuccessMessage.next(res);
          // this.dialogRef.close(true);
        }
      );
    }else{
      // this._share.showAlertErrorMessage.next('Please sign this document.');  
    }  
  }

}
