import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../../../candidate-module/candidate.service';
import { ExternalUserGlobalApiService } from '../../../core/services/external-user-global-api.service';
import { ShareService } from '../../../core/services/share.service';
import { Subscription } from 'rxjs';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { COMMON_CONST } from '../../../core/constant/common.const';
import { QuestionareFormModalComponent } from './Modal/questionare-form-modal/questionare-form-modal.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CandidateProfessionalReferenceFormModalComponent } from './Modal/candidate-pro-ref-form-modal/candidate-pro-ref-form-modal.component';
import { OtherInfoFormModalComponent } from './Modal/other-info-form-modal/other-info-form-modal.component';
@Component({
  selector: 'app-other-details-sc',
  templateUrl: './other-details-sc.component.html',
  styleUrls: ['./other-details-sc.component.scss']
})


export class OtherDetailsScComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  public otherDetailsform: UntypedFormGroup = new UntypedFormGroup({});
  public otherTabSubmitSubs: Subscription;
  public referredBackSubmitSubs: Subscription;
  displayedColumns: string[] = ['quest', 'ans', 'comment','action'];
  refrredTableColumns: string[] = ['Name', 'Email', 'Mobile', 'Designation', 'Organization','action'];
  constructor(
    private _fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private _exGlobal: ExternalUserGlobalApiService,
    private _candidateServe: CandidateService,
    private _share: ShareService,
    private _globalMethod: GlobalCommonMethodService
  ) { }

  public isHideAllControl: boolean = true;
  public isFinalSumbit: boolean = false;
  public hideEditOtherInfo: boolean = true;
  ngOnInit(): void {
    if (this._globalMethod.isFinalSubmit()) {
      this.isFinalSumbit = true;
      this.displayedColumns.pop();
      this.refrredTableColumns.pop();
    }

    this.formInit();
    this.getInfogainLocations();
    this.getCandidateotherDetails();
    this.getCandidateReferenceDetails();
    this.getCandidateQuestionireDetails();
    this.otherTabSubmitSubs = this._share.otherTabSubmit.subscribe(
      get => {
        if (get) {
          if (this.questionareGroup.length != 0) {
            for (let i = 0; i < this.questionareGroup.length; i++) {
              this.questionareGroup.removeAt(i);
            }
          }
          this.questionareGroup.length;
          this.isHideAllControl = false;
          this.getCandidateotherDetails();
          this.getCandidateReferenceDetails();
          this.getCandidateQuestionireDetails();
        }
      }
    )
    this.referredBackSubmitSubs = this._share.referredBackSubmit.subscribe(
      get => {
        if (get) {
          this.hideEditOtherInfo = false;
          this.displayedColumns.pop();
          this.refrredTableColumns.pop();
        }})


  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    if (this.otherTabSubmitSubs) {
      this.otherTabSubmitSubs.unsubscribe();
    }
    if (this.referredBackSubmitSubs) {
      this.referredBackSubmitSubs.unsubscribe();
    }
  }

  addRefrenceControl() {
    /***
    * refrence row
    */
    for (let i = 1; i <= 3; i++) {
      if (i <= 2) {
        this.ReferencesGroup.push(this.initItemRef(true, i));
      } else {
        this.ReferencesGroup.push(this.initItemRef(false, i));
      }
    }
  }
  /**
   * get other
   */
  @Input() public candidateOtherDetails: any = {};
  getCandidateotherDetails() {
    this._candidateServe.getCandidateotherDetails().subscribe(
      res => {
        this.candidateOtherDetails = res['data'][0];
      }
    )
  }
  /***
   * get Questionare details
   */
  @Input() public candidateQuestionareDetails: any = [];
  getCandidateQuestionireDetails() {
    this._candidateServe.getCandidateQuestionireDetails().subscribe(
      res => {
        
        this.candidateQuestionareDetails = res['data'];
        if (this.candidateQuestionareDetails.length === 0) {
          this.getQuestMaster();
        }
      }
    )
  }
  /***
   * get refrence detaild
   */
  @Input() public candidateReferenceDetails: any = [];
  getCandidateReferenceDetails() {
    this._candidateServe.getCandidateReferenceDetails().subscribe(
      res => {
        this.candidateReferenceDetails = res['data'];

        if (this.candidateReferenceDetails.length === 0) {
          this.addRefrenceControl();
        }
      }
    )
  }


  /***
   * gertLocationMaster
   */
  public locList: any = [];
  getInfogainLocations() {
    this._exGlobal.getInfogainLocations().subscribe(
      res => {
        let filterById = [1,2,4,5,16,21,23];
        let filterByLocationIndia = res['data'].filter(t => {
          return filterById.indexOf(t.LocID) !== -1;
        });
        this.locList = filterByLocationIndia
      }
    )
  }
  /***
   * get Quest
   */
  getQuestMaster() {
    this._exGlobal.GetcandidateQuestionire().subscribe(
      res => {
        let data = res['data'];
        if (data.length != 0) {
          data.forEach(element => {
            this.questionareGroup.push(this.initItemRow(element));
          });
        }
      }
    );
  }

  submit() {
    this.otherDetailsform.markAllAsTouched();
    this.ReferencesGroup.markAllAsTouched();
  }

  /////////  ////////
  get questionareGroup() {
    return this.otherDetailsform.get('Questionire') as UntypedFormArray;
  }
  get ReferencesGroup() {
    return this.otherDetailsform.get('References') as UntypedFormArray;
  }

  /*** dynamic control for form */
  initItemRow(data) {
    return this._fb.group({
      questId: [data?.id],
      quest: [data?.question],
      yesNo: ['N'],
      details: [null]
    }
    )
  }

  /*** dynamic control for form */
  initItemRef(isMandatory: boolean = false, i) {
    if (isMandatory) {
      return this._fb.group({
        Name: [null, [Validators.required]],
        Email: [null, [Validators.required, Validators.pattern(COMMON_CONST.emailregex)]],
        Mobile: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        Organization: [null, [Validators.required]],
        Designation: [null, [Validators.required]]
      }
      )
    }
    else {
      return this._fb.group({
        Name: [null],
        Email: [null, [Validators.pattern(COMMON_CONST.emailregex)]],
        Mobile: [null, [Validators.minLength(10), Validators.maxLength(10)]],
        Organization: [null],
        Designation: [null]
      }
      )
    }

  }
  /**
   * get Control
   */

  getControl(name: string) {
    return this.otherDetailsform.get(name);
  }
  /***
   * form setup
   */
  formInit() {
    this.otherDetailsform = this._fb.group({
      Questionire: this._fb.array([]),
      locationConsent: [null, Validators.required],
      prefLocId: [null, Validators.required],
      strengthsImpArea: [null, Validators.required],
      techAreaImprove: [null, Validators.required],
      References: this._fb.array([]),
    })
  }
  /***
   * get 
   */
  // [ngClass]="{'req-error-border' : edeew}"

  getYesNo(event: any, index: number) {
    const formGroupControl = this.questionareGroup['controls'];
    if (event.value == 'Y') {
      formGroupControl[index]['controls'].details.setValidators([Validators.required]);
    }
    else {
      formGroupControl[index]['controls'].details.clearValidators();
    }
    formGroupControl[index]['controls'].details.updateValueAndValidity();
  }

  applyValidation(i) {
    const formGroupControl = this.ReferencesGroup['controls'];
    if (i == 2) {
      let NameValue = formGroupControl[i]['controls'].Name?.value
      let DesignationValue = formGroupControl[i]['controls'].Designation?.value
      let OrganizationValue = formGroupControl[i]['controls'].Organization?.value
      let MobileValue = formGroupControl[i]['controls'].Mobile?.value
      let EmailValue = formGroupControl[i]['controls'].Email?.value
      // console.log(n+'///'+e?.length)
      if (
        (NameValue?.length != 0 && NameValue != undefined) ||
        (DesignationValue?.length != 0 && DesignationValue != undefined) ||
        (OrganizationValue?.length != 0 && OrganizationValue != undefined) ||
        (MobileValue?.length != 0 && MobileValue != undefined) ||
        (EmailValue?.length != 0 && EmailValue != undefined)
      ) {
        formGroupControl[i]['controls'].Name.setValidators([Validators.required]);
        formGroupControl[i]['controls'].Designation.setValidators([Validators.required]);
        formGroupControl[i]['controls'].Organization.setValidators([Validators.required]);
        formGroupControl[i]['controls'].Mobile.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
        formGroupControl[i]['controls'].Email.setValidators([Validators.required, Validators.pattern(COMMON_CONST.emailregex)]);
      } else {
        formGroupControl[i]['controls'].Name.clearValidators();
        formGroupControl[i]['controls'].Designation.clearValidators();
        formGroupControl[i]['controls'].Organization.clearValidators();
        formGroupControl[i]['controls'].Mobile.clearValidators();
        formGroupControl[i]['controls'].Email.clearValidators();
      }

      formGroupControl[i]['controls'].Name.updateValueAndValidity();
      formGroupControl[i]['controls'].Designation.updateValueAndValidity();
      formGroupControl[i]['controls'].Organization.updateValueAndValidity();
      formGroupControl[i]['controls'].Mobile.updateValueAndValidity();
      formGroupControl[i]['controls'].Email.updateValueAndValidity();
    }
  }

  /**update questionnare details modal */
  openUpdateOtherDetailsModal(elm: any) {
    elm['title'] = elm?.question;
    const dialogRef = this.dialog.open(QuestionareFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal'],
      data: elm,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCandidateotherDetails();
        this.getCandidateReferenceDetails();
        this.getCandidateQuestionireDetails();
      }
    });
  }

  /**update professional reference details modal */
  openUpdateProRefModal(elm: any) {
    elm['title'] = `Update your professional reference for ${elm?.name}`;
    const dialogRef = this.dialog.open(CandidateProfessionalReferenceFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal'],
      data: elm,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCandidateotherDetails();
        this.getCandidateReferenceDetails();
        this.getCandidateQuestionireDetails();
      }
    });
  }

  /**update other info details modal */
  openUpdateOtherInfoModal() {
    let elm:any = {};
    elm['title'] = `Update other Information`;
    elm['locationPreferenceId'] = this.candidateOtherDetails?.locationPreferenceId;
    elm['strengthsImprovementArea'] = this.candidateOtherDetails?.strengthsImprovementArea;
    elm['techAreaImprove'] = this.candidateOtherDetails?.techAreaImprove;
    const dialogRef = this.dialog.open(OtherInfoFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal'],
      data: elm,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCandidateotherDetails();
        this.getCandidateReferenceDetails();
        this.getCandidateQuestionireDetails();
      }
    });
  }
}
