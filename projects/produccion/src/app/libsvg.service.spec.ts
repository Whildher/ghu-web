import { TestBed } from '@angular/core/testing';

import { LibsvgService } from './libsvg.service';

describe('LibsvgService', () => {
  let service: LibsvgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibsvgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
