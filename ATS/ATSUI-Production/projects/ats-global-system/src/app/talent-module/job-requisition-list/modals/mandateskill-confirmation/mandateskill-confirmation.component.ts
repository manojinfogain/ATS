import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators, ValidationErrors
} from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { parse } from 'path';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { DemandQualityProbComponent } from '../demand-quality-prob/demand-quality-prob.component';

@Component({
  selector: 'app-mandateskill-confirmation',
  templateUrl: './mandateskill-confirmation.component.html',
  styleUrls: ['./mandateskill-confirmation.component.scss'],
})
export class MandateskillConfirmationComponent implements OnInit {
  public formTalent: UntypedFormGroup;
  public cancelReasonList: any = [];
  public reasonCategList: any = [];
  public reasonList: any = [];
  public mergedSelectedSkills: any = [];
  public mrgSelectedGoodToHaveSkills: any = [];
  public displayedColumns = ['skillName', 'skillType', 'weightage', 'rating'];

  @ViewChild('select') select: MatSelect;
  constructor(
    public dialogRef: MatDialogRef<MandateskillConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _talentServ: TalentService,
     private _globalApi:GlobalApisService,
     public dialog:MatDialog
  ) {}

  public dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public skillProficiencyLevel: any = [];
  ngOnInit() {
    this._globalApi.getSkillProficiencyLevelMaster().subscribe(
      res => {
        this.skillProficiencyLevel = res['data'];
      }
    )
    // this.formTalent =this._fb.group({
    //   skills: this._fb.array([], this.atLeastOneSkillTypeSelectedValidator) // Apply Validator Here
    // });
    // this.formTalent = this._fb.group({
    //   skills: this._fb.array([], [
    //     this.atLeastOneSkillTypeSelectedValidator,
    //     MandateskillConfirmationComponent.mandatorySkillCountValidator
    //   ])
    // });
    this.formTalent = this._fb.group({
      skills: this._fb.array([], [
        this.atLeastOneSkillTypeSelectedValidator,
        MandateskillConfirmationComponent.mandatorySkillCountValidator,
        MandateskillConfirmationComponent.totalWeightageValidator
      ])
    });
    this.setSkillTypeChangeListeners();
    setTimeout(() => {
      // Patch weightage if mandateSkill has weightage, else distribute equally
      if (Array.isArray(this.data?.mandateSkill) && this.data.mandateSkill.some(s => s.weightage)) {
        this.patchMandateSkillWeightage();
      } else {
        this.distributeMandatoryWeightage();
      }
      this.updateMandatoryRadioDisableState();
    }, 500);
    // this.formInit();
    let selectedIds = this.data?.mergedSelectedSkills.filter((n) => n);
    this._talentServ
      .GetSubSkillsByIds(selectedIds.toString())
      .subscribe((res) => {
        if (res) {
          this.mergedSelectedSkills = res['data'];
          debugger
          const mergedSkills = this.mergeSkills(
            this.mergedSelectedSkills,
            this.data?.mandateSkill,
            this.data?.goodToHaveSkill
          );
          // this.formInit();
          // Populate the FormArray after API call
          const skillsArray = this.formTalent.get('skills') as UntypedFormArray;
          mergedSkills.forEach((skill) => {
            skillsArray.push(this.createSkillForm(skill));
          });
          setTimeout(() => {
            this.dataSource = new MatTableDataSource([...this.skillsArray.controls]);
            debugger
            // Patch weightage if mandateSkill has weightage, else distribute equally
            if (Array.isArray(this.data?.mandateSkill) && this.data.mandateSkill.some(s => s.Weightage)) {
              this.patchMandateSkillWeightage();
            } else {
              this.distributeMandatoryWeightage();
            }
            this.updateMandatoryRadioDisableState();
          }, 1000);
          if (this.data?.mandateSkill?.length != 0) {
            // let TCSkil = this.data?.mandateSkill.filter(skill => skill !== null);
            // this.getControl('mandateSkill').setValue(TCSkil);
            // this.selectedSkills = this.mergedSelectedSkills.filter(n => n.skillid == TCSkil[0]);
            // this.getGoodToHaveSkills();
          }
        }
      });

    // if(this.data?.goodToHaveSkill?.length != 0){
    //   this._talentServ.GetSubSkillsByIds(this.data?.goodToHaveSkill.toString()).subscribe(
    //     res=>{
    //       if(res){
    //         this.mrgSelectedGoodToHaveSkills = res['data'];
    //         let TCSkil = this.data?.goodToHaveSkill.filter(skill => skill !== null);
    //         this.getControl('goodToHaveSkill').setValue(TCSkil);
    //         this.selectedSkillsGood = this.mrgSelectedGoodToHaveSkills.filter(n => n.skillid == TCSkil[0]);
    //         this.getGoodToHaveSkills();
    //       }
    //     }
    //   );
    // }
    this.skillsArray.controls.forEach((control, i) => {
      this.setWeightageValidator(i);
      control.get('skillType').valueChanges.subscribe(() => {
        this.setWeightageValidator(i);
      });
    });
  }


