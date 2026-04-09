import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'panelWiseFilter'
})
export class panelWiseFilterPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let first =  it.Name.toLowerCase().includes(searchString.trim().toLowerCase());
        let sec =  it.interviewerEmpId.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first+sec);
    }) 
 }
}


@Pipe({
  name: 'duFilter'
})
export class duFilterPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let first =  it.DeliveryUnit.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first)
    }) 
 }
}

@Pipe({
  name: 'panelWiseFilterDetails'
})
export class panelWiseFilterDetailsPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let Account =  it.Account.toLowerCase().includes(searchString.trim().toLowerCase());
        let Skill =  it.Skill.toLowerCase().includes(searchString.trim().toLowerCase());
        let DeliverUnit =  it.DeliverUnit.toLowerCase().includes(searchString.trim().toLowerCase());
        return (Account+Skill+DeliverUnit);
    }) 
 }
}


@Pipe({
  name: 'partnerFilter'
})
export class partnerListFilterPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let PartnerName =  it.PartnerName.toLowerCase().includes(searchString.trim().toLowerCase());
        let Email =  it.Email.toLowerCase().includes(searchString.trim().toLowerCase());
        return (PartnerName+Email);
    }) 
 }
}


@Pipe({
  name: 'talentPartner'
})
export class TalentPartnerFilterPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let first =  it.talent_id.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first)
    }) 
 }
}

@Pipe({
  name: 'companyFilter'
})
export class CompanySearchFilterPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let first =  it.name.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first)
    }) 
 }
}


@Pipe({
  name: 'recruiterWiseFilter'
})
export class recruiterWiseFilterPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let first =  it.RecruiterName.toLowerCase().includes(searchString.trim().toLowerCase());
        let sec =  it.RecruiterEmpId.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first+sec);
    }) 
 }
}


@Pipe({
  name: 'HMWiseFilter'
})
export class HMWiseFilterPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let first =  it.Name.toLowerCase().includes(searchString.trim().toLowerCase());
        let sec =  it.EmpID.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first+sec);
    }) 
 }
}


@Pipe({
  name: 'AHWiseFilter'
})
export class AHWiseFilterPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let first =  it.name.toLowerCase().includes(searchString.trim().toLowerCase());
        let sec =  it.empId.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first+sec);
    }) 
 }
}


@Pipe({
  name: 'TZWiseFilter'
})
export class TZFilterPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let first =  it.displayName.toLowerCase().includes(searchString.trim().toLowerCase());
        let sec =  it.alias.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first+sec);
    }) 
 }
}

/**
 * Pipe to check for daylight saving and setting time accordingly
 */

 import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
 import * as moment from "moment";
 @Pipe({
   name: 'dayLightCheck'
 })
 export class DayLightSavingPipe implements PipeTransform {
 
   transform(value:any[],data:any ){
         if(data && data['offset_value']){
             if(data.offset_value == GlobalMethod.getOffset()){
                 return value ; 
             }else if( Math.abs(GlobalMethod.getOffset()) > Math.abs(data.offset_value)){
                 // minus difference
                 return  +moment(value).subtract((Math.abs(GlobalMethod.getOffset()) -  Math.abs(data.offset_value)),'minutes')
             }else{
                 // add difference        
                 return  +moment(value).add(Math.abs(data.offset_value) - Math.abs(GlobalMethod.getOffset()),'minutes')
             }
         }
         return value ; 
     }
 }

 @Pipe({
  name: 'showCharPartner'
})
export class showCharPartnerPipe implements PipeTransform{

  transform(value:string,togglePipe:boolean): string {
      if(value.length > 50 && togglePipe){
          return value.substring(0, 50) + '...';
      }else{
          return value;
      }


  }

}