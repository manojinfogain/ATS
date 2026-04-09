import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Pipe({
    name: 'profileImagePipe'
})
export class DefaultProfileImagePipe implements PipeTransform {

    constructor(protected sanitizer: DomSanitizer) { }

    public transform(value: any) {
        return value ? 'https://aspire.infogain.com/ImageHandler1.ashx?n='+value : "assets//images/no-profile-male.png";
    }
}