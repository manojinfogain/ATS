import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerUserListingComponent } from './partner-user-listing.component';

describe('PartnerUserListingComponent', () => {
  let component: PartnerUserListingComponent;
  let fixture: ComponentFixture<PartnerUserListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerUserListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerUserListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
