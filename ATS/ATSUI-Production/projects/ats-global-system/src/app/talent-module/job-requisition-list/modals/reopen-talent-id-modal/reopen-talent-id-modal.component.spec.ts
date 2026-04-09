import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReopenTalentIdModalComponent } from './reopen-talent-id-modal.component';

describe('ReopenTalentIdModalComponent', () => {
  let component: ReopenTalentIdModalComponent;
  let fixture: ComponentFixture<ReopenTalentIdModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReopenTalentIdModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReopenTalentIdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
