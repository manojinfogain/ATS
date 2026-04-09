import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { saveAs } from "file-saver";

@Injectable({
  providedIn: 'root'
})
export class LibCandidateService {
  constructor(private _http: HttpClient) { }
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  SendOTPtoCandidate(apiBaseUrl: string, cid: number): Observable<any> {
    let url: string = `${apiBaseUrl}/?cid=${cid}`;
    return this._http.post<any>(url, null, this.httpOptions);
  }

  CandidateSubmitOtp(apiBaseUrl: string, param: string): Observable<any> {
    let url: string = `${apiBaseUrl}/CandidateSubmitOtp?${param}`;
    return this._http.post<any>(url, null, this.httpOptions);
  }

  getCandidateInfo(apiBaseUrl: string, cid: number): Observable<any> {
    let url: string = `${apiBaseUrl}/getCandidateDetails?cid=${cid}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  uploadDocuments(apiBaseUrl: string, formData: any): Observable<any> {
    let url: string = `${apiBaseUrl}/Documents`;
    return this._http.post<any>(url, formData);
  }

  uploadDocumentsBulk(apiBaseUrl: string, formData: any): Observable<any> {
    let url: string = `${apiBaseUrl}/documentsMulti`;
    return this._http.post<any>(url, formData);
  }

  deleteDocuments(apiBaseUrl: string, docId: any): Observable<any> {
    let url: string = `${apiBaseUrl}/Documents?docId=${docId}`;
    return this._http.delete<any>(url, this.httpOptions);
  }

  getCanddiateDocumentList(apiBaseUrl: string): Observable<any> {
    let url: string = `${apiBaseUrl}/getCanddiateDocumentList`;
    return this._http.get<any>(url, this.httpOptions);
  }

  updatePersonalDetails(apiBaseUrl: string, body: any): Observable<any> {
    let url: string = `${apiBaseUrl}/updatePersonalDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  getCandidatePersonalDetails(apiBaseUrl: string): Observable<any> {
    let url: string = `${apiBaseUrl}/getCandidatePersonalDetails`;
    return this._http.get<any>(url, this.httpOptions);
  }

  updateAddress(apiBaseUrl: string, body: any): Observable<any> {
    let url: string = `${apiBaseUrl}/updateAddress`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  updateSalaryDetails(apiBaseUrl: string, body: any): Observable<any> {
    let url: string = `${apiBaseUrl}/updateSalaryDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  getCandidateSalaryDetails(apiBaseUrl: string): Observable<any> {
    let url: string = `${apiBaseUrl}/getSalaryDetails`;
    return this._http.get<any>(url, this.httpOptions);
  }

  getEducationDetails(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/EducationDetails`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  postEducationDetails(apiBaseUrl: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post(`${apiBaseUrl}/EducationDetails`, data, httpOptions);
  }

  updateEducationalDetails(apiBaseUrl: string, id: number, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/EducationDetails?id=${id}`, data, httpOptions);
  }

  deleteEducationalDetails(apiBaseUrl: string, id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.delete<any>(`${apiBaseUrl}/EducationDetails?id=${id}`, httpOptions);
  }

  getEmploymentDetails(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/EmploymentDetails`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  addTrainingDetails(apiBaseUrl: string, body: any): Observable<any> {
    let url: string = `${apiBaseUrl}/TrainingDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  getTrainingDetails(apiBaseUrl: string): Observable<any> {
    let url: string = `${apiBaseUrl}/TrainingDetails`;
    return this._http.get<any>(url, this.httpOptions);
  }

  updateTrainingDetails(apiBaseUrl: string, body: any, id: number): Observable<any> {
    let url: string = `${apiBaseUrl}/TrainingDetails?id=${id}`;
    return this._http.put<any>(url, body, this.httpOptions);
  }

  deleteTrainingDetails(apiBaseUrl: string, id: number): Observable<any> {
    let url: string = `${apiBaseUrl}/TrainingDetails?id=${id}`;
    return this._http.delete<any>(url, this.httpOptions);
  }

  addFamilyMemberDetails(apiBaseUrl: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${apiBaseUrl}/FamilyDetails`, data, httpOptions);
  }

  updateFamilyMemberDetails(apiBaseUrl: string, id: number, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/FamilyDetails?id=${id}`, data, httpOptions);
  }

  deleteFamilyDetails(apiBaseUrl: string, id: any): Observable<any> {
    let url: string = `${apiBaseUrl}/FamilyDetails?id=${id}`;
    return this._http.delete<any>(url, this.httpOptions);
  }

  getCandidateFamilyDetails(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/FamilyDetails`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  addEmploymentDetails(apiBaseUrl: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${apiBaseUrl}/EmploymentDetails`, data, httpOptions);
  }

  updateEmploymentDetails(apiBaseUrl: string, id: number, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/EmploymentDetails?id=${id}`, data, httpOptions);
  }

  deleteEmploymentDetails(apiBaseUrl: string, id: any): Observable<any> {
    let url: string = `${apiBaseUrl}/EmploymentDetails?id=${id}`;
    return this._http.delete<any>(url, this.httpOptions);
  }

  updateOtherDetails(apiBaseUrl: string, body: any): Observable<any> {
    let url: string = `${apiBaseUrl}/CandidateotherDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  updateReferredBackDetails(apiBaseUrl: string, body: any): Observable<any> {
    let url: string = `${apiBaseUrl}/finalSubmitByCandidate?CandidateConsentEAF=${body?.CandidateConsentEAF}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  getCandidateotherDetails(apiBaseUrl: string): Observable<any> {
    let url: string = `${apiBaseUrl}/CandidateotherDetails`;
    return this._http.get<any>(url, this.httpOptions);
  }

  getCandidateQuestionireDetails(apiBaseUrl: string): Observable<any> {
    let url: string = `${apiBaseUrl}/getCandidateQuestionireDetails`;
    return this._http.get<any>(url, this.httpOptions);
  }

  getCandidateReferenceDetails(apiBaseUrl: string): Observable<any> {
    let url: string = `${apiBaseUrl}/getCandidateReferenceDetails`;
    return this._http.get<any>(url, this.httpOptions);
  }

  getScreenDetails(apiBaseUrl: string): Observable<any> {
    let url: string = `${apiBaseUrl}/getScreenDetails`;
    return this._http.get<any>(url, this.httpOptions);
  }

  updateQuestionareDetails(apiBaseUrl: string, id: number, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/updateCandidateQuestionireDetails?id=${id}`, data, httpOptions);
  }

  updateProfRefDetails(apiBaseUrl: string, id: number, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/updateCandidateReferenceDetails?id=${id}`, data, httpOptions);
  }

  getOnboardingFormDetails(apiBaseUrl: string, formType: number): Observable<any> {
    let url: string = `${apiBaseUrl}/getOnboardingFormDetails?formType=${formType}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  updateOtherInfoDetails(apiBaseUrl: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/updateCandidateotherInfo`, data, httpOptions);
  }

  SaveCandidateSignature(apiBaseUrl: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${apiBaseUrl}/SaveCandidateSignature`, data, httpOptions);
  }

  getCandidateSignature(apiBaseUrl: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${apiBaseUrl}/getCandidateSignature`, httpOptions);
  }

  updateUndertakingPendingDocForm(apiBaseUrl: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/updateUndertakingPendingDocForm`, data, httpOptions);
  }

  DeleteUndertakingPendingDoc(apiBaseUrl: string, id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.delete<any>(`${apiBaseUrl}/DeleteUndertakingPendingDoc?Id=${id}`, httpOptions);
  }

  updateUndertakingCurrentAddressProofForm(apiBaseUrl: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/updateUndertakingCurrentAddressProofForm`, data, httpOptions);
  }