  formInit() {
    // this.formTalent = this._fb.group({
    //   skills: this._fb.array(
    //     mergedSkills.map((skill) => this.createSkillForm(skill)),
    //     [this.atLeastOneSkillTypeSelectedValidator] // 🔹 Add Validator Here
    //   ),
    // });
    //this.setSkillTypeChangeListeners();
  }

  // 🔹 Merge skills and ensure `skillType` and `rating` default to `null`
  mergeSkills(skills: any[], mskills: any[], gskills: any[]) {
    // Step 1: Get only mandate and good-to-have skills that exist in mergedskill
    const mergedSkillIds = new Set(skills.map((s) => s.skillid));

    const filteredMSkills = mskills.filter((s) => mergedSkillIds.has(s.skillid));
    const filteredGSkills = gskills.filter((s) => mergedSkillIds.has(s.skillid));

    // Step 2: Combine filtered mskills and gskills
    const selectedSkills = [...filteredMSkills, ...filteredGSkills];

    // Step 3: Remove selectedSkills from mergedskill
    const selectedSkillIds = new Set(selectedSkills.map((s) => s.skillid));
    const filteredSkills = skills.filter((s) => !selectedSkillIds.has(s.skillid));

    // Step 4: Merge and set defaults
    const allSkills = [...filteredSkills, ...selectedSkills];
    if (this.data?.data?.type == 'C') {
      const merged = allSkills.map((skill) => ({
        skillName: skill.skillName,
        skillid: skill.skillid,
        skillType: null,
        rating: null,
      }));
      return merged;
    }
    // If type is not 'C', return the skills as is
    else {
      const merged = allSkills.map((skill) => ({
        skillName: skill.skillName,
        skillid: skill.skillid,
        skillType: skill.skillType ?? null,
        rating: skill.rating ?? null,
        weightage: skill.weightage ?? null,
      }));
      return merged;
    }
  }





  setSkillTypeChangeListeners() {
    this.skillsArray.controls.forEach((group, idx) => {
      group.get('skillType')?.valueChanges.subscribe((selected) => {
        // Enable/disable rating field
        if (selected) {
          group.get('rating')?.enable();
        } else {
          group.get('rating')?.reset({ value: null, disabled: true });
        }
        // Distribute weightage on every skillType change
        this.distributeMandatoryWeightage();
        this.updateMandatoryRadioDisableState();
      });
    });
  }

  // Distribute weightage equally among mandatory skills, reset weightage for non-mandatory
  distributeMandatoryWeightage() {
    const mandatoryControls = this.skillsArray.controls.filter(
      ctrl => ctrl.get('skillType')?.value === '1' || ctrl.get('skillType')?.value === 1
    );
    const count = mandatoryControls.length;
    if (count === 0) {
      // Reset all weightages if no mandatory selected
      this.skillsArray.controls.forEach(ctrl => {
        ctrl.get('weightage')?.setValue(null, { emitEvent: false });
      });
      this.formTalent.get('skills')?.updateValueAndValidity();
      return;
    }
    // Distribute 100 equally, last one gets the remainder
    const base = Math.floor(100 / count);
    let remainder = 100 - base * count;
    mandatoryControls.forEach((ctrl, i) => {
      let value = base + (i === count - 1 ? remainder : 0);
      ctrl.get('weightage')?.setValue(value, { emitEvent: false });
    });
    // Reset weightage for non-mandatory
    this.skillsArray.controls.forEach(ctrl => {
      if (!(ctrl.get('skillType')?.value === '1' || ctrl.get('skillType')?.value === 1)) {
        ctrl.get('weightage')?.setValue(null, { emitEvent: false });
      }
    });
    this.formTalent.get('skills')?.updateValueAndValidity();
  }

