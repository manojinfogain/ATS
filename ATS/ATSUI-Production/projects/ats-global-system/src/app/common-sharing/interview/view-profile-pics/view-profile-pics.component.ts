import { Component,Input, OnInit } from '@angular/core';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
@Component({
  selector: 'app-view-profile-pics',
  templateUrl: './view-profile-pics.component.html',
  styleUrls: ['./view-profile-pics.component.scss']
})
export class ViewProfilePicsComponent implements OnInit {

  @Input() isMultiProfile:boolean = false;
  @Input() roundId:number;
  @Input() cid:number;
  constructor(
    private http: HttpClient,
    private _share: ShareService
  ) { }

  ngOnInit() {
    this.getProfilePic();
    
  }
  public image: any;
  getProfilePic() {
    this.http.get(`${environment.apiMainUrlNet}dashboard/downloadProfilePic?cid=${this.cid}&roundid=${this.roundId}`, { headers: { 'Content-Type': 'image/jpg' }, responseType: 'blob' }).subscribe(
      res => {
        const reader = new FileReader();
        reader.onload = (e) => this.image = e.target.result;
        reader.readAsDataURL(new Blob([res]));
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }

}
