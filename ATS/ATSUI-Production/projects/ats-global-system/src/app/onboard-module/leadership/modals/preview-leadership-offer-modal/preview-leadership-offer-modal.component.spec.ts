import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewLeadershipOfferModalComponent } from './preview-leadership-offer-modal.component';

describe('PreviewLeadershipOfferModalComponent', () => {
  let component: PreviewLeadershipOfferModalComponent;
  let fixture: ComponentFixture<PreviewLeadershipOfferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewLeadershipOfferModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewLeadershipOfferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
