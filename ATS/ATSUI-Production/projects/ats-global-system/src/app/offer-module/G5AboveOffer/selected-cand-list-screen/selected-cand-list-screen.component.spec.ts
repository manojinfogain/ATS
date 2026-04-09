import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedCandListScreenComponent } from './selected-cand-list-screen.component';

describe('SelectedCandListScreenComponent', () => {
  let component: SelectedCandListScreenComponent;
  let fixture: ComponentFixture<SelectedCandListScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedCandListScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedCandListScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
