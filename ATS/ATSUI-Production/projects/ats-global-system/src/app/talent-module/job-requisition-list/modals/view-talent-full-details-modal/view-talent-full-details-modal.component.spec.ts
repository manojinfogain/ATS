import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTalentFullDetailsModalComponent } from './view-talent-full-details-modal.component';

describe('ViewTalentFullDetailsModalComponent', () => {
  let component: ViewTalentFullDetailsModalComponent;
  let fixture: ComponentFixture<ViewTalentFullDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTalentFullDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTalentFullDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
