import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePendingWithMeTalentModalComponent } from './approve-pending-with-me-talent-modal.component';

describe('ApprovePendingWithMeTalentModalComponent', () => {
  let component: ApprovePendingWithMeTalentModalComponent;
  let fixture: ComponentFixture<ApprovePendingWithMeTalentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovePendingWithMeTalentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePendingWithMeTalentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