  // Add this method to handle enabling/disabling mandatory radio buttons
  updateMandatoryRadioDisableState() {
    const mandatoryCount = this.skillsArray.controls.filter(
      ctrl => ctrl.get('skillType')?.value === '1' || ctrl.get('skillType')?.value === 1
    ).length;

    this.skillsArray.controls.forEach(ctrl => {
      const isMandatory = ctrl.get('skillType')?.value === '1' || ctrl.get('skillType')?.value === 1;
      // Add a custom property to each form group for template binding
      if (!ctrl['mandatoryDisabled']) {
        ctrl['mandatoryDisabled'] = false;
      }
      if (mandatoryCount >= 4 && !isMandatory) {
        ctrl['mandatoryDisabled'] = true;
      } else {
        ctrl['mandatoryDisabled'] = false;
      }
    });
  }

  autoDistributeWeightage() {
    const mandatoryIndexes = this.skillsArray.controls
      .map((ctrl, idx) => (ctrl.get('skillType')?.value === '1' || ctrl.get('skillType')?.value === 1 ? idx : -1))
      .filter(idx => idx !== -1);

    const count = mandatoryIndexes.length;
    if (count === 0) {
      // Clear all weightages if none selected
      this.skillsArray.controls.forEach(ctrl => ctrl.get('weightage')?.setValue(null, { emitEvent: false }));
      this.formTalent.get('skills')?.updateValueAndValidity();
      return;
    }
    // Distribute equally, last one gets the remainder to make sum 100
    const base = Math.floor(100 / count);
    let remainder = 100 - base * count;
    mandatoryIndexes.forEach((idx, i) => {
      let value = base + (i === count - 1 ? remainder : 0);
      this.skillsArray.at(idx).get('weightage')?.setValue(value, { emitEvent: false });
    });
    // Clear weightage for non-mandatory
    this.skillsArray.controls.forEach((ctrl, idx) => {
      if (!mandatoryIndexes.includes(idx)) {
        ctrl.get('weightage')?.setValue(null, { emitEvent: false });
      }
    });
    this.formTalent.get('skills')?.updateValueAndValidity();
  }

  static totalWeightageValidator(control: AbstractControl): ValidationErrors | null {
    const skills = (control as UntypedFormArray).value;
    const total = skills
      .filter(skill => skill.skillType === '1' || skill.skillType === 1)
      .reduce((sum, skill) => sum + (parseFloat(skill.weightage) || 0), 0);
    if (total > 100) {
      return { weightageExceeded: true };
    }
    return null;
  }

  createSkillForm(skill: any): UntypedFormGroup {
    const group = this._fb.group({
      skillName: [skill.skillName],
      skillid: [skill.skillid],
      skillType: [skill?.skillType ? skill?.skillType.toString() : null],
      rating: [{ value: skill?.rating ? parseInt(skill?.rating) : null, disabled: !skill.skillType }],
      weightage: [
        skill.weightage || null,
        [
          // Only required if skillType is '1'
          (control) => {
            const parent = control.parent;
            if (parent && (parent.get('skillType')?.value === '1' || parent.get('skillType')?.value === 1)) {
              return control.value == null ? { required: true } : null;
            }
            return null;
          },
          // Value must be between 1 and 100
          (control) => {
            if (control.value != null && (control.value < 1 || control.value > 100)) {
              return { range: true };
            }
            return null;
          }
        ]
      ]
    });

    // Enable rating only when skillType is selected
    group.get('skillType')?.valueChanges.subscribe((selected) => {
      if (selected) {
        group.get('rating')?.enable();
      } else {
        group.get('rating')?.reset({ value: null, disabled: true });
      }
      this.distributeMandatoryWeightage();
      this.updateMandatoryRadioDisableState();
    });

    // Add custom property for disabling mandatory radio
    (group as any)['mandatoryDisabled'] = false;

    return group;
  }


  get skillsArray() {
    return this.formTalent.get('skills') as UntypedFormArray;
  }
  /** ✅ Custom Validator: Ensure at least one `skillType` is selected */
  atLeastOneSkillTypeSelectedValidator(control: AbstractControl) {
    const skills = control.value as any[];

    const atLeastOneSelected = skills.some((skill) => skill.skillType);
    if (!atLeastOneSelected) {
      return { atLeastOneSkillTypeRequired: true }; // If no skill type is selected, form is invalid
    }

    const missingRatings = skills.filter(
      (skill) => skill.skillType && !skill.rating
    );
    if (missingRatings.length > 0) {
      return { ratingRequired: missingRatings.map((skill) => skill.skillName) }; // Return skills missing ratings
    }

    return null;
  }

