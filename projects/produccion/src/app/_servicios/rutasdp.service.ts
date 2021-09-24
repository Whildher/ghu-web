import { HttpClient } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppsettingsService } from '../appsettings.service';
import { env } from '../env';
import { AppSettings } from '../_class/appsettings.class';
import { fnLocal } from '../_function/localStorage.fn';

@Injectable({
	providedIn: 'root',
})
export class RutasdpService {
	settings: AppSettings;
	urlapi: string;

	constructor(private http: HttpClient,
				private appSettingsService: AppsettingsService) {
			
		}

	// Buscar Rutas tipo layout planta
	consulta(prmJson: any): Observable<any> {
		/*const url = `${env.url1}/rutasdp/consulta`;
		return this.http.post(url, prmJson, {
			headers: { token: fnLocal.get('token') },
		});*/
		const prmJ = {
			"prmAccion": 'consulta',
			"prmDatos": JSON.stringify(prmJson)
		};
		const body = JSON.stringify(prmJ);
		let url = this.appSettingsService.settingsApp.urlapi + '/api/XPro/AccionRutas';
		return this.http.post<any>(url, body, {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }).
			pipe(map((vec: any) => { return { data: JSON.parse(vec) }; }),
			catchError((err) => { return throwError(err); })
		);
	}

	// Consulta por una ruta con su id
	idruta(IdRuta: any): Observable<any> {
		/*let url = `${env.url1}/rutasdp/ruta/${IdRuta}`;
		return this.http.get(url, {
			headers: { token: fnLocal.get('token') },
		});*/
		const prmJ = {
			"prmAccion": 'idruta',
			"prmDatos": '{ "ID_RUTA": "' + IdRuta + '" }'
		};
		const body = JSON.stringify(prmJ);
		let url = this.appSettingsService.settingsApp.urlapi + '/api/XPro/AccionRutas';
		return this.http.post<any>(url, body, {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }).
			pipe(map((vec: any) => { return { data: JSON.parse(vec) }; }),
			catchError((err) => { return throwError(err); })
		);

	}

	// Guardar registro -> ejecutar de acuerdo a la acción
	save(accion: any, prmJson: any): Observable<any> {
		//let url = `${env.url1}/rutasdp`;
		switch (accion) {
			case 'new':
				/*return this.http.post(url, prmJson, {
					headers: { token: fnLocal.get('token') },
				});*/
				const prmJ = {
					"prmAccion": 'new',
					"prmDatos": JSON.stringify(prmJson)
				};
				const body = JSON.stringify(prmJ);
				let urln = this.appSettingsService.settingsApp.urlapi + '/api/XPro/AccionRutas';
				return this.http.post<any>(urln, body, {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }).
					pipe(map((vec: any) => { return { data: JSON.parse(vec) }; }),
					catchError((err) => { return throwError(err); })
				);
				break;

			case 'update':
				/*return this.http.put(url, prmJson, {
					headers: { token: fnLocal.get('token') },
				});*/
				const prmJU = {
					"prmAccion": 'update',
					"prmDatos": JSON.stringify(prmJson)
				};
				const bodyU = JSON.stringify(prmJU);
				let urlu = this.appSettingsService.settingsApp.urlapi + '/api/XPro/AccionRutas';
				return this.http.post<any>(urlu, bodyU, {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }).
					pipe(map((vec: any) => { return { data: JSON.parse(vec) }; }),
					catchError((err) => { return throwError(err); })
				);
				break;

			case 'copy':
				const urlc = `${env.url1}/rutasdp/copy`;
				return this.http.post(urlc, prmJson, {
					headers: { token: fnLocal.get('token') },
				});
				break;

			default:
				return this.http.post('', prmJson, {
					headers: { token: fnLocal.get('token') },
				});
				break;
		}
	}

	// Actualización de registro
	delete(IdRuta: any): Observable<any> {
		/*const url = `${env.url1}/rutasdp/ruta/delete/${IdRuta}`;
		return this.http.get(url, {
			headers: { token: fnLocal.get('token') },
		});*/
		const prmJ = {
			"prmAccion": 'delete',
			"prmDatos": '{ "ID_RUTA": "' + IdRuta + '" }'
		};
		const body = JSON.stringify(prmJ);
		let url = this.appSettingsService.settingsApp.urlapi + '/api/XPro/AccionRutas';
		return this.http.post<any>(url, body, {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }).
			pipe(map((vec: any) => { return { data: JSON.parse(vec) }; }),
			catchError((err) => { return throwError(err); })
		);

	}

	// Trae todas las secciones
	qsecciones(): Observable<any> {
		const prmJ = {
			"prmAccion": 'qsecciones',
			"prmDatos": '{"FILTRO":""}'
		};
		const body = JSON.stringify(prmJ);
		let url = this.appSettingsService.settingsApp.urlapi + '/api/XPro/AccionRutas';
		console.log(url);
		return this.http.post<any>(url, body, {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }).
			pipe(map((vec: any) => { return { data: JSON.parse(vec) }; }),
			catchError((err) => { return throwError(err); })
		);
	}

	// Trae todas las secciones
	qlistas(prmJson: any): Observable<any> {
		const url = `${this.appSettingsService.settingsApp.urlapi}/rutasdp/qlistas`;
		console.log('cargue..', prmJson);
		return this.http.post(url, prmJson, {
			headers: { token: fnLocal.get('token') },
		});
}
}
