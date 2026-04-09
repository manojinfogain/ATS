import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationMasterControlComponent } from './education-master-control.component';

describe('EducationMasterControlComponent', () => {
  let component: EducationMasterControlComponent;
  let fixture: ComponentFixture<EducationMasterControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationMasterControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationMasterControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
