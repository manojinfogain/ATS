  import { Component, Input, OnInit } from '@angular/core';
  import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
  import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
  import { MatLegacyRadioChange as MatRadioChange } from '@angular/material/legacy-radio';
  import { forkJoin } from 'rxjs';
  import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
  import { CANDIDATE_COMMON } from 'projects/ats-global-system-external/src/app/core/constant/candidate-common.const';
  import { ExternalUserGlobalApiService } from 'projects/ats-global-system-external/src/app/core/services/external-user-global-api.service';
  // import { UpdateAddressCandidateModalComponent } from './update-address-candidate-modal/update-address-candidate-modal.component';
  // import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { ShareService } from '../../../core/services/share.service';
import { HttpClient } from '@angular/common/http';
import { FILE_UPLOAD } from '../../../core/constant/common.const';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
  // import { COMMON_CONST } from '../../../core/constant/common.const';
  
  @Component({
  selector: 'app-highest-education-details',
  templateUrl: './highest-education-details.component.html',
  styleUrls: ['./highest-education-details.component.scss']
})
export class HighestEducationDetailsComponent implements OnInit {
    @Input() appearance: string = 'outline';
    @Input() formClass: string = 'form-outline-ats';
    public isRequired: boolean = true;
    @Input() public highestEducationForm: UntypedFormGroup = new UntypedFormGroup({});
    @Input() public candidatePersonalDetails: any = {};
    public bloodGroupList: any = CANDIDATE_COMMON.bloodGroup;
    public bloodGroupListRh: any = CANDIDATE_COMMON.bloodGroupRh;
    public FilterCtrlNationality: UntypedFormControl = new UntypedFormControl();
    public searchInputNationality: string;
    public FilterCtrlSkills: UntypedFormControl = new UntypedFormControl();
    public searchInputSkills: string;
    public today = new Date();
   public countryList: any = [];
    public maxDate = new Date(this.today.getFullYear() - 10, this.today.getMonth(), this.today.getDate());
    constructor(
      private _fb: UntypedFormBuilder,
      public dialog: MatDialog,
      private _candidateServe: CandidateService,
      private _exGlobal: ExternalUserGlobalApiService,
      private _globalMethod:GlobalCommonMethodService,
      private _share: ShareService,
      private _http:HttpClient
    ) { }
    public isFinalSumbit:boolean = false;
    ngOnInit(): void {
      this.callMasterAPI();
      this.InithighestEducationForm();
      setTimeout(() => {
      Object.keys(this.highestEducationForm.controls).forEach(key => {
        const control = this.highestEducationForm.get(key);
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
    public addedHighestEduInfo: any = [];
  public idTypeName: string = '';
    getPersonalDetails(type:string = 'N'){
      this._candidateServe.GetBGVEducationDetails().subscribe(
        res => {
        this.addedHighestEduInfo = res['data'][0];
        this.idTypeName = this.idTypeList.find((elm: any) => elm.Id == this.addedHighestEduInfo?.DocumentTypeId)?.DocumentName;
        if(this.addedHighestEduInfo?.Id){
          this.setAddedValueToForm(this.addedHighestEduInfo);
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
        this._exGlobal.GetDocumentType('E'),
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
  
   
    /***
     * set value form 
     */
    setValueToForm(data: any) {
     
  
      this.highestEducationForm.patchValue({
        "CandidateName": data?.CandidateName ? data?.CandidateName : null,
        "CourseId": data?.CaurseId ? data?.CaurseId : null,
        "CollegeName": data?.CollegeName ? data?.CollegeName : null,
        "DateOfBirth": data?.DOB ? data?.DOB : null,
        // "SeatOrRollOrEnrollorPRNNo": data?.SeatOrRollOrEnrollorPRNNo ? data?.SeatOrRollOrEnrollorPRNNo : null,
        "DegreeOrQualification": data?.DegreeOrQualification ? data?.DegreeOrQualification : 'N',
        "YearOfPassing": data?.YearOfPassing ? data?.YearOfPassing : null,
        "DivisionOrCGPAOrPercent": data?.DivisionOrCGPAOrPercent ? data?.DivisionOrCGPAOrPercent : null,
        // "DocumentTypeId": data?.DocumentTypeId ? data?.DocumentTypeId : null,
      });
    }
     /***
     * set value form 
     */
    setAddedValueToForm(data: any) {
     
  
      this.highestEducationForm.patchValue({
        "Id": data?.Id ? data?.Id : null,
        "CourseId": this.candidatePersonalDetails?.CaurseId ? this.candidatePersonalDetails?.CaurseId : null,
        "CandidateName": data?.CandidateName ? data?.CandidateName : null,
        "CollegeName": data?.CollegeName ? data?.CollegeName : null,
        "DateOfBirth": data?.DateOfBirth ? data?.DateOfBirth : null,
        "SeatOrRollOrEnrollorPRNNo": data?.SeatOrRollOrEnrollorPRNNo ? data?.SeatOrRollOrEnrollorPRNNo : null,
        "DegreeOrQualification": data?.DegreeOrQualification ? data?.DegreeOrQualification : 'N',
        "YearOfPassing": data?.YearOfPassing ? data?.YearOfPassing : null,
        "DivisionOrCGPAOrPercent": data?.DivisionOrCGPAOrPercent ? data?.DivisionOrCGPAOrPercent : null,
        "DocumentTypeId": data?.DocumentTypeId ? data?.DocumentTypeId : null,
      });
      setTimeout(() => {
      
       if(data?.DocumentTypeId){
         this.onIdTypeChange({value: data?.DocumentTypeId});
       }
     }, 500);
    }
    /***
     * Personal Form
     */
  
    InithighestEducationForm() {
      this.highestEducationForm = this._fb.group({
        Id: [null],
        CourseId: [null],
        CandidateName: [{ value: null, disabled: this.isFinalSumbit }, [Validators.required]],
      CollegeName: [{ value: null, disabled: this.isFinalSumbit }, [Validators.required]],
      DateOfBirth: [{ value: null, disabled: this.isFinalSumbit }],
      SeatOrRollOrEnrollorPRNNo: [{ value: null, disabled: this.isFinalSumbit }, [Validators.required]],
      DegreeOrQualification: [{ value: null, disabled: this.isFinalSumbit }, [Validators.required]],
      YearOfPassing: [{ value: null, disabled: this.isFinalSumbit }, [Validators.required, Validators.maxLength(4)]],
      DivisionOrCGPAOrPercent: [{ value: null, disabled: this.isFinalSumbit }, [Validators.required]],
      DocumentTypeId: [{ value: null, disabled: this.isFinalSumbit }, [Validators.required]],
      DocumentPath: [null],
      DocumentName: [null],
      UploadDocument: [null],
      UploadDocument1: [null, Validators.required],
      });

    }
  
    getControl(name: string) {
      return this.highestEducationForm.get(name);
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
        if(this.docDetails[0]?.DocumentPath){
          this.isDocumentAvailable = true;
          this.isFileReq = false;
          this.getControl('DocumentPath').setValidators([Validators.required]);
          this.getControl('DocumentName').setValidators([Validators.required]);
          this.getControl('UploadDocument1').clearValidators();
          this.highestEducationForm.patchValue({
            DocumentPath: this.docDetails[0]?.DocumentPath,
            DocumentName: this.docDetails[0]?.documentName
          });
        } else {
          this.isDocumentAvailable = false;
          this.isFileReq = true;
          this.getControl('DocumentPath').clearValidators();
          this.getControl('DocumentName').clearValidators();
          this.getControl('UploadDocument1').setValidators([Validators.required]);
          this.highestEducationForm.patchValue({
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

   public PreviewName: string = '';
    //get preview name
    getPreviewName(val: any) {
      if(val == 5){
        this.PreviewName = 'Graduation Marksheets (All Semesters)';
      }else if(val == 6){
        this.PreviewName = 'Graduation Certificate';
      } else if(val == 21){
        this.PreviewName = 'Post Graduation Marksheets (All Semesters)';
      }else if(val == 22){
        this.PreviewName = 'Post Graduation Certificate';
      } else{
        this.PreviewName = 'Document';
      }

    }

    previewDocument(data: any) {
      let elm = {};
      elm['documentName'] = data.documentTypeName?.replace(/\.(dat|enc)$/i, '') || data.documentTypeName;
      elm['filePath'] = data?.DocumentPath;
      elm['fileName'] = data?.documentName?.replace(/\.(dat|enc)$/i, '') || data?.documentName;
      elm['type'] = 'path';
      elm['cid'] = data?.cid;
      debugger
      this._globalMethod.downloadPrevDocuments(elm,this._http,this.dialog,this._share);
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
  