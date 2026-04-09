import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleConfigService {

  constructor(
    private titleService: Title
  ) { }
  
  // Set Title
  setTitle(newTitle: string) {
    const APP_TITLE = ' Global ATS';
    this.titleService.setTitle(`${APP_TITLE +' - '}${newTitle} `)
  }
}
