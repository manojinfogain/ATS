import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGenerateOfferComponent } from './view-generate-offer.component';

describe('ViewGenerateOfferComponent', () => {
  let component: ViewGenerateOfferComponent;
  let fixture: ComponentFixture<ViewGenerateOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGenerateOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGenerateOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
