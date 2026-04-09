import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { saveAs } from "file-saver";
import { GetSetStorageService } from '../core/services/get-set-storage.service';

@Injectable({
  providedIn: 'root'
})

export class CandidateService {
  constructor(private _http: HttpClient,
    private _storage: GetSetStorageService,
    ) {
   }
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  /** get candidate id is a method to get candidate unique id for api  */
  getCandidateIdServ(): string | null {
    return this._storage.getCandidateId();
  }
    /**
   * Get Education Details for Candidate
   */

  getAddedEducationDetails() {
    return this._http.get(environment.apiMainUrlNet + `Candidate/EducationDetails?Candidateid=${this.getCandidateIdServ()}`, this.httpOptions);
  }
  SendOTPtoCandidate(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/SendOTPtoCandidate?cid=${cid}`;
    return this._http.post<any>(url, null, this.httpOptions);
  }

  CandidateSubmitOtp(param: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/CandidateSubmitOtp?${param}`;
    return this._http.post<any>(url, null, this.httpOptions);
  }
  /***
   * get Candidate Details
   */
  getCandidateInfo(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/getCandidateDetails?cid=${cid}`;
    return this._http.get<any>(url, this.httpOptions);
  }
  /**
   * upload Candidate Documents
   * @param formData 
   * @returns 
   */
  uploadDocuments(formData: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/Documents`;
    return this._http.post<any>(url, formData);
  }

  uploadDocumentsBulk(formData: any): Observable<any> {
    formData.append('Candidateid', this.getCandidateIdServ());
    let url: string = `${environment.apiMainUrlNet}Candidate/documentsMulti`;
    return this._http.post<any>(url, formData);
  }

  deleteDocuments(docId: any): Observable<any> { 
    let url: string = `${environment.apiMainUrlNet}Candidate/Documents?docId=${docId}&Candidateid=${this.getCandidateIdServ()}`;
    return this._http.delete<any>(url, this.httpOptions);
  }
  /**
   *get   Candidate Documents
   * @returns 
   */
  getCanddiateDocumentList(candidateId:string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/getCanddiateDocumentList?Candidateid=${candidateId ? candidateId : ''}`;
    return this._http.get<any>(url, this.httpOptions);
  }
  /**
   *get   Candidate Documents
   * @returns  
   */
  updatePersonalDetails(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/updatePersonalDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
  *get   Candidate Documents
  * @returns 
  */
  getCandidatePersonalDetails(candidateId): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/getCandidatePersonalDetails?Candidateid=${candidateId ? candidateId : ''}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /**
   *updateAddress
   * @returns 
   */
  updateAddress(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/updateAddress`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
  * update Candidate salary
  * @returns 
  */
  updateSalaryDetails(body: any): Observable<any> {
    body['Candidateid'] =  this.getCandidateIdServ();
    let url: string = `${environment.apiMainUrlNet}Candidate/updateSalaryDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  /**
  *get   Candidate Documents
  * @returns 
  */
  getCandidateSalaryDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/getSalaryDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /****************
 *get educational details
 * ***********/
  getEducationDetails(candidateId:string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Candidate/EducationDetails?Candidateid=${candidateId ? candidateId : ''}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *post educational details
  * ***********/
  postEducationDetails(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post(`${environment.apiMainUrlNet}Candidate/EducationDetails`, data, httpOptions);
  }

  /**update educational details */
  updateEducationalDetails(id: number, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/EducationDetails?id=${id}`, data, httpOptions);
  }

  /**delete educational details */
  deleteEducationalDetails(id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.delete<any>(`${environment.apiMainUrlNet}Candidate/EducationDetails?id=${id}&Candidateid=${this.getCandidateIdServ()}`, httpOptions);
  }

  /** get Employment Details */
  getEmploymentDetails(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Candidate/EmploymentDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }


