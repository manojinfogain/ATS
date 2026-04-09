import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NaukriService {

  constructor(private _http: HttpClient) { }
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  getWorkModes(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Naukri/GetWorkModes`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  getSalaryCurrency(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Naukri/GetSalaryCurrency`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }
  getEmploymentType(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Naukri/GetEmploymentType`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }
  getQualificationsCourseType(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Naukri/GetQualificationsCourseType`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getQualificationsByCourseType(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Naukri/GetQualificationsByCauseType`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  /**
 * Add or update a job posting on Naukri
 * @param data - The job data to be submitted to Naukri
 * @returns Observable containing the API response
 */
  AddUpdateJobOnNaukri(data: any): Observable<any> {
    const url = `${environment.apiMainUrlNet}/Naukri/AddUpdateJobOnNaukri`;
    return this._http.post<any>(url, data, this.httpOptions);
  }

  /**
 * Get posted job details by job ID
 * @param jobId The ID of the posted job
 * @returns Observable containing the job details
 */
  getPostedJobDetailsById(jobId: any): Observable<any> {
    const url = `${environment.apiMainUrlNet}/Naukri/GetPostedJobDetailsbyId?jobId=${jobId}`;
    return this._http.get<any>(url, this.httpOptions);
  }

    /**
   * Get job details from Naukri
   * @param jobId The ID of the job to retrieve details for
   * @returns Observable containing the job details
   */
  getJobDetails(jobId: any): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Naukri/GetJobDetails?JobId=${jobId}`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  /**
   * Unpublish a job on Naukri
   * @param jobId The ID of the job to unpublish
   * @returns Observable containing the API response
   */
  unpublishJob(jobId: string): Observable<any> {
    const url = `${environment.apiMainUrlNet}/Naukri/UnpublishJob?JobId=${jobId}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  /**
 * Refresh a job on Naukri
 * @param jobId The ID of the job to refresh
 * @returns Observable containing the API response
 */
  refreshJob(jobId: string): Observable<any> {
    const url = `${environment.apiMainUrlNet}/Naukri/RefreshJob?JobId=${jobId}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  /**
   * Get posted locations for Naukri
   * @returns Observable containing the list of joining locations
   */
  getPostedLocationsForNaukri(): Observable<any> {
    const url = `${environment.apiMainUrlNet}/Naukri/GetPostedLocationsForNaukri`;
    return this._http.get<any>(url);
  }

  /**
   * Get organization list for Naukri
   * @returns Observable containing the list of organizations
   */
  getOrganizationForNaukri(): Observable<any> {
    const url = `${environment.apiMainUrlNet}/Naukri/GetOrganizationForNaukri`;
    return this._http.get<any>(url);
  }
  getIndustryList(): Observable<any> {
    const url = `${environment.apiMainUrlNet}/Naukri/GetIndustries`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /**
   * Get applicant details by applicant ID from Naukri
   * @param applicantId The ID of the applicant
   * @returns Observable containing the applicant details
   */
  getApplicantDetailsById(applicantId: string | number): Observable<any> {
    const url = `${environment.apiMainUrlNet}/Naukri/GetApplicantDetailsById?Id=${applicantId}`;
    return this._http.get<any>(url, this.httpOptions);
  }
}