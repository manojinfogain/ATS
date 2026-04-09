import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfilePicsComponent } from './view-profile-pics.component';

describe('ViewProfilePicsComponent', () => {
  let component: ViewProfilePicsComponent;
  let fixture: ComponentFixture<ViewProfilePicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProfilePicsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProfilePicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
