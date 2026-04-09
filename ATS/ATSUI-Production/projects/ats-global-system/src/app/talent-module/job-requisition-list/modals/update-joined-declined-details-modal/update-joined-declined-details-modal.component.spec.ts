import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateJoinedDeclinedDetailsModalComponent } from './update-joined-declined-details-modal.component';

describe('UpdateJoinedDeclinedDetailsModalComponent', () => {
  let component: UpdateJoinedDeclinedDetailsModalComponent;
  let fixture: ComponentFixture<UpdateJoinedDeclinedDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateJoinedDeclinedDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateJoinedDeclinedDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
