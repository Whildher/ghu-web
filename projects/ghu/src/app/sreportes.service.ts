import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SreportesService {

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
    let url = 'http://190.85.54.78:5000/api/ApiListaReportes';
		const prmJ = {
			ACCION: 'reportes_usr',
			DATA_JSON: JSON.stringify(prmRep),
		};
    const body = JSON.stringify(prmJ);
    return this.http.put(url, body, 
                         { headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }).
           pipe(
              map((vec: any) => {
                return JSON.parse(vec.data);
              }),
              catchError((err) => {
                return throwError(err);
              })
    );
	}

}
