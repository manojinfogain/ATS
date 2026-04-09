import { Component, OnInit } from '@angular/core';
import { COMMON_CONST } from 'projects/ats-global-system-external/src/app/core/constant/common.const';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  commonconst = COMMON_CONST;
  imgPath = this.commonconst.imgPath;
  img:string
  constructor( private _share:ShareService) {
    this.img = this.imgPath + "404.jpg";
   }

  ngOnInit() {
   // this._share.hideSideBarHeader.next(true);
  }

}
