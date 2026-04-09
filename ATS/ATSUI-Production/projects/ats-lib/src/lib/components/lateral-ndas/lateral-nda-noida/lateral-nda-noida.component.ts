import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { CandidateSignatureModel } from 'projects/ats-global-system-external/src/app/core/models/common-model';

@Component({
  selector: 'lib-lateral-nda-noida',
  templateUrl: './lateral-nda-noida.component.html',
  styleUrls: ['./lateral-nda-noida.component.scss']
})
export class LateralNdaNoida implements OnInit,OnChanges {
  public ndaLateralForm: UntypedFormGroup = new UntypedFormGroup({});
  public formId:number = 42;
  public pageTotal:number = 5;
  public rightTextHeader:string = 'Conflict of Interest policy';
  public leftText:string = 'Version 1.0 <br> Oct 03, 2022'
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
  CandidateSignatureModel: CandidateSignatureModel = new CandidateSignatureModel();
  @Output() getLatestSignatureDataPageWise = new EventEmitter<any>();
  constructor(
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    ) { }

    ngOnInit(): void {
      this.formInit();
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

          else if(result.page === 4){
            this.CandidateSignatureModel.page4 =result?.signImage;
          }
          else if(result.page === 5){
            this.CandidateSignatureModel.page5 =result?.signImage;
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
      else if(this.CandidateSignatureModel.page4){
        return  this.CandidateSignatureModel.page4;
      }
      else if(this.CandidateSignatureModel.page5){
        return  this.CandidateSignatureModel.page5;
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
      if(this.CandidateSignatureModel.page4){
        this.CandidateSignatureModel.page4 =result?.signImage;
      }
      if(this.CandidateSignatureModel.page5){
        this.CandidateSignatureModel.page4 =result?.signImage;
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
      if(result?.page == 4){
        this.CandidateSignatureModel.page4 =result?.signImage;
      }
      if(result?.page == 5){
        this.CandidateSignatureModel.page5 =result?.signImage;
      }

    }

    updatedAllPageSign(result:any){
      this.CandidateSignatureModel.page1 =result?.signImage;
      this.CandidateSignatureModel.page2 =result?.signImage;
      this.CandidateSignatureModel.page3 =result?.signImage;
      this.CandidateSignatureModel.page4 =result?.signImage;
      this.CandidateSignatureModel.page5 =result?.signImage;
    }


    signFinal(element: any = {}): void {
      if(this.result?.bodySign){
        this.CandidateSignatureModel.page4=this.result?.signImage;
      }
    }

    /***
     * form setup
     */
     formInit() {
      this.ndaLateralForm = this._fb.group({
        briefDesc: [this.Day1FormData?.BriefDesc ? this.Day1FormData?.BriefDesc : null],
        remarks: [this.Day1FormData?.RemarksFormDoc ? this.Day1FormData?.RemarksFormDoc : null]
      })
    }

  signt(element: any = {}): void {
    element['formId'] =25;
    this.OpenPadSignature.emit(element);
  }
}
