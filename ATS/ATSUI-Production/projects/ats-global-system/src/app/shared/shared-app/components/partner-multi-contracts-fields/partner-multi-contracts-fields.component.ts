import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, Validators, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { i } from '@fullcalendar/core/internal-common';

import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { UpdateContractDetailsModalComponent } from 'projects/ats-global-system/src/app/vendor-partner-module/modals/update-contract-details-modal/update-contract-details-modal.component';
import { PartnerService } from 'projects/ats-global-system/src/app/vendor-partner-module/partner.service';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-partner-multi-contracts-fields',
  templateUrl: './partner-multi-contracts-fields.component.html',
  styleUrls: ['./partner-multi-contracts-fields.component.scss'],
  providers: [DatePipe]
})
export class PartnerMultiContractsFieldsComponent implements OnInit {
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  //@Input() public contractDetails: FormGroup = new FormGroup({});
  //addContractDetailsForm: FormGroup;
  @Input() public minDate: any = new Date();
  public contactList: any = [];
  @Input() public data: any = [];
  @Input() public partnerContracts: any = [];
  @Input() public isContractsNew: boolean;
  constructor(
    private _fb: UntypedFormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private _globalServe: GlobalApisService,
    private _share: ShareService,
    public dialog: MatDialog,
    private __partnerServe: PartnerService
  ) { }
  private refreshSubscription: Subscription = new Subscription();
  ngOnInit(): void {
    const control = this.ContractDetailsGroupArray;
    this.getContractList();
    /**calling api when its not new registraction 
     * else its new registration
     * 
     * 
    */
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.ContractDetailsGroupArray.clear();
      }
    )
    this.changeDetectorRef.detectChanges();
    if (!this.isContractsNew) {
      this.getPartnerContractsList(this.data?.PartnerID);
    } else {
      this.initItemRow();
      control.push(this.initItemRow());
    }

  }

  ngAfterViewInit() {

  }

  /**contract form group */
  get ContractDetailsGroupArray() {
    return (this.form.get('ContractDetails')) as UntypedFormArray;
  }
  /**contract form controls */
  get getContractDetailsCTrL() {
    return this.ContractDetailsGroupArray['controls']
  }


  /*** dynamic control for form */
  initItemRow(data: any = {}) {
    return this._fb.group({
      ContractTypeID: [data?.contaractTypeId ? data?.contaractTypeId : null, [Validators.required]],
      ContractAvailability: [data?.contractAvailabitily ? data?.contractAvailabitily : null, [Validators.required]],
      StartDate: [data?.startDate ? new Date(data?.startDate) : null, [Validators.required]],
      EndDate: [data?.endDate ? new Date(data?.endDate) : null, [Validators.required]],
      id: [data?.id ? data?.id : null],

    });


  }

  /**adding new control dynamicly */
  addUpdateControl() {
    const control = this.ContractDetailsGroupArray;
    if (control.length < 10) {
      control.push(this.initItemRow());
    }
  }



  /**targeting the multi forms on same indexing - on selection change */
  startEndDateReq: boolean = false;
  getContractAvailablity(e: any, index: number) {
    let startDate = new Date();
    let endDate = new Date(new Date().setMonth(new Date().getMonth() + 3));
    const selectedGroup = this.getContractDetailsCTrL[index];
    if (e.value == 'Y') {
      this.startEndDateReq = true;
      selectedGroup.get('StartDate').reset();
      selectedGroup.get('EndDate').reset();
      selectedGroup.get('StartDate').setValidators([Validators.required]);
      selectedGroup.get('EndDate').setValidators([Validators.required]);
    } else {
      // selectedGroup.get('StartDate').clearValidators();
      // selectedGroup.get('EndDate').clearValidators();
      selectedGroup.get('StartDate').patchValue(startDate);
      selectedGroup.get('EndDate').patchValue(endDate);
      this.startEndDateReq = false;
      this.minEndDates[index] = new Date(selectedGroup.get('StartDate').value);
    }
    selectedGroup.get('StartDate').updateValueAndValidity();
    selectedGroup.get('EndDate').updateValueAndValidity();

  }

  /**min date dynamic for dynamic multi contract end dates */
  // minDateValidator(minDate: Date) {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     debugger
  //     const selectedDate = control.value;
  //     if (selectedDate && selectedDate < minDate) {
  //       return { minDate: true };
  //     }
  //     return null;
  //   };
  // }
  /**getting contracts details of the partner */
  getPartnerContractsList(partnerID: number) {
    let queryString = `partnerId=${partnerID}&isForApproval=${this.data?.type == 'P' ? 1 : 0}`;
    this._globalServe.getAllContractbyPartner(queryString).subscribe(
      res => {
        this.partnerContracts = res['data'];
        const control = this.ContractDetailsGroupArray;
        if (this.partnerContracts.length != 0) {
          for (let i = 0; i < this.partnerContracts.length; i++) {
            control.push(this.initItemRow(this.partnerContracts[i]));
            this.minEndDates[i] = new Date(this.partnerContracts[i]?.startDate);
           /**by default load - validation based on contractAvailabitily */
            const selectedGroup = this.getContractDetailsCTrL[i];
            if (this.partnerContracts[i]?.contractAvailabitily == 'Y') {
              selectedGroup.get('StartDate').setValidators([Validators.required]);
              selectedGroup.get('EndDate').setValidators([Validators.required]);
            } 
            // else {
            
            //   selectedGroup.get('StartDate').clearValidators();
            //   selectedGroup.get('EndDate').clearValidators();
            // }
            selectedGroup.get('StartDate').updateValueAndValidity();
            selectedGroup.get('EndDate').updateValueAndValidity();
          };

        }
      }
    )
  }
  /**on change of start date - disabling past from selected date dynamiclly */
  minEndDates: any = [];
  changeDate(index: number, event: any) {
    const selectedGroup = this.getContractDetailsCTrL[index];
    selectedGroup.get('EndDate').reset();
    this.minDate = new Date(event.value);
    //  selectedGroup.get('EndDate').setValidators([this.minDateValidator(this.minDate)]);
    this.minEndDates[index] = new Date(event.value);
    if (event.value) {
      selectedGroup.get('EndDate').setValidators([Validators.required]);
    } else {
      selectedGroup.get('EndDate').clearValidators();
    }
    selectedGroup.get('EndDate').updateValueAndValidity();
  }

  //public contactList: any = [];
  public prContactList: any = [];
  getContractList() {
    this._globalServe.GetContractTypes().subscribe(
      res => {
        /**removed Direct Contract for india */
        this.contactList = res['data'].filter(item => item.ID !== 1);
      }
    )
  }


  /**update contract */
  updateContractModal(element: any) {
    element['title'] = "Update Contract Details";
    element['partnerContractsList'] = this.contactList
    element['type'] = this.data?.type;
    const dialogRef = this.dialog.open(UpdateContractDetailsModalComponent, {
      minWidth: '800px',
      maxHeight: '250px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss'],
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getPartnerContractsList(this.data?.PartnerID);
      }
    });
  }

  /**delete selected contracts row */
  deleteRow(e: any, index: number, element: any) {
    let a = e.target.value;
    e.stopPropagation();
    let data = element?.value;
    /**if id is prensent it means- deleting contracts from db
     * else deleting dynamic added contract
     */
    if (data?.id) {
      let idsToFilter = [index];
      /**filtering current contract to perform delete action */
      let currentContract = idsToFilter.map(index => this.partnerContracts[index]);
      this.confirmDelete(currentContract)
    } else {
      const control = this.ContractDetailsGroupArray;
      if (control.length != 1) {
        control.removeAt(index);
      }
    }
  }

  /**delete contract api */
  deleteContract(data: any) {
    let queryString = `ContractId=${data[0].id}`;
    this.__partnerServe.DeleteContractDetail(queryString).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.ContractDetailsGroupArray.clear();
        this.getPartnerContractsList(this.data?.PartnerID);
      }
    )
  }


  confirmDelete(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to delete this contract?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteContract(data)
      }
    });
  }
}
