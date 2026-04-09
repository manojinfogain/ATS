import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterProductivityReporComponent } from './recruiter-productivity-repor.component';

describe('RecruiterProductivityReporComponent', () => {
  let component: RecruiterProductivityReporComponent;
  let fixture: ComponentFixture<RecruiterProductivityReporComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterProductivityReporComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterProductivityReporComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
