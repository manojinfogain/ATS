import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewProfileListComponent } from '../modal/view-profile-list/view-profile-list.component';
import { ViewAllProfilesModalComponent } from '../modal/view-all-profiles-modal/view-all-profiles-modal.component';

@Component({
  selector: 'app-assigned-talentid-list',
  templateUrl: './assigned-talentid-list.component.html',
  styleUrls: ['./assigned-talentid-list.component.scss']
})
export class AssignedTalentidListComponent implements OnInit {
  public selectedTabIndex : number = 0; 
  constructor(
    private router:Router,
    private activate:ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    let body = {
      type:'',
      title: 'Total Profiles',
    //  list: data,
      data: {},
     // IsRenuTeam:this.data?.IsRenuTeam,
     // assign: this.RequisionActionRight(this.data) === true ? true:false
    }
    //  const dialogRef = this.dialog.open(ViewAllProfilesModalComponent, {
    //          // width: '650px',
    //           panelClass: ['ats-model-wrap','ats-model-full-screen', 'view-profile-all-modal'],
    //           data: body,
    //           disableClose: true,
    //           maxWidth: '100vw',
    //           maxHeight: '100vh',
    //           height: '100%',
    //           width: '100%'
    //         });
   let param = this.activate['snapshot'].queryParams.offshore;
   if(param){
     if(param === 'true'){
       this.selectedTabIndex = 0;
     }
     else{
      this.selectedTabIndex = 1;
     }
   }

  
  }

  offshoreNav(){
    this.router.navigate(['home']);
  }

  
  onTabChanged(tabIndex : number) : void{
    this.selectedTabIndex = tabIndex; 
  }

 
}
