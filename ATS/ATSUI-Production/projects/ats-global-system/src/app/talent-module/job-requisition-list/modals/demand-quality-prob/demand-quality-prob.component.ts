import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { GlobalApisService } from 'projects/ats-lib/src/lib/services/lib-global-apis.service';
import { InteralAvailableResourceModalComponent } from '../interal-available-resource-modal/interal-available-resource-modal.component';
import { DemandFulfillmentService,DemandInput } from 'projects/ats-global-system/src/app/core/common/demand-fulfillment.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-demand-quality-prob',
  templateUrl: './demand-quality-prob.component.html',
  styleUrls: ['./demand-quality-prob.component.scss'],
})
export class DemandQualityProbComponent implements OnInit, OnDestroy {
  public formTalent: UntypedFormGroup;
  public isLoadingApiData: boolean = false;
  public loadingMessage: string = 'Analyzing demand quality and probability... Please wait.';
  private loadingTimer: any;
  private loadingStage: number = 0;
  constructor(
    public dialogRef: MatDialogRef<DemandQualityProbComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _talentServ: TalentService,
    private _globalApi: GlobalApisService,
    private dialog: MatDialog,
    private demandService: DemandFulfillmentService
  ) {}
  public dlData = {
    finalData: {
      formDataDs: {
        AcccesmentLink: null,
        Billable: 'Y',
        BillableHours: '8',
        BillingType: 1,
        Designation: null,
        ExperienceId: 4,
        Frequency: '1',
        Interviewer1Tech: '103832',
        Interviewer2: '100165',
        Remarks: '',
        SFDCClient: '0016F000035ZdqcQAC',
        THIDApprovalAttachment: null,
        accountId: 838,
        additionalSkills: null,
        approveRejectstatus: null,
        approvedBy: null,
        bidTypeDropdown: null,
        billableRates: 28,
        clientWorkRequirement: 1,
        coderBytesAssesments: null,
        conversionFor: null,
        cubeGradeId: 220,
        cubePractice: null,
        cubeRoleId: 30,
        cubeSkill1: [89],
        cubeSkill2: null,
        cubeSkill3: null,
        cubeSkill4: [69],
        deliveryUnit: '33',
        designationCategories: null,
        employeeEmail: null,
        employmentType: 3,
        exclusiveInfogain: 'N',
        expectedMargin: 40,
        fileUpload: null,
        isClientInterviewRequired: 'N',
        isResourceAvailInBu: 'N',
        jobDescription:
          '',
        jobSummary: 'NET CORE and VUE JS or similar frontend framework.',
        joiningCity: null,
        joiningLocation: 4,
        joiningState: null,
        locationType: null,
        onlineAssesment: null,
        opportunityId: '0066F000018h2L0QAI',
        plannedBillingStartDate: '2025-11-10T00:00:00+05:30',
        plannedOnBoardingDate: '2025-10-31T00:00:00+05:30',
        primarySkill: 36,
        primarySkillTc: 36,
        projectNameId: 15462,
        qualification: 1,
        reasonCategory: null,
        rejectRemarks: null,
        repGradeChangeReason: null,
        replacementFor: null,
        replacementReason: null,
        requirementType: 2,
        role: null,
        subReason: null,
        subSkills: null,
        talentCubeId: 4,
        tech1InterviewBy: 2,
        techExternalPanel: null,
        techInternalPanel: 1,
        visaReady: 'N',
      },
      mergedSelectedSkills: [[89], null, null, [69], null],
      selectedSkillsRating:[{skillid:89,skillType:1,}],
    },
    selectedSkillsRating:[{skillid:89,skillType:1,}],
  };

  public formValueData: any = {};
  ngOnInit(): void {
    this.data;
    debugger;
    //  this.getInternalProbApiData();
    /***
     * formValue Bind
     */
    if (this.data?.type == 9) {
      this.getFormValueData(this.dlData);
    } else {
      this.getFormValueData(this.data);
    }
  }

  ngOnDestroy(): void {
    // Clean up the timer when component is destroyed
    this.stopProgressiveLoading();
  }

