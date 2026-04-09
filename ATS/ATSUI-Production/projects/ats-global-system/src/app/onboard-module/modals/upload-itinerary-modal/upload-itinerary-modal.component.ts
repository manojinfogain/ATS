import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { FILE_UPLOAD } from '../../../core/constant/common.const';
import { GlobalApisService } from '../../../core/services/global-apis.service';
import { OnboardService } from '../../onboard.service';
import { saveAs } from "file-saver"; import { environment } from 'projects/ats-global-system/src/environments/environment';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';

@Component({
  selector: 'app-upload-itinerary-modal',
  templateUrl: './upload-itinerary-modal.component.html',
  styleUrls: ['./upload-itinerary-modal.component.scss']
})
export class UploadItineraryModalComponent implements OnInit {
  public uploadItineraryForm: UntypedFormGroup = new UntypedFormGroup({});
  public declineCategoryList: any;
  constructor(
    public dialogRef: MatDialogRef<UploadItineraryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _onBoardServe: OnboardService,
    private _globalApiServe: GlobalApisService,
    private http: HttpClient,
    private _globalCom:GlobalCommonMethodService
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.getDivisionList();
    this.getLocation();
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
        } else {
          ids = [1, 2, 4, 5];
        }
        let filterLocation = res['data'].filter(loc => {
          return ids.indexOf(loc.LocID) !== -1;
        })
        this.locationList = filterLocation;
      }
    );
  }


  //formInit
  formInit() {
    this.uploadItineraryForm = this._fb.group({
      divisionId: [null, [Validators.required]],
      locationId: [null, [Validators.required]],
      fileControl: [null, [Validators.required]]
    })
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


  /**
   * api
   *  
   */
  apiCallOnSubmit(body: any) {
    this._onBoardServe.uploadOnboardFormDocuments(body).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      }
    )
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

  // view/download itinerary document based on location & division
  viewItineraryDoc(form: UntypedFormGroup) {
    debugger
    form['controls']['divisionId'].markAsTouched();
    form['controls']['locationId'].markAsTouched();
    let formData = form.value;
    if (form['controls']['divisionId'].valid && form['controls']['locationId'].valid) {
      let body = {};
      body['formId'] = 26;
      if (formData['locationId']) {
        body['joiningLocation'] = formData['locationId'];
      }
      if (formData['divisionId']) {
        body['divisionId'] = formData['divisionId'];
      }

      
      this._onBoardServe.GetOnboardFormDocuments(body).subscribe(
        res => {
          let itineraryObj = res['data'][0];
          let docName = this._globalCom.removeLastExtension(itineraryObj?.documentsName);
          debugger
          if (itineraryObj?.fullPath) {
            this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${itineraryObj?.fullPath}`, { responseType: 'blob' }).subscribe(
              res => {
                saveAs(res,docName);
                setTimeout(() => {
                  this._share.showAlertSuccessMessage.next('File downloaded successfully.')
                }, 1000);
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
      if (!form['controls']['locationId'].valid) {
        this._share.showAlertErrorMessage.next('Please select Location.');
      }
    }
  }

  /***/

  closeModal(): void {
    this.dialogRef.close();
  }

}

