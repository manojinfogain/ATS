import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { OfferService } from '../../offer.service';
import { ApprovalActionModalComponent } from '../../modals/approval-action-modal/approval-action-modal.component';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShareService } from '../../../core/services/share.service';
import { Subscription } from 'rxjs';
import { AtsCommonFuncService } from '../../../core/common/ats-common-func.service';
import { OfferApproveActionModalComponent } from '../../G5AboveOffer/selected-cand-list-screen/offer-approve-action-modal/offer-approve-action-modal.component';

@Component({
  selector: 'app-offer-approval-screen',
  templateUrl: './offer-approval-screen.component.html',
  styleUrls: ['./offer-approval-screen.component.scss']
})
export class OfferApprovalScreenComponent implements OnInit {

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _storage: GetSetStorageService,
    public dialog: MatDialog,
    private route: Router,
    private _offerService: OfferService,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
        private _atsCommon:AtsCommonFuncService
  ) { }
  public paramId: number;
  public action: string;
  public userData: any = {};
  public offerAprDt: any = [];
  public isUserAuthorized: boolean = false;
  public unAuthorizedMsg: string = 'You are not authorized to view this page';
  public isGoBackVisible: boolean = false;
  public updateLocsubs: Subscription;
  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();    
    const paramId = this._activatedRoute.snapshot.params.id;
    let queryParam = this._activatedRoute['snapshot']?.queryParams;
    const action = queryParam?.action;
    if (paramId) {
      this.paramId = paramId;
      this.action = action;
      this._offerService.GetCandidateDetailsForApproval(paramId).subscribe(
        res => {
          this.offerAprDt = res['data'][0];
          let locData ={
            locId: this.offerAprDt?.JoiningLocationId,
            locName: this.offerAprDt?.JoiningLocationName
          }
          this._storage.saveLocationData(locData);    
          this._share.updateLocation.next(true);
          this._share.detectSwitchLoc.next(true);
          this._share.updateSideBarMenu.next(true);
          this._atsCommon.addClasLocationWise();
          if (this.userData?.otherRoles?.IsApprover === 'Y' &&
            (
              (this.offerAprDt?.approverCDO == this.userData?.EmpNewId ||
                this.offerAprDt?.approverDCDO == this.userData?.EmpNewId) &&
              this.offerAprDt?.OfferStatusID == 65
            ) ||
            (
              this.offerAprDt?.OfferStatusID == 20 &&
              (this.offerAprDt?.approverTagLead == this.userData?.EmpNewId ||
                this.offerAprDt?.approverDTagLead == this.userData?.EmpNewId
              )
            ) ||
            (
              this.offerAprDt?.OfferStatusID == 25 &&
              (this.offerAprDt?.approverTagHead == this.userData?.EmpNewId ||
                this.offerAprDt?.approverDTagHead == this.userData?.EmpNewId
              )
            ) ||
            (
              this.offerAprDt?.OfferStatusID == 40 &&
              (this.offerAprDt?.approverDH == this.userData?.EmpNewId ||
                this.offerAprDt?.approverDDH == this.userData?.EmpNewId
              )
            ) ||
            (
              this.offerAprDt?.OfferStatusID == 45 &&
              (this.offerAprDt?.approverDH == this.userData?.EmpNewId ||
                this.offerAprDt?.approverDDH == this.userData?.EmpNewId
              )
            ) ||
            (
              this.offerAprDt?.OfferStatusID == 60 &&
              (this.offerAprDt?.approverSVP == this.userData?.EmpNewId ||
                this.offerAprDt?.approverDSVP == this.userData?.EmpNewId
              )
            ) ||
            (
              this.offerAprDt?.OfferStatusID == 80 &&
              (this.offerAprDt?.approverCOO == this.userData?.EmpNewId ||
                this.offerAprDt?.approverDCOO == this.userData?.EmpNewId
              )
            ) ||
            (
              this.offerAprDt?.OfferStatusID == 125 &&
              (this.offerAprDt?.approverHR == this.userData?.EmpNewId ||
                this.offerAprDt?.approverDHR == this.userData?.EmpNewId
              )
            ) ||
            (
              this.offerAprDt?.OfferStatusID == 150 &&
              (this.offerAprDt?.approverFuncHead == this.userData?.EmpNewId ||
                this.offerAprDt?.approverDFuncHead == this.userData?.EmpNewId
              )
            )
          ) {
            this.isUserAuthorized = true;
            if(this.offerAprDt?.IsRenuTeam == 'Y' && this.offerAprDt?.OfferStatusID == 20){
              debugger
              this.ApprovalActionModalForLeadership();
            }else{
              debugger
              this.approvalAction();
            }            
          } else {
            this.isUserAuthorized = false;
            if (this.userData?.otherRoles?.IsApprover === 'Y'){
              this.isGoBackVisible = true;
              // msg for CDO
              if(
                ((this.offerAprDt?.approverCDO == this.userData?.EmpNewId ||
                  this.offerAprDt?.approverDCDO == this.userData?.EmpNewId) ||
                  (this.offerAprDt?.approverTagLead == this.userData?.EmpNewId ||
                    this.offerAprDt?.approverDTagLead == this.userData?.EmpNewId) || 
                    (this.offerAprDt?.approverTagHead == this.userData?.EmpNewId ||
                      this.offerAprDt?.approverDTagHead == this.userData?.EmpNewId
                    ) || (this.offerAprDt?.approverDH == this.userData?.EmpNewId ||
                      this.offerAprDt?.approverDDH == this.userData?.EmpNewId
                    ) ||  (this.offerAprDt?.approverDH == this.userData?.EmpNewId ||
                      this.offerAprDt?.approverDDH == this.userData?.EmpNewId
                    ) || (this.offerAprDt?.approverSVP == this.userData?.EmpNewId ||
                      this.offerAprDt?.approverDSVP == this.userData?.EmpNewId
                    ) ||  (this.offerAprDt?.approverCOO == this.userData?.EmpNewId ||
                      this.offerAprDt?.approverDCOO == this.userData?.EmpNewId
                    ) ||  (this.offerAprDt?.approverHR == this.userData?.EmpNewId ||
                      this.offerAprDt?.approverDHR == this.userData?.EmpNewId
                    ) || (this.offerAprDt?.approverFuncHead == this.userData?.EmpNewId ||
                      this.offerAprDt?.approverDFuncHead == this.userData?.EmpNewId
                    ) ) &&
                   this.offerAprDt?.OfferStatusID == 100
              ){
                this.unAuthorizedMsg = 'Offer is already approved';
              }else if(
                ((this.offerAprDt?.approverCDO == this.userData?.EmpNewId ||
                this.offerAprDt?.approverDCDO == this.userData?.EmpNewId) &&
                 this.offerAprDt?.OfferStatusID == 75) ||
                 (this.offerAprDt?.OfferStatusID == 30 &&
                 (this.offerAprDt?.approverTagLead == this.userData?.EmpNewId ||
                   this.offerAprDt?.approverDTagLead == this.userData?.EmpNewId
                 )) || 
                 (
                  this.offerAprDt?.OfferStatusID == 35 &&
                  (this.offerAprDt?.approverTagHead == this.userData?.EmpNewId ||
                    this.offerAprDt?.approverDTagHead == this.userData?.EmpNewId
                  )
                ) ||
                (
                  this.offerAprDt?.OfferStatusID == 50 &&
                  (this.offerAprDt?.approverDH == this.userData?.EmpNewId ||
                    this.offerAprDt?.approverDDH == this.userData?.EmpNewId
                  )
                ) ||
                (
                  this.offerAprDt?.OfferStatusID == 55 &&
                  (this.offerAprDt?.approverDH == this.userData?.EmpNewId ||
                    this.offerAprDt?.approverDDH == this.userData?.EmpNewId
                  )
                ) ||
                (
                  this.offerAprDt?.OfferStatusID == 70 &&
                  (this.offerAprDt?.approverSVP == this.userData?.EmpNewId ||
                    this.offerAprDt?.approverDSVP == this.userData?.EmpNewId
                  )
                ) ||
                (
                  this.offerAprDt?.OfferStatusID == 90 &&
                  (this.offerAprDt?.approverCOO == this.userData?.EmpNewId ||
                    this.offerAprDt?.approverDCOO == this.userData?.EmpNewId
                  )
                ) ||
                (
                  this.offerAprDt?.OfferStatusID == 135 &&
                  (this.offerAprDt?.approverHR == this.userData?.EmpNewId ||
                    this.offerAprDt?.approverDHR == this.userData?.EmpNewId
                  )
                ) ||
                (
                  this.offerAprDt?.OfferStatusID == 155 &&
                  (this.offerAprDt?.approverFuncHead == this.userData?.EmpNewId ||
                    this.offerAprDt?.approverDFuncHead == this.userData?.EmpNewId
                  )
                )
                ){
                this.unAuthorizedMsg = 'The request has already been taken care of';
              }else{
                this.unAuthorizedMsg = 'You are not authorized to view this page';
              }
            }else{           
              this.isGoBackVisible = false;   
              this.unAuthorizedMsg = 'You are not authorized to view this page';
            }
          }
        }
      )
    }else{
      this._share.showAlertErrorMessage.next('Invalid URL');  
    }
  }

  back() {
    this.route.navigate(['/offer-approval']);
  }

  /***
     * action by approver
     */
  approvalAction() {
    let elm: any = {};
    elm['cid'] = this.paramId;
    elm['th_id'] = this.offerAprDt.Th_id;
    elm['isDirectApprScr'] = true;
    elm['IsDelegator'] = this.offerAprDt.IsDelegator; 
    elm['Action'] = this.action;
    elm['OfferStatusName'] = this.offerAprDt?.OfferStatus;
    elm['OfferStatusID'] = this.offerAprDt?.OfferStatusID;
    elm['Division'] = this.offerAprDt?.DivisionName;
    const dialogRef = this.dialog.open(ApprovalActionModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result?.flag) {
          this._share.showAlertSuccessMessage.next(result?.msg);
          // this.dialogRef.close(true);
          this.GetCandidateDetailsForApproval(this.paramId);
          this.logOut();
        }
      }
    )
  }

  
  logOut() {
    setTimeout(() => {
      this._storage.destroyAllStorage();
      this._share.sessionExp.next(false);
      this.route.navigate(['/login']);
    }, 3000)
  }

  GetCandidateDetailsForApproval(cid: number) {
    this._offerService.GetCandidateDetailsForApproval(cid).subscribe(
      res => {
        this.offerAprDt = res['data'][0];
      });
  }

  getDisabledStatus() { 
    if (this.offerAprDt?.OfferStatusID == 20 || this.offerAprDt?.OfferStatusID == 25 || this.offerAprDt?.OfferStatusID == 40 || this.offerAprDt?.OfferStatusID == 45 || this.offerAprDt?.OfferStatusID == 60 || this.offerAprDt?.OfferStatusID == 65 || this.offerAprDt?.OfferStatusID == 80 || this.offerAprDt?.OfferStatusID == 125 || this.offerAprDt?.OfferStatusID == 150) {
      return false;
    } else {
      return true;
    }
  }

  ApprovalActionModalForLeadership() {
    let elm: any = {};
    elm['cid'] = this.paramId;
    elm['th_id'] = this.offerAprDt.Th_id;
    elm['isDirectApprScr'] = true;
    elm['IsDelegator'] = this.offerAprDt.IsDelegator; 
    elm['Action'] = this.action;
    elm['OfferStatusName'] = this.offerAprDt?.OfferStatus;
    elm['OfferStatusID'] = this.offerAprDt?.OfferStatusID;
    elm['Division'] = this.offerAprDt?.DivisionName;
    const dialogRef = this.dialog.open(OfferApproveActionModalComponent, {
          panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
          data: elm,
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%'
        });
        dialogRef.afterClosed().subscribe(
          result => {
            if (result?.flag) {
              this._share.showAlertSuccessMessage.next(result?.msg);
              this.GetCandidateDetailsForApproval(this.paramId);
              this.logOut();
            }
          }
        )
  }

}
