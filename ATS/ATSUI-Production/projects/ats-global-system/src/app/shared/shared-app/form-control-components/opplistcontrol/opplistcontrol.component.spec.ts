import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpplistcontrolComponent } from './opplistcontrol.component';

describe('OpplistcontrolComponent', () => {
  let component: OpplistcontrolComponent;
  let fixture: ComponentFixture<OpplistcontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpplistcontrolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpplistcontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
