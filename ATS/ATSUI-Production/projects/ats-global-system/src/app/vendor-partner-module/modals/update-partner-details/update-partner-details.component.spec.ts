import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePartnerDetailsComponent } from './update-partner-details.component';

describe('UpdatePartnerDetailsComponent', () => {
  let component: UpdatePartnerDetailsComponent;
  let fixture: ComponentFixture<UpdatePartnerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePartnerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePartnerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
