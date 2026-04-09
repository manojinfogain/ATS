import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'offerG5above'
})
export class OfferG5abovePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}


@Pipe({
  name: 'G5AboveApproverPipe'
})
export class G5AboveApproverPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    
    if(!searchString){
      return value  
    }

    return value.filter(it=>{
      let first;
      let last;  
      if(it.FullName){
          first =  it?.FullName?.toLowerCase().includes(searchString.trim().toLowerCase());
          last =  it?.EmpID?.includes(searchString.trim().toLowerCase());
        }else if(it.fullName){  
          first =  it?.fullName?.toLowerCase().includes(searchString.trim().toLowerCase());
          last =  it?.empnewid?.includes(searchString.trim().toLowerCase());
        } 
        return (first+last)
    }) 
 }
 

}
