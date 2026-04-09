import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneMultiTalentidModalComponent } from './clone-multi-talentid-modal.component';

describe('CloneMultiTalentidModalComponent', () => {
  let component: CloneMultiTalentidModalComponent;
  let fixture: ComponentFixture<CloneMultiTalentidModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneMultiTalentidModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneMultiTalentidModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
