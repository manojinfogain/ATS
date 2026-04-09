 import { Component, Input, OnInit } from '@angular/core';
 import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
 import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
 import { MatLegacyRadioChange as MatRadioChange } from '@angular/material/legacy-radio';
 import { forkJoin } from 'rxjs';
 import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
 import { CANDIDATE_COMMON } from 'projects/ats-global-system-external/src/app/core/constant/candidate-common.const';
 import { ExternalUserGlobalApiService } from 'projects/ats-global-system-external/src/app/core/services/external-user-global-api.service';
 // import { UpdateAddressCandidateModalComponent } from './update-address-candidate-modal/update-address-candidate-modal.component';
 import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { FILE_UPLOAD } from '../../../core/constant/common.const';
import { ShareService } from '../../../core/services/share.service';
import { HttpClient } from '@angular/common/http';
 // import { COMMON_CONST } from '../../../core/constant/common.const';
 
 @Component({
  selector: 'app-current-address-details',
  templateUrl: './current-address-details.component.html',
  styleUrls: ['./current-address-details.component.scss']
})
export class CurrentAddressDetailsComponent implements OnInit {
   @Input() appearance: string = 'outline';
   @Input() formClass: string = 'form-outline-ats';
   public isRequired: boolean = true;
   @Input() public currentAddressDetailsForm: UntypedFormGroup = new UntypedFormGroup({});
   @Input() public candidatePersonalDetails: any = {};
   public FilterCtrlNationality: UntypedFormControl = new UntypedFormControl();
   public searchInputNationality: string;
   public FilterCtrlSkills: UntypedFormControl = new UntypedFormControl();
   public searchInputSkills: string;
   public today = new Date();
  public countryList: any = [];
  public PreviewName: string = '';
   public maxDate = new Date(this.today.getFullYear() - 10, this.today.getMonth(), this.today.getDate());
   constructor(
     private _fb: UntypedFormBuilder,
     public dialog: MatDialog,
     private _candidateServe: CandidateService,
     private _exGlobal: ExternalUserGlobalApiService,
     private _globalMethod: GlobalCommonMethodService,
     private _share: ShareService,
     private _http: HttpClient
   ) { }
   public isFinalSumbit:boolean = false;
   ngOnInit(): void {
     this.callMasterAPI();
     this.InitCurrentAddressForm();
      setTimeout(() => {
      Object.keys(this.currentAddressDetailsForm.controls).forEach(key => {
        const control = this.currentAddressDetailsForm.get(key);
        if (control?.validator) {
          const validator = control.validator({} as UntypedFormControl);
          if (validator && validator['required']) {
            control.markAsTouched();
          }
        }
      });
    }, 0);
     this.getPersonalDetails();
   }
 
   ngAfterViewInit(): void {
     setTimeout(()=>{
       if(this._globalMethod.isBGVFinalSubmit()){
         this.isFinalSumbit= true;
       }
     },500);
   }
 
   /**
    * get PAersonal
    */
  public addedCurrentAddressInfo: any = [];
  public idTypeName: string = '';
   getPersonalDetails(type:string = 'N'){
      this._candidateServe.GetCandidateBGVCurrentAddress().subscribe(
      res => {
        this.addedCurrentAddressInfo = res['data'][0];
        this.idTypeName = this.idTypeList.find((elm: any) => elm.Id == this.addedCurrentAddressInfo?.DocumentTypeId)?.DocumentName;
        if(this.addedCurrentAddressInfo?.Id){
          this.setAddedValueToForm(this.addedCurrentAddressInfo);
        }
        else{
          this.setValueToForm(this.candidatePersonalDetails);
        }
        
      }
    )
   }
 
   /***
    *  call master API
    */
   public titleList: any = [];
   public idTypeList:any = [];
  public FilterCtrlCountry: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlCity: UntypedFormControl = new UntypedFormControl();
  public searchInputLocation: string
  public searchInputCity: string
   // public genderList:any = [];
   callMasterAPI() {
     forkJoin([
       this._exGlobal.GetCourtesyTitle(),
       this._exGlobal.GetDocumentType('I'),
      this._exGlobal.getCountryList()
     ]).subscribe(
       res => {
         this.titleList = res[0]['data'];
         this.idTypeList = res[1]['data'];
        //  this.countryList = res[2]['data'];
        let filterById = [201];
        let filterByOther = res[2]['data'].filter(t => {
          return filterById.indexOf(t.id) == -1;
        });
        this.countryList = filterByOther
         this.FilterCtrlNationality.valueChanges.subscribe(
           val => {
             this.searchInputNationality = val;
           }
         ); 
         this.FilterCtrlSkills.valueChanges.subscribe(
           val => {
             this.searchInputSkills = val;
           }
         );
         /**location search */
        this.FilterCtrlCountry.valueChanges.subscribe(
          val => {
            this.searchInputLocation = val;
          }
        )
        /**city search */
        this.FilterCtrlCity.valueChanges.subscribe(
          val => {
            this.searchInputCity = val;
          }
        )
       }
     )
   }
 
