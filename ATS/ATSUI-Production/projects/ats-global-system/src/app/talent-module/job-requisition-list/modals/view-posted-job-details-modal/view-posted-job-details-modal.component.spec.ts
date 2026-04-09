import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPostedJobDetailsModalComponent } from './view-posted-job-details-modal.component';

describe('ViewPostedJobDetailsModalComponent', () => {
  let component: ViewPostedJobDetailsModalComponent;
  let fixture: ComponentFixture<ViewPostedJobDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPostedJobDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPostedJobDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
