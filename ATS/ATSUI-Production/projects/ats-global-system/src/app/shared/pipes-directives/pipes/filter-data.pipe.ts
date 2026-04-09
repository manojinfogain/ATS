import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterDataPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
           if(!searchString){
             return value  
           }
    
           return value.filter(it=>{   
               const name = it.candidateName.toLowerCase().includes(searchString.toLowerCase().trim()) 
               const email = it.candidateEmail.toLowerCase().includes(searchString.toLowerCase().trim())
               const phone = it.candidatePhone.toLowerCase().includes(searchString.toLowerCase().trim())
              // console.log( name + email + phone);
               return (name + email + phone);      
           }) 
        }
    


}


@Pipe({
  name: 'filterListCandidate'
})
export class FilterDataCandidateListPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
           if(!searchString){
             return value  
           }
           
    
           return value.filter(it=>{   
               const name = it.Name.toString().toLowerCase().includes(searchString.toLowerCase().trim()) 
               const email = it.email.toLowerCase().includes(searchString.toLowerCase().trim())
               const phone = it.phone.toLowerCase().includes(searchString.toLowerCase().trim())
              // console.log( name + email + phone);
               return (name + email + phone);      
           }) 
        }
    


}


@Pipe({
  name: 'filterModalData'
})
export class FilterDataModalPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
           if(!searchString){
             return value  
           }
    
           return value.filter(it=>{   
               const name = it.name.toString().toLowerCase().includes(searchString.toLowerCase().trim()) 
               const email = it.email.toLowerCase().includes(searchString.toLowerCase().trim())
               const phone = it.mobile_number.toLowerCase().includes(searchString.toLowerCase().trim())
               return (name + email + phone);      
           }) 
        }
    


}
@Pipe({
  name: 'filterCSkillData'
})
export class FilterDataCSkillPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
           if(!searchString){
             return value  
           }
    
           return value.filter(it=>{   
               const name = it.name.toString().toLowerCase().includes(searchString.toLowerCase().trim()) 
               const email = it.email.toLowerCase().includes(searchString.toLowerCase().trim())
               const phone = it.contact_no.toLowerCase().includes(searchString.toLowerCase().trim())
               return (name + email + phone);      
           }) 
        }
    


}



@Pipe({
  name: 'filterDataCompanylPipe'
})
export class FilterDataCompanylPipe implements PipeTransform {

  transform(value: any, searchInput: any): any {
    if(!value || !searchInput){
      return value;
    }
    return value.filter( comList => 
      comList?.name?.toLowerCase().indexOf(searchInput.toLocaleLowerCase()) !== -1);
   // return null;
  }

}


@Pipe({
  name: 'filterOppNamePipe'
})
export class FilterOppNamePipe implements PipeTransform {

  transform(value: any, searchInput: any): any {
    if(!value || !searchInput){
      return value;
    }
    return value.filter( comList => {
      const id = comList?.Id?.toLowerCase().indexOf(searchInput.toLocaleLowerCase()) !== -1
      const oppname = comList?.OpportunityName?.toLowerCase().indexOf(searchInput.toLocaleLowerCase()) !== -1
      return (id || oppname);
    });
  }

}
