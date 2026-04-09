import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeDelegateRightsModalComponent } from './revoke-delegate-rights-modal.component';

describe('RevokeDelegateRightsModalComponent', () => {
  let component: RevokeDelegateRightsModalComponent;
  let fixture: ComponentFixture<RevokeDelegateRightsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevokeDelegateRightsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevokeDelegateRightsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
