import { DatePipe } from '@angular/common';
import { Component, OnInit,Inject } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { AddingOfferdCandidateComponent } from '../adding-offerd-candidate/adding-offerd-candidate.component';
import { UpdatejoiningDetailsModalComponent } from '../updatejoining-details-modal/updatejoining-details-modal.component';
import { CandidateTalentOfferDetailsModalComponent } from '../candidate-talent-offer-details-modal/candidate-talent-offer-details-modal.component';
import { UpdateJoinedDeclinedDetailsModalComponent } from '../update-joined-declined-details-modal/update-joined-declined-details-modal.component';

@Component({
  selector: 'app-offered-candidate-list-modal',
  templateUrl: './offered-candidate-list-modal.component.html',
  styleUrls: ['./offered-candidate-list-modal.component.scss'],
  providers: [DatePipe]
})
export class OfferedCandidateListModalComponent implements OnInit {
  displayedColumns = ['srNo', 'empName',  'OfferDate', 'tentativeJoiningDate',
   'currencyName','offerSalaryAnnual',  'sourceType', 'sourceName',
  'status','action',
  // /'comments',
  ];
  blob: any;
  url: any;
  public isloader: boolean = false;

  public offerCandidateList: any=[];
  public offerCandidateJoined: any=[];
  constructor(
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<OfferedCandidateListModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _share: ShareService,
    private _talentServ: TalentService,
    private _excelService: ExcelService,

  ) { }

  ngOnInit(): void {
   //this.GetIJPApplicantList();
   this.GetOfferedCandidateDetailsForTalent();
   if(this.data?.IsMannualOffer == 'N'){
    this.displayedColumns.pop();
   }
  }
  /**GetIJPApplicantList ijp */
  GetOfferedCandidateDetailsForTalent() {
    this._talentServ.GetOfferedCandidateDetailsForTalent(this.data?.TH_ID).subscribe(
      res => {
        this.offerCandidateList = res['data'];
        this.offerCandidateJoined = res['data'].filter(r=> r.OfferStatus  == 'Joined');
      }
    )
  }

