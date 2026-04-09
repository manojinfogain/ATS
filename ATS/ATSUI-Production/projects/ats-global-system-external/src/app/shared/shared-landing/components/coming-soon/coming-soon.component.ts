import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalCommonMethodService } from 'projects/ats-global-system-external/src/app/core/common/global-common-method.service';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {
  public updateLocsubs: Subscription;
  public locationData: any = {};
  constructor(
    private _share:ShareService,
    private _globalCommonMethod: GlobalCommonMethodService
  ) { }

  ngOnInit(): void {
    this.updateLocsubs = this._share.updateLocation.subscribe(
      get=>{
        this.locationData = this._globalCommonMethod.getSetLocation();
      }
    )
  }

}