  public countryName: string = '';
   /***
    * set value form 
    */
   setValueToForm(data: any) {
    debugger
 
     this.currentAddressDetailsForm.patchValue({       
       "CandidateName": data?.CandidateName ? data?.CandidateName : null,
       "Address": data?.Address ? data?.Address : null,
       "PinCode": data?.postalCode ? data?.postalCode : null,
       "MobileNumber": data?.MobileNumber ? data?.MobileNumber : null,
       "CountryId": data?.Country ? parseInt(data?.Country) : null,
       "State": data?.state ? data?.state : null,
       "City": data?.city ? data?.city : null,
       "AlternateContactNumber": data?.LandlineNumber ? data?.LandlineNumber : null,
       "DocumentTypeId":14,
       "DocumentPath": data?.DocumentPath ? data?.DocumentPath : null,
       "DocumentName": data?.DocumentName ? data?.DocumentName : null,
     });
     setTimeout(() => {      
       this.countryName = this.countryList.find((elm: any) => elm.id == data?.Country)?.country_name;
       this.onIdTypeChange({value: 14});
     }, 500);
   }

   /***
    * set value form 
    */
   setAddedValueToForm(data: any) {
    
 debugger
     this.currentAddressDetailsForm.patchValue({       
        "Id": data?.Id ? data?.Id : null,
       "CandidateName": data?.CandidateName ? data?.CandidateName : null,
       "Address": data?.Address ? data?.Address : null,
       "PinCode": data?.PinCode ? parseInt(data?.PinCode) : null,
       "MobileNumber": data?.MobileNumber ? data?.MobileNumber : null,
       "CountryId": data?.CountryID ? parseInt(data?.CountryID) : null,
       "State": data?.State ? data?.State : null,
       "City": data?.City ? data?.City : null,
       "AlternateContactNumber": data?.AlternateContactNumber ? data?.AlternateContactNumber : null,
       "DocumentTypeId": data?.DocumentTypeId ? data?.DocumentTypeId : null,
       "DocumentPath": data?.DocumentPath ? data?.DocumentPath : null,
       "DocumentName": data?.DocumentName ? data?.DocumentName : null,
     });
     setTimeout(() => {
      this.countryName = this.countryList.find((elm: any) => elm.id == data?.CountryID)?.country_name;
       if(data?.DocumentTypeId){
         this.onIdTypeChange({value: data?.DocumentTypeId});
       }
     }, 500);
   }
   /***
    * Personal Form
    */
 
   InitCurrentAddressForm() {
     this.currentAddressDetailsForm = this._fb.group({
        Id: [null],
       CandidateName: [null, Validators.required],
       Address: [null, Validators.required],
       PinCode: [null, Validators.required],
       MobileNumber: [null, Validators.required],
       CountryId: [null, Validators.required],
       State: [null, Validators.required],
       City: [null, Validators.required],
       AlternateContactNumber: [null, Validators.required],
       DocumentTypeId: [null, Validators.required],
       DocumentPath: [null],
       DocumentName: [null],
        UploadDocument: [null],
        UploadDocument1: [null]
     })
   }
 
   getControl(name: string) {
     return this.currentAddressDetailsForm.get(name);
   }

   public cityList:any = [];
   //get city list
  getCityList(countryId:number) {
    this._exGlobal.getCityList(countryId).subscribe(
      res => {
        this.cityList = res['data'];
        console.log(this.cityList)
      }
    )
  }

