import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
	datosMenuConfig,
	MenuClass,
	Menureg,
} from '../_class/menureg.class';
import { MenuregService  } from '../_servicios/menureg.service';

@Component({
	selector: 'app-menuregistro',
	templateUrl: './menuregistro.component.html',
	styleUrls: ['./menuregistro.component.scss'],
})
export class MenuregistroComponent implements OnInit {
	@Input() InputPrm: string;
	EspecRegistro: any;

	menuItems : MenuClass[] = [
		{
			name: 'Nuevo',
			icon: 'pi pi-plus',
			visible: true,
			uso: true,
		},
		{
			name: 'Modificar',
			icon: 'pi pi-pencil',
			visible: true,
			uso: true,
		},
		{
			name: 'Eliminar',
			icon: 'pi pi-trash',
			visible: true,
			uso: true,
		},
		{
			name: 'Guardar',
			icon: 'pi pi-save',
			visible: true,
			uso: true,
		},
		{
			name: 'Cancelar',
			icon: 'pi pi-undo',
			visible: true,
			uso: true,
		},
		{
			name: 'Buscar',
			icon: 'pi pi-search',
			visible: true,
			uso: true,
		},
		{
			name: 'BOpciones',
			icon: 'pi pi-filter',
			visible: true,
			uso: true,
			items: [
				{
					text: 'Agregar O',
					icon: 'pi pi-search-plus',
					name: 'AgregarO',
					visible: true,
					uso: true
				},
				{
					text: 'Eliminar O',
					icon: 'pi pi-search-minus',
					name: 'EliminarO',
					visible: true,
					uso: true
				},
			],
		},
		{
			name: 'Vista',
			icon: 'pi pi-eye',
			visible: true,
			uso: true,
		},
		{
			name: 'Copiar',
			icon: 'pi pi-copy',
			visible: true,
			uso: true,
		},
		{
			name: 'Ordenar',
			icon: 'pi pi-sort-alpha-down',
			visible: true,
			uso: true,
		},
		{
			name: 'Primero',
			icon: 'pi pi-angle-double-left',
			visible: true,
			uso: true,
		},
		{
			name: 'Anterior',
			icon: 'pi pi-angle-left',
			visible: true,
			uso: true,
		},
		{ name: 'NumReg', icon: '', visible: true, uso: true },
		{ name: 'TotReg', icon: '', visible: true, uso: true },
		{
			name: 'Siguiente',
			icon: 'pi pi-angle-right',
			visible: true,
			uso: true,
		},
		{
			name: 'Ultimo',
			icon: 'pi pi-angle-double-right',
			visible: true,
			uso: true,
		},
		{
			name: 'Imprimir',
			icon: 'pi pi-print',
			visible: true,
			uso: true,
		},
		{
			name: 'Refrescar',
			icon: 'pi pi-refresh',
			visible: true,
			uso: true,
		},
		{
			name: 'Cerrar',
			icon: 'pi pi-sign-out',
			visible: true,
			uso: true,
		},
	];

	menuanterior: MenuClass[] = [];
	title = 'menu';
	stylingMode = 'outlined';
	defaultVisible = [
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
	];
	DatMenuConfig: Menureg;

	subscription: Subscription;
	datCfgMenu: datosMenuConfig;

	// Control de numero de registros
	BNumReg = 0;
	BTotReg = '/99999';

	constructor(
		private route: ActivatedRoute,
		private _menuregistro: MenuregService
	) {
		this.subscription = this._menuregistro
			.getObsMenuReg()
			.subscribe((datmenu) => {
				this.datCfgMenu = datmenu;
				if (datmenu) {
					if (this.datCfgMenu.OPCIONES === '_INI_') {
						this.configMenuRegistro(datmenu);
					}
					else {
						this.AccionesMenu(
							this.datCfgMenu.OPCIONES,
							this.datCfgMenu.Status
						);
					}
				} else {
					// dato por defecto de ruta
					this.AccionesMenu(
						this.datCfgMenu.OPCIONES,
						this.datCfgMenu.Status
					);
				}
			});
		
		this.configMenuRegistro = this.configMenuRegistro.bind(this);
		this.AccionesMenu = this.AccionesMenu.bind(this);
		this.CopiaMenu = this.CopiaMenu.bind(this);
	}

	// Consulta la activacion de la barra del registro
	configMenuRegistro(cfg: any): void {
		this._menuregistro.carguemenu(cfg).subscribe((resp) => {
			this.DatMenuConfig = resp.data;
			this.ActivarBotones();
			this.menuanterior = [ ...this.menuItems];
		});
	}

	// Asocia valores de visibilidad a cada boton
	ActivarBotones(): void {
		this.menuItems[0].visible = this.DatMenuConfig.C;
		this.menuItems[1].visible = this.DatMenuConfig.M;
		this.menuItems[2].visible = this.DatMenuConfig.E;
		this.menuItems[3].visible = this.DatMenuConfig.G;
		this.menuItems[4].visible = this.DatMenuConfig.D;
		this.menuItems[5].visible = this.DatMenuConfig.B;
		this.menuItems[6].visible = this.DatMenuConfig.F;
		this.menuItems[7].visible = this.DatMenuConfig.V;
		this.menuItems[8].visible = this.DatMenuConfig.Y;
		this.menuItems[9].visible = this.DatMenuConfig.O;
		this.menuItems[10].visible = this.DatMenuConfig.P;
		this.menuItems[11].visible = this.DatMenuConfig.A;
		this.menuItems[12].visible = this.DatMenuConfig.R;
		this.menuItems[13].visible = this.DatMenuConfig.T;
		this.menuItems[14].visible = this.DatMenuConfig.S;
		this.menuItems[15].visible = this.DatMenuConfig.U;
		this.menuItems[16].visible = this.DatMenuConfig.I;
		this.menuItems[17].visible = this.DatMenuConfig.N;
		this.menuItems[18].visible = this.DatMenuConfig.X;
	}

