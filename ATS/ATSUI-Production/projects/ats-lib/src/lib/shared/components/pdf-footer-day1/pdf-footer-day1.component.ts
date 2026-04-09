import { Component, EventEmitter, Input, OnChanges, OnInit ,Output, SimpleChanges} from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SignatureCaptureLibComponent } from '../../../components/modals/signature-capture-lib/signature-capture-lib.component';
import { CandidateSignatureModel } from 'projects/ats-global-system-external/src/app/core/models/common-model';
import { GetSetStorageService } from 'projects/ats-global-system-external/src/app/core/services/get-set-storage.service';

@Component({
  selector: 'lib-pdf-footer-day1',
  templateUrl: './pdf-footer-day1.component.html',
  styleUrls: ['./pdf-footer-day1.component.css']
})
export class PdfFooterDay1Component implements OnInit,OnChanges {
  public todayDate = new Date();
  @Input() public candidatePersonalDetails:any = {};
  @Input() public formId:number = 0;
  @Input() public page:number = 0;
  @Input() public pageTotal:number = 0;
  @Input() public leftText:string = 'ISMS/PL-OSG-13 /Version 2.1 <br>Oct 31st, 2020';
  @Input() public middleText:string = 'Infogain Internal';
  @Input() public isMiddleTextHide:boolean = true;
  @Input() public isSignHide:boolean = false;
  @Input() public signimagesrc:string = '';
  @Input() public isSignEditable:boolean = true;
  @Input() public CandidateSignatureModel: CandidateSignatureModel = new CandidateSignatureModel();
  @Output() getLatestSignature = new EventEmitter<any>();
 // @Output() OpenPadSignature = new EventEmitter<any>();
  @Input() public  signPrevData:any = {};
  @Input() public isVisisbleSign:boolean = false;
  @Input() public locationId:number = 0;
  constructor(
    public dialog: MatDialog,
     private _storage:GetSetStorageService
  ) { }

  ngOnInit(): void {
    let userData = this._storage.getSetUserData();
    if(userData?.LocationID && (this.formId == 18 || this.formId == 25)){
      this.locationId = userData.LocationID
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    // if(changes?.signimagesrc?.previousValue){ 
    //   this.signimagesrc = null;
    //   this.signimagesrc = changes?.signimagesrc?.currentValue;
    // }
    
  }

//   signtAr(element: any = {}): void {
//     element['formId'] =14;
//  //   this.OpenPadSignature.emit(element);
//     
//    // this.isPgae4 = true;
//   }

  public signFileName: string = '';
  public signFilePath: string = '';
 // public formId: number = 0;
  signImage: any;
  public signData: any = {};
  signt(event) {
    let element:any = {};
    
    let filterSignImg:any = this.getValueByObjectKey();
    if(filterSignImg){
      this.signData = {
        formId:this.formId,
        page:this.page,
        isExist:true,
        signImage: filterSignImg,
        
      }
      this.getLatestSignature.emit(this.signData);
    }
    else{
      element['candidatePersonalDetails'] = this.candidatePersonalDetails;
      const dialogRef = this.dialog.open(SignatureCaptureLibComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'add-signature-modal'],
        data: element,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(
        result => {
          if (result?.signImage) {
            this.signData = {
              signImage: result?.signImage,
              signFileName: result?.signFileName,
              signFilePath: result?.signFilePath,
              formId:this.formId,
              page:this.page,
              isExist:false
            }
            
            this.getLatestSignature.emit(this.signData);
          }
        }
      )
    }
  }


  signUpdate(event) {
    let element:any = {};
    element['candidatePersonalDetails'] = this.candidatePersonalDetails;
    const dialogRef = this.dialog.open(SignatureCaptureLibComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-signature-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result?.signImage) {
         //  this.signimagesrc = result?.signImage;
          // this.signFileName = result?.signFileName;
          // this.signFilePath = result?.signFilePath;
          this.signData = {
            signImage: result?.signImage,
            signFileName: result?.signFileName,
            signFilePath: result?.signFilePath,
            formId:this.formId,
            page:this.page,
            isExist:false
          }
          
          this.getLatestSignature.emit(this.signData);
        }
      }
    )
  }

  getValueByObjectKey(){
    if(this.CandidateSignatureModel.page1){
      return this.CandidateSignatureModel.page1;
    }
    else if(this.CandidateSignatureModel.page2){
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
      return  this.CandidateSignatureModel.page8;
    }
    else if(this.CandidateSignatureModel.page10){
      return  this.CandidateSignatureModel.page8;
    }
    else{
      return null
    }
  }


}
