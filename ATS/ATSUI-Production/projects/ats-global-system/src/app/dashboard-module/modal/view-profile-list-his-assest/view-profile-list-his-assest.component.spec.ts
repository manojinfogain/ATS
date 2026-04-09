import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfileListHisAssestComponent } from './view-profile-list-his-assest.component';

describe('ViewProfileListHisAssestComponent', () => {
  let component: ViewProfileListHisAssestComponent;
  let fixture: ComponentFixture<ViewProfileListHisAssestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProfileListHisAssestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProfileListHisAssestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
