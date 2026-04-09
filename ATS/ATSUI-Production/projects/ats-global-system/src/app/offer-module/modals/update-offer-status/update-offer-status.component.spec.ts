import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOfferStatusComponent } from './update-offer-status.component';

describe('UpdateOfferStatusComponent', () => {
  let component: UpdateOfferStatusComponent;
  let fixture: ComponentFixture<UpdateOfferStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateOfferStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOfferStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
