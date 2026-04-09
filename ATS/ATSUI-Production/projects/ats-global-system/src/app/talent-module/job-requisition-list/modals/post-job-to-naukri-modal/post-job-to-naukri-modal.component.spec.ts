import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobToNaukriModalComponent } from './post-job-to-naukri-modal.component';

describe('PostJobToNaukriModalComponent', () => {
  let component: PostJobToNaukriModalComponent;
  let fixture: ComponentFixture<PostJobToNaukriModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostJobToNaukriModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobToNaukriModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