  /***
   * get Form Data
   */
  getFormValueData(data?: any) {
    this.formValueData['selectedIds'] =
      data?.finalData?.mergedSelectedSkills.filter((n) => n);
   this.formValueData['mandatorySkillsId'] = data?.selectedSkillsRating
  ?.filter((n) => n && n.skillType === 1)   // filter only skillType = 1
  .map((n) => n.skillid); 
    this.formValueData['primarySkill'] =
      data?.finalData?.formDataDs?.primarySkillTc;
    this.formValueData['grade'] = data?.finalData?.formDataDs?.cubeGradeId;
    this.formValueData['experienceRange'] =
      data?.finalData?.formDataDs?.ExperienceId;
    this.formValueData['location'] =
      data?.finalData?.formDataDs?.joiningLocation;
    this.formValueData['isResourceAvailInBu'] =
      data?.finalData?.formDataDs?.isResourceAvailInBu;
    this.formValueData['jobSummary'] = data?.finalData?.formDataDs?.jobSummary;
    this.formValueData['jobDescription'] =
      data?.finalData?.formDataDs?.jobDescription;
    this.formValueData['talentCubeId'] =
      data?.finalData?.formDataDs?.talentCubeId;
    this.formValueData['cubeSkill1'] = data?.finalData?.formDataDs?.cubeSkill1;
    this.formValueData['cubeSkill2'] = data?.finalData?.formDataDs?.cubeSkill2;
    this.formValueData['cubeSkill3'] = data?.finalData?.formDataDs?.cubeSkill3;
    this.formValueData['cubeSkill4'] = data?.finalData?.formDataDs?.cubeSkill4;
    this.formValueData['employmentType'] =
      data?.finalData?.formDataDs?.employmentType;
    this.formValueData['requirementType'] =
      data?.finalData?.formDataDs?.requirementType;
    this.formValueData['replacementReason'] = 0;
    this.formValueData['is_billable'] = data?.finalData?.formDataDs?.Billable;
    this.formValueData['billingType'] =
      data?.finalData?.formDataDs?.BillingType;
    this.formValueData['cubeRoleId'] = data?.finalData?.formDataDs?.cubeRoleId;
    this.formValueData['DemandCurrentCount'] = data?.finalData?.formDataDs?.Frequency || 0;
    debugger;
    /***
     * body psyload get by ids
     */
    let body = {
      ExperienceRange: this.formValueData?.experienceRange,
      PrimarySkill: this.formValueData?.primarySkill,
      SubSkills: this.formValueData['selectedIds'].toString(),
      AdditionalSkill1: this.formValueData?.cubeSkill1
        ? this.formValueData?.cubeSkill1.toString()
        : null,
      AdditionalSkill2: this.formValueData?.cubeSkill2
        ? this.formValueData?.cubeSkill2.toString()
        : null,
      AdditionalSkill3: this.formValueData?.cubeSkill3
        ? this.formValueData?.cubeSkill3.toString()
        : null,
      AdditionalSkill4: this.formValueData?.cubeSkill4
        ? this.formValueData?.cubeSkill4.toString()
        : null,
      MandatorySkills: this.formValueData['mandatorySkillsId'].toString()
        ? this.formValueData['mandatorySkillsId'].toString()
        : null,
      TalentCubeId: this.formValueData?.talentCubeId,
      EmploymentType: this.formValueData?.employmentType,
      RequirementType: this.formValueData?.requirementType,
      ReplacementRreason: this.formValueData?.replacementReason,
      BillingType: this.formValueData?.billingType,
      Grade: this.formValueData?.grade,
      cubeRoleId: this.formValueData?.cubeRoleId,
    };
    this.getdataByIds(body);
  }

  /***
   * get data by ids
   */

