import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileSourceModalComponent } from './update-profile-source-modal.component';

describe('UpdateProfileSourceModalComponent', () => {
  let component: UpdateProfileSourceModalComponent;
  let fixture: ComponentFixture<UpdateProfileSourceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProfileSourceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProfileSourceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
