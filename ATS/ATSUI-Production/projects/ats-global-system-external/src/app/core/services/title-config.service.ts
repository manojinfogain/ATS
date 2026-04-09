import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CANDIDATE_COMMON } from '../constant/candidate-common.const';

@Injectable({
  providedIn: 'root'
})
export class TitleConfigService {

  constructor(
    private titleService: Title
  ) { }
  
  // Set Title
  setTitle(newTitle: string) {
    //const APP_TITLE = ' Global ATS';
    const APP_TITLE = CANDIDATE_COMMON.atsLabelExternal.label;
    this.titleService.setTitle(`${APP_TITLE +' - '}${newTitle} `)
  }
}