  public isSumbitted: boolean = false;
  public reasonJdQ: any = [];
  getdataByIds(body?: any) {
    this._talentServ.GetdataByIds(body).subscribe((res) => {
      debugger;
      let data = res['data'][0];
      let subskill = res['subskill']
        .map((item) => item.skillName) // get all skillName
        .filter((name) => name && name.trim()) // remove null, undefined, empty or spaces
        .join(', ');

      let additionalSkill1 = res['AdditionalSkill1']
        .map((item) => item.skillName) // get all skillName
        .filter((name) => name && name.trim()) // remove null, undefined, empty or spaces
        .join(', ');
      let additionalSkill2 = res['AdditionalSkill2']
        .map((item) => item.skillName) // get all skillName
        .filter((name) => name && name.trim()) // remove null, undefined, empty or spaces
        .join(', ');
      let additionalSkill3 = res['AdditionalSkill3']
        .map((item) => item.skillName) // get all skillName
        .filter((name) => name && name.trim()) // remove null, undefined, empty or spaces
        .join(', ');
      let additionalSkill4 = res['AdditionalSkill4']
        .map((item) => item.skillName) // get all skillName
        .filter((name) => name && name.trim()) // remove null, undefined, empty or spaces
        .join(', ');
      let mandatorySkill = res['MandatorySkills']
        .map((item) => item.skillName) // get all skillName
        .filter((name) => name && name.trim()) // remove null, undefined, empty or spaces
        .join(', ');
      debugger;

      let bodyDataInt = {
        ExperienceRange: data?.ExperienceRange || null,
        Grade: data?.Grade || null,
        PrimarySkill: data?.PrimarySkill || null,
        SubSkills: subskill || null,
        MandatorySkills: mandatorySkill || null,
        Location: data?.Location || null,
         TalentCube: data?.TalentCube ?? 'NA',
         DemandCurrentCount:this.formValueData['DemandCurrentCount'] || 0,
      };
      debugger;
      let jobBody = {
        location: data?.Location ?? 'NA',
        within_mu_allocation: 'NA',
        job_summary: this.formValueData?.jobSummary ?? 'NA',
        job_description: this.formValueData['jobDescription'] ?? 'NA',
        grade: data?.Grade ?? 'NA',
        experience: data?.ExperienceRange ?? 'NA',
        talent_cube: data?.TalentCube ?? 'NA',
        primary_skill: data?.PrimarySkill ?? 'NA',
        additional_skill1: additionalSkill1 ?? 'NA',
        additional_skill2: additionalSkill2 ?? 'NA',
        additional_skill3: additionalSkill3 ?? 'NA',
        additional_skill4: additionalSkill4 ?? 'NA',
        employment_type: data?.EmploymentType ?? 'NA',
        requirement_type: data?.RequirementType ?? 'NA',
        replacement_reason: data?.ReplacementReason ?? 'NA',
        is_billable: this.formValueData?.is_billable == 'Y' ? 'Yes' : 'No',
        billing_type: data?.BillingType ?? 'NA',
      };
      debugger;
      const payload = {
        Designation: data?.cubeRole ?? 'NA',
        Grade: data?.Grade ?? 'NA',
        Experience: data?.ExperienceRange ?? 'NA',
        JobDescription: this.formValueData['jobDescription'] ?? 'NA',
        JobSummary: this.formValueData?.jobSummary ?? 'NA',
        PrimarySkill: data?.PrimarySkill ?? 'NA',
        MandatorySkills: mandatorySkill || 'NA',
      };
      if (subskill) {
        payload['SubSkills'] = subskill.split(',').map((s) => s.trim());
      }

      // Show loading state while API calls are executing
      this.isLoadingApiData = true;
      this.startProgressiveLoading();

      // Execute all three API calls concurrently using forkJoin
      forkJoin({
        internalProbData:
          this._talentServ.getInternalDemandProbability(bodyDataInt),
        demandProbData: this._talentServ.getDemandProbability(jobBody),
        jobQualityData: this._talentServ.getJdQuality(payload),
      }).subscribe({
        next: (responses) => {
          // Hide loading state and stop progressive messages
          this.isLoadingApiData = false;
          this.stopProgressiveLoading();
          
          // Handle Internal Demand Probability response
          this.EmployeeDataList = responses.internalProbData['EmployeeData'];
          this.DemandDataList = responses.internalProbData['DemandData'];
          this.ProbabilityData =
            responses.internalProbData['DemandProbability'][0];

          // Handle Demand Probability response
          this.demandProbData = responses.demandProbData;

          // Handle Job Quality response
          this.jobQualityData = responses.jobQualityData;
          this.reasonJdQ = this.jobQualityData['Job Description']?.Reason;

          debugger;
          const input: DemandInput = {
            HTi: this.demandProbData?.probabilities['INTERNALLY FULFILLED'] || 0,
            HTe: this.demandProbData?.probabilities['FULFILLED EXTERNALLY'] || 0,
            HTc: this.demandProbData?.probabilities['CANCELLED'] || 0,
            RMCount: this.ProbabilityData?.EmployeeCount || 0,
            K: this.ProbabilityData?.EmployeeCountTotal || 0,
            JDQ: this.jobQualityData['Job Description Quality Score (%)'] || 0,
          };

          this.demandProbabilityResult = this.demandService.calculateProbability(input);
          debugger
          this.setDemandStatus();

         
          this.isSumbitted=true;
        },
        error: (error) => {
          this.isSumbitted=true;
          // Hide loading state even on error and stop progressive messages
          this.isLoadingApiData = false;
          this.stopProgressiveLoading();
          console.error('Error in one or more API calls:', error);
          debugger;
        },
      });
    });
  }

