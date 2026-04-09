import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpMethodsService } from './http-methods.service';
import { SkipLoader } from 'projects/ats-global-system/src/app/core/interceptors/loader-interceptor';
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

  /****************
  *get division List for employee id creation
  * ***********/
  getEmpCreationDivision(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetEmpCreationDivision`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get Employee category List for employee id creation
  * ***********/
  GetEmpCategoryDetails(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetEmpCategoryDetails`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

   /****************
  *get location List for employee id creation
  * ***********/
  GetEmpCreationLocation(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetEmpCreationLocation`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get new location List for employee id creation
  * ***********/
  GetNewLocation(locId:number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetNewLocation?LocationId=${locId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get sub location List for employee id creation
  * ***********/
  GetSubLocationNames(locId:number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetSubLocationNames?LocationId=${locId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *get sub location new List for employee id creation
  * ***********/
  GetSubLocationNew(newLocId:number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetSubLocationNew?LocationId=${newLocId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *GetNationalityNames List for employee id creation
  * ***********/
  GetNationalityNames(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetNationalityNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

   /****************
  *GetLegalEntityByLocation List for employee id creation
  * ***********/
  GetLegalEntityByLocation(locId:number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetLegalEntityByLocation?LocationId=${locId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

   /****************
  *GetEmployeeUnitforEmpCreation List for employee id creation
  * ***********/
  GetEmployeeUnitforEmpCreation(isCreated:number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetEmployeeUnitforEmpCreation?IsCreated=${isCreated}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *GetHorizontalDepartment List for employee id creation
  * ***********/
  GetHorizontalDepartment(empUnitId:number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetHorizontalDepartment?EmpUnit=${empUnitId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

   /****************
  *GetTeamPracticeList for employee id creation
  * ***********/
  GetTeamPracticeList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetTeamPracticeList`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

   /****************
  *GetRelationShipNames for employee id creation
  * ***********/
  GetRelationShipNames(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetRelationShipNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  
   /****************
  *GetVendor list for employee id creation
  * ***********/
  GetVendor(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetVendor`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

   /****************
  *GetPIMSEmpStatus list for employee id creation
  * ***********/
  GetPIMSEmpStatus(CreateType:string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetPIMSEmpStatus?CreateType=${CreateType}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *GetPIMSDesignation list for employee id creation
  * ***********/
  GetPIMSDesignation(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetPIMSDesignation`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *GetGradeByDesignation list for employee id creation
  * ***********/
  GetGradeByDesignation(DesignationId:number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetGradeByDesignation?DesignationId=${DesignationId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /****************
  *GetReportingManagerBYGrade list for employee id creation
  * ***********/
  GetReportingManagerBYGrade(GradeId:number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetReportingManagerBYGrade?GradeId=${GradeId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

   /****************
  *GetPIMSDesignationNames list for employee id creation
  * ***********/
  GetPIMSDesignationNames(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetPIMSDesignationNames`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

   /****************
  *getTeamPracticeList list for employee id creation
  * ***********/
  getTeamPracticeList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetTeamPracticeList`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

   /****************
  *GetAllPIMSEmployer list for employee id creation
  * ***********/
  GetAllPIMSEmployer(flag:number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetAllPIMSEmployer?flag=${flag}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

   /****************
  *get candidate default details for employee id creation
  * ***********/
  getCandidateDefaultDetails(Candidateid:string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/OnBoard/GetEmpCreationDefaultDetails?Candidateid=${Candidateid}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

}
