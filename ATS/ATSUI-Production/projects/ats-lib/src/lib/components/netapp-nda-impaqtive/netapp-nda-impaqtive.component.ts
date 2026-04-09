import { Component, OnInit,Input,Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CandidateSignatureModel } from 'projects/ats-global-system-external/src/app/core/models/common-model';

@Component({
  selector: 'lib-netapp-nda-impaqtive',
  templateUrl: './netapp-nda-impaqtive.component.html',
  styleUrls: ['./netapp-nda-impaqtive.component.scss']
})
export class NetappNdaImpaqtiveComponent implements OnInit {

  
    public formId:number = 19;
    public pageTotal:number = 3;
    public rightTextHeader:string = ' ';
    public middleText:string = 'MPA EXHIBIT D: LABOR SERVICES EXHIBIT (v20081231)';
    signImage:any;
    file:string='';
    @Input() public candidatePersonalDetails:any = {};
    @Input() public Day1FormData:any = {};
    @Input() public type:string = '';
    @Output() OpenPadSignature = new EventEmitter<any>();
    @Input() public  signPrevData:any = {};
    public signFileName:string = '';
    public signFilePath:string = '';
    public todayDate = new Date();
    CandidateSignatureModel: CandidateSignatureModel = new CandidateSignatureModel();
    @Output() getLatestSignatureDataPageWise = new EventEmitter<any>();
  
    constructor() { }
  
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
         
          if(result.page === 1){
            this.CandidateSignatureModel.page1 =result?.signImage;
          }
          else if(result.page === 2){
            this.CandidateSignatureModel.page2 =result?.signImage;
          }
    
          else if(result.page === 3){
            this.CandidateSignatureModel.page3 =result?.signImage;
          }  
    
           data['CandidateSignatureModel']=this.CandidateSignatureModel;
           this.updatedataSignWithExist(result);
    
           this.getLatestSignatureDataPageWise.emit(data)
        }
      }
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
      else{
        return null
      }
    }
  
    updatedataSignWithExist(result:any){
      if(this.CandidateSignatureModel.page1){
        this.CandidateSignatureModel.page1 =result?.signImage;
      }
      if(this.CandidateSignatureModel.page2){
        this.CandidateSignatureModel.page2 =result?.signImage;
      }
      if(this.CandidateSignatureModel.page3){
        this.CandidateSignatureModel.page3 =result?.signImage;
      }
    }
    updatedataSignWithNew(result:any){
      if(result?.page == 1){
        this.CandidateSignatureModel.page1 =result?.signImage;
      }
      if(result?.page == 2){
        this.CandidateSignatureModel.page2 =result?.signImage;
      }
      if(result?.page == 3){
        this.CandidateSignatureModel.page3 =result?.signImage;
      }
    }
  
    updatedAllPageSign(result:any){
      this.CandidateSignatureModel.page1 =result?.signImage;
      this.CandidateSignatureModel.page2 =result?.signImage;
      this.CandidateSignatureModel.page3 =result?.signImage;
    }
  
  
    signFinal(element: any = {}): void {
      if(this.result?.bodySign){
        this.CandidateSignatureModel.page3=this.result?.signImage;
      }
    }
  
    signt(element: any = {}): void {
      element['formId'] = 19;
      this.OpenPadSignature.emit(element);
    }
}