  /***
   * add training
   */
  addTrainingDetails(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/TrainingDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  /***
  * add training
  */
  getTrainingDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/TrainingDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /***
  * update training
  */
  updateTrainingDetails(body: any, id: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/TrainingDetails?id=${id}`;
    return this._http.put<any>(url, body, this.httpOptions);
  }

  /***
  * update training
  */
  deleteTrainingDetails(id: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/TrainingDetails?id=${id}&Candidateid=${this.getCandidateIdServ()}`;
    return this._http.delete<any>(url, this.httpOptions);
  }
  /**add family details */
  addFamilyMemberDetails(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Candidate/FamilyDetails`, data, httpOptions);
  }

  /**update family details */
  updateFamilyMemberDetails(id: number, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/FamilyDetails?id=${id}`, data, httpOptions);
  }

  /**delete family details */
  deleteFamilyDetails(id: any): Observable<any> {
    let candidateId =this._storage.getCandidateId();
    let url: string = `${environment.apiMainUrlNet}/Candidate/FamilyDetails?id=${id}&Candidateid=${candidateId ? candidateId : ''}`;
    return this._http.delete<any>(url, this.httpOptions);
  }


  /**get getCandidateFamilyDetails */
  getCandidateFamilyDetails(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Candidate/FamilyDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**add employment details */
  addEmploymentDetails(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Candidate/EmploymentDetails`, data, httpOptions);
  }

  /**update Employment Details */
  updateEmploymentDetails(id: number, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/EmploymentDetails?id=${id}`, data, httpOptions);
  }

  /**delete employment details */
  deleteEmploymentDetails(id: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}/Candidate/EmploymentDetails?id=${id}&Candidateid=${this.getCandidateIdServ()}`;
    return this._http.delete<any>(url, this.httpOptions);
  }


  /***
  *  update other
  */
  updateOtherDetails(body: any): Observable<any> {
    body['Candidateid'] = this.getCandidateIdServ();
    let url: string = `${environment.apiMainUrlNet}Candidate/CandidateotherDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /***
  *  update referred Back details
  */
  updateReferredBackDetails(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/finalSubmitByCandidate?CandidateConsentEAF=${body?.CandidateConsentEAF}&Candidateid=${this.getCandidateIdServ()}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  /***
* get
*/
  getCandidateotherDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/CandidateotherDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  getCandidateQuestionireDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/getCandidateQuestionireDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  getCandidateReferenceDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/getCandidateReferenceDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  getScreenDetails(): Observable<any> {
    let candidateId =this._storage.getCandidateId();
    let url: string = `${environment.apiMainUrlNet}Candidate/getScreenDetails?Candidateid=${candidateId ? candidateId : ''}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /**update Questionare Details */
  updateQuestionareDetails(id: number, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/updateCandidateQuestionireDetails?id=${id}`, data, httpOptions);
  }

