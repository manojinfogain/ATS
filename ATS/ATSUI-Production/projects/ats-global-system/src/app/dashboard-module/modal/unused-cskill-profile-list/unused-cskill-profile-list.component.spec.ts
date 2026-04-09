import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnusedCskillProfileListComponent } from './unused-cskill-profile-list.component';

describe('UnusedCskillProfileListComponent', () => {
  let component: UnusedCskillProfileListComponent;
  let fixture: ComponentFixture<UnusedCskillProfileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnusedCskillProfileListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnusedCskillProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
