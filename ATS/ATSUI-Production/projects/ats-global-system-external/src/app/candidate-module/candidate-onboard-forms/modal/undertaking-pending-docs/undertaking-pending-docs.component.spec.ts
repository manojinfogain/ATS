import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndertakingPendingDocsComponent } from './undertaking-pending-docs.component';

describe('UndertakingPendingDocsComponent', () => {
  let component: UndertakingPendingDocsComponent;
  let fixture: ComponentFixture<UndertakingPendingDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UndertakingPendingDocsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UndertakingPendingDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
