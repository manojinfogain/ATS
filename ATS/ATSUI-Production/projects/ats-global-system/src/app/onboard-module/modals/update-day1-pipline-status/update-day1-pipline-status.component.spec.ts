import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDay1PiplineStatusComponent } from './update-day1-pipline-status.component';

describe('UpdateDay1PiplineStatusComponent', () => {
  let component: UpdateDay1PiplineStatusComponent;
  let fixture: ComponentFixture<UpdateDay1PiplineStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDay1PiplineStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDay1PiplineStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
