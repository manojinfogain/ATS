import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleConfigService } from 'projects/ats-global-system-external/src/app/core/services/title-config.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  @Input() public showBreadCrumb:boolean = true;
  public pageTitle:string;
  @Input() public subText:string = '';
  constructor(private _activeRouter:ActivatedRoute,private _titleService:TitleConfigService){}

  ngOnInit(): void {
    this.pageTitle = this._activeRouter['snapshot'].data['title'];
    this._titleService.setTitle(this._activeRouter['snapshot'].data['title']);
  }

}
