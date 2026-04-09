import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictofInteresPolicyComponent } from './conflictof-interes-policy.component';

describe('ConflictofInteresPolicyComponent', () => {
  let component: ConflictofInteresPolicyComponent;
  let fixture: ComponentFixture<ConflictofInteresPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConflictofInteresPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictofInteresPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
