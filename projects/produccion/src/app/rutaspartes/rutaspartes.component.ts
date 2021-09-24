import { Component, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DxDiagramComponent, DxDropDownBoxComponent } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
import { LibsvgService } from '../libsvg.service';
import { childFlowNode, FlowEdge, FlowNode, MSecciones } from '../_class/distriplantas.class';
import { custShapesDiagrama } from '../_class/libsvg.class';
import { datosMenuConfig } from '../_class/menureg.class';
import { MRutasPartes } from '../_class/rutaspartes.class';
import { RutasdpService } from '../_servicios/rutasdp.service';
import config from 'devextreme/core/config';
import { Subscription } from 'rxjs';
import { AppSettings } from '../_class/appsettings.class';
import { SVisorService } from '../visor/models/s-visor.service';
import { ActivatedRoute } from '@angular/router';
import { MenuregService } from '../_servicios/menureg.service';
import { ConfirmationService } from 'primeng/api';
import dxCheckBox from 'devextreme/ui/check_box';
import { AppsettingsService } from '../appsettings.service';
declare let alertify: any;

@Component({
  selector: 'app-rutaspartes',
  templateUrl: './rutaspartes.component.html',
  styleUrls: ['./rutaspartes.component.scss'],
  providers: [ConfirmationService]
})
export class RutaspartesComponent implements OnInit {
	@ViewChild('diagPartes', { static: false }) diagLay: DxDiagramComponent;
	@ViewChild('ddBox', { static: false }) ddLayout: DxDropDownBoxComponent;

	DataRutasPartes: MRutasPartes;
	DataDP_Q: MRutasPartes[] = [];
	DatosSeccRutasDP: MSecciones[];
	DatosSecciones: any;

	dSBEstados = [{ ESTADO: 'ACTIVO' }, { ESTADO: 'INACTIVO' }];
	dSBPrioridades = [{ PRIORIDAD: 'Primaria' }, { PRIORIDAD: 'Secundaria' }];
	colCountByScreen: object;
	stylingMode = 'outlined';
	editorStylingMode: 'outlined';
	ReadOnlyEncabRP = true;
	statusMenuRegApl: datosMenuConfig;
	vecNodosSelecc: any;
	IdRutaAnterior: string;
	OpGuardar: string;
	GDatosLayoutDP: any;
	GValorLayout: string[] = [];
	MsgValidacion: string;
	operCfg: string;
	PrmMenuReg: datosMenuConfig;

	// Parámetro de ruta para pasar
	subscription: Subscription;
	datIdRuta: string;
	appsettings: AppSettings;

  	seccNodos: FlowNode[] = [];
	seccNodosRuta: FlowNode[] = [];
	seccNodosLay: FlowNode[] = [];
	seccConec: FlowEdge[] = [];
	seccConecRuta: FlowEdge[] = [];
	seccConecLay: FlowEdge[] = [];
	seccNodosBak: FlowNode[] = [];
	seccConecBak: FlowEdge[] = [];
	seccNodosDataSource: any;
	seccConecDataSource: any;
	elemNodo: FlowNode;
	elemConecEdit: FlowEdge;
	modelDiagrama: any;
	diagReadOnly: boolean = false;
	itemsMenuDiag: any;
	dropDownOptions = { width: 500 };

  	// Selección de secciones en diagrama
	ModoPopUp: string;
	popupVisible: boolean = false;
	popupMode = 'Secciones';
	SelNodoDato: any;
	SelNodoLP: any;
	dialogModal: string;
	errMsg: string;
	errTit: string;
	loadingVisible = false;
  	initDiagrama: boolean = false;
  	menuDiagVisible: boolean = false;
	nodoSeccionAccion: string;
	HIGHLIGHT_CLASS: string = "highlight";
	HIGHLIGHT_ACTIVE_CLASS: string = "highlight-is-active";
	highlightIsActive: boolean = false;

