import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LibGetSetStorageService } from './lib-get-set-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LibExternalUserGlobalApiService {

  constructor(private _http: HttpClient, private _storage: LibGetSetStorageService) { }
  public headerHttp = new HttpHeaders({
    'Content-Type': 'application/json',
    SkipLoader: ''
  })
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  /****************
  *get Documents  Category Master List
  * ***********/
  getDocumentsCategoryMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getDocumentsCategoryMaster`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get Documents Sub  Category Master List
  * ***********/
  getDocumentsSubCategoryMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getDocumentsSubCategoryMaster`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
 *get Documents Sub child Category Master List
 * ***********/
  getDocumentsChildSubcategoryMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getDocumentsChildSubcategoryMaster`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
 *get getNationalityMaster List
 * ***********/
  getNationalityMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getNationality`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
 *get getMaritalStatusMaster List
 * ***********/
  getMaritalStatusMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getMaritalStatus`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get getRelationShipMaster */
  getRelationShipMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetRelationShipMaster`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get occupation */
  GetOccupationMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetOccupation`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get Degree/courses Master List
  * ***********/
  getDegreeNamesMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetDegreeNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get College/establishment name Master List
  * ***********/
  getCollegeNamesMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetCollegeNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get university/affiliated to name Master List
  * ***********/
  getUniversityNamesMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetUniversityNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get subject/Specialization name Master List
  * ***********/
  getSpecializationListMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetSubjectNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get education type Master List
  * ***********/
  getEducationTypeListMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetCourseType`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get level names Master List
  * ***********/
  getLevelListMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetLevelNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get discipline names Master List
  * ***********/
  getDisciplineListMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetDisciplineNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
 *get GetCurrencyList 
 * ***********/
  GetCurrencyList(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetCurrencyList`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  getGenderList(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetGenderList`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
*get GetcandidateQuestionire 
* ***********/
  GetcandidateQuestionire(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetcandidateQuestionire`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
*get GetcandidateQuestionire 
* ***********/
  getInfogainLocations(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getInfogainLocations`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get designation */
  getDesignationList(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetDesignationNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get function */
  getFunctionList(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetFunctionNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get industry */
  getIndustryList(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetIndustryNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get skills */
  GetSkillNames(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetSkillNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get location country name  */
  GetCountryNames(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetCountryNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
 *get Secondary skills Master List
 * ***********/
  getSkillsList(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getSkills`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get location city name  */
  getCityList(apiBaseUrl: string, contryId: number = null): Observable<any> {
    const getTokenEmp = this._storage.getUserEmpId();
    let canUrl = `${apiBaseUrl}/getCityList?EmpId=${getTokenEmp}&${contryId ? `CountryId=${contryId}` : ''}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
}