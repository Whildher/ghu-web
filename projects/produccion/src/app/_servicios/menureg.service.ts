import { HttpClient,	HttpHeaders, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { datosMenuConfig, Menureg } from '../_class/menureg.class';
import { env } from '../env';
import { fnLocal } from '../_function/localStorage.fn';
import { catchError, map } from 'rxjs/operators';
import { AppsettingsService } from '../appsettings.service';
import { AppSettings } from '../_class/appsettings.class';

@Injectable({
	providedIn: 'root',
})
export class MenuregService {
	MenuRegConfig: Menureg;
	settings: AppSettings;
	public urlapi: string;
	private subject = new Subject<any>();

	constructor(private http: HttpClient,
				private appSettingsService: AppsettingsService) {
	}

	getMenuRegDatos() {
		return this.MenuRegConfig;
	}

	// Asigna datos
	setMenuRegDatos(PrmMenuReg: Menureg) {
		this.MenuRegConfig = PrmMenuReg;
		return this.MenuRegConfig;
	}

	// Paso de parámetros de configuracion
	setObsMenuReg(PrmMenuCfg: datosMenuConfig) {
		this.subject.next(PrmMenuCfg);
	}

	// genera observable
	getObsMenuReg(): Observable<any> {
		return this.subject.asObservable();
	}

	// Obtiene datos de configuracions según origen
	/* dataMenu: any;
	async datosConfigMenuReg(datosCfg: datosMenuConfig) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
			}),
		};
		let url = '/api/XPro/AccionSQL';
		let prmJ = {
			prmAccion: 'MENU REGISTRO',
			prmDatos: JSON.stringify(datosCfg),
		};
		var body = JSON.stringify(prmJ);
		await this.http
			.post(url, body, httpOptions)
			.toPromise()
			.then((result) => (this.dataMenu = result))
			.catch((error) => console.log(error));
		this.MenuRegConfig = JSON.parse(this.dataMenu);

		return this.MenuRegConfig; // you can return what you want here
	} */

	// Trae toda la configuracion del menú
	carguemenu(datosCfg: datosMenuConfig): Observable<any> {
		/*const url = `${env.url1}/menureg`;
		return this.http.post(url, datosCfg, {
			headers: { token: fnLocal.get('token') },
		});*/
		const prmJ = {
			"prmAccion": 'menu_registro',
			"prmDatos": JSON.stringify(datosCfg)
		};
		const body = JSON.stringify(prmJ);
		let url = this.appSettingsService.settingsApp.urlapi + '/api/XPro/AccionRutas';
		return this.http.post<any>(url, body, {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }).
			pipe(map((vec: any) => { return { data: JSON.parse(vec) }; }),
			catchError((err) => { return throwError(err); })
		);
	}

}
