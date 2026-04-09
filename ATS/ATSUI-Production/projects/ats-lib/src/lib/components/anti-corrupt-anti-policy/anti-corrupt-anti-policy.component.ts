import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { CandidateSignatureModel } from 'projects/ats-global-system-external/src/app/core/models/common-model';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
@Component({
  selector: 'lib-anti-corrupt-anti-policy',
  templateUrl: './anti-corrupt-anti-policy.component.html',
  styleUrls: ['./anti-corrupt-anti-policy.component.scss']
})
export class AntiCorruptAntiPolicyComponent implements OnInit,OnChanges {
  public formId:number = 14;
  public signFileName:string = '';
  public signFilePath:string = '';
  public rightTextHeader:string = 'Anti-Corruption & Anti- Bribery policy';
  public leftText:string = 'Version 1.0 <br> Oct 03, 2022'
  signImage:any;
  file:string='';
  @Input() public candidatePersonalDetails:any = {};
  @Input() public Day1FormData:any = {};
  @Input() public type:string = '';
  @Output() OpenPadSignature = new EventEmitter<any>();
  @Input() public  signPrevData:any = {};
  public todayDate = new Date();
  CandidateSignatureModel: CandidateSignatureModel = new CandidateSignatureModel();
  @Output() getLatestSignatureDataPageWise = new EventEmitter<any>();
  constructor(
    public dialog: MatDialog,
    private _candidateServeExt: CandidateService,
    private _share:ShareService
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
      this.CandidateSignatureModel.page5=result?.signImage;
    }
    if(result?.page == 6){
      this.CandidateSignatureModel.page6=result?.signImage;
    }
    if(result?.page == 7){
      this.CandidateSignatureModel.page7=result?.signImage;
    }
    if(result?.page == 8){
      this.CandidateSignatureModel.page8=result?.signImage;
    }
    if(result?.page == 9){
      this.CandidateSignatureModel.page9=result?.signImage;
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
  }


  signFinal(element: any = {}): void {
    debugger
    if(this.result?.bodySign){
      this.CandidateSignatureModel.page9=this.result?.signImage;
    }
  }




  signt(element: any = {}): void {
    element['formId'] =14;
    this.OpenPadSignature.emit(element);
    // const dialogRef = this.dialog.open(SignatureCaptureLibComponent, {
    //   width: '500px',
    //   panelClass: ['ats-model-wrap', 'add-signature-modal'],
    //   data: element,
    //   disableClose: true
    // });
    // dialogRef.afterClosed().subscribe(
    //   result => {
    //
    //     if (result?.signImage) {
    //       this.signImage = result?.signImage;
    //       this.signFileName = result?.signFileName;
    //       this.signFilePath = result?.signFilePath;
    //     }
    //   }
    // )
    // element['titleSignModal'] = " Add Signature";
    // element['type'] =this.type;
    // const dialogRef = this.dialog.open(SignatureCaptureLibComponent, {
    //   width: '500px',
    //   panelClass: ['ats-model-wrap', 'add-signature-modal'],
    //   data: element,
    //   disableClose: true
    // });
    // dialogRef.afterClosed().subscribe(
    //   result => {
    //
    //     if (result?.signImage) {
    //       this.signImage = result?.signImage;
    //       this.signFileName = result?.signFileName;
    //       this.signFilePath = result?.signFilePath;
    //     }
    //   }
    // )
  }


  signUpdate(event) {
    // let element:any = {};
    // const dialogRef = this.dialog.open(SignatureCaptureLibComponent, {
    //   width: '500px',
    //   panelClass: ['ats-model-wrap', 'add-signature-modal'],
    //   data: element,
    //   disableClose: true
    // });
    // dialogRef.afterClosed().subscribe(
    //   result => {
    //     if (result?.signImage) {
    //      //  this.signimagesrc = result?.signImage;
    //       // this.signFileName = result?.signFileName;
    //       // this.signFilePath = result?.signFilePath;
    //       this.signData = {
    //         signImage: result?.signImage,
    //         signFileName: result?.signFileName,
    //         signFilePath: result?.signFilePath,
    //         formId:this.formId,
    //         page:this.page,
    //         isExist:false
    //       }
    //
    //       this.getLatestSignature.emit(this.signData);
    //     }
    //   }
    // )
  }



  saveDoc(){
    if(this.signImage){
      let body = {};
      // body['cid'] = this.data?.candidatePersonalDetails?.cid;
      body['FormId'] = 14;
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
