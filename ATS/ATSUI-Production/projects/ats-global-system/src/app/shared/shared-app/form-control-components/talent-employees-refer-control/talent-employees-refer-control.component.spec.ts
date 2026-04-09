import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentEmployeesReferControlComponent } from './talent-employees-refer-control.component';

describe('TalentEmployeesReferControlComponent', () => {
  let component: TalentEmployeesReferControlComponent;
  let fixture: ComponentFixture<TalentEmployeesReferControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentEmployeesReferControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentEmployeesReferControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
