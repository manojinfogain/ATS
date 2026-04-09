import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTalentidModalComponent } from './cancel-talentid-modal.component';

describe('CancelTalentidModalComponent', () => {
  let component: CancelTalentidModalComponent;
  let fixture: ComponentFixture<CancelTalentidModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelTalentidModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelTalentidModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
