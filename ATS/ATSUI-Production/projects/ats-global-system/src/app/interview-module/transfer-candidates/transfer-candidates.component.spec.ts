import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCandidatesComponent } from './transfer-candidates.component';

describe('TransferCandidatesComponent', () => {
  let component: TransferCandidatesComponent;
  let fixture: ComponentFixture<TransferCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferCandidatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
