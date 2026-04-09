import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TalentService } from '../talent.service';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { TitleConfigService } from '../../core/services/title-config.service';

@Component({
  selector: 'app-apply-for-ijp',
  templateUrl: './apply-for-ijp.component.html',
  styleUrls: ['./apply-for-ijp.component.scss']
})
export class ApplyForIjpComponent implements OnInit {
  public selectedTabIndex: number = 0;
  public applicationCount: number = 0;
  
  constructor(
    private _talentServ: TalentService,
    private _activeRouter: ActivatedRoute,
    private _titleService: TitleConfigService
  ) {
  }

  ngOnInit() {
    // Set page title from route data
    const pageTitle = this._activeRouter.snapshot.data['title'];
    if (pageTitle) {
      this._titleService.setTitle(pageTitle);
    }
    // this.loadApplicationCount();
  }

  /**
   * Load application count for badge
   */
  // loadApplicationCount() {
  //   this._talentServ.getMyApplicationStats().subscribe(
  //     res => {
  //       if (res && res['data'] && res['data'].length > 0) {
  //         const stats = res['data'][0];
  //         this.applicationCount = stats.TotalApplications || 0;
  //       }
  //     },
  //     err => {
  //       console.error('Error loading application count:', err);
  //     }
  //   );
  // }

  /**
   * Handle tab change event
   */
  onTabChange(event: MatTabChangeEvent) {
    this.selectedTabIndex = event.index;
    // Refresh data when switching to dashboard tab
    // if (event.index === 1) {
    //   this.loadApplicationCount();
    // }
  }

  /**
   * Handle application applied event from child component
   */
  onApplicationApplied() {
    // this.loadApplicationCount();
  }
}
