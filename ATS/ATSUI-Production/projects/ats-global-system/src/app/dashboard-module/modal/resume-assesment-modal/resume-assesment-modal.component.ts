import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { GlobalApisService } from '../../../core/services/global-apis.service';
import { catchError, forkJoin, of } from 'rxjs';
import { DashboardService } from '../../dashboard.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { GlobalMethod } from '../../../core/common/global-method';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import { ShareService } from '../../../core/services/share.service';
import { ViewResumeAiRatingDetailsComponent } from '../../../common-sharing/modals/view-resume-ai-rating-details/view-resume-ai-rating-details.component';
import { labelResumeRating } from '../../../core/constant/common.const';
import { ViewTalentFullDetailsModalComponent } from '../../../talent-module/job-requisition-list/modals/view-talent-full-details-modal/view-talent-full-details-modal.component';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';
import { CONSTANTS } from '../../../core/constant/constants';
import { InterviewCommonService } from '../../../core/services/interview-common.service';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
@Component({
  selector: 'app-resume-assesment-modal',
  templateUrl: './resume-assesment-modal.component.html',
  styleUrls: ['./resume-assesment-modal.component.scss'],
})
export class ResumeAssesmentModalComponent implements OnInit {
  resumeForm: UntypedFormGroup;

  parsedResumes = [];
  public FilterCtrl: UntypedFormControl = new UntypedFormControl([]);
  public searchInput: string;
  public FilterCtrlAd: UntypedFormControl = new UntypedFormControl([]);
  public searchInputAd: string;
  public salaryTypeList: any = this.getSalaryTypeListLocationWise();
  public maxDate: Date = new Date();
  public minDate: Date = new Date();
  dialogRef1: MatDialogRef<ViewResumeAiRatingDetailsComponent> | null = null;
  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ResumeAssesmentModalComponent>,
    private _globalServe: GlobalApisService,
    public _dashServe: DashboardService,
    private http: HttpClient,
    private _storage: GetSetStorageService,
    private _share: ShareService,
    public dialog: MatDialog,
    private getLocInfo: GetLocationInfo,
    private _intCommonServe: InterviewCommonService,
  ) {
    this.resumeForm = this.fb.group({
      resumes: this.fb.array([]),
    });
  }

  skillDataList: any[] = [];
  public skillProficiencyLevel: any = [];
  public isLocationIndia: boolean = true;
  ngOnInit(): void {
    this.isLocationIndia = this.getLocInfo.isLocationIndia();
    this.getGender();
    this.getCurrencyType();
    this.getEmpType();
    this.getCompanyListDaata('');
    this._globalServe.getSkillProficiencyLevelMaster().subscribe((res) => {
      this.skillProficiencyLevel = res['data'];
    });
    this.FilterCtrl.valueChanges.subscribe((val) => {
      this.searchInput = val;
    });
    this.FilterCtrlAd.valueChanges.subscribe((val) => {
      this.searchInputAd = val;
    });
    this._globalServe.getSkill().subscribe((res) => {
      this.skillDataList = res['data'];
      if (this.data && this.data?.parsedResumes) {
        debugger;
        this.parsedResumes = this.data?.parsedResumes;
        this.buildFormFromParsedData();
      }
    });
    // this.buildFormFromParsedData();

    // if (this.data && this.data?.parsedResumes) {
    //   debugger;
    //   this.parsedResumes = this.data?.parsedResumes;
    //   this.buildFormFromParsedData();
    // }
  }


