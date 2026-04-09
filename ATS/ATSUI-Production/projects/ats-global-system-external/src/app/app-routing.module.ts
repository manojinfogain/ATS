import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication-module/login/login.component';
import { UserAuthLoadGuard } from './core/guards/user-auth-load.guard';
import { ComingSoonComponent } from './shared/shared-landing/components/coming-soon/coming-soon.component';
import { PageNotFoundComponent } from './shared/shared-landing/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: "/candidate-screen",
    pathMatch: 'full'
  },
  {
    path: 'login',
    component:LoginComponent,
    data: { title: "Login" }
  },
  {
    path: '',
    loadChildren: () => import('../app/authentication-module/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: '',
    loadChildren: () => import('../app/candidate-module/candidate-module.module').then(m => m.CandidateModuleModule),
    canLoad:[UserAuthLoadGuard]
  },
  {
    path: 'coming-soon',
    component:ComingSoonComponent,
    data: { title: "Coming Soon" }
  },
  
  { path : '**', component : PageNotFoundComponent,  data: {title : "Page Not Found"},canLoad:[UserAuthLoadGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
