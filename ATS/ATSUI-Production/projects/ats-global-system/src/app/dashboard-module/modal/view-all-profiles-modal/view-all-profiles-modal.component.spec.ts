import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllProfilesModalComponent } from './view-all-profiles-modal.component';

describe('ViewAllProfilesModalComponent', () => {
  let component: ViewAllProfilesModalComponent;
  let fixture: ComponentFixture<ViewAllProfilesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllProfilesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllProfilesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
