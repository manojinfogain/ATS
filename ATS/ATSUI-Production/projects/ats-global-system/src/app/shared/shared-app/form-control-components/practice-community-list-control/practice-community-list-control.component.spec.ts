import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeCommunityListControlComponent } from './practice-community-list-control.component';

describe('PracticeCommunityListControlComponent', () => {
  let component: PracticeCommunityListControlComponent;
  let fixture: ComponentFixture<PracticeCommunityListControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticeCommunityListControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeCommunityListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
