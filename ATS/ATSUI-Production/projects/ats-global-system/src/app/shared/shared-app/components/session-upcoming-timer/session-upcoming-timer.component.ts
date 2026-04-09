import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CountdownConfig } from 'ngx-countdown';
const CountdownTimeUnits: Array<[string, number]> = [
  ['Y', 1000 * 60 * 60 * 24 * 365], // years
  ['M', 1000 * 60 * 60 * 24 * 30], // months
  ['D', 1000 * 60 * 60 * 24], // days
  ['H', 1000 * 60 * 60], // hours
  ['m', 1000 * 60], // minutes
  ['s', 1000], // seconds
  ['S', 1], // million seconds
];
@Component({
  selector: 'app-session-upcoming-timer',
  templateUrl: './session-upcoming-timer.component.html',
  styleUrls: ['./session-upcoming-timer.component.scss']
})
export class SessionUpcomingTimerComponent implements OnInit {
  @Input() public futureDate: any;
  @Input() public IsPrivateSession:any;
  @Output() IsTimesUp: EventEmitter<any> = new EventEmitter<any>();
  public leftTime = 0;
  config: CountdownConfig;

  constructor() { }

  ngOnInit(): void {
    if(!this.IsPrivateSession)
    {
    this.leftTime = Math.round((new Date(this.futureDate).getTime() - new Date().getTime()) / 1000);
    }
    else
    {
      var sessionScheduledTime = new Date(this.futureDate);
      sessionScheduledTime.setMinutes(sessionScheduledTime.getMinutes() + 30);
      this.leftTime = Math.round((new Date(sessionScheduledTime).getTime() + 30 - new Date().getTime()) / 1000);
    }
 
   
  }


  /***
   * more than 24 hours
   */
  formatTimer = ({ date, formatStr }) => {
    let duration = Number(date || 0);

    return CountdownTimeUnits.reduce((current, [name, unit]) => {
      if (current.indexOf(name) !== -1) {
        const v = Math.floor(duration / unit);
        duration -= v * unit;
        return current.replace(new RegExp(`${name}+`, 'g'), (match: string) => {
          return v.toString().padStart(match.length, '0');
        });
      }
      return current;
    }, formatStr);
  }
  handleEvent(e) {
    this.IsTimesUp.next(e);
  }

}
