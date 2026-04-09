import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-status-id-visibility-shared',
  templateUrl: './all-status-id-visibility-shared.component.html',
  styleUrls: ['./all-status-id-visibility-shared.component.scss']
})
export class AllStatusIdVisibilitySharedComponent implements OnInit {
  @Input() statusId: number = 0;
  @Input() statusName: string = '';
  @Input() statusType: string = '';
  @Input() PrevStatusName: string = null;
  constructor() { }

  ngOnInit(): void {
  }

  /**showing status wise colour based on id */
  // statusClassMap: { [key: number]: string } = {
  //   // schedule yellow colour
  //   1: 'schedule', 2: 'schedule', 16: 'schedule', 17: 'schedule',
  //   20: 'schedule', 25: 'schedule', 40: 'schedule', 45: 'schedule',
  //   60: 'schedule', 65: 'schedule', 80: 'schedule', 125: 'schedule',
  //   150: 'schedule',

  //   // rejects in red
  //   5: 'rejects', 15: 'rejects', 18: 'rejects',
  //   30: 'rejects', 35: 'rejects', 50: 'rejects', 55: 'rejects',
  //   70: 'rejects', 75: 'rejects', 90: 'rejects', 110: 'rejects',
  //   135: 'rejects', 155: 'rejects', 160: 'rejects', 220: 'rejects',
  //   270: 'rejects',

  //   // shortlisted green
  //   7: 'shortlisted', 100: 'shortlisted', 130: 'shortlisted',
  //   140: 'shortlisted', 180: 'shortlisted', 200: 'shortlisted',

  //   // holds lite green
  //   6: 'holds', 10: 'holds',

  //   // special ones
  //   3: 'reschedule',
  //   4: 'selecteds',
  //   120: 'offergen',
  //   240: 'drops',
  //   260: 'drops'
  // };

  // getStatusClass(id: number): string {
  //   return this.statusClassMap[id] || '';
  // }

}
