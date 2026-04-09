import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cidPrefix'
})
export class CidPrefixPipe implements PipeTransform {

  transform(value: number, profileId: number): unknown {
    //
    if(!value){
       return value;
    }
    if(profileId == 4){
       return 'E' + value;
    }
    else if(profileId == 3){
       return 'C' + value;
    }
    else if(profileId == 5){
    return 'P' + value;
    }
    else{
      return 'R' + value;
    }
    
  }

}