  	NodosSvg2 = [{ svg: '../../assets/pro-rojo.svg', id: 'pro-rojo' } ,
				{ svg: '../../assets/pro-azul.svg', id: 'pro-azul' },
				{ svg: '../../assets/pro-naranja.svg', id: 'pro-naranja' },
				{ svg: '../../assets/pro-verde.svg', id: 'pro-verde' },
				{ svg: '../../assets/pro-indigo.svg', id: 'pro-indigo' },
				{ svg: '../../assets/pro-amarillo.svg', id: 'pro-amarillo' },
				{ svg: '../../assets/pro-marino.svg', id: 'pro-marino' },
				{ svg: '../../assets/pro-celeste.svg', id: 'pro-celeste' },
				{ svg: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiPg0KPHBhdGggZD0iTTE1LjAyNSwxNS4yMDE3OTcyIEwxMC44NjY1ODQyLDExLjA0MzM4MTQgQzEyLjkwNzA0OTEsOC42MTU0ODY0NCAxMi44MDM3MzQ0LDQuOTk5NDcyNjYgMTAuNTMwODExNSwyLjcyNjU0OTcyIEM4LjEyODc0NTE2LDAuMzI0NDgzNDI3IDQuMjI4NjE2MDEsMC4zMjQ0ODM0MjcgMS44MjY1NDk3MiwyLjcyNjU0OTcyIEMtMC41NzU1MTY1NzMsNS4xMjg2MTYwMSAtMC41NzU1MTY1NzMsOS4wMjg3NDUxNiAxLjgyNjU0OTcyLDExLjQzMDgxMTUgQzMuMDE0NjY4NTMsMTIuNjE4OTMwMyA0LjYxNjA0NjA2LDEzLjIzODgxODMgNi4xOTE1OTQ5MiwxMy4yMzg4MTgzIEM3LjYxMjE3MTc2LDEzLjIzODgxODMgOS4wMDY5MTk5MywxMi43NDgwNzM2IDEwLjE2OTIxMDEsMTEuNzkyNDEyOCBMMTQuMzI3NjI1OSwxNS45NTA4Mjg3IEwxNS4wMjUsMTUuMjAxNzk3MiBaIE0yLjU0OTc1MjQ4LDEwLjcwNzYwODcgQzAuNTYwOTQ0ODk5LDguNzE4ODAxMTIgMC41NjA5NDQ4OTksNS40NjQzODg3MiAyLjU0OTc1MjQ4LDMuNDc1NTgxMTUgQzMuNTU3MDcwNiwyLjQ2ODI2MzAyIDQuODQ4NTA0MDksMS45Nzc1MTgzIDYuMTY1NzY2MjUsMS45Nzc1MTgzIEM3LjQ4MzAyODQxLDEuOTc3NTE4MyA4LjgwMDI5MDU3LDIuNDY4MjYzMDIgOS43ODE3ODAwMywzLjQ3NTU4MTE1IEMxMS43NzA1ODc2LDUuNDY0Mzg4NzIgMTEuNzcwNTg3Niw4LjcxODgwMTEyIDkuNzgxNzgwMDMsMTAuNzA3NjA4NyBDNy43OTI5NzI0NSwxMi42OTY0MTYzIDQuNTM4NTYwMDUsMTIuNjk2NDE2MyAyLjU0OTc1MjQ4LDEwLjcwNzYwODcgWiIvPg0KPC9zdmc+DQo=', id: 'png-celeste' }
			   ];

  	NodosSvg: custShapesDiagrama[] = [];
  	colorOver: string;

  	constructor(_slibsvg: LibsvgService,
				private appSettingsService: AppsettingsService,
				private _rutasdpservice: RutasdpService,
				private SVisor: SVisorService,
				private rutas: ActivatedRoute,
				private _menuregistro: MenuregService,
				private confirmationService: ConfirmationService,
				private render: Renderer2
    ) { 

    const settings = this.appSettingsService.getSettings();

    _slibsvg.getArchivo().subscribe((datos) => {
			this.NodosSvg = _slibsvg.custShapes;
    });

		var flowNodes: FlowNode[] = [];
		var flowEdges: FlowEdge[] = [];
		this.elemConecEdit = { id: '', text: '', fromId: '', toId: '', fromPoint: '-1', toPoint: '-1'};
    /*flowNodes = [{"id":"49","text":"49 Armado Tapicería","type":"process","x":"43","y":"48","width":"2520","height":"1080","textStyle":"fill:#e6e0e0"},
                 {"id":"10007","text":"10007 Emparrillado","type":"process","x":"199","y":"48","width":"2520","height":"1080","textStyle":"fill:#e6e0e0"},
                 {"id":"50","text":"50 Corte Tela","type":"process","x":"343","y":"96","width":"2520","height":"1080","textStyle":"fill:#e6e0e0"},
                 {"id":"10008","text":"10008 Costura","type":"process","x":"487","y":"96","width":"2520","height":"1080","textStyle":"fill:#e6e0e0"},
                 {"id":"51","text":"51 Blanqueo","type":"process","x":"199","y":"132","width":"2520","height":"1080","textStyle":"fill:#e6e0e0"}]
    flowEdges = [{"id":"c_49","fromId":"49","toId":"10007","text":"","fromPoint":"1","toPoint":"3","conecStyle":"stroke: #e6e0e0"},
                 {"id":"c_10007","fromId":"10007","toId":"50","text":"","fromPoint":"1","toPoint":"3","conecStyle":"stroke: #e6e0e0"},
                 {"id":"c_50","fromId":"50","toId":"10008","text":"","fromPoint":"1","toPoint":"3","conecStyle":"stroke: #e6e0e0"},
                 {"fromId":"51","toId":"50","fromPoint":"1","toPoint":"3","text":"","id":"9c11ae54-93c0-625d-e7d5-a138327805b4","conecStyle":"stroke: #e6e0e0"}] */
    this.seccNodos = flowNodes;
    this.seccConec = flowEdges;
    this.seccNodosDataSource = new ArrayStore({
			key: 'id',
			data: flowNodes
		});
		this.seccConecDataSource = new ArrayStore({
			key: 'id',
			data: flowEdges
		});
    this.seccNodosBak = JSON.parse(JSON.stringify(flowNodes));
    this.seccConecBak = JSON.parse(JSON.stringify(flowEdges));

		this.colCountByScreen = {
			xs: 1,
			sm: 2,
			md: 4,
			lg: 5,
		};
		config({
			editorStylingMode: 'outlined',
		});

    // Eventos en operaciones de registro
		this.subscription = this._menuregistro
      .getObsMenuReg()
      .subscribe((datmenu) => {
        this.statusMenuRegApl = datmenu;
        if (datmenu) {
          this.opMenuRegistro(datmenu);
        } else {
          // dato por defecto de ruta
          this.operCfg = '';
        }
    });

	this.ValideExistencia = this.ValideExistencia.bind(this);
    this.confirmClick = this.confirmClick.bind(this);
	this.cancelClick = this.cancelClick.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.clickout = this.clickout.bind(this);
	this.onMostrarMenuDiag = this.onMostrarMenuDiag.bind(this);
	this.agregarNodoRuta = this.agregarNodoRuta.bind(this);
	this.requestEditOperationHandler = this.requestEditOperationHandler.bind(this);

  }

	// Llama a Acciones de registro
	opMenuRegistro(operMenu: datosMenuConfig): void {
		switch (operMenu.OPCIONES) {
			case 'Nuevo':
				this.IdRutaAnterior = '';
				this.OpGuardar = 'new';
				this.DataRutasPartes = {
					ID_RUTA: '',
					DESCRIPCION: '',
					ESTADO: '',
					TIPO: '',
					PRIORIDAD: '',
					SECCIONES: '{}',
					LAYOUT_DP: '',
          			DIAGRAMA: '{}'
				};
				this.opPrepararNuevo();
				break;

			case 'Modificar':
				this.OpGuardar = 'update';
				this.IdRutaAnterior = this.DataRutasPartes.ID_RUTA;
				this.opPrepararModificar();
				break;

			case 'pre_Guardar':
				this.opPrepararGuardar(this.OpGuardar);
				break;

			case 'Buscar':
			case 'pre_Buscar':
				if (operMenu.OPCIONES === 'pre_Buscar') {
					this.DataRutasPartes = {
						ID_RUTA: '',
						DESCRIPCION: '',
						ESTADO: '',
						TIPO: '',
						PRIORIDAD: '',
						SECCIONES: '{}',
						LAYOUT_DP: '',
            DIAGRAMA: '{}'
					};
				}
				this.opPrepararBuscar();
				break;

			case 'Eliminar':
				this.opEliminar();
				break;

			case 'Primero':
			case 'Anterior':
			case 'Siguiente':
			case 'Ultimo':
			case 'IrA':
				this.opIrARegistro(operMenu.OPCIONES);
				break;

			case 'Vista':
				this.opVista();
				break;

			default:
				break;
		}
	}

	/****** OPERACIONES DE REGISTRO **************/
	opPrepararNuevo(): void {
		this.ReadOnlyEncabRP = false;
		this.diagReadOnly = false;
		this.opBlanquearForma();
	}
  opBlanquearForma(): void {
		this.seccNodos.splice(0, this.seccNodos.length);
		this.seccConec.splice(0, this.seccConec.length);
		this.seccConecBak.splice(0, this.seccConecBak.length);
		const flowNodes: FlowNode[] = [];
		const flowEdges: FlowEdge[] = [];
		this.seccNodosBak = flowNodes;
		this.seccConecBak = flowEdges;
    this.seccNodosRuta = flowNodes;
    this.seccConecRuta = flowEdges;
		this.seccNodosDataSource = new ArrayStore({
			key: 'id',
			data: flowNodes
		});
		this.seccConecDataSource = new ArrayStore({
			key: 'id',
			data: flowEdges
		});
    this.diagLay.pageOrientation = 'landscape';
	}

	opPrepararModificar(): void {
		this.ReadOnlyEncabRP = false;
	}
	opPrepararGuardar(accion: string): void {
		// Valida que no hayan 2 inicios
		var nodErrIni: string[] = [];
		this.seccNodosRuta.forEach((nodr) => {
			const nodCon = this.seccConecRuta.filter(c => (c.toId == nodr.id) && c.id.match('crp_'));
			if (nodCon.length === 0) nodErrIni.push(nodr.text);
		});
		if (nodErrIni.length > 1 ) {
			for (var k=0; k < nodErrIni.length; k++) this.activateHighlight(nodErrIni[k]);
			this.confirmationService.confirm({
				message: 'No puede existir más de una sección definida como Inicio',
				header: 'Guardando ruta',
				icon: 'pi pi-exclamation-triangle',
				accept: () => { return; },
				reject: (type: any) => { return; }
				});
			this.statusMenuRegApl.Status = 'Error';
			this.statusMenuRegApl.OPCIONES = 'Guardar';
			return;
		}

		// Acción validación de datos
		if (!this.ValidaDatos('requerido')) {
			this.statusMenuRegApl.Status = 'Error';
			this.statusMenuRegApl.OPCIONES = 'Guardar';
			this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
			return;
		}

		/*const datossecc = {
			JSECC_ITM: this.DatosPrmRuta.datosEdicionSeccPartes,
		};*/
		this.DataRutasPartes.TIPO = 'Rutas de partes';
		const prmDatos = {
			...this.DataRutasPartes,
			ID_RUTA_ANTERIOR: this.IdRutaAnterior,
		};
		const datossencab = { JRUTAS_ENC: prmDatos };
		const datosdiagrama = { JDIAGRAMA: { NODOS: JSON.stringify(this.seccNodosDataSource._array), 
											 CONECTORES: JSON.stringify(this.seccConecDataSource._array),
											 NODOS_RUTA: JSON.stringify(this.seccNodosRuta),
											 CONECTORES_RUTA: JSON.stringify(this.seccConecRuta) } };
		const prmDatosGuardar = JSON.parse(
			(JSON.stringify(datossencab) + JSON.stringify(datosdiagrama)).replace(
				/}{/g,
				','
			)
		);

		// API guardado de datos
		// this.s_Generales.setExecAPI(Accion, prmDatosGuardar).then((data) => {
		// const res = data;
		this._rutasdpservice.save(accion, prmDatosGuardar).subscribe((resp) => {
			const res = resp.data;
			if (res.ErrorMessage !== '') {
				this.statusMenuRegApl.Status = 'Error';
				this.statusMenuRegApl.OPCIONES = 'Guardar';
				this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
				alertify
					.alert('Error al guardar Ruta', resp.ErrorMessage)
					.setting({ label: 'Aceptar' })
					.show();
			} else {
				this.statusMenuRegApl.Status = '';
				this.statusMenuRegApl.OPCIONES = 'Guardar';
				this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
				alertify.success('Registro guardado!');
				this.ReadOnlyEncabRP = true;
			}
		});
	}
	ValidaDatos(Accion: string): boolean {
		if (Accion === 'requerido') {
			if (
				this.DataRutasPartes.ID_RUTA === '' ||
				this.DataRutasPartes.DESCRIPCION === '' ||
				this.DataRutasPartes.ESTADO === '' ||
				this.DataRutasPartes.PRIORIDAD === '' ||
				this.DataRutasPartes.LAYOUT_DP === ''
			) {
				alertify.alert(
					'Faltan datos',
					'Hay datos que faltan. Revisar contenido de datos de la ruta!'
				);
				return false;
			}
		}
		return true;
	}
	opPrepararBuscar(): void {
		if (this.statusMenuRegApl.OPCIONES === 'pre_Buscar') {
			this.ReadOnlyEncabRP = false;
		} 
    	else {
			const PrmFiltro = [{CAMPO: 'ID_RUTA',EXPRESION: this.DataRutasPartes.ID_RUTA},
							   {CAMPO: 'DESCRIPCION',EXPRESION: this.DataRutasPartes.DESCRIPCION},
							   {CAMPO: 'TIPO', EXPRESION: 'Rutas de partes' }];
			const datossecc = { RUTAS_PRODUCCION: PrmFiltro };
			const datossencab = { ITM_RUTAS_PRODUCCION: '' };
			const prmDatosBuscar = JSON.parse(
				( JSON.stringify(datossencab) + JSON.stringify(datossecc) ).replace(/}{/g, ',')
			);

			// Ejecuta búsqueda API
			// this.s_Generales
			// 	.setExecAPI('BUSCAR RUTAS', prmDatosBuscar)
			// 	.then((data) => {
			this._rutasdpservice
				.consulta(prmDatosBuscar)
				.subscribe((resp: any) => {
					this.DataDP_Q = [];
					this.DataDP_Q = resp.data === null ? [] : resp.data;
					if (this.DataDP_Q.length > 0) {
						this.DataRutasPartes = this.DataDP_Q[0];

						// Diagrama de las rutas asociadas
						try {
							this.modelDiagrama = JSON.parse(this.DataDP_Q[0].DIAGRAMA)
						} catch (error) {
							this.modelDiagrama = { NODOS: [{}], CONECTORES: [{}], NODOS_RUTA: [{}], CONECTORES_RUTA: [{}] };
						}
					} else {
						this.DataRutasPartes = {
							ID_RUTA: '',
							DESCRIPCION: '',
							ESTADO: '',
							TIPO: '',
							PRIORIDAD: '',
							SECCIONES: '',
							LAYOUT_DP: '',
              				DIAGRAMA: '{}'
						};
						this.modelDiagrama = { NODOS: [{}], CONECTORES: [{}], NODOS_RUTA: [{}], CONECTORES_RUTA: [{}] };
					}
					this.statusMenuRegApl = {
						...this.statusMenuRegApl,
						Status: '',
						BNumReg: this.DataDP_Q.length > 0 ? 1 : 0,
						BTotReg: this.DataDP_Q.length,
						OPCIONES: 'pos_Buscar'
					};

					// Trae el diagrama
					this.seccNodos =  JSON.stringify(this.modelDiagrama.NODOS[0]) === '{}' ? [] : this.modelDiagrama.NODOS;
					this.seccNodosDataSource = new ArrayStore({
						key: 'id',
						data: this.seccNodos
					});
					this.seccConec = JSON.stringify(this.modelDiagrama.CONECTORES[0]) === '{}' ? [] : this.modelDiagrama.CONECTORES;
					this.seccConecDataSource = new ArrayStore({
						key: 'id',
						data: this.seccConec
					});
					this.seccNodosRuta =  JSON.parse(JSON.stringify(this.modelDiagrama.NODOS_RUTA));
					this.seccConecRuta =  JSON.parse(JSON.stringify(this.modelDiagrama.CONECTORES_RUTA));
					this.seccNodosBak =  JSON.parse(JSON.stringify(this.seccNodos));
					this.seccConecBak =  JSON.parse(JSON.stringify(this.seccConec));
					this.ReadOnlyEncabRP = true;
					this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
				});
		}

		this.ReadOnlyEncabRP = false;
	}
	opIrARegistro(accion: string): void {
		this.statusMenuRegApl.OPCIONES =
			'pos_' + this.statusMenuRegApl.OPCIONES;
		switch (accion) {
			case 'Primero':
				this.statusMenuRegApl.BNumReg = 1;
				this.DataRutasPartes = this.DataDP_Q[0];
				this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
				break;

			case 'Anterior':
				this.statusMenuRegApl.BNumReg =
					this.statusMenuRegApl.BNumReg === 1
						? 1
						: this.statusMenuRegApl.BNumReg - 1;
				this.DataRutasPartes =
					this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1];
				this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
				break;

			case 'Siguiente':
				this.statusMenuRegApl.BNumReg =
					this.statusMenuRegApl.BNumReg === this.DataDP_Q.length
						? this.DataDP_Q.length
						: this.statusMenuRegApl.BNumReg + 1;
				this.DataRutasPartes =
					this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1];
				this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
				break;

			case 'Ultimo':
				this.statusMenuRegApl.BNumReg = this.DataDP_Q.length;
				this.DataRutasPartes =
					this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1];
				this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
				break;

