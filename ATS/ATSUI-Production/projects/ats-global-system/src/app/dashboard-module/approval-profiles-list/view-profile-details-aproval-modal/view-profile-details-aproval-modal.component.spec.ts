import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfileDetailsAprovalModalComponent } from './view-profile-details-aproval-modal.component';

describe('ViewProfileDetailsAprovalModalComponent', () => {
  let component: ViewProfileDetailsAprovalModalComponent;
  let fixture: ComponentFixture<ViewProfileDetailsAprovalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProfileDetailsAprovalModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProfileDetailsAprovalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
