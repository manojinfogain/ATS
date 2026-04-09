import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalJobPostingModalComponent } from './internal-job-posting-modal.component';

describe('InternalJobPostingModalComponent', () => {
  let component: InternalJobPostingModalComponent;
  let fixture: ComponentFixture<InternalJobPostingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalJobPostingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalJobPostingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
