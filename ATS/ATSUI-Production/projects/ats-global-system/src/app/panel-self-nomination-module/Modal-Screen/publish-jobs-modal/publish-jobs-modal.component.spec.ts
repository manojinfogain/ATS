import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishJobsModalComponent } from './publish-jobs-modal.component';

describe('PublishJobsModalComponent', () => {
  let component: PublishJobsModalComponent;
  let fixture: ComponentFixture<PublishJobsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishJobsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishJobsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
