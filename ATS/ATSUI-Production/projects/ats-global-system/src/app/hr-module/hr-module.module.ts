import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrModuleRoutingModule } from './hr-module-routing.module';
import { ValidateDocumentsComponent } from './validate-documents/validate-documents.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';


@NgModule({
  declarations: [
    ValidateDocumentsComponent
  ],
  imports: [
    CommonModule,
    HrModuleRoutingModule,
    SharedAppModule
  ]
})
export class HrModuleModule { }
