import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminModuleRoutingModule } from './admin-module-routing.module';
import { CompanyMasterComponent } from './company-master/company-master.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { AddNewCompanyModalComponent } from './company-master/modals/add-new-company-modal/add-new-company-modal.component';


@NgModule({
  declarations: [
    CompanyMasterComponent,
    AddNewCompanyModalComponent
  ],
  imports: [
    CommonModule,
    AdminModuleRoutingModule,
    SharedAppModule
  ]
})
export class AdminModuleModule { }
