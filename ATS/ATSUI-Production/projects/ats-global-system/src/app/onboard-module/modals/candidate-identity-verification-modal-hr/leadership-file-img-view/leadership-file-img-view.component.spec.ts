import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadershipFileImgViewComponent } from './leadership-file-img-view.component';

describe('LeadershipFileImgViewComponent', () => {
  let component: LeadershipFileImgViewComponent;
  let fixture: ComponentFixture<LeadershipFileImgViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadershipFileImgViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadershipFileImgViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