  public NormalizeStatus: any = "";
  setDemandStatus() {
  const { P_i_prime, P_e_prime, P_c_prime } = this.demandProbabilityResult;

  // Find the maximum value
  const maxValue = Math.max(P_i_prime, P_e_prime, P_c_prime);

  // Set the status based on which value is highest
  if (maxValue === P_i_prime) {
    this.NormalizeStatus = 'Internally Fulfilled';
  } else if (maxValue === P_e_prime) {
    this.NormalizeStatus = 'Fulfilled Externally';
  } else if (maxValue === P_c_prime) {
    this.NormalizeStatus = 'Cancelled';
  }
}


  public demandProbabilityResult: any = {};

  /**
   * Progressive loading messages
   */
  private startProgressiveLoading() {
    this.loadingStage = 0;
    this.updateLoadingMessage();
    
    this.loadingTimer = setInterval(() => {
      this.loadingStage++;
      this.updateLoadingMessage();
    }, 8000); // Update every 8 seconds
  }

  private updateLoadingMessage() {
    const messages = [
      'Analyzing demand quality and probability... Please wait.',
      'Processing historical data and trends...',
      'Calculating internal resource availability...',
      'Still processing... This may take a moment.',
      'Almost done... Finalizing calculations.',
      'Thank you for your patience... Nearly complete.'
    ];
    
    if (this.loadingStage < messages.length) {
      this.loadingMessage = messages[this.loadingStage];
    } else {
      this.loadingMessage = 'Processing is taking longer than expected... Please wait.';
    }
  }

  private stopProgressiveLoading() {
    if (this.loadingTimer) {
      clearInterval(this.loadingTimer);
      this.loadingTimer = null;
    }
    this.loadingStage = 0;
  }

  /***
   * Individual API methods - now using forkJoin for concurrent execution
   * These methods are kept for reference but not actively used
   */
  public EmployeeDataList: any = [];
  public DemandDataList: any = [];
  public ProbabilityData: any = [];

  // Individual method - not used anymore, kept for reference
  getInternalProbApiData(data?: any) {
    this._talentServ.getInternalDemandProbability(data).subscribe((res) => {
      this.EmployeeDataList = res['EmployeeData'];
      this.DemandDataList = res['DemandData'];
      this.ProbabilityData = res['DemandProbability'][0];
      debugger;
    });
  }

  public demandProbData: any = {};
  // Individual method - not used anymore, kept for reference
  getDemandProbability(data?: any) {
    this._talentServ.getDemandProbability(data).subscribe((res) => {
      this.demandProbData = res;
      debugger;
    });
  }

  public jobQualityData: any = {};
  // Individual method - not used anymore, kept for reference
  getJobQuality(data?: any) {
    this._talentServ.getJdQuality(data).subscribe((res) => {
      this.jobQualityData = res;
      debugger;
      console.log(this.jobQualityData);
    });
  }

  openListAvailableResource(data: any = {}) {
    data['EmployeeData'] = this.EmployeeDataList;
    const dialogRef = this.dialog.open(InteralAvailableResourceModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'talent-mandateSkill-rating-selection','interal-available-resource-modal'],
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dialogRef.close(data);
      }
    });
  }

  createDemand() {
    const demandData = {
      HTi: this.demandProbData?.probabilities?.['INTERNALLY FULFILLED'] || 0,
      HTe: this.demandProbData?.probabilities?.['FULFILLED EXTERNALLY'] || 0,
      HTc: this.demandProbData?.probabilities?.['CANCELLED'] || 0,
      RMCount: this.ProbabilityData?.EmployeeCount || 0,
      K: this.ProbabilityData?.EmployeeCountTotal || 0,
      JDQ: this.jobQualityData?.['Job Description Quality Score (%)'] || 0,
      P_internal: this.demandProbabilityResult?.P_internal || 0,
      P_external: this.demandProbabilityResult?.P_external || 0,
      P_cancelled: this.demandProbabilityResult?.P_cancelled || 0,
      P_i_prime: this.demandProbabilityResult?.P_i_prime || 0,
      P_e_prime: this.demandProbabilityResult?.P_e_prime || 0,
      P_c_prime: this.demandProbabilityResult?.P_c_prime || 0,
      P_i_percent: this.demandProbabilityResult?.P_i_percent || 0,
      P_e_percent:this.demandProbabilityResult?.P_e_percent || 0,
      P_c_percent: this.demandProbabilityResult?.P_c_percent || 0,
      NormalizeStatus: this.NormalizeStatus || 'API Failed',
      demandCountTotal: this.ProbabilityData?.DemandCountTotal || 0,
      demandCount: this.ProbabilityData?.DemandCount || 0,
      P_total: this.demandProbabilityResult?.total || 0,
      JDReason:this.jobQualityData?.['Job Description']?.Reason || [],
    };
    debugger
    this.dialogRef.close(demandData);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
