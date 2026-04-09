import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStatusIdVisibilitySharedComponent } from './all-status-id-visibility-shared.component';

describe('AllStatusIdVisibilitySharedComponent', () => {
  let component: AllStatusIdVisibilitySharedComponent;
  let fixture: ComponentFixture<AllStatusIdVisibilitySharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllStatusIdVisibilitySharedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllStatusIdVisibilitySharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
