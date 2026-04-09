import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveInitiateBGVModalComponent } from './approve-initiate-bgv-modal.component';

describe('ApproveInitiateBGVModalComponent', () => {
  let component: ApproveInitiateBGVModalComponent;
  let fixture: ComponentFixture<ApproveInitiateBGVModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveInitiateBGVModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveInitiateBGVModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
