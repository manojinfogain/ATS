import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProfilelistSharedbyPartnerComponent } from './candidate-profilelist-sharedby-partner.component';

describe('CandidateProfilelistSharedbyPartnerComponent', () => {
  let component: CandidateProfilelistSharedbyPartnerComponent;
  let fixture: ComponentFixture<CandidateProfilelistSharedbyPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateProfilelistSharedbyPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateProfilelistSharedbyPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
