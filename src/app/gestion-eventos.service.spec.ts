import { TestBed } from '@angular/core/testing';

import { GestionEventosService } from './gestion-eventos.service';

describe('GestionEventosService', () => {
  let service: GestionEventosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionEventosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
