import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'lib-address-candidate',
  templateUrl: './lib-address-candidate.component.html',
  styleUrls: ['./lib-address-candidate.component.scss']
})
export class LibAddressCandidateComponent implements OnInit {
@Input() group: UntypedFormGroup = new  UntypedFormGroup({});
  @Input() formColClass:string = 'ats-form-col';
  @Input() appearance:string ='outline';
  @Input() public apiBaseUrlMaster:string = '';
  
  constructor() { }

  ngOnInit(): void {
    this.createAddressForm();
  }

  getControl(name: string) {
    return this.group.get(name);
  }

  createAddressForm(){
    this.group.addControl('addressLine1', new UntypedFormControl(null,[Validators.required]));
    this.group.addControl('addressLine2', new UntypedFormControl(null,[Validators.required]));
    this.group.addControl('addressLine3', new UntypedFormControl(null));
    this.group.addControl('city', new UntypedFormControl(null,[Validators.required]));
    this.group.addControl('state', new UntypedFormControl(null,[Validators.required]));
    this.group.addControl('postalCode', new UntypedFormControl(null,[Validators.required]));
    this.group.addControl('country', new UntypedFormControl(null,[Validators.required]))}

}
