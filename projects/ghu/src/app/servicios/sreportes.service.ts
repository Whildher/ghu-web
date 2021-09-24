import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RFiltro } from '../_class/rfiltro.class';

@Injectable({
  providedIn: 'root'
})
export class SreportesService {
	private subject = new Subject<any>();
  public DRepApl: any;
  public DFiltro: RFiltro[] = [];
  @Output() evRutaNav = new EventEmitter<string>();

  constructor() { }

  itemRutaNav(paso: string) {
    this.evRutaNav.emit(paso);
  }
  // Paso del parámetro de la aplicacion
	setObsDatosReporteApl(prmApl: string): void {
    this.subject.next(prmApl);
	}
  getObsDatosReporteApl(): Observable<any> {
		return this.subject.asObservable();
	}

}