  getControl(name: string) {
    return this.formTalent.get(name);
  }

  public showErrorHighlight: boolean = false;
  SkillSubmitTalent(form: any) {
    this.formTalent.markAllAsTouched();
    const errors = this.formTalent.get('skills')?.errors;
    this.showErrorHighlight = false;
    debugger
    if (this.formTalent.valid) {
      // 🔹 Extract only valid entries with `skillid`, `skillType`, and `rating`
      const filteredSkills = form.value.skills
        .filter((skill) => skill.skillType !== null && skill.rating !== null) // Keep only selected skills
        .map((skill) => ({
          skillid: skill.skillid,
          skillType: parseInt(skill.skillType),
          weightage: skill.weightage ? parseInt(skill.weightage) : 0,
          rating: parseInt(skill.rating),
        }));

          debugger
                // ✅ Check if at least one skillType = 1 exists
        const hasMandatory = filteredSkills.some(skill => skill.skillType === 1);

        if (!hasMandatory) {
          this._share.showAlertErrorMessage.next(
            'Please select at least one Mandatory skill.'
          );
          this.showErrorHighlight = true;
          return;
        }
             let body = {
          "selectedSkillsRating": filteredSkills,
          Probability:{
            HTc: null,
            HTe: null,
            HTi: null,
            JDQ: null,
            P_c_prime: null,
            P_e_prime: null,
            P_i_prime: null,
            P_cancelled: null,
            P_external: null,
            P_internal: null,
            RMCount: null,
            K: null,
            NormalizeStatus: ''
          }
        }
      //  this.dialogRef.close(body);
      let availableData ={
         finalData:this.data,
        body:body,
         "selectedSkillsRating": filteredSkills
      }
      this.data;
      debugger
      if(this.data?.data?.type == 'C' || this.data?.data?.type == 'N' ){
       
        if(this.data?.formDataDs?.isResourceAvailInBu == 'Y'){
          this.dialogRef.close(body);
        }
        else{
          this.openDemandQualityProb(availableData);
        }
      }
      else{
       this.dialogRef.close(body);
      }
      

    } 
    else {
      this.showErrorHighlight = true;
      if (errors?.atLeastOneSkillTypeRequired) {
        //  this._share.showAlertErrorMessage.next('Please select at least one Skill Type.');
        this._share.showAlertErrorMessage.next(
          'Please select at least one  as Mandatory skill.'
        );
        return;
      }

      else if (errors?.ratingRequired) {
        this._share.showAlertErrorMessage.next(
          `Please choose a rating for: ${errors.ratingRequired.join(', ')}`
        );
        return;
      }
      //  this._share.showAlertErrorMessage.next('Please select Mandatory skills.');
      else {
        this._share.showAlertErrorMessage.next(
          `Please fill the weightage.`
        );
        return;
      }
    }
  }

