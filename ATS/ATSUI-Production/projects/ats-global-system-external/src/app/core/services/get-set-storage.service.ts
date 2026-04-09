import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class GetSetStorageService {
  public secretKey = 'ATS123!INF';
  constructor(
  ) { }

  public encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    } catch (e) {
      console.log(e);
    }
  }

  public decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.warn(e);
    }
  }
  /*******  Get Token *****/
  getToken(): string {
    return window.sessionStorage['jwtWebToken'];
  }
  /*******  Save Token *****/
  saveToken(token: string) {
    window.sessionStorage.setItem("jwtWebToken", token);
  }
  /*******  Delete Token *****/
  destroyToken() {
    window.sessionStorage.removeItem('jwtWebToken');
  }

  /*******  Get Token *****/
  getTokenEx(): string {
    return window.sessionStorage['jwtWebTokenEx'];
  }
  /*******  Save Token *****/
  saveTokenEx(token: string) {
    window.sessionStorage.setItem("jwtWebTokenEx", token);
  }
  /*******  Delete Token *****/
  destroyTokenEx() {
    window.sessionStorage.removeItem('jwtWebTokenEx');
  }

  /*******  Get Token ex temp *****/
  getTokenExTemp(): string {
    return window.sessionStorage['jwtWebTokenExTemp'];
  }
  /*******  Save Token *****/
  saveTokenExTemp(token: string) {
    window.sessionStorage.setItem("jwtWebTokenExTemp", token);
  }
  /*******  Delete Token *****/
  destroyTokenExTemp() {
    window.sessionStorage.removeItem('jwtWebTokenExTemp');
  }


  /*******  Set User Details *****/
  setUserData(data) {
    let queryParam = this.encryptData(data);
    window.sessionStorage.setItem('userData', queryParam);
  }
  /*******  Get  User Details *****/
  getSetUserData() {
    let data = window.sessionStorage['userData'];
    if (data) {
      let queryParam = this.decryptData(data);
      return queryParam
    }

  }
  /*******  Delete User Details *****/
  destroySetUserData() {
    window.sessionStorage.removeItem('userData');
  }
  /***
   * userToken Id
   */
  setUserId(data) {
    window.sessionStorage.setItem("userTokenId", data);
  }
  getUserId(): string {
    return window.sessionStorage['userTokenId'];
  }
  destroyUserId() {
    window.sessionStorage.removeItem('userTokenId');
  }

  /***
  * userTokenEmp Id
  */
  setUserEmpId(data) {
    let queryParam = this.encryptData(data);
    window.sessionStorage.setItem("userTokenEmp", queryParam);
  }
  getUserEmpId(): string {
    let data = window.sessionStorage['userTokenEmp'];
    if (data) {
      let queryParam = this.decryptData(data);
      return queryParam
    }
  }

  destroyUserEmpId() {
    window.sessionStorage.removeItem('userTokenEmp');
  }
  /** candidate ID - leadership login */
  setCandidateId(data) {
    let queryParam = this.encryptData(data);
    window.sessionStorage.setItem("CandidateId", queryParam);
  }
  getCandidateId(): string {
    let data = window.sessionStorage['CandidateId'];
    if (data) {
      let queryParam = this.decryptData(data);
      return queryParam
    }
  }
  destroyCandidateId() {
    window.sessionStorage.removeItem('CandidateId');
  }


  /***
 * rightId Id
 */
  setUserRightId(data) {
    window.sessionStorage.setItem("rightId", data);
  }
  getUserRightId(): string {
    return window.sessionStorage['rightId'];
  }
  destroyUserRightId() {
    window.sessionStorage.removeItem('rightId');
  }

  /***
 * user Role
 */
  setUserRole(data) {
    let queryParam = this.encryptData(data);
    window.sessionStorage.setItem("role", queryParam);
  }
  getUserRole(): string {
    let data = window.sessionStorage['role'];
    if (data) {
      let queryParam = this.decryptData(data);
      return queryParam
    }
  }
  destroyUserRole() {
    window.sessionStorage.removeItem('role');
  }

  /***
* user Cid
*/
  setUserCid(data) {
    window.sessionStorage.setItem("cid", data);
  }
  getUserCid(): string {
    return window.sessionStorage['cid'];
  }
  destroyUserCid() {
    window.sessionStorage.removeItem('cid');
  }

  /***
*  talentId
*/
  setTalentId(data) {
    window.sessionStorage.setItem("talentId", data);
  }
  getTalentId(): string {
    return window.sessionStorage['talentId'];
  }
  destroyTalentId() {
    window.sessionStorage.removeItem('talentId');
  }

  /***
*  uniqName
*/
  setUniqueName(data) {
    window.sessionStorage.setItem("uniqName", data);
  }
  getUniqueName(): string {
    return window.sessionStorage['uniqName'];
  }
  destroyUniqueName() {
    window.sessionStorage.removeItem('uniqName');
  }

  /***
*  username
*/
  setUserName(data) {
    let queryParam = this.encryptData(data);
    window.sessionStorage.setItem("username", queryParam);
  }
  getUserName(): string {
    let data = window.sessionStorage['username'];
    if (data) {
      let queryParam = this.decryptData(data);
      return queryParam
    }
  }
  destroyUserName() {
    window.sessionStorage.removeItem('username');
  }

  /***
*  username
*/
  setUserEmail(data) {
    let queryParam = this.encryptData(data);
    window.sessionStorage.setItem("userEmail", queryParam);
  }
  getUserEmail(): string {
    let data = window.sessionStorage['userEmail'];
    if (data) {
      let queryParam = this.decryptData(data);
      return queryParam
    }
  }
  destroyUserEmail() {
    window.sessionStorage.removeItem('userEmail');
  }

  /***
*  username
*/
  setDomainId(data) {
    window.sessionStorage.setItem("domainId", data);
  }
  getDomainId(): string {
    return window.sessionStorage['domainId'];
  }
  destroyDomainId() {
    window.sessionStorage.removeItem('domainId');
  }


  saveLocationData(data: any) {
    window.localStorage.setItem('comLoc', JSON.stringify(data));
  }
  getLocationData() {
    let data = window.localStorage['comLoc'];
    if (data) {
      return JSON.parse(data)
    }
  }
  /*******  Delete  Details *****/
  destroyLocationData() {
    window.localStorage.removeItem('comLoc');
  }

  saveLocationList(data: any) {
    window.sessionStorage.setItem('locationList', JSON.stringify(data));
  }
  getLocationList() {
    let data = window.sessionStorage['locationList'];
    if (data) {
      return JSON.parse(data)
    }
  }
  /*******  Delete User Details *****/
  destroyLocationList() {
    window.sessionStorage.removeItem('locationList');
  }

  /***
 *  UserType
 */
  setUserType(data) {
    window.localStorage.setItem("UserType", data);
  }
  getUserType(): string {
    return window.localStorage['UserType'];
  }
  destroyUserType() {
    window.localStorage.removeItem('UserType');
  }

  /***
*  action
*/
  setAction(data) {
    window.localStorage.setItem("action", data);
  }
  getAction(): string {
    return window.localStorage['action'];
  }
  destroyAction() {
    window.localStorage.removeItem('action');
  }

  /***
*  action
*/
  setLoginType(data) {
    window.localStorage.setItem("loginType", data);
  }
  getLoginType(): string {
    return window.localStorage['loginType'];
  }
  destroyLoginType() {
    window.localStorage.removeItem('loginType');
  }


  /*******  Set User Details *****/
  setCandExp(data) {
    let queryParam = this.encryptData(data);
    window.sessionStorage.setItem('candExp', queryParam);
  }
  /*******  Get  User Details *****/
  getCandExp() {
    let data = window.sessionStorage['candExp'];
    if (data) {
      let queryParam = this.decryptData(data);
      return queryParam
    }

  }
  /*******  Delete User Details *****/
  destroyCandExp() {
    window.sessionStorage.removeItem('candExp');
  }

   /*******  Set exp Details bgv *****/
  setCandExpBGV(data) {
    let queryParam = this.encryptData(data);
    window.sessionStorage.setItem('candExpBGV', queryParam);
  }
  /*******  Get  exp Details bgv*****/
  getCandExpBGV() {
    let data = window.sessionStorage['candExpBGV'];
    if (data) {
      let queryParam = this.decryptData(data);
      return queryParam
    }

  }
  /*******  Delete exp Details bgv*****/
  destroyCandExpBGV() {
    window.sessionStorage.removeItem('candExpBGV');
  }

  /*******  Set User Details *****/
  setIsFinalStatud(data) {
    let queryParam = this.encryptData(data);
    window.sessionStorage.setItem('step', queryParam);
  }
  /*******  Get  User Details *****/
  getIsFinalStatus() {
    debugger
    let data = window.sessionStorage['step'];
    if (data) {
      let queryParam = this.decryptData(data);
      return queryParam
    }

  }
  /*******  Delete User Details *****/
  destroyIsFinalStatud() {
    window.sessionStorage.removeItem('step');
    window.sessionStorage.removeItem('onbStatus');
  }

  /*******  Set setIsDocumentsUploaded Details *****/
  setIsDocumentsUploaded(data) {
    let queryParam = this.encryptData(data);
    window.sessionStorage.setItem('isDocumentsUploaded', queryParam);
  }
  /*******  Get  IsDocumentsUploaded Details *****/
  getIsDocumentsUploaded() {
    let data = window.sessionStorage['isDocumentsUploaded'];
    if (data) {
      let queryParam = this.decryptData(data);
      return queryParam
    }

  }
  /*******  Delete IsDocumentsUploaded Details *****/
  destroyIsDocumentsUploaded() {
    window.sessionStorage.removeItem('isDocumentsUploaded');
  }

  /*******  Set Onb Details *****/
  setOnboardStatus(data) {
    let queryParam = this.encryptData(data);
    window.sessionStorage.setItem('onbStatus', queryParam);
  }
  /*******  Get  Onb Details *****/
  getOnboardStatus() {
    let data = window.sessionStorage['onbStatus'];
    if (data) {
      let queryParam = this.decryptData(data);
      return queryParam
    }
  }


  /*******  Set Onb Details *****/
  setIsDeclarationDone(data) {
    let queryParam = this.encryptData(data);
    window.sessionStorage.setItem('IsDeclarationDone', queryParam);
  }
  /*******  Get  Onb Details *****/
  getIsDeclarationDone() {
    let data = window.sessionStorage['IsDeclarationDone'];
    if (data) {
      let queryParam = this.decryptData(data);
      return queryParam
    }
  }

   /*******  Delete  Details *****/
   destroyIsDeclarationDone() {
    window.sessionStorage.removeItem('IsDeclarationDone');
  }
   /*******  Set BGV final status Details *****/
  setIsBGVFinalStatud(data) {
    let queryParam = this.encryptData(data);
    window.sessionStorage.setItem('BGVstep', queryParam);
  }
  /*******  Get  User Details *****/
  getIsBGVFinalStatus() {
    let data = window.sessionStorage['BGVstep'];
    if (data) {
      let queryParam = this.decryptData(data);
      return queryParam
    }

  }
  /*******  Delete User Details *****/
  destroyIsBGVFinalStatud() {
    window.sessionStorage.removeItem('BGVstep');
  }
  /***
   * remove all storage except language
   */
  destroyAllStorage() {
    this.destroyTokenExTemp();
    this.destroyTokenEx();
    this.destroyToken();
    this.destroySetUserData();
    this.destroyUserId();
    this.destroyUserEmpId();
    this.destroyUserRightId();
    this.destroyUserCid();
    this.destroyUserRole();
    this.destroyTalentId();
    this.destroyUniqueName();
    this.destroyUserName();
    this.destroyUserEmail();
    this.destroyDomainId();
    this.destroyLoginType();
    this.destroyCandExp();
    this.destroyCandExpBGV();
    this.destroyIsFinalStatud(); 
    this.destroyIsDocumentsUploaded();
    this.destroyTokenExTemp();
    this.destroyIsDeclarationDone();
    this.destroyIsBGVFinalStatud();
    // window.localStorage.removeItem('pdfjs.history');
  }

}
