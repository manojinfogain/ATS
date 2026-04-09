import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBuddyComponent } from './update-buddy.component';

describe('UpdateBuddyComponent', () => {
  let component: UpdateBuddyComponent;
  let fixture: ComponentFixture<UpdateBuddyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBuddyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBuddyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
