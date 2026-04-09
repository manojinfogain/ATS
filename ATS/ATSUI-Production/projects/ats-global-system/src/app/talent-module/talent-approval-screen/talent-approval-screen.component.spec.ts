import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentApprovalScreenComponent } from './talent-approval-screen.component';

describe('TalentApprovalScreenComponent', () => {
  let component: TalentApprovalScreenComponent;
  let fixture: ComponentFixture<TalentApprovalScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentApprovalScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentApprovalScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
