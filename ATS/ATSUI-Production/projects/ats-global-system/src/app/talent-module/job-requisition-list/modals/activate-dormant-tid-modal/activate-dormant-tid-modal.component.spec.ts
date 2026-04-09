import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateDormantTidModalComponent } from './activate-dormant-tid-modal.component';

describe('ActivateDormantTidModalComponent', () => {
  let component: ActivateDormantTidModalComponent;
  let fixture: ComponentFixture<ActivateDormantTidModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivateDormantTidModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateDormantTidModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
