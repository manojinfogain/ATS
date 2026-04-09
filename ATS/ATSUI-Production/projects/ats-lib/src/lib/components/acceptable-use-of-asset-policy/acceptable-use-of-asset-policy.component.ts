
import { Component, OnInit,Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SignatureCaptureLibComponent } from '../modals/signature-capture-lib/signature-capture-lib.component';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { CandidateSignatureModel } from 'projects/ats-global-system-external/src/app/core/models/common-model';
@Component({
  selector: 'lib-acceptable-use-of-asset-policy',
  templateUrl: './acceptable-use-of-asset-policy.component.html',
  styleUrls: ['./acceptable-use-of-asset-policy.component.css']
})
export class AcceptableUseOfAssetPolicyComponent implements OnInit, OnChanges {
  @Input() public candidatePersonalDetails:any = {};
  @Input() public Day1FormData:any = {};
  @Input() public type:string = '';
  @Output() OpenPadSignature = new EventEmitter<any>();
  @Input() public  signPrevData:any = {};
  public formId:number = 13;
  public pageTotal:number = 12;
  public rightTextHeader:string = 'Acceptable Use of Asset Policy';
  public leftText:string = 'ISMS/PL-CF-13/Version 3.1 <br> Dec 06th, 2024';
  public todayDate = new Date();
  CandidateSignatureModel: CandidateSignatureModel = new CandidateSignatureModel();
  @Output() getLatestSignatureDataPageWise = new EventEmitter<any>();
  constructor(
    public dialog: MatDialog,
    private _candidateServeExt: CandidateService
  ) { }

