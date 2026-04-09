import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { InrerviewsService } from '../../../inrerviews.service';

@Component({
  selector: 'app-update-profile-source-modal',
  templateUrl: './update-profile-source-modal.component.html',
  styleUrls: ['./update-profile-source-modal.component.scss']
})
export class UpdateProfileSourceModalComponent implements OnInit {
  public isloader: boolean = false;
  public updateProfileSourceForm: UntypedFormGroup = new UntypedFormGroup({});
  public profileNameData: any = [];
  public maxDate: any = new Date();
  public originalProfileSource: any = null;
  public originalDOB: any = null;
  public isRenuTeam: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<UpdateProfileSourceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _share: ShareService,
    private _fb: UntypedFormBuilder,
    private _intCommonServe: InterviewCommonService,
    private _globalCommonMethod: GlobalCommonMethodService,
    private getLocInfo: GetLocationInfo,
    private intServe: InrerviewsService
  ) { }

  ngOnInit(): void {
    this.formInit({});
    this.getProfileSource({});
  }


  formInit(data) {
    this.updateProfileSourceForm = this._fb.group({
      profileSource: [null],
      DOB:[null],
      Remarks: [null]
    });
    
    // Store original values for comparison
    this.originalProfileSource = this.data?.ProfileId || null;
    this.originalDOB = this.data?.dob ? new Date(this.data.dob) : null;
    
    // Only patch DOB initially, profileSource will be patched after API loads
    this.updateProfileSourceForm.patchValue({
      DOB: this.data?.dob ? new Date(this.data.dob) : null,
      Remarks: null
    });
  }

  //   * change date
  //  */
  // changeDate(type: string, event: any) {
  //   this.addPartnerContractsForm.get('EndDate').reset();
  //   this.minDate = new Date(event.value);
  // }

  /**
     * getProfileSource
     */
  getProfileSource(data: any) {
    //get Profile Name
    this._intCommonServe.getProfileName().subscribe({
      next: (res) => {
        if (environment.locationWise) {
          if (this.getLocInfo.isLocationIndia()) {
            this.loadIndiaProfileSource(data, res);
          }
          else {
            this.profileNameData = this._globalCommonMethod.getProfileUs(data, res);
          }
        }
        else {
          this.loadIndiaProfileSource(data, res);
        }
        // Re-patch form after profile data is loaded to ensure correct selection
        this.patchFormAfterDataLoad();
      },
      error: (error) => {
        console.error('Error loading profile sources:', error);
        this._share.showAlertErrorMessage.next('Failed to load profile sources. Please try again.');
        
        // Still try to patch form with existing data
        this.patchFormAfterDataLoad();
      }
    });
  }
  
  loadIndiaProfileSource(data: any, res: any) {
    if (this.isRenuTeam) {
      this.profileNameData = this._globalCommonMethod.getProfileRenuTeamG5Above(data, res);
    }
    else {
      this.profileNameData = this._globalCommonMethod.getProfileIndia(data, res);
    }
  }

  /**
   * Patch form after all data is loaded
   */
  patchFormAfterDataLoad() {
    if (this.data && this.profileNameData && this.profileNameData.length > 0) {
      // Use setTimeout to ensure the dropdown is fully rendered
      setTimeout(() => {
        const profileSourceValue = this.originalProfileSource; 
        // Verify the profile source exists in the dropdown options
        const profileExists = this.profileNameData.find(p => p.id === profileSourceValue);
        this.updateProfileSourceForm.patchValue({
          profileSource: profileSourceValue,
          DOB: this.originalDOB,
          Remarks: null
        });
        
      }, 200); // Increased timeout to ensure rendering
    } else {
      console.warn('Cannot patch form - missing required data:', {
        hasData: !!this.data,
        hasProfileData: !!this.profileNameData,
        profileDataLength: this.profileNameData?.length || 0
      });
    }
  }
  onNoClick() {
    this.dialogRef.close();
  }
  
  getControl(name: string) {
    return this.updateProfileSourceForm.get(name);
  }

  /**
   * Check if any field has been changed from original values
   */
  hasFormChanges(): boolean {
    const formData = this.updateProfileSourceForm.value;
    
    // Check profile source change
    const hasProfileSourceChange = formData?.profileSource !== this.originalProfileSource;
    
    // Check DOB change - handle both null/undefined and date comparison
    let hasDOBChange = false;
    if (formData?.DOB && this.originalDOB) {
      hasDOBChange = new Date(formData.DOB).getTime() !== new Date(this.originalDOB).getTime();
    } else if (formData?.DOB && !this.originalDOB) {
      hasDOBChange = true; // New DOB when there was none
    } else if (!formData?.DOB && this.originalDOB) {
      hasDOBChange = true; // DOB cleared when there was one
    }
    
    return hasProfileSourceChange || hasDOBChange;
  }

  /**
   * Get changed fields for better user feedback
   */
  getChangedFields(): string[] {
    const formData = this.updateProfileSourceForm.value;
    const changedFields: string[] = [];
    
    if (formData?.profileSource !== this.originalProfileSource) {
      changedFields.push('Profile Source');
    }
    
    // Check DOB change with better logic
    let hasDOBChange = false;
    if (formData?.DOB && this.originalDOB) {
      hasDOBChange = new Date(formData.DOB).getTime() !== new Date(this.originalDOB).getTime();
    } else if (formData?.DOB && !this.originalDOB) {
      hasDOBChange = true;
    } else if (!formData?.DOB && this.originalDOB) {
      hasDOBChange = true;
    }
    
    if (hasDOBChange) {
      changedFields.push('Date of Birth');
    }
    
    return changedFields;
  }

  public contactList: any = [];

  /**submit*/
  updateProfileSourceHandler(form: any) {
    this.updateProfileSourceForm.markAllAsTouched();
    // Check if at least one field has been changed
    if (!this.hasFormChanges()) {
      this._share.showAlertErrorMessage.next('Please update at least one field (Profile Source or DOB) before submitting.');
      return;
    }

    if (form.valid) {
      let formData = form.value;
      let formBody: any = {};
      
      // Always include candidate ID
      formBody['cid'] = this.data?.cid;
      
      // Always include remarks if provided
      if (formData?.Remarks) {
        formBody['Remarks'] = formData.Remarks;
      }
      
      // Only include profileSource if it has changed
      const hasProfileSourceChange = formData?.profileSource !== this.originalProfileSource;
      if (hasProfileSourceChange) {
        formBody['profileSourceId'] = formData?.profileSource;
      }
      
      // Only include DOB if it has changed
      let hasDOBChange = false;
      if (formData?.DOB && this.originalDOB) {
        hasDOBChange = new Date(formData.DOB).getTime() !== new Date(this.originalDOB).getTime();
      } else if (formData?.DOB && !this.originalDOB) {
        hasDOBChange = true; // New DOB when there was none
      } else if (!formData?.DOB && this.originalDOB) {
        hasDOBChange = true; // DOB cleared when there was one
      }
      
      if (hasDOBChange) {
        formBody['DOB'] = formData?.DOB ? GlobalMethod.formatDate(formData.DOB) : null;
      }
      this.isloader = true;
      this.intServe.updateCandidateSourceDob(formBody).subscribe(
        res => {
          this.isloader = false;
          const changedFields = this.getChangedFields();
          const successMessage = `Successfully updated: ${changedFields.join(', ')}`;
          this._share.showAlertSuccessMessage.next(successMessage);
          this.dialogRef.close(true);
        },
        error => {
          this.isloader = false;
          this._share.showAlertErrorMessage.next(error?.error);
        }
      )

    }
    else {
      this._share.showAlertErrorMessage.next('Please correct the form errors before submitting.');
    }

  }



  closeModal(): void {
    this.dialogRef.close();
  }

}
