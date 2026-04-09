

  import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl, Validators } from '@angular/forms';
  import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { BgvServiceService } from 'projects/ats-global-system/src/app/bgv-module/bgv-service.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
  
  @Component({
    selector: 'app-onboarding-send-cred-confirmation-dialog',
    templateUrl: './onboarding-send-cred-confirmation-dialog.component.html',
    styleUrls: ['./onboarding-send-cred-confirmation-dialog.component.scss']
  })
  export class OnboardingSendCredConfirmationDialogComponent implements OnInit {
  
    public isHideCancel:boolean = true;
    public locationList:any = [];
    public isLocationAvailable:boolean = false;
    public isPackageAvailable:boolean = false;
    public selectedLocation:any = '';
    public locationId: UntypedFormControl = new UntypedFormControl();
    public PackageId: UntypedFormControl = new UntypedFormControl();
     public vendorIdCtrl: FormControl = new FormControl();
     public isOnGridSelected:boolean = false;
    public vendorList:any = [
      {Id: 1, Name: 'Securitas'},
      {Id: 2, Name: 'OnGrid'},
    ];
    constructor( 
      public dialogRef: MatDialogRef<OnboardingSendCredConfirmationDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,      
      private _globalApiServe: GlobalApisService,
      private _share: ShareService,
      public _bgvServe: BgvServiceService,
    ) { }
  
    ngOnInit(): void {
     // this.data['freezeVendor'] = 1;
      if(this.data?.isHideCancel == 0){
        this.isHideCancel = this.data?.isHideCancel;
      }
      this.getLocation();
      this.GetPackageList();
      // this.getDivisionList();
      this.isLocationAvailable = this.data?.joiningLocationId ? true : false;
      this.isPackageAvailable = this.data?.packageId ? true : false;
      this.locationId.patchValue(this.data?.joiningLocationId);
      this.PackageId.patchValue(this.data?.packageId);
      this.vendorIdCtrl.patchValue(this.data?.BGVVender);
     
       
      
      if(this.data?.BGVVender == 2){
        this.isOnGridSelected = true;
      }else{
        this.isOnGridSelected = false;
      }

      if(this.data?.IsNewCaseForBGV == 'Y' && !this.isOnGridSelected){
        this.PackageId.setValidators([Validators.required]);
        this.PackageId.updateValueAndValidity();
      }else{
        this.PackageId.clearValidators();
        this.PackageId.updateValueAndValidity();
      }
      // this.setDefaultVendor(this.data?.joiningLocationId);
    }
 
   
    onVendorChange(e:any){
      //2 on grid
      if(e?.value == 2){
        this.isOnGridSelected = true;
        this.PackageId.clearValidators();
        this.PackageId.reset();
      }else{
        this.isOnGridSelected = false;
         this.PackageId.patchValue(this.data?.packageId);
         
      }
      this.PackageId.updateValueAndValidity();
    }

    getLocation() {
      this._globalApiServe.getLocationList().subscribe(
        res => {
          let ids = [];
            ids = [1, 2, 4, 5, 16,23];
          // }
          let filterLocation = res['data'].filter(loc => {
            return ids.indexOf(loc.LocID) !== -1;
          })
          this.locationList = filterLocation;
          if(this.data?.joiningLocationId){
            this.selectedLocation = this.locationList?.filter(loc => loc.LocID == this.data?.joiningLocationId)[0]?.LocName;
          }
        }
      );
    }
    submitDialog(){
      this.locationId.markAsTouched();
      this.PackageId.markAsTouched();
      this.vendorIdCtrl.markAsTouched();
      
      if(this.locationId?.valid && this.PackageId?.valid && this.vendorIdCtrl?.valid){
        let body = {};
        
        body['locationId'] = this.locationId?.value;
        body['packageId'] = this.PackageId?.value;
        body['vendorId'] = this.vendorIdCtrl?.value;
        body['flag'] = true;
        body['vendorId'] = this.vendorIdCtrl?.value;
        this.dialogRef.close(body);
      }else{        
        if(this.locationId?.invalid){
          this._share.showAlertErrorMessage.next('Please choose joining location.');
        }else if(this.PackageId?.invalid){
          this._share.showAlertErrorMessage.next('Please choose BGV package.');
        }else if(this.vendorIdCtrl?.invalid){
          this._share.showAlertErrorMessage.next('Please choose vendor.');
        }else{
          this._share.showAlertErrorMessage.next('Please choose required fields.');
        }
      }
    }
    
  /***
  * getPackage list
  */
 public statusList:any = [];
 public selectedPackage:any = '';
  GetPackageList(): void {
    let joiningLocationId = this.data?.joiningLocationId ? this.data?.joiningLocationId : this.locationId?.value;
    if(joiningLocationId){
      this._bgvServe.GetPackagesList(joiningLocationId).subscribe(
        res => {
          this.statusList = res['data'];
          if(this.data?.packageId){
              this.selectedPackage = this.statusList?.filter(pkg => pkg.Id == this.data?.packageId)[0]?.PackageName;
            }
        }
      );
    }
  }

  onLocationChange(event:any){
    this.GetPackageList();
    this.setDefaultVendor(event.value);
  }

  /** set vendor dropdown default value based on location */
  /** for banglore and Noida - Securitas selection
   * for rest other Ongrid selection
   */
   setDefaultVendor(locationId?: number){
    if(locationId === 1 || locationId === 4){
        this.vendorIdCtrl.patchValue(1); // Securitas
       //  this.vendorIdCtrl.patchValue(this.data?.BGVVender);
         this.isOnGridSelected = false;
         this.PackageId.addValidators(Validators.required);
         this.PackageId.updateValueAndValidity();
      }else{
        this.vendorIdCtrl.patchValue(2); // Ongrid
         this.isOnGridSelected = true;
          this.PackageId.clearValidators();
          this.PackageId.updateValueAndValidity();
      }
    }
  
  }
  