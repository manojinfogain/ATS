import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { GlobalApisService } from 'projects/ats-lib/src/lib/services/lib-global-apis.service';
import { InteralAvailableResourceModalComponent } from '../interal-available-resource-modal/interal-available-resource-modal.component';
import {
  DemandFulfillmentService,
  DemandInput,
} from 'projects/ats-global-system/src/app/core/common/demand-fulfillment.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-demand-probabilty-view',
  templateUrl: './demand-probabilty-view.component.html',
  styleUrls: ['./demand-probabilty-view.component.scss'],
})
export class DemandProbabiltyViewComponent implements OnInit {
  public isLoadingApiData: boolean = false;
  public loadingMessage: string =
    'Analyzing demand quality and probability... Please wait.';
  private loadingTimer: any;
  private loadingStage: number = 0;
selectedTabIndex = 0;
  constructor(
    public dialogRef: MatDialogRef<DemandProbabiltyViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _talentServ: TalentService,
    private _globalApi: GlobalApisService,
    private dialog: MatDialog,
    private demandService: DemandFulfillmentService
  ) {}

  public talentDetails: any = {};
  public demandProbDetails: any = {};
  public JDReasonListDm: any[] = [];
  public alldata: any = {};
  ngOnInit(): void {
    this._talentServ.GetTHIDDetailsByTHID(this.data?.TH_ID).subscribe((res) => {
      this.alldata = res;
      this.talentDetails = res['data'][0];
      this.demandProbDetails = res['DemandProbability'][0];
      if (this.demandProbDetails.JDReason) {
        try {
          this.JDReasonListDm = JSON.parse(this.demandProbDetails.JDReason);
        } catch (e) {
          this.JDReasonListDm = []; // fallback if JSON parsing fails
        }
      }
      debugger;
      this.getFormValueData(res);
    });
  }

  public flagLoaderShouldBeShown: boolean = false;
  reloadPrediction(){
    this.flagLoaderShouldBeShown = true;
       this.getFormValueData(this.alldata);
  }
  public formValueData: any = {};

  /***
   * get Form Data
   */
  getFormValueData(res?: any) {
    let data = res['data'][0];
    let mandatorySkills = res['MandatorySkills'];
    let goodToHaveSkills = res['GoodToHaveSkills'];
    // Selected skills processing
    const mandatory = mandatorySkills || [];
    const goodToHave = goodToHaveSkills || [];

    // Step 1: merge Mandatory + GoodToHave skills
    let selectedSkillIds = [...mandatory, ...goodToHave].map((s) => s.skillid);

    // Step 2: list of TCSkill fields that may be null or empty
    const tcSkills = [
      data.TCSkill1,
      data.TCSkill2,
      data.TCSkill3,
      data.TCSkill4,
    ];

    // Step 3: validate, split & merge
    tcSkills.forEach((val) => {
      if (val && val.toString().trim() !== '') {
        // check not null & not empty
        const ids = val
          .split(',')
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x)); // ignore invalid numbers

        selectedSkillIds.push(...ids);
      }
    });

    // Step 4: remove duplicates
    selectedSkillIds = [...new Set(selectedSkillIds)];

    // Step 5: final comma-separated output

    const finalselectedSkillIds = selectedSkillIds.join(',');
    this.formValueData['selectedIds'] = finalselectedSkillIds;
    // Get only MandatorySkills and convert their skill IDs into a comma-separated string.
    const mandatorySkillIds = mandatory.map((s) => s.skillid).join(',');
    this.formValueData['mandatorySkillsId'] = mandatorySkillIds;

    this.formValueData['primarySkill'] = data?.TalentCubePrimarySkillID;
    this.formValueData['grade'] = data?.TCGradeId;
    this.formValueData['experienceRange'] = data?.ExperienceId;
    this.formValueData['location'] = data?.JoiningLocID;
    this.formValueData['isResourceAvailInBu'] = data?.IsInternel;
    this.formValueData['jobSummary'] = data?.JobSummary;
    this.formValueData['jobDescription'] = data?.JobDesc;
    this.formValueData['talentCubeId'] = data?.TalentCubeId;
    this.formValueData['cubeSkill1'] = data?.TCSkill1;
    this.formValueData['cubeSkill2'] = data?.TCSkill2;
    this.formValueData['cubeSkill3'] = data?.TCSkill3;
    this.formValueData['cubeSkill4'] = data?.TCSkill4;
    this.formValueData['employmentType'] = data?.EMPLOYEMENT_TYPE_ID;
    this.formValueData['requirementType'] = data?.ReqTypeID;
    this.formValueData['replacementReason'] = data?.RepReason;
    this.formValueData['is_billable'] = data?.finalData?.formDataDs?.Billable;
    this.formValueData['billingType'] = data?.BillingTypeId;
    this.formValueData['cubeRoleId'] = data?.TalentCubeRoleId;
    this.formValueData['DemandCurrentCount'] = 1;
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
        DemandCurrentCount: this.formValueData['DemandCurrentCount'] || 0,
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
      if (this.flagLoaderShouldBeShown) {
         this.isLoadingApiData = true;
         this.startProgressiveLoading();
         
      }
     

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
            HTi:
              this.demandProbData?.probabilities['INTERNALLY FULFILLED'] || 0,
            HTe:
              this.demandProbData?.probabilities['FULFILLED EXTERNALLY'] || 0,
            HTc: this.demandProbData?.probabilities['CANCELLED'] || 0,
            RMCount: this.ProbabilityData?.EmployeeCount || 0,
            K: this.ProbabilityData?.EmployeeCountTotal || 0,
            JDQ: this.jobQualityData['Job Description Quality Score (%)'] || 0,
          };

          this.demandProbabilityResult =
            this.demandService.calculateProbability(input);
          debugger;
          this.setDemandStatus();

          if (this.flagLoaderShouldBeShown) {
            this.selectedTabIndex = 1; // Switch to the "Current Probability" tab
          }
        },
        error: (error) => {
          // Hide loading state even on error and stop progressive messages
          this.isLoadingApiData = false;
          this.stopProgressiveLoading();
          console.error('Error in one or more API calls:', error);
          debugger;
        },
      });
    });
  }

  public NormalizeStatus: any = '';
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
      'Thank you for your patience... Nearly complete.',
    ];

    if (this.loadingStage < messages.length) {
      this.loadingMessage = messages[this.loadingStage];
    } else {
      this.loadingMessage =
        'Processing is taking longer than expected... Please wait.';
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
      panelClass: [
        'ats-model-wrap',
        'talent-mandateSkill-rating-selection',
        'interal-available-resource-modal',
      ],
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dialogRef.close(data);
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
