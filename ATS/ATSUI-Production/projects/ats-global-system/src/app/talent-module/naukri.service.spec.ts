import { TestBed } from '@angular/core/testing';

import { NaukriService } from './naukri.service';

describe('NaukriService', () => {
  let service: NaukriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NaukriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
