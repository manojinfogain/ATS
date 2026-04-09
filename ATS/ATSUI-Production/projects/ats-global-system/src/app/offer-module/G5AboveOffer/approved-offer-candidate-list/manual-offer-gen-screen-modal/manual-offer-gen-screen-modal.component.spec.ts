import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualOfferGenScreenModalComponent } from './manual-offer-gen-screen-modal.component';

describe('ManualOfferGenScreenModalComponent', () => {
  let component: ManualOfferGenScreenModalComponent;
  let fixture: ComponentFixture<ManualOfferGenScreenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualOfferGenScreenModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualOfferGenScreenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
