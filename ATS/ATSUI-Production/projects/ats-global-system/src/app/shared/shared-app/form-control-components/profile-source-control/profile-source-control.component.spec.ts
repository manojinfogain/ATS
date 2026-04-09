import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSourceControlComponent } from './profile-source-control.component';

describe('ProfileSourceControlComponent', () => {
  let component: ProfileSourceControlComponent;
  let fixture: ComponentFixture<ProfileSourceControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileSourceControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSourceControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
