export interface IChangePassword {
  password: string;
}

export interface ILogin {
  password: string;
  userName: string;
}

export interface ITotal{
  Count?:number
}
export interface ICandidateScreenTab{
  PersonalDetails?:boolean;
  FamilyDetails?:boolean;
  EducationalBackground?:boolean;
  TrainingCourses?:boolean;
  EmploymentDetails?:boolean;
  SalaryDetails?:boolean;
  UploadDocuments?:boolean;
  OtherDetails?:boolean;
}
export class CandidateScreenTab implements ICandidateScreenTab{
   PersonalDetails:boolean =false
  FamilyDetails:boolean =false
  EducationalBackground:boolean =false
  TrainingCourses:boolean =false
  EmploymentDetails:boolean =false
  SalaryDetails?:boolean;
  UploadDocuments?:boolean;
  OtherDetails?:boolean =false
}

export interface ICandidateSignature{
  page1?:string;
  page2?:string;
  page3?:string;
  page4?:string;
  page5?:string;
  page6?:string;
  page7?:string;
  page8?:string;
  page9?:string;
  page10?:string;
}
export class CandidateSignatureModel implements ICandidateSignature{
  page1:string =null
  page2:string =null
  page3:string =null
  page4:string =null
  page5:string =null
  page6:string =null
  page7:string =null
  page8:string =null
  page9:string =null
  page10:string =null
  page11:string =null
  page12:string =null
}
export interface ICandidateBGVScreenTab{
  PersonalInformation?:boolean;
  CurrentAddressDetails?:boolean;
  CRCDetails?:boolean;
  HighestEducationDetails?:boolean;
  EmploymentDetails?:boolean;
  GlobalDBCheckDetails?:boolean;
  OFACDetails?:boolean;
  DigitalLOA?:boolean;
}
export class CandidateBGVScreenTab implements ICandidateBGVScreenTab{
  PersonalInformation:boolean =false
  CurrentAddressDetails:boolean =false
  CRCDetails:boolean =false
  HighestEducationDetails:boolean =false
  EmploymentDetails:boolean =false
  GlobalDBCheckDetails:boolean =false
  OFACDetails:boolean =false
  DigitalLOA:boolean =false
}
