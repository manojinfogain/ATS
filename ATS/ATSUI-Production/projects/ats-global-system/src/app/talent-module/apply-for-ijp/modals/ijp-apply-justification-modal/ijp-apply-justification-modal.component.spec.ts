import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IjpApplyJustificationModalComponent } from './ijp-apply-justification-modal.component';

describe('IjpApplyJustificationModalComponent', () => {
  let component: IjpApplyJustificationModalComponent;
  let fixture: ComponentFixture<IjpApplyJustificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IjpApplyJustificationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IjpApplyJustificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
