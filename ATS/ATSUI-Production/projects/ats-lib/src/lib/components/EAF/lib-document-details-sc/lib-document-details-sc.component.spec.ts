import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibDocumentDetailsScComponent } from './lib-document-details-sc.component';

describe('DocumentDetailsScComponent', () => {
  let component: LibDocumentDetailsScComponent;
  let fixture: ComponentFixture<LibDocumentDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibDocumentDetailsScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibDocumentDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
