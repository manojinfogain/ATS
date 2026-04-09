import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import {COMMON_CONST,FILE_UPLOAD} from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
 @Input() public formControlOpt: UntypedFormControl = new UntypedFormControl();
 @Input() public allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf)$/i;
 @Input() public allowedExtensionsMsg = 'jpeg/jpg/png/txt/pdf/doc/docx/rtf';
 @Output() getFile = new EventEmitter<any>();
  constructor(
    private _share:ShareService

  ) { }

  ngOnInit(): void {
  }

  fileUp(event) {
     let file = event.target.files[0];
     let fileName = file.name;
     if (!this.allowedExtensions.exec(fileName)) {
       this._share.showAlertErrorMessage.next(`Please upload file type  ${this.allowedExtensionsMsg} only.`);
       event.target.value = "";
       return false;
     }
     else if (file.size > FILE_UPLOAD.FILE_SIZE) {
       this._share.showAlertErrorMessage.next(`Image  uploaded cannot be greater than 15MB.`);
       event.target.value = "";
       return false;
     }
     else{
       this.getFile.emit(file);
     }
   }

}
