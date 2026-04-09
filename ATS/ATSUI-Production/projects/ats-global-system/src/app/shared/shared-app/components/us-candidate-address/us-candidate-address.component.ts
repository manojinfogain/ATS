import { Component, OnInit,Input } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-us-candidate-address',
  templateUrl: './us-candidate-address.component.html',
  styleUrls: ['./us-candidate-address.component.scss']
})
export class UsCandidateAddressComponent implements OnInit {
  @Input() group: UntypedFormGroup = new  UntypedFormGroup({});
  @Input() formColClass:string = 'ats-form-col';
  @Input() appearance:string ='outline';
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
    // this.group.addControl('addressLine3', new FormControl(null));
    this.group.addControl('city', new UntypedFormControl(null,[Validators.required]));
    this.group.addControl('state', new UntypedFormControl(null,[Validators.required]));
    this.group.addControl('postalCode', new UntypedFormControl(null,[Validators.required]));
    this.group.addControl('country', new UntypedFormControl(null,[Validators.required]))}
}