	// Aplica si es visible o no
	toggleDefault(ix: any): void {
		this.defaultVisible[ix] = !this.defaultVisible[ix];
	}

	CopiaMenu(menu1: any, menu2: any): any {
		for(var k=1; k < menu1.length; k++) {
			menu1[k].visible = menu2[k].visible
		};
	}

	// Operaciones con los botones una vez seleccionados
	onClickMenuReg(boton: string): void {
		// Inactiva botones por defecto
		this.datCfgMenu.Status = '';

		// Condicion especial para la busqueda: 1ro captura 2do ejecuta busqueda
		if (this.datCfgMenu.OPCIONES !== 'pre_Buscar' || boton === 'Cancelar') {
			this.datCfgMenu.OPCIONES = boton;
		} else {
			boton = 'pre_Buscar';
			this.datCfgMenu.OPCIONES = 'Buscar';
		}
		if (!boton.match('Primero|Anterior|Siguiente|Ultimo|Eliminar|Vista')) {
			for (const menuitem of this.menuItems) {
				menuitem.visible = false;
			}
		}

		switch (boton) {
			case 'Nuevo':
				this.menuItems[3].visible = true;
				this.menuItems[4].visible = true;
				this._menuregistro.setObsMenuReg(this.datCfgMenu);
				break;

			case 'Modificar':
				this.menuItems[3].visible = true;
				this.menuItems[4].visible = true;
				this._menuregistro.setObsMenuReg(this.datCfgMenu);
				break;

			case 'Eliminar':
				this._menuregistro.setObsMenuReg(this.datCfgMenu);
				break;

			case 'Buscar':
				this.menuItems[4].visible = true;
				this.menuItems[5].visible = true;
				this.menuItems[6].visible = true;
				this.datCfgMenu.OPCIONES = 'pre_' + boton;
				this._menuregistro.setObsMenuReg(this.datCfgMenu);
				break;

			case 'pre_Buscar':
				this._menuregistro.setObsMenuReg(this.datCfgMenu);
				break;

			case 'Primero':
			case 'Anterior':
			case 'Siguiente':
			case 'Ultimo':
				this._menuregistro.setObsMenuReg(this.datCfgMenu);
				break;

			case 'Cancelar':
				if(this.datCfgMenu.BTotReg > 0) {
					for (const menuitem of this.menuItems) {
						menuitem.visible = true;
					}
					this.menuItems[3].visible = false;
					this.menuItems[4].visible = false;
					}
				else {
					this.menuItems[0].visible = true;
					this.menuItems[5].visible = true;
				}
				this.datCfgMenu.OPCIONES = 'IrA';
				this._menuregistro.setObsMenuReg(this.datCfgMenu);
				break;

			case 'Guardar':
				this.datCfgMenu.OPCIONES = 'pre_' + boton;
				this._menuregistro.setObsMenuReg(this.datCfgMenu);
				break;

			case 'Vista':
				this._menuregistro.setObsMenuReg(this.datCfgMenu);
				break;

			default:
				break;
		}
	}

	// Acciones posteriores a las Operaciones con los botones
	AccionesMenu(Accion: string, StatMnu: string): void{
		switch (Accion) {
			case 'Guardar':
				if (StatMnu !== 'Error') {
					for (const menuitem of this.menuItems) {
						menuitem.visible = true;
					}
					this.menuItems[3].visible = false;
					this.menuItems[4].visible = false;
					this.BNumReg = this.datCfgMenu.BNumReg;
					this.BTotReg = '/' + this.datCfgMenu.BTotReg.toString();
					this.CopiaMenu(this.menuanterior, this.menuItems);
				} else {
					for (const menuitem of this.menuItems) {
						menuitem.visible = false;
					}
					this.menuItems[3].visible = true;
					this.menuItems[4].visible = true;
				}
				break;

			case 'pos_Buscar':
				if (this.datCfgMenu.BTotReg !== 0) {
					for (const menuitem of this.menuItems) {
						menuitem.visible = true;
					}
					this.menuItems[3].visible = false;
					this.menuItems[4].visible = false;
					this.menuItems[6].visible = false;
					this.BNumReg = 1;
					this.BTotReg = '/' + this.datCfgMenu.BTotReg.toString();
					this.CopiaMenu(this.menuanterior, this.menuItems);
				} else {
					this.BNumReg = 0;
					this.BTotReg = '/0';
					this.menuItems[0].visible = true;
					this.menuItems[5].visible = true;
				}
				this.CopiaMenu(this.menuanterior, this.menuItems);
				break;

			case 'pos_Primero':
			case 'pos_Anterior':
			case 'pos_Siguiente':
			case 'pos_Ultimo':
			case 'pos_IrA':
				this.BNumReg = this.datCfgMenu.BNumReg;
				break;

			case 'pos_Eliminar':
				if (this.datCfgMenu.BTotReg === 0) {
					for (const menuitem of this.menuItems) {
						menuitem.visible = false;
					}
					this.BNumReg = 0;
					this.BTotReg = '/0';
					this.menuItems[0].visible = true;
					this.menuItems[5].visible = true;
				}
				else {
					this.BNumReg = this.datCfgMenu.BNumReg;
					this.BTotReg = '/' + this.datCfgMenu.BTotReg.toString();
				}
				break;

			default:
				break;
		}
	}

	ngOnInit(): void {
		// Aplica si es visible si se Usa
		// this.DatMenuConfig = this._menuregistro.getMenuRegDatos();
		// this.ActivarBotones();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