  openAddOfferCModal() {
    let elm:any =this.data;
    elm['title'] = 'Add Offer Details';
    const dialogRef = this.dialog.open(AddingOfferdCandidateComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.GetOfferedCandidateDetailsForTalent();
      }
    }
    );
  }

  public isLoadList:boolean = false;
  updatejoiningDetails(elm: any) {
    elm['title'] = 'Joining Details';
    elm['isExceptionOfferAllowed'] = this.data?.isExceptionOfferAllowed;
     elm['IsExceptionCandidateJoin'] = this.data?.isExceptionOfferAllowed;
      elm['IsJoined'] = this.offerCandidateJoined?.length == 0 ? 'N' : 'Y';
    if(this.data?.LocationID == 13){
      const dialogRef = this.dialog.open(UpdateJoinedDeclinedDetailsModalComponent, {
        panelClass: ['ats-model-wrap', 'request-transfers-candidate','join-model-candidate'],
        data: elm
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          if(res == 200){
            this.isLoadList = true;
          }
         
          this.GetOfferedCandidateDetailsForTalent();
        }
      }
      );
    }
    else{
      const dialogRef = this.dialog.open(UpdatejoiningDetailsModalComponent, {
        panelClass: ['ats-model-wrap', 'request-transfers-candidate','join-model-candidate'],
        data: elm
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.isLoadList = true;
          this.GetOfferedCandidateDetailsForTalent();
        }
      }
      );
    }

  }

  onNoClick() {
    if(this.isLoadList){
      this.dialogRef.close(true);
    }
    else{
      this.dialogRef.close();
    }
    
  }


  /**download  list */
  exportAsXLSX(): void {
    if(this.data?.LocationID == 13){
      this._talentServ.GetOfferedCandidateDetailsForTalentForPoland(this.data?.TH_ID).subscribe(
        res => {
          let candidateList = res['data'];
          let filterDataExcel = [];
          let dateFormat = 'd-MMM-y';
          for (var key in candidateList) {
            let selectedData = {
              'Talent ID': candidateList[key].TalentID || '-',
              'Candidate Name': candidateList[key].CandidateName || '-',
              'Offered Date': this.datepipe.transform(candidateList[key].OfferedDate, dateFormat) || '-',
              'Tentative Joining Date': this.datepipe.transform(candidateList[key].DateOfJoining, dateFormat) || '-',
              'Offer Status': candidateList[key].OfferStatus || '-',              
              'Primary Skill': candidateList[key].PrimarySkill || '-',
              'Sub Skills': candidateList[key].SubSkill || '-',
              'Total Experience': (candidateList[key].ExpInYear || '0') + ' Year(s) ' + (candidateList[key].ExpInMonth || '0') + ' Month(s)',
              'Source Type': candidateList[key].Source || '-',
              'Source Name': candidateList[key].SourceName || 'NA',
              'Partner Name': candidateList[key].PartnerName || 'NA',
              'Referrer Name': candidateList[key].ReferrerName || 'NA',
              'External Portal Name': candidateList[key].SubProfileName || 'NA',
              'Employment Type': candidateList[key].EmploymentType || '-',
              'Designation': candidateList[key].DesignatinName || '-',
              'Grade': candidateList[key].Grade || '-',
              'Offered Salary  Monthly / Hourly (PLN)': candidateList[key].OfferedCTCLocal || '-',
              'Joining Bonus (PLN)': candidateList[key].JoiningBonus || '-',
              'Retention Bonus (PLN)': candidateList[key].RetentionBonus || '-',
              'Relocation Expenses (PLN)': candidateList[key].RelocationExpense || '-',
              'Travel Expenses (PLN)': candidateList[key].TravelExpense || '-',
              'Reporting Manager': candidateList[key].ReportingManager || '-',
              'Billing Currency': candidateList[key].BillingCurrencyName || '-',
              'Billing Rate / Hour ( In Billing Currency )': candidateList[key].billingRateHrCurrency || '-',
              'Billable Hours / Day': candidateList[key].BillableHoursDay || '-',
              'Project Buffer % ( If Applicable )': candidateList[key].ProjectBufferInPercent || '-',
              'Project Buffer ( In USD )': candidateList[key].ProjectBufferUsd || '-',
              'Local Currency': candidateList[key].LocalCurrency || '-',
              'Annual CTC ( In Local Currency )': candidateList[key].AnnualCTC || '-',
              'Billing Rate / Hour ( In USD )': candidateList[key].BillingRateHrInUSD || '-',
              'Annual Billable Hours': candidateList[key].AnnualBillableHours || '-',
              'Annual Revenue ( In USD )': candidateList[key].AnnualRevenueUsd || '-',
              'Annual Salary Cost ( In USD )': candidateList[key].AnnualSalaryCostUsd || '-',
              'Joining Bonus ( In USD )': candidateList[key].JoiningBonusUsd || '-',
              'Benefits ( In USD )': candidateList[key].BenefitsUsd || '-',
              'DGM Cost ( In USD )': candidateList[key].DgmCostUsd || '-',
              'DGM Percentage': candidateList[key].DgmPercentUsd || '-',
              'Date of Decline': this.datepipe.transform(candidateList[key].DateOfDecline, dateFormat) || '-',
              'Decline Category': candidateList[key].DeclineCategory || '-',
              'Decline Remarks': candidateList[key].DeclineRemarks || '-',
              'Comments': candidateList[key].Comment || '-',
            };
            filterDataExcel.push(selectedData);
          }

          this._excelService.exportAsExcelFile(filterDataExcel, 'Offered Candidate');
        }
      )
    } else {
      this._talentServ.GetOfferedCandidateDetailsForTalent(this.data?.TH_ID).subscribe(
        res => {
          let candidateList = res['data'];
          let filterDataExcel = [];
          let dateFormat = 'd MMM y';
          for (var key in candidateList) {
            let selectedData = {
              'Talent ID': candidateList[key].TalentID || '-',
              'Candidate Name': candidateList[key].CandidateName || '-',
              'Offered Date': this.datepipe.transform(candidateList[key].OfferedDate, dateFormat) || '-',
              'Tentative Joining Date': this.datepipe.transform(candidateList[key].DateOfJoining, dateFormat) || '-',
              'Max Salary Annually (INR)': candidateList[key].MaxSalary || '-',
              'Offer Salary  Annually (INR)': candidateList[key].OfferedCTC || '-',
              'Variance ( % )': candidateList[key].Variance || '-',
              'Source Name': candidateList[key].SourceName || '-',
              'Source Type': candidateList[key].Source || '-',
            };
            filterDataExcel.push(selectedData);
          }

          this._excelService.exportAsExcelFile(filterDataExcel, 'Offered Candidate');
        }
      )
    }

  }

  viewOfferDetailsModal(elm: any) {
    elm['title'] = elm?.Name + '';
    const dialogRef = this.dialog.open(CandidateTalentOfferDetailsModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }
    
   

}
