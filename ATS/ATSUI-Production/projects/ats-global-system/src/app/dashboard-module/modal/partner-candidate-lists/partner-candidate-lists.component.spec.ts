import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerCandidateListsComponent } from './partner-candidate-lists.component';

describe('PartnerCandidateListsComponent', () => {
  let component: PartnerCandidateListsComponent;
  let fixture: ComponentFixture<PartnerCandidateListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerCandidateListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerCandidateListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
