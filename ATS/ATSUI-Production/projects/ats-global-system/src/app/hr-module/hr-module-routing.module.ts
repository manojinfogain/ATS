import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateDocumentsComponent } from './validate-documents/validate-documents.component';

const routes: Routes = [
  {
    path: 'validate-documents',
    component:ValidateDocumentsComponent,
    data: { title: "Validate Documents" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrModuleRoutingModule { }
