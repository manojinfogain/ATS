import { AbstractControl, ValidatorFn } from '@angular/forms';
export class CustomValidation {

    static emailContainInfogain(AC: AbstractControl) {
        let password = AC?.get('password')?.value;
        if(AC?.get('confirmPassword')?.touched || AC?.get('confirmPassword')?.dirty) {
            let verifyPassword = AC?.get('confirmPassword')?.value;

            if(password != verifyPassword) {
                AC?.get('confirmPassword')?.setErrors( {MatchPassword: true} )
            } else {
                return null
            }
            
        }
        return null
    }

    static minLenNoWhitespace(minLen: number): ValidatorFn{
        return (control: AbstractControl): {[key: string]: any} | null => {
          const value = control.value;
          const nonWhitespaceLen = value ? value.replace(/\s/g, '').length : 0;
          return nonWhitespaceLen < minLen ? { 'minLenNoWhitespace': { value: control.value } } : null;
        };
      }

}