import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amountMask'
})
export class AmountMaskPipe implements PipeTransform {

  transform(value: any,statusId?:number,): any {
    let userData = window.sessionStorage['userData'];
    if (!value) {
      return '';
    }
    //  payroll team
    if(userData?.RoleId === 9){
      return value; 
    }
     /**200 for candidate joined/ 6 for fulfilled externally talent*/
    else if(statusId == 200 || statusId == 6){
      // let amount = value.toString().replace(/[0-9]/g, '*');
      let amount = 'XXXXXXXX'

      return amount;
    }
    else{
     return value;
    }

    
  }

}