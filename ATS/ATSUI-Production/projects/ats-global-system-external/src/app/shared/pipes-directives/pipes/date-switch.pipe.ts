import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateSwitch'
})
export class dateSwitchPipe implements PipeTransform {
  public lang:String = null;
  constructor(){
  }
  transform(val:string,elm:any ) {
    if(!val){
      return val  
    }
    if(elm['interviewDateUTC'] == null || elm['interviewDateUTC'] == ''){
     return   val = elm['interviewDate'];
    }
    else{
      return  val = elm['interviewDateUTC'];
    }
   
    
  }

}