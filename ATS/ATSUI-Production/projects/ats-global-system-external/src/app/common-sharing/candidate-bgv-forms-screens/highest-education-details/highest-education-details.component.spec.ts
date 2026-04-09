import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighestEducationDetailsComponent } from './highest-education-details.component';

describe('HighestEducationDetailsComponent', () => {
  let component: HighestEducationDetailsComponent;
  let fixture: ComponentFixture<HighestEducationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighestEducationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighestEducationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