  updateJoiningForm(apiBaseUrl: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/updateJoiningForm`, data, httpOptions);
  }

  updateAccesscardForm(apiBaseUrl: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/updateAccesscardForm`, data, httpOptions);
  }

  updatePersonalDetailsForm(apiBaseUrl: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/updatePersonalDetailsForm`, data, httpOptions);
  }

  getOnboardingFormDetailsById(apiBaseUrl: string, id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${apiBaseUrl}/getOnboardingFormDetails?formType=0&formId=${id}`, httpOptions);
  }

  formUpload(apiBaseUrl: string, data: any): Observable<any> {
    let url: string = `${apiBaseUrl}/formUpload`;
    return this._http.post<any>(url, data);
  }

  uploadAppointmentLetter(apiBaseUrl: string, data: any): Observable<any> {
    let url: string = `${apiBaseUrl}/UpdateAppoimentLetter`;
    return this._http.post<any>(url, data);
  }

  SaveOrSubmitPendingDocument(apiBaseUrl: string, data: any): Observable<any> {
    let url: string = `${apiBaseUrl}/SaveOrSubmitPendingDocument`;
    return this._http.post<any>(url, data);
  }

  UpdateSudexoForm(apiBaseUrl: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/UpdateSudexoForm`, data, httpOptions);
  }

  SubmitOnboardFormByCandidate(apiBaseUrl: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/SubmitOnboardFormByCandidate?Consent=${data?.consent}`, httpOptions);
  }

  SubmitDay1FormByCandidate(apiBaseUrl: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/SubmitDay1FormByCandidate?Consent=${data?.consent}`, httpOptions);
  }

  downloadFile(apiBaseUrl: string, path: string, name: string) {
    this._http.get(`${apiBaseUrl}/Downloadfiles?filePath=${path}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, name);
      }
    )
  }

  AddUpdateDay1Sign(apiBaseUrl: string, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.put<any>(`${apiBaseUrl}/AddUpdateDay1Sign`, data, httpOptions);
  }

  getCandidatePreviousEmploymentDetails(apiBaseUrl: string): Observable<any> {
    let url: string = `${apiBaseUrl}/CandidatePreviousEmploymentDetails`;
    return this._http.get<any>(url, this.httpOptions);
  }
}