  ngOnInit(): void {
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

       if(result.page === 2){
          this.CandidateSignatureModel.page2 =result?.signImage;
        }

        else if(result.page === 3){
          this.CandidateSignatureModel.page3 =result?.signImage;
        }

        else if(result.page === 4){
          this.CandidateSignatureModel.page4 =result?.signImage;
        }
        else if(result.page === 5){
          this.CandidateSignatureModel.page5 =result?.signImage;
        }
        else if(result.page === 6){
          this.CandidateSignatureModel.page6 =result?.signImage;
        }
        else if(result.page === 7){
          this.CandidateSignatureModel.page7 =result?.signImage;
        }
        else if(result.page === 8){
          this.CandidateSignatureModel.page8 =result?.signImage;
        }
        else if(result.page === 9){
          this.CandidateSignatureModel.page9 =result?.signImage;
        }
        else if(result.page === 10){
          this.CandidateSignatureModel.page10 =result?.signImage;
        }
        else if(result.page === 11){
          this.CandidateSignatureModel.page11 =result?.signImage;
        }
        else if(result.page === 12){
          this.CandidateSignatureModel.page12 =result?.signImage;
        }

         data['CandidateSignatureModel']=this.CandidateSignatureModel;
         this.updatedataSignWithExist(result);

         this.getLatestSignatureDataPageWise.emit(data)
      }
    }
  }

  getValueByObjectKey(){
    if(this.CandidateSignatureModel.page2){
      return  this.CandidateSignatureModel.page2;
    }
    else if(this.CandidateSignatureModel.page3){
      return  this.CandidateSignatureModel.page3;
    }
    else if(this.CandidateSignatureModel.page4){
      return  this.CandidateSignatureModel.page4;
    }
    else if(this.CandidateSignatureModel.page5){
      return  this.CandidateSignatureModel.page5;
    }
    else if(this.CandidateSignatureModel.page6){
      return  this.CandidateSignatureModel.page6;
    }
    else if(this.CandidateSignatureModel.page7){
      return  this.CandidateSignatureModel.page7;
    }
    else if(this.CandidateSignatureModel.page8){
      return  this.CandidateSignatureModel.page8;
    }
    else if(this.CandidateSignatureModel.page9){
      return  this.CandidateSignatureModel.page9;
    }
    else if(this.CandidateSignatureModel.page10){
      return  this.CandidateSignatureModel.page10;
    }
    else if(this.CandidateSignatureModel.page11){
      return  this.CandidateSignatureModel.page11;
    }
    else if(this.CandidateSignatureModel.page12){
      return  this.CandidateSignatureModel.page12;
    }
    else{
      return null
    }
  }

  updatedataSignWithExist(result:any){
    if(this.CandidateSignatureModel.page2){
      this.CandidateSignatureModel.page2 =result?.signImage;
    }
    if(this.CandidateSignatureModel.page3){
      this.CandidateSignatureModel.page3 =result?.signImage;
    }
    if(this.CandidateSignatureModel.page4){
      this.CandidateSignatureModel.page4 =result?.signImage;
    }
    if(this.CandidateSignatureModel.page5){
      this.CandidateSignatureModel.page5 =result?.signImage;
    }
    if(this.CandidateSignatureModel.page6){
      this.CandidateSignatureModel.page6 =result?.signImage;
    }
    if(this.CandidateSignatureModel.page7){
      this.CandidateSignatureModel.page7 =result?.signImage;
    }
    if(this.CandidateSignatureModel.page8){
      this.CandidateSignatureModel.page8 =result?.signImage;
    }
    if(this.CandidateSignatureModel.page9){
      this.CandidateSignatureModel.page9 =result?.signImage;
    }
    if(this.CandidateSignatureModel.page10){
      this.CandidateSignatureModel.page10 =result?.signImage;
    }
    if(this.CandidateSignatureModel.page11){
      this.CandidateSignatureModel.page11 =result?.signImage;
    }
    if(this.CandidateSignatureModel.page12){
      this.CandidateSignatureModel.page12 =result?.signImage;
    }
  }
  updatedataSignWithNew(result:any){
    if(result?.page == 2){
      this.CandidateSignatureModel.page2 =result?.signImage;
    }
    if(result?.page == 3){
      this.CandidateSignatureModel.page3 =result?.signImage;
    }
    if(result?.page == 4){
      this.CandidateSignatureModel.page4 =result?.signImage;
    }
    if(result?.page == 5){
      this.CandidateSignatureModel.page5 =result?.signImage;
    }
    if(result?.page == 6){
      this.CandidateSignatureModel.page6 =result?.signImage;
    }
    if(result?.page == 7){
      this.CandidateSignatureModel.page7 =result?.signImage;
    }
    if(result?.page == 8){
      this.CandidateSignatureModel.page8 =result?.signImage;
    }
    if(result?.page == 9){
      this.CandidateSignatureModel.page9 =result?.signImage;
    }
    if(result?.page == 10){
      this.CandidateSignatureModel.page10 =result?.signImage;
    }
    if(result?.page == 11){
      this.CandidateSignatureModel.page11 =result?.signImage;
    }
    if(result?.page == 12){
      this.CandidateSignatureModel.page12 =result?.signImage;
    }

  }

  updatedAllPageSign(result:any){
    this.CandidateSignatureModel.page2 =result?.signImage;
    this.CandidateSignatureModel.page3 =result?.signImage;
    this.CandidateSignatureModel.page4 =result?.signImage;
    this.CandidateSignatureModel.page5 =result?.signImage;
    this.CandidateSignatureModel.page6 =result?.signImage;
    this.CandidateSignatureModel.page7 =result?.signImage;
    this.CandidateSignatureModel.page8 =result?.signImage;
    this.CandidateSignatureModel.page9 =result?.signImage;
    this.CandidateSignatureModel.page10 =result?.signImage;
    this.CandidateSignatureModel.page11 =result?.signImage;
    this.CandidateSignatureModel.page12 =result?.signImage;
  }

  signFinal(element: any = {}): void {
    if(this.result?.bodySign){
      this.CandidateSignatureModel.page4=this.result?.signImage;
    }
  }

  public signFileName:string = '';
  public signFilePath:string = '';
  signImage:any;
  signt(element: any = {}): void {
    element['formId'] =13;
    this.OpenPadSignature.emit(element);
  }

  saveDoc(){
    if(this.signImage){
      let body = {};
      // body['cid'] = this.data?.candidatePersonalDetails?.cid;
      body['FormId'] = 13;
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
