import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRejectTalentidReqComponent } from './approve-reject-talentid-req.component';

describe('ApproveRejectTalentidReqComponent', () => {
  let component: ApproveRejectTalentidReqComponent;
  let fixture: ComponentFixture<ApproveRejectTalentidReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRejectTalentidReqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRejectTalentidReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
