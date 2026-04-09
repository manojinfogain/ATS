import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MessageComponent, MessageSnackBarComponent, MessageSnackBarErrorComponent } from './components/message/message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { NgbDropdownModule,NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { PipesDirectivesModule } from '../pipes-directives/pipes-directives.module';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LaoderComponent } from './components/laoder/laoder.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SidebarMenuComponent } from './components/sidebar-menu/sidebar-menu.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { HeaderAtsComponent } from './components/header-ats/header-ats.component';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import {MatBadgeModule} from '@angular/material/badge';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';
import { NotificationDComponent } from './components/notification-d/notification-d.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
const WidgetModules = [
  NgbDropdownModule,
  NgbTooltipModule,
  MatSnackBarModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  NgxSpinnerModule,
  MatExpansionModule,
  MatMenuModule,
  MatToolbarModule,
  MatTooltipModule,
  MatBadgeModule,
  MatTabsModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
]

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        MessageComponent,
        LeftSidebarComponent,
        PageNotFoundComponent,
        MessageSnackBarComponent,
        MessageSnackBarErrorComponent,
        LaoderComponent,
        SidebarMenuComponent,
        HeaderAtsComponent,
        ComingSoonComponent,
        NotificationDComponent,
        NotificationListComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        WidgetModules,
        PipesDirectivesModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        HeaderComponent,
        FooterComponent,
        MessageComponent,
        LeftSidebarComponent,
        WidgetModules,
        PageNotFoundComponent,
        PipesDirectivesModule,
        LaoderComponent,
        SidebarMenuComponent,
        HeaderAtsComponent,
        ComingSoonComponent
    ]
})
export class SharedLandingModule { }
