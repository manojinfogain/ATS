import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuddyScreenComponent } from './buddy-screen.component';

describe('BuddyScreenComponent', () => {
  let component: BuddyScreenComponent;
  let fixture: ComponentFixture<BuddyScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuddyScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuddyScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
