import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppsettingsService } from '../appsettings.service';

@Injectable({
  providedIn: 'root'
})
export class SdatosService {

  constructor(private http: HttpClient,
              private appSettingsService: AppsettingsService) { }

  getDatos(Accion: string, prmDatos: any): Observable<any> {
		const prmJ = {
			"prmAccion": Accion,
			"prmDatos": JSON.stringify(prmDatos)
		};
    const body = JSON.stringify(prmJ);

    let url = this.appSettingsService.settingsApp.urlapi + '/api/XPro/AccionSQL';
    /*return this.http.post(url, body, { 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } })
              .toPromise()
              .then((res) => { 
                console.log(res);
              })
              .catch((err) => { console.log('Error API ',err)});*/
    return this.http.post<any>(url, body,
                          {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }).
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
