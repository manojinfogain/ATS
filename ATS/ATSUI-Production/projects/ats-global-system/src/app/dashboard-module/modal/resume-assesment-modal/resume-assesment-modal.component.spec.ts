import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeAssesmentModalComponent } from './resume-assesment-modal.component';

describe('ResumeAssesmentModalComponent', () => {
  let component: ResumeAssesmentModalComponent;
  let fixture: ComponentFixture<ResumeAssesmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeAssesmentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeAssesmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
