import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsGenerateOfferModalComponent } from './us-generate-offer-modal.component';

describe('UsGenerateOfferModalComponent', () => {
  let component: UsGenerateOfferModalComponent;
  let fixture: ComponentFixture<UsGenerateOfferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsGenerateOfferModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsGenerateOfferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
