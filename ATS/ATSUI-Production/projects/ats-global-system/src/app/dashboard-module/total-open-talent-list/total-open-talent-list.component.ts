import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-total-open-talent-list',
  templateUrl: './total-open-talent-list.component.html',
  styleUrls: ['./total-open-talent-list.component.scss']
})
export class TotalOpenTalentListComponent implements OnInit {
  public selectedTabIndex : number = 0; 
  constructor(
    private router:Router,
    private activate:ActivatedRoute
  ) { }

  ngOnInit(): void {
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
