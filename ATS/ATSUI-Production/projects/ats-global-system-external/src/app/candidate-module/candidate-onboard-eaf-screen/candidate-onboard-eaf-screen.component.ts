import { Component, OnInit } from '@angular/core';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';

@Component({
  selector: 'app-candidate-onboard-eaf-screen',
  templateUrl: './candidate-onboard-eaf-screen.component.html',
  styleUrls: ['./candidate-onboard-eaf-screen.component.scss']
})
export class CandidateOnboardEafScreenComponent implements OnInit {

  constructor(
    private _storage: GetSetStorageService
  ) { }

  public authUserType:string = '';
  ngOnInit(): void {
    let user = this._storage.getSetUserData();
    let userRole = user?.RoleId;
    this.authUserType = user?.AuthUserType;
  }

}