  public manualLocationReq: boolean = false
  public isCityVisible: boolean = false
  getCountryId(id) {
    // if (id == 0) {
    //   // this.manualLocationReq = true;
    //   // this.ManualLocationControl.setValidators([Validators.required]);
    //   // this.isCityVisible = false;
    //   this.getControl('cityId').clearValidators();
    //   this.getControl('cityId').reset();
    // } else {
    //   this.manualLocationReq = false;
    //   // this.ManualLocationControl.clearValidators();
    //   if(id == 331){
    //     this.isCityVisible = true;
    //     this.getControl('cityId').setValidators([Validators.required]);
        this.getCityList(id);
        this.getStateList(id);
      // }else{
      //   this.isCityVisible = false;
      //   this.getControl('cityId').clearValidators();
      //   this.getControl('cityId').reset();
      // }
    // }
    // this.ManualLocationControl.updateValueAndValidity();
    // this.getControl('cityId').updateValueAndValidity();
  }
  public stateList:any = [];
  //get state list
  getStateList(countryId:number) {
    this._exGlobal.getStateList(countryId).subscribe(
      res => {
        this.stateList = res['data'];
      }
    )
  } 
  public docDetails: any = {};
    public isDocumentAvailable: boolean = false;
    public isFileReq: boolean = true;
  
    onIdTypeChange(event: any) {
      this.getPreviewName(event?.value);
      this._candidateServe.GetBGVFilePaths(event?.value).subscribe(
        res => {
          this.docDetails = res['data'];
          if (this.docDetails[0]?.DocumentPath) {
            this.isDocumentAvailable = true;
            this.isFileReq = false;
            this.getControl('DocumentPath').setValidators([Validators.required]);
            this.getControl('DocumentName').setValidators([Validators.required]);
            this.getControl('UploadDocument1').clearValidators();
            this.currentAddressDetailsForm.patchValue({
              DocumentPath: this.docDetails[0]?.DocumentPath,
              DocumentName: this.docDetails[0]?.documentName
            });
          } else {
            this.isDocumentAvailable = false;
            this.isFileReq = true;
            this.getControl('DocumentPath').clearValidators();
            this.getControl('DocumentName').clearValidators();
            this.getControl('UploadDocument1').setValidators([Validators.required]);
            this.currentAddressDetailsForm.patchValue({
              DocumentPath: null,
              DocumentName: null
            });
          }
          this.getControl('DocumentPath').updateValueAndValidity();
          this.getControl('DocumentName').updateValueAndValidity();
          this.getControl('UploadDocument1').updateValueAndValidity();
        }
      )
    }

    getPreviewName(val: any) {
      if(val == 14){
        this.PreviewName = 'Aadhar Card';
      }else if(val == 17){
        this.PreviewName = 'Voter Id';
      } else if(val == 29){
        this.PreviewName = 'Passport';
      } else if(val == 30){
        this.PreviewName = 'Rent Agreement';
      }else{
        this.PreviewName = 'Document';
      }

    }
  
    previewDocument(data: any) {
      debugger
      let elm = {};
      const docTypeName = data?.documentTypeName || data?.DocumentTypeName;
      elm['documentName'] = docTypeName?.replace(/\.(dat|enc)$/i, '') || docTypeName;
      elm['filePath'] = data?.DocumentPath;
      const fileName = data?.documentName || data?.DocumentName;
      elm['fileName'] = fileName?.replace(/\.(dat|enc)$/i, '') || fileName;
      elm['type'] = 'path';
      elm['cid'] = data?.cid || data?.CID;
      elm['candidateName'] = this.addedCurrentAddressInfo?.CandidateName || this.candidatePersonalDetails?.CandidateName || 'Document';
      this._globalMethod.downloadPrevDocuments(elm, this._http, this.dialog, this._share);
    }
    public fileID: any;
    fileUpload(event) {
      this.fileID = '';
      let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
      let file = event.target.files[0];
      let fileName = file?.name;
      this.getControl('UploadDocument1').markAsTouched();
      if (!allowedExtensions.exec(fileName)) {
        this._share.showAlertErrorMessage.next('Please upload file type jpg/jpeg/png/pdf only.');
        event.target.value = "";
        this.fileID = '';
        return false;
      }
      else if (file.size > FILE_UPLOAD.FILE_SIZE) {
        this._share.showAlertErrorMessage.next('file  cannot be greater than 15MB.');
        event.target.value = "";
        this.fileID = '';
        return false;
      }
      else {
        this.fileID = file;
        //
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          let base64File = reader.result.toString().replace(/^data:.+;base64,/, '');
          let data = {
            fileID: base64File,
            FileNameID: file.name,
          }
          console.log(data);
          this.getControl('UploadDocument').setValue(data?.fileID);
          this.getControl('UploadDocument').updateValueAndValidity();
          this.getControl('DocumentName').setValue(file.name);
          this.getControl('DocumentName').updateValueAndValidity();
        }
      }
    }
 }
 