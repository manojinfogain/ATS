import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from '../authentication-module/authentication-routing.module';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { BuddyRoutingModule } from './buddy-routing.module';
import { BuddyScreenComponent } from './buddy-screen/buddy-screen.component';
import { UpdateBuddyComponent } from './update-buddy/update-buddy.component';




@NgModule({
  declarations: [
  
    BuddyScreenComponent,
    UpdateBuddyComponent,
      


  ],
  imports: [
    CommonModule,
    SharedAppModule,
    BuddyRoutingModule
  ]
})
export class BuddyModule { 
}
