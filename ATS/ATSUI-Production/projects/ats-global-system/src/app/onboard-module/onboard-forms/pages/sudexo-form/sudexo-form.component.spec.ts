import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SudexoFormComponent } from './sudexo-form.component';

describe('SudexoFormComponent', () => {
  let component: SudexoFormComponent;
  let fixture: ComponentFixture<SudexoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SudexoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SudexoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
