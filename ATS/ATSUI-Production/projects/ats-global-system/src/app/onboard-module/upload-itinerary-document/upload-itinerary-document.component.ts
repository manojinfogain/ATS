import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { COMMON_CONST, FILE_UPLOAD, ONBOARDING_MODE } from '../../core/constant/common.const';
import { ShareService } from '../../core/services/share.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { OnboardService } from '../onboard.service';
import { GlobalApisService } from '../../core/services/global-apis.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from "file-saver";
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
@Component({
  selector: 'app-upload-itinerary-document',
  templateUrl: './upload-itinerary-document.component.html',
  styleUrls: ['./upload-itinerary-document.component.scss']
})
export class UploadItineraryDocumentComponent implements OnInit {
  public uploadItineraryForm: UntypedFormGroup = new UntypedFormGroup({});
  public onboardingModeList: any = ONBOARDING_MODE;
  constructor(
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _onBoardServe: OnboardService,
    private _globalApiServe: GlobalApisService,
    private http: HttpClient,
     private _globalCom:GlobalCommonMethodService
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.formInit();
    this.getDivisionList();
    this.getLocation();
  }

  //formInit
  formInit() {
    this.uploadItineraryForm = this._fb.group({
      divisionId: [null, [Validators.required]],
      locationId: [null, [Validators.required]],
      onboardingMode: [null, [Validators.required]],
      fileControl: [null, [Validators.required]]
    })
  }


  resetForm() {
    this.uploadItineraryForm.reset();
  }

  // gotPartnerDetailsPage():void{
  //   this._router.navigate(['partner-details'])
  // }

  ///////////////

  /**
   * api
   *  
   */
  apiCallOnSubmit(body: any) {
    this._onBoardServe.uploadOnboardFormDocuments(body).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        //this.dialogRef.close(true);
        this.resetForm();
      }
    )
  }
  /***
   * submit method
   */
  submitUploadItineraryForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    let formData = form.value;
    if (form.valid) {
      let body = new FormData();
      body.append('formId', '26');
      body.append('candidateType', '3');
      if (formData['locationId']) {
        body.append('joiningLocation', formData['locationId']);
      }
      // body.append('onboardingMode', 'V');
      if (formData['onboardingMode']) {
        body.append('onboardingMode', formData['onboardingMode']);
      }
      if (formData['divisionId']) {
        body.append('DivisionId', formData['divisionId']);
      }
      if (this.itinararyDoc) {
        body.append('file', this.itinararyDoc);
      }
      this.apiCallOnSubmit(body);
      

    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }
  //get division list
  public divisionList: any = [];
  getDivisionList() {
    this._globalApiServe.getDivisionList().subscribe(
      res => {
        this.divisionList = res['data'];
      }
    );
  }

  public divisionID: number;
  divisionChanged(e: any) {
    this.divisionID = e.value;
    this.getLocation();
  }


  //get company location
  public locationList: any = [];
  getLocation() {
    this._globalApiServe.getLocationList().subscribe(
      res => {
        let ids = [];
        if (this.divisionID == 7) {
          ids = [16];
        } else if (this.divisionID == 2) {
          ids = [4];
        } else if (this.divisionID == 9) {
          ids = [23];
        } 
        else {
          ids = [1, 2, 4, 5,16];
        }
        let filterLocation = res['data'].filter(loc => {
          return ids.indexOf(loc.LocID) !== -1;
        })
        this.locationList = filterLocation;
      }
    );
  }
  // view/download itinerary document based on location & division & onboarding mode
  viewItineraryDoc(form: UntypedFormGroup) {
    form['controls']['divisionId'].markAsTouched();
    form['controls']['locationId'].markAsTouched();
    form['controls']['onboardingMode'].markAsTouched();
    let formData = form.value;
    if (form['controls']['divisionId'].valid && form['controls']['locationId'].valid && form['controls']['onboardingMode'].valid) {
      let body = {};
      body['formId'] = 26;
      if (formData['locationId']) {
        body['joiningLocation'] = formData['locationId'];
      }
      if (formData['divisionId']) {
        body['divisionId'] = formData['divisionId'];
      }
      if (formData['onboardingMode']) {
        body['onboardingMode'] = formData['onboardingMode'];
      }
      this._onBoardServe.GetOnboardFormDocuments(body).subscribe(
        res => {
          let itineraryObj = res['data'][0];
          let docName = this._globalCom.removeLastExtension(itineraryObj?.documentsName);
          debugger
          if (itineraryObj?.fullPath) {
            // Dashboard/downloadFile?filelocation=${itineraryObj?.fullPath}
            this.http.get(`${environment.apiMainUrlNet}OnBoard/downloadItineraryFile?formId=${itineraryObj?.Id}&joiningLocation=${itineraryObj?.locationId}&divisionId=${itineraryObj?.divisionId}&onboardingMode=${itineraryObj?.OnboardingMode}`, { responseType: 'blob' }).subscribe(
              res => {
                saveAs(res, docName);
                setTimeout(() => {
                  this._share.showAlertSuccessMessage.next('File downloaded successfully.')
                }, 1000);
              },
              (error) => {
                this._share.showAlertErrorMessage.next('Joining Itinerary not available for the selected criteria.');
              }
            )
          }
          // this._share.showAlertSuccessMessage.next(res);
          // this.dialogRef.close(true);
        }
      )

    } else {
      if (!form['controls']['divisionId'].valid) {
        this._share.showAlertErrorMessage.next('Please select Division.');
      } 
      if (!form['controls']['onboardingMode'].valid) {
        this._share.showAlertErrorMessage.next('Please select Onboarding Mode.');
      }
      if (!form['controls']['locationId'].valid) {
        this._share.showAlertErrorMessage.next('Please select Location.');
      }
    }
  }
  //control for form
  getControl(name: string) {
    return this.uploadItineraryForm.get(name);
  }
  /***
  * upload itinarary option
  */
  public itinararyDoc: any;
  fileUpload(event) {
    this.itinararyDoc = '';
    let allowedExtensions = /(\.PDF|\.pdf)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;

    this.getControl('fileControl').markAsTouched();
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type .pdf only.');
      event.target.value = "";
      this.itinararyDoc = '';
      this.getControl('fileControl').reset();
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 15MB.');
      event.target.value = "";
      this.itinararyDoc = '';
      this.getControl('fileControl').reset();
      return false;
    }
    else {
      this.itinararyDoc = file;
    }
  }



}