			case 'IrA':
				if (this.statusMenuRegApl.BNumReg !== 0) {
					// Valida si hubo cambio de ordenamiento en el visor
					if (this.SVisor.ColSort.Columna !== '') {
						if (this.SVisor.ColSort.Clase === 'asc') {
							this.DataDP_Q = this.DataDP_Q.sort((a: any, b: any) =>
								a[this.SVisor.ColSort.Columna].toUpperCase() < b[this.SVisor.ColSort.Columna].toUpperCase() ? -1 : 1
							);
						} else {
							this.DataDP_Q = this.DataDP_Q.sort((a: any, b: any) =>
								a[this.SVisor.ColSort.Columna].toUpperCase() > b[this.SVisor.ColSort.Columna].toUpperCase() ? -1 : 1
							);
						}
					}

          			this.DataRutasPartes =
						this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1];
						this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
					} else {
					this.DataRutasPartes = {
						ID_RUTA: '',
						DESCRIPCION: '',
						ESTADO: '',
						TIPO: '',
						PRIORIDAD: '',
						SECCIONES: '{}',
						LAYOUT_DP: '',
            			DIAGRAMA: '{}'
					};
				}
				this.ReadOnlyEncabRP = true;
				break;

			case 'Eliminado':
				this.DataDP_Q.splice(this.statusMenuRegApl.BNumReg - 1, 1);
				this.statusMenuRegApl.BTotReg--;
				if (
					this.statusMenuRegApl.BNumReg >
					this.statusMenuRegApl.BTotReg
				) {
					this.statusMenuRegApl.BNumReg =
						this.statusMenuRegApl.BTotReg;
				}
				if (this.DataDP_Q.length >= 0) {
					this.DataRutasPartes =
						this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1];
				} else {
					this.DataRutasPartes = {
						ID_RUTA: '',
						DESCRIPCION: '',
						ESTADO: '',
						TIPO: '',
						PRIORIDAD: '',
						SECCIONES: '{}',
						LAYOUT_DP: '',
            DIAGRAMA: '{}'
					};
				}
				// Status
				this.statusMenuRegApl.Status = '';
				this.statusMenuRegApl.OPCIONES = 'pos_Eliminar';
				this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
				break;

			default:
				break;
		}

		// Trae secciones asociadas a la ruta
		this.vecNodosSelecc = JSON.parse(this.DataRutasPartes.SECCIONES);
	}

	opEliminar(): void {
		// Confirma...
		alertify.confirm(
			'Eliminar ruta',
			'Desea eliminar la Ruta <i>' +
				this.DataRutasPartes.ID_RUTA +
				' ' +
				this.DataRutasPartes.DESCRIPCION +
				'</i> ?',
			() => {
				this.AccionEliminar();
			},
			() => {
				this.statusMenuRegApl.Status = '';
				this.statusMenuRegApl.OPCIONES = 'pos_Eliminar';
			}
		);
	}
	// Ejecuta la eliminación
	AccionEliminar(): void {
		const datosruta = { ID_RUTA: this.DataRutasPartes.ID_RUTA };
		const prmDatosEliminar = JSON.parse(JSON.stringify(datosruta));

		// API eliminación de datos
		// this.s_Generales
		// .setExecAPI('ELIMINAR RUTAS', prmDatosEliminar)
		// .then((data) => {
		this._rutasdpservice
			.delete(this.DataRutasPartes.ID_RUTA)
			.subscribe((resp) => {
				const res = resp.data;
				if (res.ErrorMessage !== '') {
					this.statusMenuRegApl.Status = 'Error';
					this.statusMenuRegApl.OPCIONES = 'pos_Eliminar';
					this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
					alertify
						.alert(
							'Error al eliminar Ruta',
							'<b style="color:red;">' + res.ErrorMessage + '</b'
						)
						.setting({ label: 'Aceptar' })
						.show();
				} else {
					// Elimina y posiciona en el Array de Consulta
					this.opIrARegistro('Eliminado');
					alertify.success('Registro eliminado!');
					this.ReadOnlyEncabRP = true;
				}
			});
	}
	// Vista/Zoom de los datos consultados
	opVista(): void {
		this.statusMenuRegApl.Status = '';
		this.statusMenuRegApl.OPCIONES = 'pos_Visor';
		this.SVisor.DatosVisor = JSON.parse(JSON.stringify(this.DataDP_Q));
		this.SVisor.PrmVisor = {
			Titulo: 'Layouts de Planta',
			Columnas: [
				{ Nombre: 'ID_RUTA', Titulo: 'Id Ruta' },
				{ Nombre: 'DESCRIPCION', Titulo: 'Descripción' },
				{ Nombre: 'ESTADO', Titulo: 'Estado' },
				{ Nombre: 'TIPO', Titulo: 'Tipo' },
			],
			PrmApl: this.statusMenuRegApl,
		};
		this.SVisor.setObsVisor(true);
	}

	onSelectionChanged(e: any, dropDownBoxInstance: any): void {
		const keys = e.selectedRowKeys;
		this.GValorLayout = [];
		keys.forEach((e: any) => {
			this.GValorLayout.push(e.ID_RUTA);
		});
		dropDownBoxInstance.option(
			'value',
			keys.length > 0 ? this.GValorLayout.toString() : null
		);
		if (this.GValorLayout !== null) {
			this.DataRutasPartes.LAYOUT_DP = this.GValorLayout.toString();
		}

    // Carga el diagrama
    this._rutasdpservice.consulta({ accion: 'diagrama layout planta', 
                                    ID_RUTA: keys[keys.length-1].ID_RUTA })
        .subscribe((resp) => {
          this.modelDiagrama = resp.data;

          // Agrega layout al diagrama
          this.agregarLayout(keys[keys.length-1].ID_RUTA, keys[keys.length-1].DESCRIPCION);
        });

	}

  // Agrega layout como un container
  childCnt: childFlowNode[] = [];
  minX: number; minY: number; maxX: number; maxY: number;
  agregarLayout(IdRuta: string, NomRuta: string) {
    let nodoCnt = this.seccNodos.filter((s) => s.type === 'horizontalContainer');
    const numCnt = nodoCnt !== undefined ? nodoCnt.length : 0;

    // Nodos y conectores del diagrama
    this.seccNodosLay =  JSON.stringify(this.modelDiagrama.NODOS[0]) === '{}' ? [] : this.modelDiagrama.NODOS;
    this.seccConecLay = JSON.stringify(this.modelDiagrama.CONECTORES[0]) === '{}' ? [] : this.modelDiagrama.CONECTORES;
    this.seccNodosLay.forEach(nod => {
		this.seccNodosBak =  [...this.seccNodosBak, JSON.parse(JSON.stringify(nod))];
	});

    // Crea container y agrega los nodos
    this.seccNodosLay.forEach(nod => {
      nod.contenedor = 'cnt_' + IdRuta;
      nod.width = "100";
      nod.height = "60";
      nod.bloqSeccion = true;
      nod.textStyle = 'fill:#e6e0e0';
      nod.type = 'rectangle';
	  nod.text = nod.text;
    })
    
    // Contenedor --> Layout de planta -- Coordenadas y tamaño 
    this.minX = Number(this.seccNodosLay.reduce((ant, act) => {
                    return Number(ant.x) < Number(act.x) ? ant : act;
                  }).x);
    this.minY = Number(this.seccNodosLay.reduce((ant, act) => {
                    return Number(ant.y) < Number(act.y) ? ant : act;
                  }).y);
    let obj = this.seccNodosLay.reduce((ant, act) => {
                    return Number(ant.x) + Number(ant.width) > Number(act.x) + Number(act.width) ? ant : act;
                  });
    this.maxX = Number(obj.x) + Number(obj.width);
    obj = this.seccNodosLay.reduce((ant, act) => {
                    return Number(ant.y)+Number(ant.height) > Number(act.y)+Number(act.height) ? ant : act;
                  });
    this.maxY = Number(obj.y) + Number(obj.height);
    this.elemNodo =
    {
      id: 'cnt_' + IdRuta,
      text: NomRuta,
      type: 'horizontalContainer',
      x: (this.minX - 40).toString(), 
      y: (this.minY - 10).toString(), 
      width: (this.maxX + 10).toString(),
      height: (this.maxY).toString()
    };

    // Si hay mas de un contenedor ubicar el siguiente
    if (numCnt !== 0) {
      let obj = nodoCnt.reduce((ant, act) => {
                      return Number(ant.x) + Number(ant.width) > Number(act.x) + Number(act.width) ? ant : act;
                    });
      this.maxX = Number(obj.x) + Number(obj.width);

      // Define posición y tamaño nuevo container
      this.elemNodo.x = (this.maxX + 50).toString();

      this.seccNodosLay.forEach(nod => {
        nod.x = (Number(nod.x) + this.maxX + 50).toString();
      })

    }

    // Agrega secciones - nodos
    this.seccNodos = [...this.seccNodos, this.elemNodo];
    this.seccNodosLay.forEach(nod => {
      this.seccNodos = [...this.seccNodos, nod];
    });
    this.seccNodosDataSource = new ArrayStore({
      key: 'id',
      data: this.seccNodos
    });
    this.seccConecLay.forEach(conn => {
      conn.bloqConn = true;
      conn.conecStyle = 'stroke: #e6e0e0';
      this.seccConec = [...this.seccConec, conn];
    });
    this.seccConecDataSource = new ArrayStore({
      key: 'id',
      data: this.seccConec
    });
	this.diagLay.instance.repaint();

  }

	// Selección opción Menu contextual del diagrama - acciones
	contextMenuItemClick(e: any) {
		if (e.itemData.name === 'vincular') {
			this.agregarNodoRuta(this.nodoSeccionAccion);
		}
		if (e.itemData.name === 'desvincular') {
			this.eliminarNodoRuta(this.nodoSeccionAccion);
		}
	}

	// Evento al abrir Menú contextual sobre el shape de sección
	onMostrarMenuDiag(e: any) {
		// Nodo sobre el que actúa el menú
		var pnodo = e.jQEvent.currentTarget.getAttribute('id');
		var nodoHtml = e.jQEvent.currentTarget.outerHTML;
		var doc = new DOMParser().parseFromString(nodoHtml, "text/xml");
		const coordX = doc.getElementsByTagName('rect')[0].getAttribute('x');
		const coordY = doc.getElementsByTagName('rect')[0].getAttribute('y');
		const textNodo = doc.getElementsByTagName('text')[0].getAttribute('appliedText');
		const nodoSelecc = this.seccNodos.find(f => f.x == coordX && f.y == coordY && f.text == textNodo);
		if (nodoSelecc) {
			this.nodoSeccionAccion = nodoSelecc.id;
		}
		
		/*if (pnodo) {
			pnodo = pnodo.replace('_secc_','');
			this.nodoSeccionAccion = pnodo;
		}*/
		
		if (e.jQEvent.currentTarget.classList.value === 'shape container') {
			e.cancel = true;
		}
		else {
			if (e.jQEvent.currentTarget.classList.value !== 'shape locked') {
			e.cancel = true;
		}
		}
	}

	@HostListener('document:click', ['$event'])
	clickout(e: any) {
		this.menuDiagVisible = false;
		if (!this.highlightIsActive)
			this.deactivateHighlight(null);
	}

  // *** Restricciones de edición nodos
  indMovCnt: boolean = false;
  requestLayoutUpdateHandler(e: any) { 
    //console.log("uh",e);
    this.indMovCnt = false;
    /*for(var i = 0; i < e.changes.length; i++) {
      if(e.changes[i].type === 'update' && e.changes[i].data.type === 'horizontalContainer') {
        this.indMovCnt = false;
        e.allowed = true;
      }
      else 
          e.allowed = false;
    }*/
  } 
  requestEditOperationHandler(e: any) {
	if (e.operation === "addShape") {
		console.log("oh",e);
	}
	else if (e.operation === "deleteConnector") {
		// eliminar de los nodos de Ruta
		let conecElim = this.seccConecRuta.findIndex(f => f.id == e.args.connector.dataItem.id);
		if (conecElim != 0) {
			this.seccConecRuta.splice(conecElim, 1);
		}
	}
	else if (e.operation === "changeConnection") {
		// Si está agregando conector
		var shapeType = e.args.newShape && e.args.newShape.type;
		if (e.args.connectorPosition === "start") {
			if (shapeType) {
				if (shapeType.match('pro-') && e.args.connectionPointIndex !== -1) {
					this.elemConecEdit.fromPoint = e.args.connectionPointIndex;
				}
			}
		}
		if (e.args.connectorPosition === "end") {
			if (shapeType) {
				if (shapeType.match('pro-') && e.args.connectionPointIndex !== -1) {
					this.elemConecEdit.toPoint = e.args.connectionPointIndex;
				}
			}
			/*if (e.reason !== "checkUIElementAvailability" && e.args.connectionPointIndex != -1) {
				var connadd = this.diagLay.instance.getItemById(e.args.connector.id);
				let conecInfo = this.seccConec.findIndex(f => f.id == e.args.connector.id);
				if (conecInfo >= 0) {
					this.seccConec[conecInfo].id = 'crp_' + e.args.connector.fromKey + '_' + e.args.connector.toKey;
					let conecRuta = this.seccConecRuta.findIndex(f => f.id == 'crp_' + e.args.connector.id);
					if (conecRuta === 0) {
						const elemConect =
						{
							id: 'crp_' + e.args.connector.fromKey + '_' + e.args.connector.toKey,
							fromId: this.seccConec[conecInfo].fromId,
							toId: this.seccConec[conecInfo].toId,
							text: '',
							fromPoint: this.seccConec[conecInfo].fromPoint,
							toPoint: this.seccConec[conecInfo].toPoint,
							conecStyle: 'stroke: black'
						};
						this.seccConecRuta = [...this.seccConecRuta, elemConect];
					}
				}
				e.allowed = true;
			}*/
		}
	}
    if (e.operation === "moveShape") {
      if(e.args.shape.type !== "horizontalContainer") {
          e.allowed = this.indMovCnt;
      }
      else {
        this.indMovCnt = true;
        e.allowed = true;
      }
    }
    else {
      e.allowed = true;
    }
  }
  onContentReady(e: any) {
  }

  autoSaveTimeout: any = -1;
  onOptionChanged(e: any) {
	//var pnodo = this.render.selectRootElement('shape locked');
	//console.log(e);

	this.autoSaveTimeout = setTimeout(() => {
		// Verfica si hubo cambios en conectores
		if (Number(this.elemConecEdit.fromPoint) != -1 && Number(this.elemConecEdit.toPoint) != -1) {
			this.seccConec.forEach(cn => {
				const frId = this.seccNodos.filter(f => f.id == cn.fromId);
				const toId = this.seccNodos.filter(f => f.id == cn.toId);
				const cnIgual = this.seccConec.filter(f => f.id == cn.toId && f.id == cn.fromId && f.id.match('crp_'));
				
				// 1. cambia el id de conectores agregados manualmente
				// 2. agrega a los conectores de las rutas
				if (frId[0].type.match('pro-') && toId[0].type.match('pro-') && 
				    !cn.id.match('crp_') && !cn.id.match('clp_') && cnIgual.length === 0) 
				{
					
					// re-asigna codigo id
					cn.id = 'crp_' + cn.fromId + '_' + cn.toId;
				
					let conecInfo = this.seccConecRuta.findIndex(f => f.id == cn.id);
					if (conecInfo === -1) {
						const elemConect =
						{
							id: cn.id,
							fromId: cn.fromId,
							toId: cn.toId,
							text: '',
							fromPoint: cn.fromPoint,
							toPoint: cn.toPoint,
							conecStyle: cn.conecStyle
						};
						this.seccConecRuta = [...this.seccConecRuta, elemConect];
					}
				}
			});
			this.elemConecEdit = { id: '', text: '', fromId: '', toId: '', fromPoint: '-1', toPoint: '-1'};
		}

		var pnodo = document.getElementsByClassName('shape locked');
		if (pnodo === undefined) return;
		e.component.option("hasChanges", false);
		
		// Verifica si es una sección
		/*for (var k=0; k < pnodo.length; k++) {
			var nodotxt = pnodo[k].outerHTML;
			if (nodotxt.includes('¬')) {
				const idNodo = nodotxt.split('¬')[1];
				//pnodo[k].outerHTML = nodotxt.split('¬')[0] + nodotxt.split('¬')[2];
				if (!pnodo[k].hasAttribute('id'))
					pnodo[k].id = "_secc_" + idNodo;
				}
		};*/
		//this.diagLay.instance.repaint();
	}, 500);

	/*var pnodo = document.getElementsByClassName('shape locked');
	console.log("adddd",pnodo);
	if (pnodo !== undefined) {
		console.log("validadooo",pnodo.length);		
		for (var k=0; k < pnodo.length; k++) {
			console.log("nodoooooooo",pnodo[k]);
			pnodo[k].id = "_secc_" + k.toString();
			}
		} */
  }

  handleMouseOver(e: any) {
    this.colorOver = "red";
	}


  itemStyleExpr(obj: any) {
    return { "stroke": "#e6e0e0" };
  }
  textStyleExpr(obj: any) {
    return { "fill": "#e6e0e0" };
  }
  onItemDblClick(e: any) {
    const seccNueva = e.item.dataItem.id;
	this.agregarNodoRuta(seccNueva);
  }
  onItemClick(e: any) {
	this.highlightIsActive = false;
	console.log('click',e);
  }

  // **** Agregar nodo de ruta ****
  agregarNodoRuta(seccNueva: string) {
    let NodoSecc = this.seccNodos.findIndex(f => f.id == seccNueva);
    if (NodoSecc >= 0) {
		// Tipo de nodo produccion
		const nodOrg = this.seccNodosBak.findIndex(f => f.id == seccNueva);
		this.seccNodos[NodoSecc].type = this.seccNodosBak[nodOrg].type;
		this.seccNodos[NodoSecc].textStyle = 'fill: black';
		this.seccNodosRuta = [...this.seccNodosRuta, this.seccNodos[NodoSecc]];
		this.seccNodosDataSource = new ArrayStore({
			key: 'id',
			data: this.seccNodos
		});

      	if(this.seccNodosRuta.length > 1) {
			const seccUlt = this.seccNodosRuta[this.seccNodosRuta.length - 2].id;
			const elemConect =
			{
				id: 'crp_' + seccUlt,
				fromId: seccUlt,
				toId: seccNueva,
				text: '',
				fromPoint: '2',
				toPoint: '3',
				conecStyle: 'stroke: black'
			};
			this.seccConec = [...this.seccConec, elemConect];
			this.seccConecRuta = [...this.seccConecRuta, elemConect];
			this.seccConecDataSource = new ArrayStore({
					key: 'id',
					data: this.seccConec
				});
		}
    }

  }

  // **** Eliminar nodo de ruta ****
  eliminarNodoRuta(seccEliminar: string) {
    let NodoSecc = this.seccNodos.findIndex(f => f.id == seccEliminar);
    if (NodoSecc >= 0) {
	// Tipo de nodo produccion
		this.seccNodos[NodoSecc].type = 'rectangle';
		this.seccNodos[NodoSecc].textStyle = 'fill:#e6e0e0';
		this.seccNodos[NodoSecc].bloqSeccion = true;
		this.seccNodos[NodoSecc].width = "100";
		this.seccNodos[NodoSecc].height = "60";
		this.seccNodosDataSource = new ArrayStore({
			key: 'id',
			data: this.seccNodos
		  });
	  
		// Eliminar de los nodos de la ruta
		NodoSecc = this.seccNodosRuta.findIndex(f => f.id == seccEliminar);
		this.seccNodosRuta.splice(NodoSecc, 1);

		// Eliminar los conectores relacionados con la ruta
		let conecElim = this.seccConecRuta.filter(f => f.fromId == seccEliminar || f.toId == seccEliminar);
		conecElim.forEach((nod, index) => {
			const ix = this.seccConecRuta.findIndex(f => f.id == nod.id);
			this.seccConecRuta.splice(ix, 1);
		})
		// Elimina conectores asociados al nodo eliminado distintos a layout de planta
		conecElim = this.seccConec.filter(f => (f.fromId == seccEliminar || f.toId == seccEliminar) && !f.id.match('clp_'));
		conecElim.forEach((nod, index) => {
			const ix = this.seccConec.findIndex(f => f.id == nod.id);
			this.seccConec.splice(ix, 1);
		})
		this.seccConecDataSource = new ArrayStore({
			key: 'id',
			data: this.seccConec
		});

      };


  }

	// HIGHLIGHT HELPERS
	activateHighlight(nodoSinConec: any) {
		const diagSombra = document.getElementById('diagPartes') as HTMLElement;
		const htmlNodo = document.querySelector('[appliedText="'+nodoSinConec+'"]') as HTMLElement;
		if (htmlNodo === null) return; 
		const highlightedElement = htmlNodo.parentElement as HTMLElement;
		this.highlightIsActive = true;
	
		diagSombra.classList.add(this.HIGHLIGHT_ACTIVE_CLASS);
		highlightedElement.classList.add(this.HIGHLIGHT_CLASS);
	}
	deactivateHighlight(nodoSinConec: any) {
		const diagSombra = document.getElementById('diagPartes') as HTMLElement;
		const highlightedElement = document.getElementsByClassName(this.HIGHLIGHT_CLASS);
		if (highlightedElement === null) return; 
		this.highlightIsActive = false;
	
		diagSombra.classList.remove(this.HIGHLIGHT_ACTIVE_CLASS);
		for (var k=0; k < highlightedElement.length; k++) {
			highlightedElement[k].classList.remove(this.HIGHLIGHT_CLASS);
		};
	}


  clickLay(opcion: string) {
    switch (opcion) {
      case 'original':
        this.seccNodosDataSource = new ArrayStore({
          key: 'id',
          data: this.seccNodosBak
        });
				this.seccConecDataSource = new ArrayStore({
					key: 'id',
					data: this.seccConecBak
				});
        break;
    
      case 'nuevo':
        this.seccNodosDataSource = new ArrayStore({
          key: 'id',
          data: this.seccNodos
        });
				this.seccConecDataSource = new ArrayStore({
					key: 'id',
					data: this.seccConec
				});
        break;
    
      case 'ruta':
		this.activateHighlight(undefined);

        /*this.seccNodosDataSource = new ArrayStore({
          key: 'id',
          data: this.seccNodosRuta
        });
				this.seccConecDataSource = new ArrayStore({
					key: 'id',
					data: this.seccConecRuta
				});*/
        break;
    
      default:
        break;
    }
  }

  // Valide unicidad de la llave
	ValideExistencia(e: any): any {
		return new Promise((resolve, reject) => {
			if (!this.statusMenuRegApl.OPCIONES.match('Nuevo|Modificar')) {
				resolve('');
				return;
			}
			if (e.value !== '') {
				this._rutasdpservice
					.idruta(e.value)
					.subscribe((resp: any) => {
						const Msg = resp.data;
						if (Msg.ErrorMessage !== '') {
							alertify.alert('Ruta repetida', Msg.ErrorMessage);
							// const overlay = e.element.querySelectorAll('.dx-invalid-message.dx-overlay');
							// overlay.style.width = '500px';
							reject(Msg.ErrorMessage);
						} else {
							resolve('');
						}
					});
			} else {
				resolve('');
			}
		});
	}

  onSeleccEstado(e: any): void {
		this.DataRutasPartes.ESTADO = e.value;
	}

	onSeleccPrioridad(e: any): void {
		this.DataRutasPartes.PRIORIDAD = e.value;
	}

	CambioDatosForma(e: any): void {
		//this.DatosPrmRuta.DatosRutaParte = this.DataRutasPartes;
	}

  confirmClick(e: any): void {
		// Agregar nodo y expandir
		if (this.ModoPopUp === 'treelist') {
			// Busca si existe nodo de secciones
		}
		this.popupVisible = false;
	}
	cancelClick(e: any): void {
		this.popupVisible = false;
	}

  // Permitir solo las operativas
  onCellPreparedLP(e: any) {
    // Solo deja seleccionables las operativas
    if (
      e.rowType == 'data' &&
      e.cellElement.querySelector('.dx-select-checkbox')
    ) {
      let check = e.cellElement.querySelectorAll('.dx-select-checkbox');
      check.forEach((ele: any, ixfila: any) => {
        const inst = dxCheckBox.getInstance(ele);
        if (e.data.TIPO != 'OPERATIVA') inst.option('visible', false);
      });
    }
  }
	// Permitir solo una seleccion
	onSeleccNodo(e: any): void {
		this.SelNodoLP = e.currentSelectedRowKeys;
	}

  cerrarListaDP(e: any) {
    this.ddLayout.instance.close();
  }

  ngOnInit(): void {
		this.PrmMenuReg = {
			TABLA_BASE: 'RUTAS_PRODUCCION',
			APLICACION: 'PRO-013',
			USUARIO: 'XTEIN',
			OPCIONES: '_INI_',
			Status: '',
			BNumReg: 0,
			BTotReg: 0,
		};

    this.DataRutasPartes = {
			ID_RUTA: '',
			DESCRIPCION: '',
			ESTADO: '',
			TIPO: '',
			PRIORIDAD: '',
			SECCIONES: '',
			LAYOUT_DP: '',
			DIAGRAMA: '{}'
		};

		this.appSettingsService.getSettings().subscribe((datos) => {
			this._menuregistro.setObsMenuReg(this.PrmMenuReg);

      // Trae datos de Layouts de planta
      this._rutasdpservice.consulta({ accion: 'qlistadp', ID_RUTA: '' }).subscribe((resp) => {
        const res = resp.data;
        this.GDatosLayoutDP = res;
      });

    });

    // Items menú contextual diagrama
    this.itemsMenuDiag = [
      { text: "Vincular a ruta", name: "vincular" },
      { text: "Des-vincular de ruta", name: "desvincular" }
    ];

  }

	ngAfterViewInit(): void {
		const x = setTimeout(() => {
			this.initDiagrama = true;
			this.diagReadOnly = true;
			this.diagLay.instance.repaint();
		}, 1000);
		//this.ddLayout.instance.option("dropDownOptions.width", 800);  
  	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

}
