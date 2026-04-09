import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalApisService {
  constructor(private _http: HttpClient) { }

  public headerHttp = new HttpHeaders({
    'Content-Type': 'application/json',
    SkipLoader: ''
  });
  public httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getCountryListCode(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getCountryList`;
    return this._http.get<any>(canUrl, this.httpOption);
  }

  getDocumentsCategoryMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getDocumentsCategoryMaster`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getDocumentsSubCategoryMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getDocumentsSubCategoryMaster`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getDocumentsChildSubcategoryMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getDocumentsChildSubcategoryMaster`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getNationalityMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getNationalityMaster`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getMaritalStatusMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getMaritalStatusMaster`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getRelationShipMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetRelationShipMaster`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  GetOccupationMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetOccupationMaster`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getDegreeNamesMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetDegreeNames`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getCollegeNamesMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetCollegeNames`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getUniversityNamesMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetUniversityNames`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getSpecializationListMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetSubjectNames`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getEducationTypeListMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetCourseType`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getLevelListMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetLevelNames`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getDisciplineListMaster(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetDisciplineNames`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  GetCurrencyList(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetCurrencyList`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getGenderList(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetGenderList`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  GetcandidateQuestionire(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetcandidateQuestionire`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getInfogainLocations(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getInfogainLocations`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getDesignationList(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetDesignationNames`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getFunctionList(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetFunctionNames`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getIndustryList(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetIndustryNames`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  GetSkillNames(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetSkillNames`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  GetCountryNames(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/GetCountryNames`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getSkillsList(apiBaseUrl: string): Observable<any> {
    let canUrl = `${apiBaseUrl}/getSkills`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }

  getCityList(apiBaseUrl: string, contryId: number = null,getTokenEmp:string=''): Observable<any> {
   // const getTokenEmp = this._storage.getUserEmpId();
    let canUrl = `${apiBaseUrl}/getCityList?EmpId=${getTokenEmp}&${contryId ? `CountryId=${contryId}` : ''}`;
    return this._http.get<any>(canUrl, this.httpOptions);
  }
}