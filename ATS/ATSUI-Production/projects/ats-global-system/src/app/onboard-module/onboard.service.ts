import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { SkipLoader } from 'projects/ats-global-system/src/app/core/interceptors/loader-interceptor';
import { GlobalMethod } from '../core/common/global-method';

@Injectable({
  providedIn: 'root'
})
export class OnboardService {

  constructor(private _http: HttpClient) { }
  public headerHttp = new HttpHeaders({
    'Content-Type': 'application/json',
    SkipLoader: ''
  })
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  getPipelineJoineeCandidateList(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OnBoard/GetPipelineJoineeCandidateList`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  /**
   * 
   * @param body 
   * @returns 
   */
  updateJoineeCandidateStatus(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/updateJoineeCandidateStatus`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  /**
   * 
   * @param body 
   * @returns 
   */
  addJoineeCandidateDetails(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/addJoineeCandidateDetailsByISS`;
    return this._http.post<any>(url, body, this.httpOptions);
  }


  /**
 * 
 * @param body 
 * @returns 
 */
  updateJoineeCandidateDetails(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/updateJoineeCandidateDetailsByISS`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  ResendDay1FormEmail(Candidateid: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OnBoard/ResendDay1DocToCandidate?Candidateid=${Candidateid}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  // sendOfferToBharti(cid: number): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}OnBoard/SenfOfferLetterMailer?cid=${cid}`;
  //   return this._http.post<any>(url, this.httpOptions);
  // }




  deleteJoineeCandidateDetails(Candidateid: number) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/DeleteJoineeCandidateDetailsByISS?Candidateid=${Candidateid}`;
    return this._http.delete<any>(url, this.httpOptions);
  }

  /***
   * get onboard Candidate List
   */

  getAllOnboardCandidateList(data: any): Observable<any> {
    return this._http.post<any>(`${environment.apiMainUrlNet}OnBoard/getAllOnboardCandidateList`, data, this.httpOptions);
  }
  /** getting all details of candidate here - family , education, training, employment, questionire, salary  */
  getCandidateAllDetails(Candidateid: string): Observable<any> {
    return this._http.get<any>(`${environment.apiMainUrlNet}OnBoard/getCandidateAllDetails?Candidateid=${Candidateid}`, this.httpOptions);
  }

  getCandidatePersonalDetails(Candidateid: string): Observable<any> {
    return this._http.get<any>(`${environment.apiMainUrlNet}OnBoard/getCandidatePersonalDetails?Candidateid=${Candidateid}`, this.httpOptions);
  }

  /**
  *get   Candidate Documents
  * @returns 
  */
  getCanddiateDocumentList(Candidateid: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OnBoard/getCandidateDocumentList?Candidateid=${Candidateid}`;
    return this._http.get<any>(url, this.httpOptions);
  }


  /**
 * 
 * @param body 
 * @returns 
 */
  verificationOnboardingByRecHr(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/verificationOnboardingByRecHr`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
 * 
 * verification of onboarding forms by formid
 */
  verificationOnboardingFormsByHr(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/OnboardingFormVerificationByFormId`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
* 
* @param body 
* @returns 
*/
  getVideoIdentityProfilePic(param: string) {
    let url: string = `${environment.apiMainUrlNet}Interview/GetVideoIdentityProfilePic?${param}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /***
   * get onboard Candidate ListFinalVerificationOnboardingByRecHr
   */

  getAllCandidatesForHRValidation(data: any): Observable<any> {
    return this._http.post<any>(`${environment.apiMainUrlNet}OnBoard/GetAllCandidatesForHRValidation`, data, this.httpOptions);
  }

  /**
* 
* @param body 
* @returns 
*/
  uploadPicVideoOnboard(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/uploadPicVideoOnboard`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  /**
* 
* @param body 
* @returns 
*/
  candidateIdentificationByHR(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/CandidateIdentificationByHR`;
    return this._http.post<any>(url, body);
  }

  AddEmployeeVideoMatchDetails(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/AddEmployeeVideoMatchDetails`;
    return this._http.post<any>(url, body);
  }
  /**
* 

 * 
 * @param body 
 * @returns 
 */
  sendEmailtoITTeamOnboardVideoResult(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/SendEmailtoITTeamOnboardVideoResult`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**SendEmailtoITTeamEmployeeVideoFail when video not match */
  SendEmailtoITTeamEmployeeVideoFail(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/SendEmailtoITTeamEmployeeVideoFail`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  /**
* 
* @param body 
* @returns 
*/
  checkVoiceImprint(body: any) {
    this.headerHttp[SkipLoader] = '';
    let url: string = `${environment.apiMainUrlNet}OnBoard/checkVoiceImprint`;
    return this._http.post<any>(url, body, { headers: this.headerHttp });
  }

  /**
* 
* @param body 
* @returns 
*/
  CheckVideoCompare(body: any) {
    this.headerHttp[SkipLoader] = '';
    let url: string = `${environment.apiMainUrlNet}OnBoard/CheckVideoCompare`;
    return this._http.post<any>(url, body);
  }

  /**
 * 
 * @param body 
 * @returns 
 */
  getVideoProfilePicOnboard(Candidateid: string) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/GetVideoProfilePicOnboard?Candidateid=${Candidateid}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /**
 * 
 * @param body 
 * @returns 
 */
  VerificationOnboardingCandidateDetails(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/VerificationOnboardingCandidateDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
 * 
 * @param body 
 * @returns 
 */
  directReferBackToCandidate(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/refferedbackToCandidateByRecruiter`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
 * 
 * @param body 
 * @returns 
 */
  sendOnboardDocToCandidate(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/sendOnboardDocToCandidate`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
* 
* @param body 
* @returns 
*/
  OnboardFormEnableDisable(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/OnboardFormEnableDisable`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
* 
* final submit employee id creation forms 
*/
  submitEmployeeIdCreationForm(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/CreateEmployeeId`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
 * 
 * @param body 
 * @returns 
 */
  getOnboardingFormDetails(Candidateid: string, formType: number) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/getOnboardingFormDetails?Candidateid=${Candidateid}&formType=${formType}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /**
 * 
 * @param body 
 * @returns 
 */
  GetOnboardingFormList(Candidateid: string, formType: number) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/GetOnboardingFormList?Candidateid=${Candidateid}&formType=${formType}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /**
* 
* final submit onboarding forms verification 
*/
  FinalVerificationOnboardingForm(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/FinalVerificationOnboardingForm`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
* 
* final submit onboarding forms verification 
*/
  finalVerificationDay1Form(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/FinalVerificationDay1Form`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
* 
* save and send appointment letter 
*/
  SaveAndSentAppoimentLetter(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/SaveAppoimentLetter`;
    return this._http.post<any>(url, body);
  }

  /**save HR form sign */
  SaveHRSignature(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}OnBoard/SaveSignatureInternalUser`, data, httpOptions);
  }

  /**get candidate onboarding form sign */
  getHRSignature(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}OnBoard/GetSignatureInternalUser`, httpOptions);
  }

  /**save HR sign  form id wise*/
  HrSignatureOnForms(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}OnBoard/HrSignatureOnForms`, data, httpOptions);
  }

  /**save Itinerary  form */
  uploadOnboardFormDocuments(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/uploadOnboardFormDocuments`;
    return this._http.post<any>(url, body);
  }

  /**get itinerary form */
  GetOnboardFormDocuments(body: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}OnBoard/GetOnboardFormDocuments?formId=${body.formId}&joiningLocation=${body.joiningLocation}&divisionId=${body.divisionId}&onboardingMode=${body.onboardingMode}`, httpOptions);
  }

  sendIdCardDetailsToAdmin(Candidateid: string) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/SendIdCardDetailsToAdmin?Candidateid=${Candidateid}`;
    return this._http.post<any>(url, null, this.httpOptions);
  }

  sendAccountDetailsLinkToCandidate(Candidateid: string) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/SendAccountDetailsLinkToCandidate?Candidateid=${Candidateid}`;
    return this._http.post<any>(url, null, this.httpOptions);
  }

  /**
* 
* verification of onboarding forms by formid
*/
  verifyPendingDocument(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/verifyPendingDocument`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
 * 
 * send offer letter to bharti
 */
  sendOfferToBharti(candidateId: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OnBoard/SenfOfferLetterMailer?Candidateid=${candidateId}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  /**get itinerary event list */
  GetJoiningItineraryList(locId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}OnBoard/GetJoiningItineraryList?LocationId=${locId}`, httpOptions);
  }
  /**
* 
* send SendAppoimentLetter to candidate
*/
  SendAppoimentLetter(candidateId: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OnBoard/SendAppoimentLetter?Candidateid=${candidateId}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  /***
   * get onboard Candidate List
   */

  GetOnboardCandidateVerificationReport(data: any): Observable<any> {
    return this._http.post<any>(`${environment.apiMainUrlNet}OnBoard/GetOnboardCandidateVerificationReport`, data, this.httpOptions);
  }


  /**get employee list to send invite based on location & doj */
  GetCandidateListByJoiningDate(locId: number, doj: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}OnBoard/GetCandidateListByJoiningDate?LocationId=${locId}&InviteDate=${doj}`, httpOptions);
  }

  /**
* 
*  submit send induction invite forms 
*/
  submitInductionInviteForm(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/AddUpdateDay1InductionInviteDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**get induction invite details based on location & doj */
  getInductionInviteDetails(locId: number, doj: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}OnBoard/GetDay1InductionInviteDetails?LocationId=${locId}&InviteDate=${doj}`, httpOptions);
  }

  /**get resend induction Invite based on location & doj */
  resendInductionInvite(body: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}OnBoard/ResendInvite?LocationId=${body?.locationId}&InviteDate=${body?.InviteDate}`, httpOptions);
  }

  /**get gender List */
  getPIMSGender(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}OnBoard/getPIMSGender`, httpOptions);
  }