  openDemandQualityProb(data:any ={}){
        
        const dialogRef = this.dialog.open(DemandQualityProbComponent, {
       // width: '500px',
        panelClass: ['ats-model-wrap', 'ats-model-full-screen','talent-mandateSkill-rating-selection1'],
        data: data,
        disableClose: true,
         maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
      });
       dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Structure the result to include Probability data
          const finalResult = {
            selectedSkillsRating: data.selectedSkillsRating,
            Probability: {
              HTc: result.HTc || null,
              HTe: result.HTe || null,
              HTi: result.HTi || null,
              JDQ: result.JDQ || null,
              P_c_prime: result.P_c_prime || null,
              P_e_prime: result.P_e_prime || null,
              P_i_prime: result.P_i_prime || null,
              P_cancelled: result.P_cancelled || null,
              P_external: result.P_external || null,
              P_internal: result.P_internal || null,
              P_i_percent: result.P_i_percent || 0,
              P_e_percent: result.P_e_percent || 0,
              P_c_percent: result.P_c_percent || 0,
              RMCount: result.RMCount || null,
              K: result.K || null,
              NormalizeStatus: result.NormalizeStatus || '',
              demandCountTotal: result.demandCountTotal || 0,
              demandCount: result.demandCount || 0,
              P_total: result.P_total || 0,
              JDReason: result.JDReason || [],
            }
          };
          this.dialogRef.close(finalResult);
        }
      });
  }

  //   /**cancel talent submit */
  //  SkillSubmitTalent(form:any){
  //   this.formTalent.markAllAsTouched();
  //     if(this.formTalent.valid){
  //       let formValue = form.value;
  //       let mandateSkillString = formValue?.mandateSkill.join(',');
  //       let goodToHaveSkillString = null;

  //       if(formValue?.goodToHaveSkill && formValue?.goodToHaveSkill.length > 0){
  //          // Check if the number of selected skills exceeds 5
  //       if (formValue?.goodToHaveSkill.length > 5) {
  //         this._share.showAlertErrorMessage.next('Maximum of 5 Good To Have skills allowed. Please adjust your selection and select no more than 5 skills.');
  //         return;
  //       }
  //         goodToHaveSkillString = formValue?.goodToHaveSkill.join(',');
  //       }
  //       let body = {
  //         "mandateSkill": mandateSkillString,
  //         "goodToHaveSkill": goodToHaveSkillString
  //       }
  //       this.dialogRef.close(body);

  //     }
  //     else {
  //       this._share.showAlertErrorMessage.next('Please select Mandatory skills.');
  //     }

  //   }
  /***
   * close dialog
   */
  closeModal(): void {
    this.dialogRef.close();
  }

  /** Custom Validator for Mandatory Skill Count */
  static mandatorySkillCountValidator(control: AbstractControl): ValidationErrors | null {
    const skills = (control as UntypedFormArray).value;
    const mandatoryCount = skills.filter(skill => skill.skillType === '1' || skill.skillType === 1).length;
    if (mandatoryCount < 1) {
      return { minMandatory: true };
    }
    if (mandatoryCount > 4) {
      return { maxMandatory: true };
    }
    return null;
  }

  // Add this method to patch weightage from mandateSkill if present
  patchMandateSkillWeightage() {
    if (!Array.isArray(this.data?.mandateSkill)) return;
    this.skillsArray.controls.forEach(ctrl => {
      const skillId = ctrl.get('skillid')?.value;
      const mandateSkill = this.data.mandateSkill.find((s: any) => s.skillid === skillId);
      if (mandateSkill && (mandateSkill.skillType === '1' || mandateSkill.skillType === 1)) {
        ctrl.get('weightage')?.setValue(mandateSkill.Weightage ?? null, { emitEvent: false });
      } else {
        ctrl.get('weightage')?.setValue(null, { emitEvent: false });
      }
    });
    this.formTalent.get('skills')?.updateValueAndValidity();
  }

  restrictInitialZero(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    const key = event.key;
    const { selectionStart, selectionEnd, value } = input;

    // Block '0' if it would result in a value starting with 0
    if (key === '0') {
      // If all text is selected and user presses '0', prevent
      if (selectionStart === 0 && selectionEnd === value.length) {
        event.preventDefault();
        return;
      }
      // If input is empty and '0' is pressed, prevent
      if (value.length === 0) {
        event.preventDefault();
        return;
      }
      // If cursor is at the start and '0' is pressed, prevent
      if (selectionStart === 0) {
        event.preventDefault();
        return;
      }
      // If selection replaces all except first char and first char is 0, prevent
      if (value[0] === '0' && selectionStart === 1 && selectionEnd === value.length) {
        event.preventDefault();
        return;
      }
      // If after this keydown, the value would start with 0, prevent
      // const newValue = value.slice(0, selectionStart!) + key + value.slice(selectionEnd!);
      // if (/^0\d*/.test(newValue)) {
      //   event.preventDefault();
      //   return;
      // }
    }
    // Prevent pasting a value that starts with 0
    if (event.ctrlKey && (key === 'v' || key === 'V')) {
      setTimeout(() => {
        if (input.value.length > 1 && input.value.startsWith('0')) {
          input.value = input.value.replace(/^0+/, '');
          // Optionally, update the form control as well
          const formArray = this.formTalent.get('skills') as UntypedFormArray;
          formArray.at(index).get('weightage')?.setValue(input.value);
        }
      }, 0);
    }
  }

  setWeightageValidator(index: number) {
    const skillCtrl = this.skillsArray.at(index);
    const skillType = skillCtrl.get('skillType').value;
    const weightageCtrl = skillCtrl.get('weightage');
    if (skillType === '1' || skillType === 1) {
      weightageCtrl.setValidators([Validators.required, Validators.min(1), Validators.max(100)]);
    } else {
      weightageCtrl.clearValidators();
    }
    weightageCtrl.updateValueAndValidity({ emitEvent: false });
  }
}
