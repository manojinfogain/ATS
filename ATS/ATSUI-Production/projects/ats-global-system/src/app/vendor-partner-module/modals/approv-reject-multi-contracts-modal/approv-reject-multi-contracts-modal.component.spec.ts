import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovRejectMultiContractsModalComponent } from './approv-reject-multi-contracts-modal.component';

describe('ApprovRejectMultiContractsModalComponent', () => {
  let component: ApprovRejectMultiContractsModalComponent;
  let fixture: ComponentFixture<ApprovRejectMultiContractsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovRejectMultiContractsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovRejectMultiContractsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
