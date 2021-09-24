import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MColumna, MVisor } from './visor.class';

@Injectable({
  providedIn: 'root'
})
export class SVisorService {
  public DatosVisor: any;
  public PrmVisor: MVisor = { Titulo: "", Columnas: []};
  public ColSort = {Columna: "", Clase: ""};
  private subject = new Subject<any>();

  constructor(private http: HttpClient) { }

  // Asocia datos
  setDatosVisor(DatosV: any) {
    this.DatosVisor = DatosV;
  }

  // Parámetros del Visor
  getPrmVisor() {
    return this.PrmVisor;
  }

  // Paso de parámetros de configuracion
  setObsVisor(PrmVisor: any) {
    this.subject.next(PrmVisor);
  }

  // genera observable
  getObsVisor(): Observable<any> {
    return this.subject.asObservable();
  }

}
