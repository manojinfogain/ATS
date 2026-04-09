import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentIdAssignedPartnerComponent } from './talent-id-assigned-partner.component';

describe('TalentIdAssignedPartnerComponent', () => {
  let component: TalentIdAssignedPartnerComponent;
  let fixture: ComponentFixture<TalentIdAssignedPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentIdAssignedPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentIdAssignedPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
