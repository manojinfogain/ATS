import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-personal-dt-form',
  templateUrl: './personal-dt-form.component.html',
  styleUrls: ['./personal-dt-form.component.scss']
})
export class PersonalDtFormComponent implements OnInit {
  @Input() data:any = {}
  constructor() { }

  ngOnInit(): void {
  }

}
