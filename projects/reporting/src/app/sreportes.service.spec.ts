import { TestBed } from '@angular/core/testing';

import { SreportesService } from './sreportes.service';

describe('SreportesService', () => {
  let service: SreportesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SreportesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
