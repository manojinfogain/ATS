import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../../candidate.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ONB_FILE_UPLOAD } from '../../../core/constant/common.const';
import { ShareService } from '../../../core/services/share.service';
import { GlobalMethod } from '../../../core/common/global-method';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from "file-saver";
import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
@Component({
  selector: 'app-appointment-letter-consent',
  templateUrl: './appointment-letter-consent.component.html',
  styleUrls: ['./appointment-letter-consent.component.scss']
})
export class AppointmentLetterConsentComponent implements OnInit {
  // displayedColumns = ['Name', 'status', 'action'];
  public appointmentLetterForm: UntypedFormGroup = new UntypedFormGroup({});
  public onBoardCandidateList: any = []
  public onBoardOppointment: any = []
  public data: any = []
  private candidateId =  this._storage.getCandidateId();
  constructor(
    public dialog: MatDialog,
    private _candidateServe: CandidateService,
    private _share: ShareService,
    private _fb: UntypedFormBuilder,
    private _commonMethodServe: GlobalCommonMethodService,
    private _http: HttpClient,
    private _storage: GetSetStorageService
  ) { }
  public candidatePersonalDetails: any = [];
  ngOnInit(): void {
    this.getCandidatePersonalDetails();
    this.getOnboardingFormDetails();
    this.formInit();
  }

  //init form
  formInit() {
    this.appointmentLetterForm = this._fb.group({
      iConfirmedCheckBox: [null, [Validators.required]],
      uploadForm: [null, [Validators.required]],
    })
  }

  //get onboarding form details
  getOnboardingFormDetails() {
    this._candidateServe.getOnboardingFormDetails(2).subscribe(
      res => {
        this.onBoardOppointment = res['data']
        // this.getIndividualFormStatus();
      }
    )
  }

  /**candidate personal data */
  getCandidatePersonalDetails() {
    this._candidateServe.getCandidatePersonalDetails(this.candidateId).subscribe(
      res => {
        this.candidatePersonalDetails = res['data'][0];
      }
    )
  }
  /***
   * download appointment letter 
   */
  downloadDocuments(elm: any) {
    let today = new Date();
    let todayDate = GlobalMethod.formatDate(today);
    this._http.get(`${environment.apiMainUrlNet}Candidate/DownloadAppoinmentLetter?Candidateid=${this.candidatePersonalDetails?.candidateId}`, { responseType: 'blob' }).subscribe(
      res => {
        
        saveAs(res, 'Appointment-Letter');
        setTimeout(() => {
          this._share.showAlertSuccessMessage.next('File downloaded successfully.')
        }, 1000);
      }
    )
  }

  //get control name
  getControl(name: string) {
    return this.appointmentLetterForm.get(name);
  }

  public anyFormRef: string = 'N';
  public referredBackForms = [];
  public pendingForms = [];
  public uploadForm: any;
  // public base64File: any;
  fileUpload(event) {
    this.uploadForm = '';
    let allowedExtensions = /(\.doc|\.DOC|\.dot|\.DOT|\.PDF|\.pdf|\.DOCX|\.docx|\.xlsx)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;
    this.getControl('uploadForm').markAsTouched();
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type .doc\.DOC\.dot\.DOT\.PDF\.pdf\.DOCX\.docx\.xlsx only.');
      event.target.value = "";
      this.uploadForm = '';
      return false;
    }
    else if (file.size > ONB_FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 5MB.');
      event.target.value = "";
      this.uploadForm = '';
      return false;
    }
    else {
      this.uploadForm = file;
      //
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const blob = this._commonMethodServe.base64toBlob(reader.result);
      }
    }
  }

  /**reset form */
  resetFrom() {
    this.getControl('iConfirmedCheckBox').reset();
    this.getControl('uploadForm').reset();
  }

  /***
  * submit submit Appointment Letter Form
  */
  submitAppointmentLetterForm(form: any) {
    form.markAllAsTouched();
    if (this.appointmentLetterForm.valid) {
      let body = new FormData();
      if (this.candidatePersonalDetails?.cid) {
        body.append('cid', this.candidatePersonalDetails?.cid);
      }
      body.append('ConcentSignOff', '1');
      if (this.uploadForm) {
        body.append('file', this.uploadForm);
      }
      this._candidateServe.uploadAppointmentLetter(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.appointmentLetterForm.reset();
        }
      );
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill the required fields.');
    }
  }
}