/***ngb */
isOverPopover = false;
  isOverButton = false;

  onMouseEnter(popover: any) {
    this.isOverButton = true;
    popover.open();
  }

  onMouseLeave(popover: any) {
    this.isOverButton = false;

    setTimeout(() => {
      if (!this.isOverPopover && !this.isOverButton) {
        popover.close();
      }
    }, 200);
  }

  //get Salary Type List LocationWise
  getSalaryTypeListLocationWise() {
    if (this.getLocInfo.isLocationIndia()) {
      return CONSTANTS.salaryType?.filter((d) => d?.id == 1 || d?.id == 2);
    } else {
      return CONSTANTS.salaryType;
    }
  }

  public genderType: any = [];
  getGender() {
    this._globalServe.getGenderList().subscribe((res) => {
      this.genderType = res['data'];
    });
  }
  //  get currencyTypeData
  public currencyTypeData: any = [];
  getCurrencyType() {
    this._globalServe.getCurrency().subscribe((res) => {
      this.currencyTypeData = res;
    });
  }
  public candidateTypeData: any = [];
  getEmpType() {
    //get cand type
    this._intCommonServe.getCandidateType().subscribe((res) => {
      let filterById: any = [];
      if (environment.locationWise) {
        if (this.getLocInfo.isLocationIndia()) {
          filterById = [1, 2];
        } else {
          filterById = [4, 5, 6, 7, 8, 9];
        }
      } else {
        filterById = [1, 2];
      }
      this.candidateTypeData = res.filter((t) => {
        return filterById.indexOf(t.typeId) !== -1;
      });
    });
  }

  public listData: any = [];
  getCompanyListDaata(queryParam: string): void {
    this._globalServe.getCompanyListPaging(queryParam).subscribe((res) => {
      this.listData = res['data'];
    });
  }

  /**view candidate full details modal open */
  viweTalentFullDetailsModal(elm: any) {
    elm['title'] = 'View Talent ID Details';
    elm['TH_ID'] = this.data?.profileData?.thid;
    elm['CTHID'] = this.data?.profileData?.thid;
    const dialogRef = this.dialog.open(ViewTalentFullDetailsModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
      }
    });
  }

  getSkillIdsFromCoreSkills(coreSkills: string, masterSkills: any): any {
    if (!coreSkills || !masterSkills || masterSkills.length === 0) return [];

    const coreSkillList = coreSkills
      .split(',')
      .map((skill) => skill.trim().toLowerCase());

    const matchedSkillIds = masterSkills
      .filter(
        (ms) =>
          ms.SkillName &&
          coreSkillList.includes(ms.SkillName.trim().toLowerCase())
      )
      .map((ms) => ms.SkillId);

    return [...new Set(matchedSkillIds)];
  }

  get resumes(): UntypedFormArray {
    return this.resumeForm.get('resumes') as UntypedFormArray;
  }

  public resumesRaw: any[] = [];
  selectedItem: any;
  buildFormFromParsedData() {
    // Sort the original response by overallRating (ascending, so highest at bottom)
    this.parsedResumes.sort(
      (a, b) => (b.overallRating ?? 0) - (a.overallRating ?? 0)
    );

    debugger;
    this.parsedResumes.forEach((resume) => {
      // const skillIds = this.getSkillIdsFromCoreSkills(
      //   resume?.coreSkills,
      //   this.skillDataList
      // );
      let v = resume?.skillsIds?.length > 0 ? resume?.skillsIds[0] : null;
      debugger;
      this.resumes.push(
        this.fb.group({
          firstName: [resume?.firstName ? resume?.firstName : null],
          middleName: [resume?.middleName ? resume?.middleName : null],
          lastName: [resume?.lastName ? resume.lastName : null],
          email: [resume?.email ? resume.email : null],
          countryCode: [resume?.countryCode ? resume?.countryCode : null],
          phone: [resume?.mobileNumber ? resume?.mobileNumber : null],
          // totalExpYear: [
          //   resume?.totalExperienceInYears
          //     ? resume?.totalExperienceInYears
          //     : null,
          // ],
          // totalExpMonth: [
          //   resume?.totalExperienceInMonths
          //     ? resume?.totalExperienceInMonths
          //     : null,
          // ],
          // releventExpYear: [resume?.relevantExperienceInYears
          //   ? resume?.relevantExperienceInYears
          //   : null,],
          // releventExpMonth: [resume?.relevantExperienceInMonths
          //   ? resume?.relevantExperienceInMonths
          //   : null,],
          totalExpYear: [resume?.totalExperienceInYears ?? null],
          totalExpMonth: [resume?.totalExperienceInMonths ?? null],
          releventExpYear: [resume?.relevantExperienceInYears ?? null],
          releventExpMonth: [resume?.relevantExperienceInMonths ?? null],
          skill: [resume?.skillsIds?.length > 0 ? resume?.skillsIds[0] : null],
          additionalSkill: [
            resume?.additionalSkillsIds?.length > 1
              ? resume?.additionalSkillsIds[1]
              : null,
          ],
          dob: [resume?.DOB ? this.normalizeDate(new Date(resume?.DOB)) : null],
          selected: [false],
          gender: [null],
          qualification: [null],
          currCompany: [null],
          joinDate: [null],
          countryID: [null],
          cityID: [null],
          currencyType: [null],
          SalaryType: [null],
          currentSalary: [null],
          expectedSalary: [null],
          candidateType: [null],
        })
      );
    });
    this.resumesRaw = this.parsedResumes;

    if (this.data && !this.data?.isProfileExist) {
      setTimeout(() => {
        this.SaveHistoryAssesstProfile();
      }, 1000);
    }
  }

  //country id
  public CountryId: number;
  getCountry(e) {
    this.CountryId = e;
  }

  /**
   * Normalize date to avoid timezone offset issues
   * Sets time to noon (12:00:00) to prevent date shifting when converting to UTC
   */
  normalizeDate(date: Date): Date {
    if (!date) return null;
    const normalized = new Date(date);
    normalized.setHours(12, 0, 0, 0);
    return normalized;
  }

  /**
   * Handle date change event for datepicker fields
   * Normalizes the date to prevent timezone offset issues
   */
  onDateChange(event: any, fieldName: string, index: number): void {
    const selectedDate = event.value;
    if (selectedDate) {
      const normalizedDate = this.normalizeDate(selectedDate);
      const resumesArray = this.resumeForm.get('resumes') as UntypedFormArray;
      const resumeGroup = resumesArray.at(index) as UntypedFormGroup;
      resumeGroup.get(fieldName)?.setValue(normalizedDate, { emitEvent: false });
    }
  }

  /***
   * Checkbox click event handler to toggle required validation
   */
  checkboxClick(event: any, index: number) {
    // event.stopPropagation()
    const resumesArray = this.resumeForm.get('resumes') as UntypedFormArray;
    const resumeGroup = resumesArray.at(index) as UntypedFormGroup;
    debugger;
    if (event.checked) {
      // If checked, set all fields to required
      resumeGroup.get('firstName')?.setValidators([Validators.required]);
      resumeGroup.get('email')?.setValidators([Validators.required,Validators.email]);
      resumeGroup.get('countryCode')?.setValidators([Validators.required]);
      resumeGroup.get('phone')?.setValidators([Validators.required]);
      resumeGroup.get('totalExpYear')?.setValidators([Validators.required]);
      resumeGroup.get('totalExpMonth')?.setValidators([Validators.required]);
      resumeGroup.get('skill')?.setValidators([Validators.required]);
      resumeGroup.get('additionalSkill')?.setValidators([Validators.required]);
      resumeGroup.get('releventExpYear')?.setValidators([Validators.required]);
      resumeGroup.get('releventExpMonth')?.setValidators([Validators.required]);
      // location specific validation
      if(this.isLocationIndia){
        resumeGroup.get('dob')?.setValidators([Validators.required]);
     
      }
      
    } else {
      // If unchecked, remove all validators
      resumeGroup.get('firstName')?.clearValidators();
      resumeGroup.get('email')?.clearValidators();
      resumeGroup.get('countryCode')?.clearValidators();
      resumeGroup.get('phone')?.clearValidators();
      resumeGroup.get('totalExpYear')?.clearValidators();
      resumeGroup.get('totalExpMonth')?.clearValidators();
      resumeGroup.get('skill')?.clearValidators();
      resumeGroup.get('additionalSkill')?.clearValidators();
      resumeGroup.get('releventExpYear')?.clearValidators();
      resumeGroup.get('releventExpMonth')?.clearValidators();
      resumeGroup.get('dob')?.clearValidators();

     
    }

     // Update validity after clearing validators
      resumeGroup.get('firstName')?.updateValueAndValidity();
      resumeGroup.get('email')?.updateValueAndValidity();
      resumeGroup.get('countryCode')?.updateValueAndValidity();
      resumeGroup.get('phone')?.updateValueAndValidity();
      resumeGroup.get('totalExpYear')?.updateValueAndValidity();
      resumeGroup.get('totalExpMonth')?.updateValueAndValidity();
      resumeGroup.get('skill')?.updateValueAndValidity();
      resumeGroup.get('additionalSkill')?.updateValueAndValidity();
      resumeGroup.get('releventExpYear')?.updateValueAndValidity();
      resumeGroup.get('releventExpMonth')?.updateValueAndValidity();
      resumeGroup.get('dob')?.updateValueAndValidity();
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async preparePayloadWithBase64(data: any[]): Promise<any[]> {
    const updatedData = await Promise.all(
      data.map(async (item: any) => {
        if (item.file) {
          const base64String = await this.convertFileToBase64(item.file);
          return {
            ...item,
            base64: base64String,
            fileName: item.file.name,
            fileSize: item.file.size,
            fileType: item.file.type, // Optional: can also include MIME type
          };
        }
        return item;
      })
    );
    return updatedData;
  }

  public finalData: any[] = [];

  SaveHistoryAssesstProfile() {
    const selectedResumes = this.resumeForm.value.resumes;
    if (selectedResumes.length === 0) {
      this._share.showAlertErrorMessage.next(
        'Please select at least one resume to submit.'
      );
      return;
    }
    debugger;
    console.log('Selected Resume(s):', selectedResumes);
    console.log('All Resume Data:', this.resumeForm.value.resumes);

    const finalPayload = selectedResumes.map((formItem) => {
      // Match email against both possible fields
      const matchedResume = this.parsedResumes.find(
        (resume) =>
          resume.email?.toLowerCase() === formItem.email?.toLowerCase()
      );

      return {
        ...formItem,
        file: matchedResume?.file ?? null,
        filename: matchedResume?.filename ?? null,
        filenameMap: matchedResume?.filename ?? null,
        // ...(matchedResume?.keyResume && { keyResume: matchedResume.keyResume }),
      };
    });
    this.finalData = finalPayload;

    const formData = new FormData();
    // Append all files to formData
    // finalPayload.forEach((candidate, index) => {
    //   if (candidate.file) {
    //     formData.append(`files[${index}]`, candidate.file, candidate.file.name);
    //   }
    // });
    // Append each file separately
    finalPayload.forEach((candidate, index) => {
      debugger;
      if (candidate.file) {
        formData.append(`files`, candidate.file, candidate.file.name);
      }
    });

    formData.append('StatusId', '7');
    formData.append('ProfileId', this.data?.profileData?.profileId || '0');
    formData.append('thid', this.data?.profileData?.thid || '0');
    formData.append('profiles', JSON.stringify(finalPayload));
    this._dashServe
      .AddMultipleProfilesAfterAssesments(formData)
      .subscribe((res) => {
        //  this._share.showAlertSuccessMessage.next(res['Message']);
        // this.dialogRef.close(true);
      });
  }
  onSubmit() {
    this.resumeForm;
    debugger;
    if (!this.resumeForm.valid) {
      this._share.showAlertErrorMessage.next(
        'Please fill all required fields before submitting.'
      );
      return;
    }
    const selectedResumes = this.resumeForm.value.resumes.filter(
      (r: any) => r.selected
    );
    if (selectedResumes.length === 0) {
      this._share.showAlertErrorMessage.next(
        'Please select at least one resume to submit.'
      );
      return;
    }
    debugger;
    console.log('Selected Resume(s):', selectedResumes);
    console.log('All Resume Data:', this.resumeForm.value.resumes);

    const finalPayload = selectedResumes.map((formItem) => {
      // Match email against both possible fields
      const matchedResume = this.parsedResumes.find(
        (resume) =>
          resume.email?.toLowerCase() === formItem.email?.toLowerCase()
      );

      return {
        ...formItem,
        file: matchedResume?.file ?? null,
        filename: matchedResume?.filename ?? null,
        filenameMap: matchedResume?.filename ?? null,
        // ...(matchedResume?.keyResume && { keyResume: matchedResume.keyResume }),
      };
    });
    this.finalData = finalPayload;

    const formData = new FormData();
    // Append all files to formData
    // finalPayload.forEach((candidate, index) => {
    //   if (candidate.file) {
    //     formData.append(`files[${index}]`, candidate.file, candidate.file.name);
    //   }
    // });
    // Append each file separately
    finalPayload.forEach((candidate, index) => {
      debugger;
      if (candidate.file) {
        formData.append(`files`, candidate.file, candidate.file.name);
      }
    });

    formData.append('StatusId', '7');
    formData.append('ProfileId', this.data?.profileData?.profileId || '0');
    formData.append('thid', this.data?.profileData?.thid || '0');
    formData.append('profiles', JSON.stringify(finalPayload));
    if (this.data?.isProfileExist) {
      formData.append('candidateId', this.data?.profileData?.cid || '0');
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to Submit?`,
        buttonText: {
          ok: 'Yes',
          cancel: 'No',
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._dashServe.AddMultipleProfiles(formData).subscribe((res) => {
          this._share.showAlertSuccessMessage.next(res['Message']);
          this.dialogRef.close(true);
        });
      }
    });

    // this.preparePayloadWithBase64(this.finalData).then((finalPayload) => {
    //   debugger
    //   console.log("Final Payload with Base64", finalPayload);
    //   // Now you can send it in an API or process further
    // });

    // const requests: any[] = [];
    // let empId = this._storage.getUserEmpId();
    // finalPayload.forEach((resume) => {
    //   const formData = new FormData();
    //   formData.append('id', '0');
    //   formData.append('firstName', resume.firstName || '');
    //   formData.append('middleName', resume.middleName || '');
    //   formData.append('lastName', resume.lastName || '');
    //   formData.append('Email', resume.email || '');
    //   formData.append('CountryCOde', resume.countryCode || '');
    //   formData.append('MobileNumber', resume.phone || '');
    //   formData.append('totalExp', resume.totalExpYear?.toString() || '0');
    //   formData.append('totalExpMonth', resume.totalExpMonth?.toString() || '0');
    //   formData.append('releventExp', resume.releventExpYear?.toString() || '0');
    //   formData.append(
    //     'relExpMonth',
    //     resume.releventExpMonth?.toString() || '0'
    //   );
    //   formData.append('PrimarySkill', resume.skill || '');
    //   formData.append('SecondarySkill', resume.additionalSkill || '');
    //   formData.append('StatusId', '7');
    //   formData.append('AddedBy', '100037');
    //   formData.append('ProfileId', this.data?.profileData?.id || '0');
    //   formData.append('thid', this.data?.data?.th_id || '0');
    //   formData.append(
    //     'dob',
    //     resume.dob ? GlobalMethod.formatDate(resume.dob) : ''
    //   );

    //   if (resume.file) {
    //     formData.append('Resume', resume.file, resume.file.name);
    //   }
    //   let url: string =
    //     environment.apiMainUrlNet + 'Dashboard/addupdateCandidateDetailsFile';
    //   // Push raw HTTP POST observable (no pipe)
    //   requests.push(this.http.post<any>(url, formData));
    // });

    // // 🔁 Execute all requests in parallel
    // forkJoin(requests).subscribe({
    //   next: (responses) => {
    //     console.log('✅ All resumes submitted:', responses);
    //     alert('All resumes submitted successfully!');
    //     this.dialogRef.close(true);
    //   },
    //   error: (error) => {
    //     console.error('❌ One of the submissions failed:', error);
    //     alert('Submission failed for one or more resumes. Please try again.');
    //   },
    // });
    // debugger;
    // call backend API to save all
  }

  hideModal() {
    this.dialogRef.close();
  }

  /***
   * view ai rating details
   */
  openCandidateRatingDetailsModal(elm: any = {}) {
    debugger;
    let name = elm?.firstName + ' ' + elm?.lastName;
    elm['title'] = labelResumeRating?.modalViewResumeRatingTitle + ` - ${name}`;
    elm['isProfileInterview'] = 0;
    elm['id'] = elm.id;
    elm['name'] = name;
    elm['isDBFrom'] = false;
    if (!this.dialogRef1) {
      const dialogRef = this.dialog.open(ViewResumeAiRatingDetailsComponent, {
        panelClass: ['ats-model-wrap', 'ats-rating-dtp-modal'],
        data: elm,
        width: '500px',
      });
    }
  }
}
