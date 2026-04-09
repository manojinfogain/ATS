import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { HttpMethodsService } from './http-methods.service';
import { SkipLoader } from 'projects/ats-global-system-external/src/app/core/interceptors/loader-interceptor';
import { GetSetStorageService } from './get-set-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ExternalUserGlobalApiService {

  constructor(private httpMethod: HttpMethodsService, private _http: HttpClient, private _storage: GetSetStorageService) { }
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
  getDocumentsCategoryMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getDocumentsCategoryMaster`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get Documents Sub  Category Master List
  * ***********/
  getDocumentsSubCategoryMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getDocumentsSubCategoryMaster`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
 *get Documents Sub child Category Master List
 * ***********/
  getDocumentsChildSubcategoryMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getDocumentsChildSubcategoryMaster`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
 *get getNationalityMaster List
 * ***********/
  getNationalityMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getNationalityMaster`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
 *get getMaritalStatusMaster List
 * ***********/
  getMaritalStatusMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getMaritalStatusMaster`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get getRelationShipMaster */
  getRelationShipMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetRelationShipMaster`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }


  /**get getCandidateFamilyDetails */
  // getCandidateFamilyDetails(): Observable<any> {
  //   let canUrl = `${environment.apiMainUrlNet}/Candidate/FamilyDetails`;
  //   return this._http.get<any>(canUrl, this.httpOptions)
  // }
  /**get occupation */
  GetOccupationMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetOccupationMaster`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get Degree/courses Master List
  * ***********/
  getDegreeNamesMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetDegreeNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get College/establishment name Master List
  * ***********/
  getCollegeNamesMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetCollegeNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get university/affiliated to name Master List
  * ***********/
  getUniversityNamesMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetUniversityNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get subject/Specialization name Master List
  * ***********/
  getSpecializationListMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetSubjectNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get education type Master List
  * ***********/
  getEducationTypeListMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetCourseType`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get level names Master List
  * ***********/
  getLevelListMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetLevelNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get discipline names Master List
  * ***********/
  getDisciplineListMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetDisciplineNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
 *get GetCurrencyList 
 * ***********/
  GetCurrencyList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetCurrencyList`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  getGenderList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetGenderList`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
*get GetcandidateQuestionire 
* ***********/
  GetcandidateQuestionire(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetcandidateQuestionire`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /****************
*get GetcandidateQuestionire 
* ***********/
  getInfogainLocations(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getInfogainLocations`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
/**get designation */
  getDesignationList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetDesignationNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get function */
  getFunctionList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetFunctionNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get industry */

  getIndustryList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetIndustryNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

   /**get skills */
   GetSkillNames(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetSkillNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  
   /**get location country name  */
   GetCountryNames(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetCountryNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

   /****************
 *get Secondary skills Master List
 * ***********/
 getSkillsList(): Observable<any> {
  let canUrl = `${environment.apiMainUrlNet}/master/getSkills`;
  return this._http.get<any>(canUrl, this.httpOptions)
}

 /**get location city name  */
 getCityList(contryId:number = null): Observable<any> {
  const getTokenEmp = this._storage.getUserEmpId();
  let canUrl = `${environment.apiMainUrlNet}/master/getCityList?EmpId=${getTokenEmp}&${contryId?`CountryId=${contryId}`:''}`;
  return this._http.get<any>(canUrl, this.httpOptions)
}

 /**get GetCourtesyTitle name  */
   GetCourtesyTitle(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetCourtesyTitle`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get GetDocumentType name  */
   GetDocumentType(type: string, empType: string = null): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetDocumentType?Type=${type}`;
    if (empType) {
      canUrl += `&EmployerType=${empType}`;
    }
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  
  /**get location city name  */
 getStateList(contryId:number = null): Observable<any> {
  const getTokenEmp = this._storage.getUserEmpId();
  let canUrl = `${environment.apiMainUrlNet}/master/getStateList?${contryId?`CountryId=${contryId}`:''}`;
  return this._http.get<any>(canUrl, this.httpOptions)
}

/**get location country name  */
   getCountryList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getCountryList`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

}
