import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoshDocImpaqtiveKochiComponent } from './posh-doc-impaqtive-kochi.component';

describe('PoshDocImpaqtiveKochiComponent', () => {
  let component: PoshDocImpaqtiveKochiComponent;
  let fixture: ComponentFixture<PoshDocImpaqtiveKochiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoshDocImpaqtiveKochiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoshDocImpaqtiveKochiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
