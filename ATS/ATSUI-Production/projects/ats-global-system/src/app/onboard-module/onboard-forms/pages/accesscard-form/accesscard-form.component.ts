import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-accesscard-form',
  templateUrl: './accesscard-form.component.html',
  styleUrls: ['./accesscard-form.component.scss']
})
export class AccesscardFormComponent implements OnInit {
  @Input() data:any = {}
  constructor() { }

  ngOnInit(): void {
  }

}
