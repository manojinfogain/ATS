import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateprofileDetailsComponent } from './updateprofile-details.component';

describe('UpdateprofileDetailsComponent', () => {
  let component: UpdateprofileDetailsComponent;
  let fixture: ComponentFixture<UpdateprofileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateprofileDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateprofileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
