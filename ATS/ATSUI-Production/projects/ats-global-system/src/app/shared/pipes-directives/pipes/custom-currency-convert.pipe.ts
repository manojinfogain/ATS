import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyConvertPipe implements PipeTransform {
  public lang:String = null;
  constructor(){
  }
  transform(val:number,currencyId?:number,minimumFractionDigits:number= 0,maxFractionDigits:number= 0) {
    if(!val){
      return val  
    }
    if(currencyId == 1){
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits:minimumFractionDigits,
        maximumFractionDigits:maxFractionDigits
      }).format(Number(val));
    }
    else if(currencyId == 2){
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits:minimumFractionDigits,
        maximumFractionDigits:maxFractionDigits
      }).format(Number(val));
    }
    else if(currencyId == 3){
      return new Intl.NumberFormat('ar-ae', {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits:minimumFractionDigits,
        maximumFractionDigits:maxFractionDigits
      }).format(Number(val));
    }
    else if(currencyId == 4){
      return new Intl.NumberFormat('zh-SG', {
        style: 'currency',
        currency: 'SGD',
        minimumFractionDigits:minimumFractionDigits,
        maximumFractionDigits:maxFractionDigits
      }).format(Number(val));
    }

    else if(currencyId == 5){
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits:minimumFractionDigits,
        maximumFractionDigits:maxFractionDigits
      }).format(Number(val));
    }
    else if(currencyId == 6){
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits:minimumFractionDigits,
        maximumFractionDigits:maxFractionDigits
      }).format(Number(val));
    }
    else{
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits:minimumFractionDigits,
        maximumFractionDigits:maxFractionDigits
      }).format(Number(val));
    }
    
  }

}



@Pipe({
  name: 'CalenderAddKey'
})
export class CalenderAddKey implements PipeTransform {
  public lang:String = null;
  constructor(){
  }
  transform(val:any,date?:string) {
    if(!val || !date){
      return val  
    }
   
   
    for(let i =0; i<val.length;i++){
      val[i]['key']=10;
    }
    return val
    
    
  }

}
