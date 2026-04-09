import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetSetStorageService } from './get-set-storage.service';
import { GlobalMethod } from '../common/global-method';
import { environment } from 'projects/ats-global-system/src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NewInterviewService {

  constructor(private _httpclient: HttpClient, private _storage: GetSetStorageService) { }

  sendDataToServer(data): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/addupdateCandidateDetails`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    let myDate = new Date();
    let currentDate = myDate.getFullYear() + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2) + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + ('0' + (myDate.getMinutes())).slice(-2) + ':' + myDate.getSeconds();
    const getTokenEmp = this._storage.getUserEmpId();
    const getUsername = this._storage.getUserName();
    let bodyFormData = new FormData();
    bodyFormData.append('id', '0');
    bodyFormData.append('profileId', data.profileId);
    bodyFormData.append('appliedid', data.appliedid);
    bodyFormData.append('c_profileUniqId', data.c_profileUniqId);
    bodyFormData.append("name", data.name);
    bodyFormData.append("totalExp", data.toexpNo);
    bodyFormData.append("totalExpMonth", data.toexpNoMonth);
    bodyFormData.append("relevantExp", data.totrelevantExpNo);
    bodyFormData.append("relExpMonth", data.totrelevantExpNoMonth);
    bodyFormData.append("primarySkill", data.primarySkillNo);
    bodyFormData.append("phone", data.phone);
    bodyFormData.append("email", data.email);
    bodyFormData.append("currentCompany", data.currCompanyNo);
    bodyFormData.append("CountryID", data.CountryID);
    bodyFormData.append("CityID", data.CityID);
    bodyFormData.append("currentOrg", data.currCompanyNo);
    bodyFormData.append("eduQualification", data.educaQualification);
    bodyFormData.append("interviewType", data.interviewType);
    bodyFormData.append("interviewDate", data.interviewDate);
    bodyFormData.append("joiningDate", data.joiningDate);
    // bodyFormData.append("identityId", data.idType);
    //  bodyFormData.append("identityNo", data.idNo);
    bodyFormData.append("statusID", '1');
    bodyFormData.append("thId", data.thId);
    bodyFormData.append("talentId", data.talentId);
    bodyFormData.append("candidateTypeID", data.candidateType);
    bodyFormData.append("recruiter", data.rec);
    bodyFormData.append("panel", data.panel);
    bodyFormData.append("Additionalpanel", data.panelAd);
    bodyFormData.append("roleId", '3');
    bodyFormData.append("currencyTypeId", data.currencyTypeId);
    bodyFormData.append("expSalary", data.expectedSalary);
    bodyFormData.append("curSalary", data.currentSalary);
    bodyFormData.append("otherOffer", data.offersLetter);
    bodyFormData.append("optional", '0');
    bodyFormData.append("interviewMode", data.intModes);
    bodyFormData.append("remarks", data.remark);
    bodyFormData.append("userName", getUsername);
    bodyFormData.append("interviewDetails", data.intDt);
    bodyFormData.append("createdBy", getTokenEmp);
    if (data.file) {
      bodyFormData.append('resume', data.file);
    }


    let bodyInt = {
      "id": 0,
      "name": data.name,
      "totalExp": data.toexpNo,
      "relevantExp": data.totrelevantExpNo,
      "primarySkill": data.primarySkillNo,
      "phone": data.phone,
      "email": data.email,
      "currentCompany": data.currCompanyNo,
      "CountryID": data.CountryID,
      "CityID": data.CityID,
      "currentOrg": data.currCompanyNo,
      "eduQualification": data.educaQualification,
      "interviewType": data.interviewType,
      "interviewDate": data.interviewDate,
      "joiningDate": data.joiningDate,
      "identityId": data.idType,
      "identityNo": data.idNo,
      "statusID": 1,
      "thId": data.thId,
      "talentId": data.talentId,
      "candidateTypeID": data.candidateType,
      "recruiter": data.rec,
      "panel": data.panel,
      "roleId": 3,
      "currencyTypeId": data.currencyTypeId,
      "expSalary": data.expectedSalary,
      "curSalary": data.currentSalary,
      "otherOffer": data.toexpNo,
      "optional": 0,
      "interviewMode": data.intModes,
      "remarks": data.remark,
      "userName": getUsername,
      "interviewDetails": data.intDt,
      "createdBy": getTokenEmp
    }

    return this._httpclient.post<any>(url, bodyFormData)
  }



  scheduleInterviewScreen(data): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/addupdateCandidateDetails`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    let myDate = new Date();
    let currentDate = myDate.getFullYear() + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2) + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + ('0' + (myDate.getMinutes())).slice(-2) + ':' + myDate.getSeconds();
    const getTokenEmp = this._storage.getUserEmpId();
    const getUsername = this._storage.getUserName();
    let intDate: string = '';
    // if (data?.interviewDate && data?.interviewTimeHours && data?.interviewTimeMint) {
    //   intDate = GlobalMethod.formatDate(data?.interviewDate) + " " + data?.interviewTimeHours + ":" + data?.interviewTimeMint + ":00";
    // } else {
    //   let interviewDate = new Date();
    //   let interviewTime = interviewDate.getHours() + ':' + interviewDate.getMinutes() + ':' + interviewDate.getSeconds();
    //   intDate = GlobalMethod.formatDate(interviewDate) + ' ' + interviewTime
    // }
    let interviewDate = new Date();
    let interviewTime = interviewDate.getHours() + ':' + interviewDate.getMinutes() + ':' + interviewDate.getSeconds();
    let bodyFormData = new FormData();
    bodyFormData.append('id', '0');
    bodyFormData.append('profileId', data.profileName);
    bodyFormData.append('appliedid', data.appliedid ? data.appliedid : '');
    bodyFormData.append('c_profileUniqId', data.c_profileUniqId ? data.c_profileUniqId : 'undefined');
    bodyFormData.append("firstName", data.firstName);
    bodyFormData.append("middleName", data.middleName ? data.middleName : '');
    bodyFormData.append("lastName", data.lastName ? data.lastName : '');
    bodyFormData.append("totalExp", data.totalExp);
    bodyFormData.append("totalExpMonth", data.totalExpMonth);
    bodyFormData.append("relevantExp", data.totalRelExp);
    bodyFormData.append("relExpMonth", data.totalRelExpMonth);
    bodyFormData.append("primarySkill", data.skill);
    bodyFormData.append("phone", data.phone);
    bodyFormData.append("email", data.email);
    bodyFormData.append("currentCompany", data.currCompany ? data.currCompany : '');
    bodyFormData.append("CountryID", data.CountryID ? data.CountryID : '');
    bodyFormData.append("CityID", data.CityID);
    bodyFormData.append("currentOrg", data.currCompany ? data.currCompany : '');
    bodyFormData.append("eduQualification", data.educaQualification ? data.educaQualification : '');
    bodyFormData.append("interviewType", '1');
    bodyFormData.append("interviewDate", GlobalMethod.formatDate(interviewDate) + ' ' + interviewTime);
    // bodyFormData.append("interviewDate", intDate);
    bodyFormData.append('interviewDateUTC', GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(interviewDate) + ' ' + interviewTime));
    // bodyFormData.append('interviewDateUTC', GlobalMethod.convertToUTCDateTime(intDate));
    bodyFormData.append("joiningDate", data.joiningDate);
    // bodyFormData.append("identityId", data.idType);
    //  bodyFormData.append("identityNo", data.idNo);
    bodyFormData.append("statusID", '1');
    bodyFormData.append("thId", data.thId);
    bodyFormData.append("talentId", data.talentId);
    bodyFormData.append("candidateTypeID", data.candidateType);
    bodyFormData.append("recruiter", this._storage.getUserEmpId());
    // bodyFormData.append("panel", data?.panel ? data?.panel : this._storage.getUserEmpId());
    bodyFormData.append("panel", this._storage.getUserEmpId());
    // bodyFormData.append("Additionalpanel", data?.AdditionalInterviewer ? data?.AdditionalInterviewer?.toString() : '');
    bodyFormData.append("Additionalpanel", '');
    bodyFormData.append("roleId", '3');
    bodyFormData.append("currencyTypeId", data.currencyType);
    bodyFormData.append("expSalary", data.expectedSalary);
    bodyFormData.append("curSalary", data.currentSalary ? data.currentSalary : '');
    bodyFormData.append("otherOffer", data.offLetter);
    if (data.offLetter === 'true' || data.offLetter === true) {
      bodyFormData.append("OfferInHandCTC", data.OfferInHandCTC ? data.OfferInHandCTC : '');
    }

    bodyFormData.append("optional", '0');
    // bodyFormData.append("interviewMode", data?.IntModeType ? data?.IntModeType : '3');
    bodyFormData.append("interviewMode", '3');
    // if (data?.interviewDuration) {
    //   bodyFormData.append('interviewDuration', data?.interviewDuration);
    // }
    bodyFormData.append("remarks", data.remarkTd ? data.remarkTd : '');
    bodyFormData.append("userName", getUsername);
    // bodyFormData.append("interviewDetails", data.Venue ? data.Venue : '');
    bodyFormData.append("interviewDetails", '');
    bodyFormData.append("createdBy", getTokenEmp);
    bodyFormData.append('offsetDate', GlobalMethod.getOffset().toString());
    // bodyFormData.append('interviewTimeZone', data?.interviewDateTimeZone ? data?.interviewDateTimeZone : GlobalMethod.getTimezone());
    bodyFormData.append('interviewTimeZone', GlobalMethod.getTimezone());
    bodyFormData.append('Gender', data.candidateGender ? data.candidateGender : '');
    bodyFormData.append('dob', data.candiDob ? GlobalMethod.formatDate(data.candiDob) : '');
    bodyFormData.append('DivisionID', data.DivisionID ? data.DivisionID : '');
    // bodyFormData.append('JobFamilyID', data.JobFamilyID ? data.JobFamilyID : '');
    bodyFormData.append('gradeId', data.gradeId ? data.gradeId : '');
    bodyFormData.append('gradeBand', data.gradeBand ? data.gradeBand : '');
    // bodyFormData.append('SalaryType',data.SalaryType?data.SalaryType:'' );
    if (environment.locationWise) {
      bodyFormData.append("HiringLocation", data.hiringLocation);
      bodyFormData.append("StateID", data.StateID ? data.StateID : '');
    }
    if (data?.SalaryType) {
      bodyFormData.append('SalaryType', data?.SalaryType);
    }
    if (data.resume) {
      bodyFormData.append('resume', data.resume);
    }
    if (data.EntityId) {
      bodyFormData.append('EntityId', data.EntityId);
    }
    if (data.ApplicantUid) {
      bodyFormData.append('ApplicantUid', data.ApplicantUid);
    }
    if (data.IsFromNaukriAPI) {
      bodyFormData.append('IsFromNaukriAPI', data.IsFromNaukriAPI);
    }
    // if (data?.JfCateg) {
    //   bodyFormData.append('jobfamilycategory', data?.JfCateg);
    // }
    // if (data?.practiceId) {
    //   bodyFormData.append('practiceId', data?.practiceId);
    // }
    if (data?.empUnitId) {
      bodyFormData.append('EmpUnitId', data?.empUnitId);
    }
    if (data?.TCID) {
      bodyFormData.append('CubeID', data?.TCID);
    }
    if (data?.cubeClusterId) {
      bodyFormData.append('CubeClusterID', data?.cubeClusterId);
    }
    if (data?.roleId) {
      bodyFormData.append('CubeRoleID', data?.roleId);
    }
    // if (data?.isRenuTeam) {
    //   bodyFormData.append('isRenuTeam', data?.isRenuTeam);
    // }
    if (data?.countryCode) {
      bodyFormData.append('CountryCode', data?.countryCode);
    }
    return this._httpclient.post<any>(url, bodyFormData)
  }



}