  /**
* 
* change onboarding mode of candidate
*/
  updateCandidateOnboardingMode(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OnBoard/updateCandidateOnboardingMode?Candidateid=${data?.candidateId}&onboardingMode=${data?.onboardingMode}&ActionTakenBy=${data?.actionTakenBy ? data?.actionTakenBy : ''}&remarks=${data?.remarks ? data?.remarks : ''}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  /**Upload mandatory back papers OLA, IE, OA Itinerary  form */
  UploadJoiningMandateHRDocs(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/UploadJoiningMandateHRDocs`;
    return this._http.post<any>(url, body);
  }



  //Get candidates pending doc Report 
  getCandidateWisePendingDocReport(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}OnBoard/GetPendingDocReport`, data, httpOptions);
  }
  /** * Save BGV Consent by Recruiter
 * @param cid 
 * @returns Observable<any>cid: number, consent:number
 */
  SaveBGVConsentByRecruiter(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}BGV/SaveBGVConsentByRecruiter?Candidateid=${body?.Candidateid}&RecruiterConsentBGV=${body?.recConsent}`;
    return this._http.post<any>(url, null, this.httpOptions);
  }

  /** getting all bgv details of candidate here - family , education, training, employment, questionire, salary  */
  GetBGVCandidateDetailsByCid(candidateId: number): Observable<any> {
    return this._http.get<any>(`${environment.apiMainUrlNet}BGV/GetBGVCandidateDetailsByCid?Candidateid=${candidateId}`, this.httpOptions);
  }

  /**
   * Approve to send candidate details for BGV
   * @param action 
   * @param cid 
   * @returns Observable<any>
   */
  ApprovalToSendCandidateDetailsForBGV(consent: number, cid: number, candidateId: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}BGV/ApprovalToSendCandidateDetailsForBGV?HRConsentBGV=${consent}&cid=${cid}&Candidateid=${candidateId}`;
    return this._http.post<any>(url, null, this.httpOptions);
  }



  /**
 * 
 * @param body 
 * @returns 
 */
  mailersendDay1CandidateStatus(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/MailersendDay1CandidateStatus`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
   * Send Manual Pipeline Mail with Approval Document
   * @param formData - FormData containing candidates, date, location, and document
   * @returns Observable
   */
  sendManualPipelineMail(formData: FormData) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/SendMailerPipelineManual`;
    // Note: Don't include httpOptions for FormData, let browser set Content-Type with boundary
    return this._http.post<any>(url, formData);
  }

  /**
* 
* @param body 
* @returns 
*/
  UpdateCandidateJoiningStatus(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/UpdateCandidateJoiningStatus`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  ResendOnboardingFormMailer(cid: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OnBoard/ResendOnboardingFormMailer?cid=${cid}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  ResendEnableDisableOnboardingFormMailer(CandidateId: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OnBoard/ResendEnableDisableOnboardingFormMailer?Candidateid=${CandidateId}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /** getting list of all added leadership */
  getAllLeadershipOnboardCandidateListMethod(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}LeadershipOnboard/getAllLeadershipOnboardCandidateList`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  /**getting leadership full details */
  getLeadershipOnboardCandidatelDetailsMethod(candidateID: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}LeadershipOnboard/getLeadershipOnboardCandidatelDetails?candidateid=${candidateID}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /**addLeadership */
  addLeadership(formData: any, imgFile, reqData: any): Observable<any> {
    let url: string = environment.apiMainUrlNet + 'LeadershipOnboard/addupdateLeadershipCandidateDetails';
    let bodyFormData = new FormData();
    if (formData?.fName) {
      bodyFormData.append('FirstName', formData?.fName);
    }
    if (formData?.middleName) {
      bodyFormData.append('MiddleName', formData?.middleName);
    }
    if (formData?.lastName) {
      bodyFormData.append('LastName', formData?.lastName);
    }
    bodyFormData.append('CandidateSubmissionStatus', reqData?.actionType);
    if (formData?.phone) {
      bodyFormData.append('Mobileno', formData?.phone);
    }
    if (formData?.employeeEmail) {
      bodyFormData.append('Email', formData?.employeeEmail);
    }
    if (formData?.candidateGender) {
      bodyFormData.append('Gender', formData?.candidateGender);
    }
    if (formData?.candiDob) {
      bodyFormData.append('Dob', formData?.candiDob ? GlobalMethod.formatDate(formData?.candiDob) : '');
    }
    if (formData?.candidateHiringType) {
      bodyFormData.append('candidateHiringType', formData?.candidateHiringType);
    }

    if (formData?.qualification) {
      bodyFormData.append('eduQualification', formData?.qualification);
    }
    if (formData?.skills) {
      bodyFormData.append('SkillId', formData?.skills);
    }
    if (formData?.totalExp) {
      bodyFormData.append('TotalExp', formData?.totalExp);
    }
    if (formData?.totalExpMonth) {
      bodyFormData.append('TotalExpMonth', formData?.totalExpMonth);
    }
    if (formData?.totalRelExp) {
      bodyFormData.append('RelevantExp', formData?.totalRelExp);
    }
    if (formData?.totalRelExpMonth) {
      bodyFormData.append('RelevantExpMonth', formData?.totalRelExpMonth);
    }
    if (formData?.currCompany) {
      bodyFormData.append('currentOrg', formData?.currCompany);
    }
    ///
    if (formData?.tentativeJoinningDate) {
      bodyFormData.append('JoiningDate', formData?.tentativeJoinningDate ? GlobalMethod.formatDate(formData?.tentativeJoinningDate) : '');
    }
    if (formData?.CountryID) {
      bodyFormData.append('CountryId', formData?.CountryID);
    }
    if (formData?.CityID) {
      bodyFormData.append('CityId', formData?.CityID);
    }
    if (formData?.profileName) {
      bodyFormData.append('ProfileId', formData?.profileName);
    }
    if (formData?.candidateType) {
      bodyFormData.append('candidateTypeId', formData?.candidateType);
    }
    if (formData?.JoiningLocationID) {
      bodyFormData.append('JoiningLocationId', formData?.JoiningLocationID);
    }
    // if (formData?.remarks) {
    //   bodyFormData.append('remark', formData?.remarks);
    // }
    if (formData?.gradeId) {
      bodyFormData.append('GradeId', formData?.gradeId);
    }
    if (formData?.gradeBand) {
      bodyFormData.append('GradeBand', formData?.gradeBand);
    }
    if (formData?.designationId) {
      bodyFormData.append('DesignationId', formData?.designationId);
    }
    if (formData?.bgvPackageId) {
      bodyFormData.append('BgvPackageId', formData?.bgvPackageId);
    }

    if (imgFile) {
      bodyFormData.append('Resume', imgFile);
    }

    if (reqData?.video) {
      // bodyFormData.append('VideoFilePath', reqData?.canVidSrc);
      // bodyFormData.append('VideoFileName', reqData?.FileNameVideo);
      bodyFormData.append('VideoFile', reqData?.video);
      // bodyFormData.append('VideoFileSize', reqData?.fileSize);
      //bodyFormData['VideoFile'] = reqData?.canVidSrc;
      //   bodyFormData['VideoFileSize'] = reqData?.fileSize;
      bodyFormData.append('FileType', 'V');
    }

    if (reqData?.candidatePicture) {
      bodyFormData.append('ProfilePic', reqData?.candidatePicture);
      bodyFormData.append('FileType', 'P');
    }
    bodyFormData.append('CreatedOnUTC', GlobalMethod.convertToUTCDate(new Date()));
    bodyFormData.append('CreatedOnTimeZone', GlobalMethod.getTimezone());
    bodyFormData.append('CreatedOnTimeZoneOffset', GlobalMethod.getOffset().toString());

    if (reqData.type == 'E') {
      bodyFormData.append('CandidateId', reqData.CandidateId ? reqData.CandidateId : '');
      bodyFormData.append('LCid', reqData.CandidateLCid ? reqData.CandidateLCid : null);

    }
    if (formData?.rehireId) {
      bodyFormData.append('ReHireID', formData?.rehireId);
    }
    if (formData?.isConversion !== null && formData?.isConversion !== undefined) {
      bodyFormData.append('IsConversion', formData?.isConversion);
    }
    if (formData?.practiceId) {
      bodyFormData.append('PracticeID', formData?.practiceId);
    }
    if (formData?.deliveryUnitId) {
      bodyFormData.append('DeliveryUnitID', formData?.deliveryUnitId);
    }

    if (formData?.accountId) {
      bodyFormData.append('AccountID', formData?.accountId);
    }

    if (formData?.divisionId) {
      bodyFormData.append('DivisionID', formData?.divisionId);
    }
    if (formData?.currentAddress) {
      bodyFormData.append('Address', formData?.currentAddress);
    }
    debugger
    return this._http.post(url, bodyFormData);
  }
  /**upload offer letter and acceptance letter by recruiter */
  upploadOfferLeadership(formData: any): Observable<any> {
    let url: string = environment.apiMainUrlNet + 'LeadershipOnboard/UploadOfferDocuments';
    return this._http.post(url, formData);
  }

  /**DelegateRecruiterAuth */
  delegateRecruiterAuth(formData: any): Observable<any> {
    let url: string = environment.apiMainUrlNet + 'OnBoard/DelegateRecruiterAuth';
    return this._http.post(url, formData, this.httpOptions);
  }

  /**getting hr for delgate assignatiion */
  getHrListForDelegation(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Master/getOnboardSpocList`;
    return this._http.get<any>(url, this.httpOptions);
  }
  /**submit add delegator */
  addOnboarSpocDelegation(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}LeadershipOnboard/addOnboarSpocDelegation?DelegateTo=${data?.delegateHrId}&Candidateid=${data?.Candidateid}&Remarks=${data?.remarks ? data?.remarks : ''}`;
    return this._http.post<any>(url, this.httpOptions);
  }
  /**GetLeadership Pipeline Joinee CandidateList */
  GetLeadershipPipelineJoineeCandidateListApi(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}LeadershipOnboard/GetLeadershipPipelineJoineeCandidateList`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**upload Joining Itinerary leadership*/
  uploadJoiningItinerary(body: any) {
    let url: string = `${environment.apiMainUrlNet}LeadershipOnboard/uploadJoiningItinerary`;
    return this._http.post<any>(url, body);
  }

  /**getting ISS spocs list for delgate  */
  getIssSpocListDelegation(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Master/getISS_SpocList`;
    return this._http.get<any>(url, this.httpOptions);
  }
  /**submit iss delegator */
  addISSDelegationMethod(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}LeadershipOnboard/addISSDelegation?DelegateTo=${data?.issDelegateId}&Candidateid=${data?.Candidateid}&Remarks=${data?.remarks ? data?.remarks : ''}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  /***
  * ResendCredential
  */
  ResendCredential(candidateId: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}LeadershipOnboard/ResendCredential?candidateId=${candidateId}`;
    return this._http.post<any>(url, null, this.httpOptions);
  }

  /**
   * 
   * @param body 
   * @returns 
   */
  getPipelineConfirmCandidateListToday(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OnBoard/GetPipelineConfirmCandidateListToday`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**
   * 
   * @param body 
   * @returns 
   */
  UpdateCandidateJoiningStatusLeadership(body: any) {
    let url: string = `${environment.apiMainUrlNet}LeadershipOnboard/UpdateCandidateJoiningStatus`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  
   /**
 * 
 * @param body 
 * @returns 
 */
  GetPipelineCandidateListPending(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/GetPipelineCandidateListPending`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /** get dropout candidate api */
  GetdropoutCandidateReport(data: any): Observable<any> {
    return this._http.post<any>(`${environment.apiMainUrlNet}OnBoard/GetAllDropCanddiateList`, data, this.httpOptions);
  }

  updateRemarkByISSForLaptopDelivery(body: any) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/updateRemarkByISSForLaptopDelivery `;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  
   GetVerificationDelayReasonMaster() {
    let url: string = `${environment.apiMainUrlNet}master/GetVerificationDelayReasonMaster`;
    return this._http.get<any>(url, this.httpOptions);
  }

   /**Get Pipeline Mail Sent List  - history*/
 GetPipelineMailSentList(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OnBoard/GetPipelineMailSentList`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  /**Download Pipeline Document */
  //  DownloadPipelineDocument(docId: any): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}OnBoard/DownloadPipelineDocument?id=${docId}`;
  //   return this._http.get<any>(url, null, this.httpOptions);
  // }
    DownloadPipelineDocument(docId: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OnBoard/DownloadPipelineDocument?id=${docId}`;
    return this._http.get<any>(url, { responseType: 'blob' as 'json' });
  }


   GetRemarkHistoryUpdatedByIss(candidateId: string) {
    let url: string = `${environment.apiMainUrlNet}OnBoard/GetRemarkHistoryUpdatedByIss?candidateId=${candidateId}`;
    return this._http.get<any>(url, this.httpOptions);
  }

}