  /**update professional references Details */
  updateProfRefDetails(id: number, data: any): Observable<any> {
   
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/updateCandidateReferenceDetails?Candidateid=${this.getCandidateIdServ()}&id=${id}`, data, httpOptions);
  }
  /**
   * getOnboardingFormDetails
   * @returns 
   */
  getOnboardingFormDetails(formType: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/getOnboardingFormDetails?formType=${formType}&Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /**update other info Details */
  updateOtherInfoDetails(data: any): Observable<any> {
    data['Candidateid'] = this.getCandidateIdServ();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/updateCandidateotherInfo`, data, httpOptions);
  }

  /**save candidate onboarding form sign */
  SaveCandidateSignature(data: any): Observable<any> {
    data['Candidateid'] = this.getCandidateIdServ();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Candidate/SaveCandidateSignature`, data, httpOptions);
  }
  
  /**get candidate onboarding form sign */
  getCandidateSignature(candidate:string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}Candidate/getCandidateSignature?Candidateid=${this.getCandidateIdServ()}`, httpOptions);
  }

  /**update pending doc declaratin form */
  updateUndertakingPendingDocForm(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/updateUndertakingPendingDocForm`, data, httpOptions);
  }

  /**delete pending doc reccord */
  // DeleteUndertakingPendingDoc(id: any): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}Candidate/DeleteUndertakingPendingDoc?Id=${id}`;
  //   return this._http.delete<any>(url, this.httpOptions);
  // }
  DeleteUndertakingPendingDoc(id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.delete<any>(`${environment.apiMainUrlNet}Candidate/DeleteUndertakingPendingDoc?Id=${id}&Candidateid=${this.getCandidateIdServ()}`, httpOptions);
  }

  /**update current address declaratin form */
  updateUndertakingCurrentAddressProofForm(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/updateUndertakingCurrentAddressProofForm`, data, httpOptions);
  }

  /**update joining report form */
  updateJoiningForm(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/updateJoiningForm`, data, httpOptions);
  }

  /**update updateAccesscardForm form */
  updateAccesscardForm(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/updateAccesscardForm`, data, httpOptions);
  }

  /**update updatePersonalDetailsForm form */
  updatePersonalDetailsForm(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/updatePersonalDetailsForm`, data, httpOptions);
  }

  /**get onboarding form details */
  getOnboardingFormDetailsById(id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}Candidate/getOnboardingFormDetails?formType=0&formId=${id}&Candidateid=${this.getCandidateIdServ()}`, httpOptions);
  }

  /**post upload govt form */

  formUpload(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/formUpload`;
    return this._http.post<any>(url, data);
  }

  //upload/update appointment letter
  uploadAppointmentLetter(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/UpdateAppoimentLetter`;
    return this._http.post<any>(url, data);
  }

  //upload pending document 
  SaveOrSubmitPendingDocument(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/SaveOrSubmitPendingDocument`;
    return this._http.post<any>(url, data);
  }

  /**update sodexo form */
  UpdateSudexoForm(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/UpdateSudexoForm`, data, httpOptions);
  }

  /**submit final onboarding form details */
  SubmitOnboardFormByCandidate(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/SubmitOnboardFormByCandidate?Consent=${data?.consent}&Candidateid=${this.getCandidateIdServ()}`, httpOptions);
  }

  /**submit final day 1 form details */
  SubmitDay1FormByCandidate(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/SubmitDay1FormByCandidate?Consent=${data?.consent}&Candidateid=${this.getCandidateIdServ()}`, httpOptions);
  }

  /**
   * 
   *  common download
   *
   *  
   */
  downloadFile(path: string, name: string) {
    this._http.get(`${environment.apiMainUrlNet}Candidate/Downloadfiles?filePath=${path}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, name);
      }
    )
  }
  //new 
  downloadSignature(id:number,name:string){
    let signType= 'C'
    this._http.get(`${environment.apiMainUrlNet}Candidate/downloadSignature?id=${id}&signType=${signType}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res,name);
      }
    )
  }


  /**update current address declaratin form */
  AddUpdateDay1Sign(data: any): Observable<any> {
    data['Candidateid'] = this._storage.getCandidateId();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${environment.apiMainUrlNet}Candidate/AddUpdateDay1Sign`, data, httpOptions);
  }

  /**
  *get   Candidate previous company details
  * @returns 
  */
  getCandidatePreviousEmploymentDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/CandidatePreviousEmploymentDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  declarationSubmit(body:any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/DeclarationSubmit`;
    return this._http.post<any>(url,body, this.httpOptions);
  }

  /**
   *get   Candidate Documents
   * @returns 
   */
  updatePersonalDetailsForBGV(body: any): Observable<any> {
    body['Candidateid'] =  this.getCandidateIdServ();
    let url: string = `${environment.apiMainUrlNet}Candidate/AddUpdateBGVPersonalDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
   *CurrentAddressDetailsForBGV
   * @returns 
   */
  updateCurrentAddressDetailsForBGV(body: any): Observable<any> {
    body['Candidateid'] =  this.getCandidateIdServ();
    let url: string = `${environment.apiMainUrlNet}Candidate/AddUpdateBGVCurrentAddress`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
   *highest education details update
   * @returns 
   */
  updateHighestEducationDetailsForBGV(body: any): Observable<any> {
    body['Candidateid'] =  this.getCandidateIdServ();
    let url: string = `${environment.apiMainUrlNet}Candidate/AddUpdateBGVEducationalDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
   *CrcDetailsForBGV
   * @returns 
   */
  updateCrcDetailsForBGV(body: any): Observable<any> {
    body['Candidateid'] =  this.getCandidateIdServ();
    let url: string = `${environment.apiMainUrlNet}Candidate/AddUpdateBGVCRCDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

   /**
  *get   Candidate bgv Details
  * @returns 
  */
  GetCandidateDetailsBGVDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/GetCandidateDetailsBGVDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }

   /**
  *get   Candidate bgv personal info Details
  * @returns 
  */
  GetBGVPersonalDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/GetBGVPersonalDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }

   /**
  *get   Candidate bgv current address Details
  * @returns 
  */
  GetCandidateBGVCurrentAddress(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/GetCandidateBGVCurrentAddress?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }
   /**
  *get   Candidate bgv CRC Details
  * @returns 
  */
  GetBGVCRCDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/GetBGVCRCDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }

   /**
  *get   Candidate bgv highest education Details
  * @returns 
  */
  GetBGVEducationDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/GetBGVEducationDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }
  /** get BGV Employment Details */
  GetBGVEmploymentDetails(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Candidate/GetBGVEmploymentDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /**get GetBGVFilePaths  */
   GetBGVFilePaths(DocumentTypeId: string, OrgId:number=null): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Candidate/GetBGVFilePaths?DocumentTypeId=${DocumentTypeId}&Candidateid=${this.getCandidateIdServ()}`;
    if (OrgId) {
      canUrl += `&OrgId=${OrgId}`;
    }
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /**add bgv employment details */
  AddUpdateBGVEmploymentDetails(data: any): Observable<any> {
    // data.append('Candidateid', this.getCandidateIdServ());
    data['Candidateid'] =  this.getCandidateIdServ();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Candidate/AddUpdateBGVEmploymentDetails`, data, httpOptions);
  }
   /**
  *get   Candidate bgv global db check Details
  * @returns 
  */
  GetBGVGlobalDBCheck(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/GetBGVGlobalDBCheck?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }
  /**
   *global db check details update
   * @returns 
   */
  AddUpdateBGVGlobalDBCheck(body: any): Observable<any> {
    body['Candidateid'] =  this.getCandidateIdServ();
    let url: string = `${environment.apiMainUrlNet}Candidate/AddUpdateBGVGlobalDBCheck`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
/**
   *OFAC check details update
   * @returns 
   */
  AddUpdateBGVOFACDetails(body: any): Observable<any> {
    body['Candidateid'] =  this.getCandidateIdServ();
    let url: string = `${environment.apiMainUrlNet}Candidate/AddUpdateBGVOFACDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
     /**
  *get   Candidate bgv global db check Details
  * @returns 
  */
  GetBGVOFACDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/GetBGVOFACDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }
   /**
  *get   LOA Details
  * @returns 
  */
  GetBGVLOADetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/GetBGVLOADetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /***
  *  Save LOA
  */
  SaveBGVLetterofAuthorization(body: any): Observable<any> {
    body['Candidateid'] =  this.getCandidateIdServ();
    let url: string = `${environment.apiMainUrlNet}Candidate/SaveBGVLetterofAuthorization`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  getBGVScreenDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/getBGVScreenDetails?Candidateid=${this.getCandidateIdServ()}`;
    return this._http.get<any>(url, this.httpOptions);
  }
  /***
  *  Final submit BGV form details
  */
   FinalBGVSubmitByCandidate(body:any): Observable<any> {
    body['Candidateid'] =  this.getCandidateIdServ();
    let url: string = `${environment.apiMainUrlNet}Candidate/FinalBGVSubmitByCandidate`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

}


