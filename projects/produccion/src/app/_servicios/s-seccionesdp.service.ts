import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { env } from '../env';
import { datosMenuConfig } from '../_class/menureg.class';
import { MSecciones } from '../_class/distriplantas.class';

@Injectable({
	providedIn: 'root',
})
export class SSeccionesdpService {
	// private envPrmRuta = new BehaviorSubject('');
	// datosRuta = this.envPrmRuta.asObservable();
	private subject = new Subject<any>();
	public datosEdicionSeccDP: any;
	public datosSeccionesSelecc: any;
	public statusMenuRegApl: datosMenuConfig;

	constructor(private http: HttpClient) {
		this.statusMenuRegApl = {TABLA_BASE: '', APLICACION: '', OPCIONES: '', BNumReg: 0, BTotReg: 0, Status: '', USUARIO: '' };
	}

	datosSeccDP: any;
	async getSeccRutasDP(IdRuta: string) {
		// Datos de secciones
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
			}),
		};
		const prmRuta = { ID_RUTA: IdRuta };
		const prmJ = {
			prmAccion: 'SECCIONES RUTAS DP',
			prmDatos: JSON.stringify(prmRuta),
		};
		const url = `/api/XPro/AccionSQL`;
		const body = JSON.stringify(prmJ);
		await this.http
			.post(url, body, httpOptions)
			.toPromise()
			.then((result) => (this.datosSeccDP = result))
			.catch((error) => console.log(error));

		return this.datosSeccDP; // you can return what you want here
	}

	// Paso del parámetro de la ruta
	setDatosSeleccionDP(vdatselecc: any): void {
		this.datosEdicionSeccDP = vdatselecc;
	}

	// Paso del parámetro de la ruta
	setObsDatosSeccDP(prmRuta: string): void {
		this.subject.next(prmRuta);
	}

	getObsDatosSeccDP(): Observable<any> {
		return this.subject.asObservable();
	}
}
