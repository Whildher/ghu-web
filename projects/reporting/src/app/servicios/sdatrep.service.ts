import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SdatrepService {

  constructor(private http: HttpClient) { }

  getDatos(): Observable<any> {
    let url = 'http://190.85.54.78:5000/api/ApiReport';
    return this.http.get(url, {headers: 
      {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }).pipe(
      map((vec: any) => {
        return vec.datos;
      }),
			catchError((err) => {
				return throwError(err);
			})
    );
	}

  getDatReporte(prmRep: any): Observable<any> {
    let url = 'http://190.85.54.78:5000/api/ApiReport/GetListaReportes';
		const prmJ = {
			ACCION: 'reportes_usr',
			DATA_JSON: JSON.stringify(prmRep),
		};
    const body = JSON.stringify(prmJ);
    url = url + '?PrmDatos=' + body;
    return this.http.get(url).
           pipe(
              map((vec: any) => {
                return vec;
              }),
              catchError((err) => {
                return throwError(err);
              })
    );
	}

  getDatReporteApl(prmRepApl: any): Observable<any> {
    let url = 'http://190.85.54.78:5000/api/ApiReport/GetListaReportes';
		const prmJ = {
			ACCION: 'reportes_apl',
			DATA_JSON: JSON.stringify(prmRepApl)
		};
    const body = JSON.stringify(prmJ);
    url = url + '?PrmDatos=' + body;
    return this.http.get(url).
           pipe(
              map((vec: any) => {
                return vec;
              }),
              catchError((err) => {
                return throwError(err);
              })
    );
	}

}
