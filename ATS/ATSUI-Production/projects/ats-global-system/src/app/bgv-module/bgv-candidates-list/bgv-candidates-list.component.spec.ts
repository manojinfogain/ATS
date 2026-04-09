import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgvCandidatesListComponent } from './bgv-candidates-list.component';

describe('BgvCandidatesListComponent', () => {
  let component: BgvCandidatesListComponent;
  let fixture: ComponentFixture<BgvCandidatesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BgvCandidatesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BgvCandidatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
