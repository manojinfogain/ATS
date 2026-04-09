import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'accountFilterOnDash'
})
export class AccountFilterOnDash implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let first =  it.AccountName.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first)
    }) 
 }
}


@Pipe({
  name: 'pmFilterOnDash'
})
export class PmFilterOnDashPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let first =  it.ProjectName.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first)
    }) 
 }
}

@Pipe({
  name: 'hmFilterOnDash'
})
export class HmFilterOnDashPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let first =  it.HiringManagerName.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first)
    }) 
 }
}


@Pipe({
  name: 'buFilterOnDash'
})
export class BUFilterOnDashPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{   
        let first =  it.BusinessUnit.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first)
    }) 
 }
}

@Pipe({
  name: 'duFilterOnDash'
})
export class DUFilterOnDashPipe implements PipeTransform {

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
  name: 'reportFiltersDash'
})
export class RportFilterOnDashPipe implements PipeTransform {

  transform(value:any[],searchString:string,type?:string){
    
    if(!searchString){
      return value  
    }
   // hiring Manager
    if(type === 'hm'){
      return value.filter(it=>{   
        let first =  it.HiringManagerName?.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first)
    }) 
    }

    else if(type === 'PM'){
      return value.filter(it=>{   
        let first =  it.ProjectName?.toLowerCase().includes(searchString.trim().toLowerCase());
        return (first)
    }) 
    }
 }
}

