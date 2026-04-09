import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { Editor, Toolbar, toHTML } from 'ngx-editor';
@Component({
  selector: 'app-internal-job-posting-modal',
  templateUrl: './internal-job-posting-modal.component.html',
  styleUrls: ['./internal-job-posting-modal.component.scss']
})
export class InternalJobPostingModalComponent implements OnInit, AfterViewInit,OnDestroy {

  public submitInternalJobPostingForm: UntypedFormGroup = new UntypedFormGroup({});
  public ijpDetails: any = [];
  public isDisabled:boolean=false;
  public disablePastDate: any = new Date(new Date().setDate(new Date().getDate()));
  public formAppearance: string = 'outline';
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
   // ['bold'],
    ['underline', 'strike'],
   // ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
   // ['link', 'image'],
    ['text_color', 'background_color'],
    //['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  constructor(
    public dialogRef: MatDialogRef<InternalJobPostingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _talentAPi: TalentService
  ) { }

  ngOnInit(): void {
    this.editor = new Editor();
    
    this.isDisabled = true;
    this.GetIjpDetails();

    this.FormInit();
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  public editorLen:string = '';
  ngAfterViewInit() {
    this.editor.valueChanges.subscribe(
      get=>{
        const el = document.createElement('div')
        el.innerHTML = toHTML(get);
        this.editorLen = el.textContent;
        if(this.editorLen?.length < 100){
          this.getControl('ijpJobDescription').setErrors({ 'invalid': true }) 
        }
       
      }
    )
  }

  //form control
  // {value: '', disabled:  this.data?.OldSTATUS_ID == 26 || this.data?.OldSTATUS_ID == 28}
  FormInit() {
    
    this.submitInternalJobPostingForm = this._fb.group({
      IjpName: [null,  [Validators.required]],
      startDateIJP: [null, [Validators.required]],
      endDateIJP: [ null, [Validators.required]],
      ijpJobDescription: [null, [Validators.required]]
    })

  }

  /**getting ijp details */
  GetIjpDetails() {
    this._talentAPi.GetIJPTHIDDetails(this.data?.TH_ID).subscribe(
      res => {
        this.ijpDetails = res['data'][0];
        this.setDefaultValue(this.ijpDetails);
      }
      
    )
  }
  public minDate2: any = new Date();
  changeStartDate(type: string, event: any) {
    this.getControl('endDateIJP')?.reset();
    this.getControl('endDateIJP')?.enable();
    let date = new Date(event.value);
    // date.setDate(date.getDate()+1);
    this.minDate2 = new Date(event.value);
  }

  //control for form
  getControl(name: string) {
    return this.submitInternalJobPostingForm.get(name);
  }
  /**set default value  */
  setDefaultValue(data:any) {
    this.submitInternalJobPostingForm.patchValue({
      IjpName: data?.IJPName ? data?.IJPName : null,
      ijpJobDescription: data?.JobDesc ?GlobalMethod.htmlUnescape(data?.JobDesc)  : null,
      startDateIJP: data?.IJP_START_DATE ? GlobalMethod.formatDate(data?.IJP_START_DATE) : null,
      endDateIJP: data?.IJP_END_DATE ?  GlobalMethod.formatDate(data?.IJP_END_DATE ) : null
    })

   
  }

  //submit internal job posting 
  internalJobPostingHandler(form: UntypedFormGroup) {
    if (form.valid) {
      let formData = form.value;
      let body = {};
      body['THID'] = this.data?.TH_ID;
      if (formData?.IjpName) {
        body['IJPName'] = formData?.IjpName;
      }
      if (formData?.ijpJobDescription) {
        body['IJPJobDesc'] = GlobalMethod.htmlEscape(formData.ijpJobDescription);
       // body['IJPJobDesc'] = formData?.ijpJobDescription;
      }
      
      if (formData?.startDateIJP) {
        body['IJPStartDate'] = GlobalMethod.formatDate(formData?.startDateIJP);
      }
      if (formData?.endDateIJP) {
        body['IJPEndDate'] = GlobalMethod.formatDate(formData?.endDateIJP);
      }
      this._talentAPi.AddUpdateIJP(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    } else {
      form.markAllAsTouched();
      this._share.showAlertErrorMessage.next("Please fill all mandatory fields.");
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
