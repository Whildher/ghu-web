import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxDiagramComponent, DxTreeListComponent } from 'devextreme-angular';
import dxCheckBox from 'devextreme/ui/check_box';
import { Subscription } from 'rxjs';
import { RutasdpService } from '../_servicios/rutasdp.service';
import { FlowEdge, FlowNode, MDistriplantas, MSecciones } from '../_class/distriplantas.class';
import { SSeccionesdpService } from '../_servicios/s-seccionesdp.service';
import ArrayStore from 'devextreme/data/array_store';
import { datosMenuConfig } from '../_class/menureg.class';
import config from 'devextreme/core/config';
import {MenuItem, PrimeNGConfig} from 'primeng/api';
import { MenuregService } from '../_servicios/menureg.service';
import { SVisorService } from '../visor/models/s-visor.service';
import {ConfirmationService } from 'primeng/api';
import { AppsettingsService } from '../appsettings.service';
import { AppSettings } from '../_class/appsettings.class';

declare let alertify: any;

@Component({
  selector: 'app-layoutplanta',
  templateUrl: './layoutplanta.component.html',
  styleUrls: ['./layoutplanta.component.scss'],
  providers: [ConfirmationService]
})
export class LayoutplantaComponent implements OnInit {
	@ViewChild(DxTreeListComponent, { static: false }) treeList: DxTreeListComponent;
	@ViewChild('diagram', { static: false }) diagLay: DxDiagramComponent;
	@ViewChild('secciones', { static: false }) treeListLP: DxTreeListComponent;

	DataDistriPlanta: MDistriplantas;
	DataDP_Q: MDistriplantas[] = [];
	DatosSeccRutasDP: MSecciones[];
	DatosSecciones: any;

	PrmMenuReg: datosMenuConfig;
	colCountByScreen: object;
	stylingMode = 'outlined';
	editorStylingMode: 'outlined';
	operCfg: string;
	ReadOnlyEncabDP = true;
	statusMenuRegApl: datosMenuConfig;
	vecNodosSelecc: any;
	IdRutaAnterior: string;
	OpGuardar: string;
	dSBEstados = [{ ESTADO: 'ACTIVO' }, { ESTADO: 'INACTIVO' }];

	// Parámetro de ruta para pasar
	subscription: Subscription;
	datIdRuta: string;
	appsettings: AppSettings;

	// Parámetro de ruta para pasar
	statusSeccDP = '';
	seleccionDP: any[] = [];
	seleccRecur = false;
	seccNodos: FlowNode[] = [];
	seccConec: FlowEdge[] = [];
	seccNodosBak: FlowNode[] = [];
	seccConecBak: FlowEdge[] = [];
	seccNodosDataSource: any;
	seccConecDataSource: any;
	elemNodo: FlowNode;
	modelDiagrama: any;
	diagReadOnly: boolean = true;
	eliminarNodo: boolean = false;
	NodosSvg = [{ svg: '../../assets/pro-rojo.svg', id: 'pro-rojo' } ,
				{ svg: '../../assets/pro-azul.svg', id: 'pro-azul' },
				{ svg: '../../assets/pro-naranja.svg', id: 'pro-naranja' },
				{ svg: '../../assets/pro-verde.svg', id: 'pro-verde' },
				{ svg: '../../assets/pro-indigo.svg', id: 'pro-indigo' },
				{ svg: '../../assets/pro-amarillo.svg', id: 'pro-amarillo' },
				{ svg: '../../assets/pro-marino.svg', id: 'pro-marino' },
				{ svg: '../../assets/pro-celeste.svg', id: 'pro-celeste' }
			   ];

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
  

	constructor(
		private appSettingsService: AppsettingsService,
		private s_seccdp: SSeccionesdpService,
		private _rutasdpservice: RutasdpService,
		private DatosPrmRuta: SSeccionesdpService,
		private SVisor: SVisorService,
		private rutas: ActivatedRoute,
		private _menuregistro: MenuregService,
		private confirmationService: ConfirmationService,
		private primengConfig: PrimeNGConfig 
	)
	{
		this.colCountByScreen = {
			xs: 1,
			sm: 2,
			md: 2,
			lg: 2,
		};
		config({
			editorStylingMode: 'outlined',
		});

		const settings = this.appSettingsService.getSettings();

		const flowNodes: FlowNode[] = [];
		const flowEdges: FlowEdge[] = [];
		this.seccNodosDataSource = new ArrayStore({
			key: 'id',
			data: flowNodes
		});
		this.seccConecDataSource = new ArrayStore({
			key: 'id',
			data: flowEdges
		});

		// Eventos en operaciones de registro
		this.subscription = this._menuregistro
			.getObsMenuReg()
			.subscribe((datmenu) => {
				this.statusMenuRegApl = datmenu;
				this.DatosPrmRuta.statusMenuRegApl = datmenu;
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
		this.onCellPrepared = this.onCellPrepared.bind(this);
		this.diagramCambios = this.diagramCambios.bind(this);
		this.selecSeccion = this.selecSeccion.bind(this);
		this.eliminarNodoDiagrama = this.eliminarNodoDiagrama.bind(this);
		this.cancelEliminarNodoDiagrama = this.cancelEliminarNodoDiagrama.bind(this);
		this.onSoloSeccSelec = this.onSoloSeccSelec.bind(this);

	}

	  // Parámetros de Conexion
	async PrmConexion() {
		const settings = await this.appSettingsService.getSettings();
    	console.log(settings);
	}

	// Llama a Acciones de registro
	selectedNodes: any[] = [];
	opMenuRegistro(operMenu: datosMenuConfig): void {
		switch (operMenu.OPCIONES) {
			case 'Nuevo':
				this.IdRutaAnterior = '';
				this.OpGuardar = 'new';
				this.DataDistriPlanta = {
					ID_RUTA: '',
					DESCRIPCION: '',
					ESTADO: '',
					TIPO: '',
					PRIORIDAD: '',
					SECCIONES: '{}',
					DIAGRAMA: '{}'
				};
				this.opPrepararNuevo();
				break;

			case 'Modificar':
				this.OpGuardar = 'update';
				this.IdRutaAnterior = this.DataDistriPlanta.ID_RUTA;
				this.statusSeccDP = 'ED';
				this.treeList.instance.repaint();
				this.opPrepararModificar();
				break;

			case 'pre_Guardar':
				this.opPrepararGuardar(this.OpGuardar);
				break;

			case 'Buscar':
			case 'pre_Buscar':
				if (operMenu.OPCIONES === 'pre_Buscar') {
					this.DataDistriPlanta = {
						ID_RUTA: '',
						DESCRIPCION: '',
						ESTADO: '',
						TIPO: '',
						PRIORIDAD: '',
						SECCIONES: '{}',
						DIAGRAMA: '{}'
					};
				}
				this.opBlanquearForma();
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
		this.DatosPrmRuta.setObsDatosSeccDP('Nuevo');
		this.ReadOnlyEncabDP = false;
		this.statusSeccDP = 'ED';
		this.diagReadOnly = false;
		this.opBlanquearForma();
	}
	opBlanquearForma(): void {
		this.treeList.instance.deselectAll();
		this.treeList.instance.repaint();
		this.seccNodos.splice(0, this.seccNodos.length);
		this.seccConec.splice(0, this.seccConec.length);
		this.seccConecBak.splice(0, this.seccConecBak.length);
		const flowNodes: FlowNode[] = [];
		const flowEdges: FlowEdge[] = [];
		this.seccNodosBak = flowNodes;
		this.seccConecBak = flowEdges;
		this.seccNodosDataSource = new ArrayStore({
			key: 'id',
			data: flowNodes
		});
		this.seccConecDataSource = new ArrayStore({
			key: 'id',
			data: flowEdges
		});
	}
	opPrepararModificar(): void {
		this.DatosPrmRuta.setObsDatosSeccDP('Modificar');
		this.ReadOnlyEncabDP = false;
		this.statusSeccDP = 'ED';
		this.treeList.instance.repaint();
		this.diagReadOnly = false;
	}
	opPrepararGuardar(accion: string): void {
		// >*this.DatosPrmRuta.setObsDatosSeccDP('Guardar');
		// Asociación de las secciones solo escogidas
		this.selectedNodes = this.treeList.instance.getSelectedRowsData('all');

		this.DataDistriPlanta.TIPO = 'Layout Planta';
		this.DataDistriPlanta.ESTADO = 'ACTIVO';
		const datossecc = { JSECC_ITM: this.selectedNodes };
		const datosdiagrama = { JDIAGRAMA: { NODOS: JSON.stringify(this.seccNodosDataSource._array), CONECTORES: JSON.stringify(this.seccConecDataSource._array) } };
		const prmDatos = {
			...this.DataDistriPlanta,
			ID_RUTA_ANTERIOR: this.IdRutaAnterior,
		};
		const datossencab = { JRUTAS_ENC: prmDatos };
		const prmDatosGuardar = JSON.parse(
			(JSON.stringify(datossencab) + JSON.stringify(datossecc) + JSON.stringify(datosdiagrama)).replace(
				/}{/g,
				','
			)
		);

		// API guardado de datos
		this._rutasdpservice.save(accion, prmDatosGuardar).subscribe((resp) => {
			const res = resp.data;
			if (res.ErrorMessage !== '') {
				this.statusMenuRegApl.Status = 'Error';
				this.statusMenuRegApl.OPCIONES = 'Guardar';
				// >*this.DatosPrmRuta.setObsDatosSeccDP('err_guardar');
				this.statusSeccDP = 'ED';
				this.treeList.instance.repaint();
				this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
				alertify
					.alert('Error al guardar Ruta', res.ErrorMessage)
					.setting({ label: 'Aceptar' })
					.show();
			} 
			else {
				if (accion.match('new|copy')) {
					this.DataDP_Q = [];
					this.DataDP_Q.push(this.DataDistriPlanta);
				}
				else {
					this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1] = this.DataDistriPlanta;
				}
				this.statusMenuRegApl = {
					...this.statusMenuRegApl,
					Status: '',
					OPCIONES: 'Guardar',
					BNumReg: (accion === 'new' ? 1 : this.statusMenuRegApl.BNumReg),
					BTotReg: this.DataDP_Q.length
				};
				let nodoselecc = [];
				for (const nodo of this.selectedNodes) {
					nodoselecc.push(nodo.ITEM.toString());
				}
				this.statusSeccDP = '';
				this.treeList.instance.repaint();
				this.DataDistriPlanta.SECCIONES = JSON.stringify(nodoselecc);
				this.DataDistriPlanta.DIAGRAMA = JSON.stringify({ NODOS: this.seccNodosDataSource._array, CONECTORES: this.seccConecDataSource._array });
				this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
				alertify.success('Registro guardado!');
				this.ReadOnlyEncabDP = true;
				this.diagReadOnly = true;
			}
		});
	}

	opPrepararBuscar(): void {
		if (this.statusMenuRegApl.OPCIONES === 'pre_Buscar') {
			this.DatosPrmRuta.setObsDatosSeccDP('Nuevo');
			this.statusSeccDP = '';
			this.diagReadOnly = true;
			this.ReadOnlyEncabDP = false;
		} else {
			const PrmFiltro = [];
			PrmFiltro.push({
				CAMPO: 'ID_RUTA',
				EXPRESION: this.DataDistriPlanta.ID_RUTA,
			});
			PrmFiltro.push({
				CAMPO: 'DESCRIPCION',
				EXPRESION: this.DataDistriPlanta.DESCRIPCION,
			});
			PrmFiltro.push({ CAMPO: 'TIPO', EXPRESION: 'Layout Planta' });
			const datossecc = { RUTAS_PRODUCCION: PrmFiltro };
			const datossencab = { ITM_RUTAS_PRODUCCION: '' };
			const prmDatosBuscar = JSON.parse(
				(
					JSON.stringify(datossencab) + JSON.stringify(datossecc)
				).replace(/}{/g, ',')
			);

			// Ejecuta búsqueda API
			// this.s_Generales
			// .setExecAPI('BUSCAR RUTAS', prmDatosBuscar)
			// .then((data) => {
			this._rutasdpservice
				.consulta(prmDatosBuscar)
				.subscribe((resp: any) => {
					this.DataDP_Q = [];
					this.DataDP_Q = resp.data === null ? [] : resp.data;
					if (this.DataDP_Q.length > 0) {
						this.DataDistriPlanta = this.DataDP_Q[0];

						// Selecciona las secciones asociadas
						try {
							this.vecNodosSelecc = JSON.parse(this.DataDP_Q[0].SECCIONES);
							this.DatosPrmRuta.setDatosSeleccionDP(this.vecNodosSelecc.SECCIONES);
							this.modelDiagrama = JSON.parse(this.DataDP_Q[0].DIAGRAMA)
						} catch (error) {
							this.modelDiagrama = { NODOS: [{}], CONECTORES: [{}] };
						}
						// >*this.DatosPrmRuta.setObsDatosSeccDP('Seleccion');
					} else {
						this.DataDistriPlanta = {
							ID_RUTA: '',
							DESCRIPCION: '',
							ESTADO: '',
							TIPO: '',
							PRIORIDAD: '',
							SECCIONES: '[]',
							DIAGRAMA: { NODOS: [{}], CONECTORES: [{}] }
						};
						this.DatosPrmRuta.setDatosSeleccionDP({});
						this.modelDiagrama = { NODOS: [{}], CONECTORES: [{}] };

					}
					this.statusMenuRegApl = {
						...this.statusMenuRegApl,
						Status: '',
						BNumReg: this.DataDP_Q.length > 0 ? 1 : 0,
						BTotReg: this.DataDP_Q.length,
						OPCIONES: 'pos_Buscar'
					};
					// >*this.DatosPrmRuta.setObsDatosSeccDP('Seleccion');
					// Selecciona las secciones
					this.treeList.instance.selectRows(this.vecNodosSelecc, false);
					this.statusSeccDP = '';
					this.treeList.instance.repaint();

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
					this.seccNodosBak =  JSON.parse(JSON.stringify(this.seccNodos));
					this.seccConecBak =  JSON.parse(JSON.stringify(this.seccConec));
					this.ReadOnlyEncabDP = true;
					this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
				});
		}

		this.ReadOnlyEncabDP = false;
	}
	opIrARegistro(accion: string): void {
		this.statusMenuRegApl.OPCIONES =
			'pos_' + this.statusMenuRegApl.OPCIONES;
		switch (accion) {
			case 'Primero':
				this.statusMenuRegApl.BNumReg = 1;
				this.DataDistriPlanta = this.DataDP_Q[0];
				this.modelDiagrama = JSON.parse(this.DataDP_Q[0].DIAGRAMA);
				this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
				break;

			case 'Anterior':
				this.statusMenuRegApl.BNumReg =
					this.statusMenuRegApl.BNumReg === 1
						? 1
						: this.statusMenuRegApl.BNumReg - 1;
				this.DataDistriPlanta = this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1];
				this.modelDiagrama = JSON.parse(this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1].DIAGRAMA);
				this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
				break;

			case 'Siguiente':
				this.statusMenuRegApl.BNumReg =
					this.statusMenuRegApl.BNumReg === this.DataDP_Q.length
						? this.DataDP_Q.length
						: this.statusMenuRegApl.BNumReg + 1;
				this.DataDistriPlanta =	this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1];
				this.modelDiagrama = JSON.parse(this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1].DIAGRAMA);
				this._menuregistro.setObsMenuReg(this.statusMenuRegApl);
				break;

			case 'Ultimo':
				this.statusMenuRegApl.BNumReg = this.DataDP_Q.length;
				this.DataDistriPlanta = this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1];
				this.modelDiagrama = JSON.parse(this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1].DIAGRAMA);
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
					this.DataDistriPlanta = this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1];
					this.modelDiagrama = JSON.parse(this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1].DIAGRAMA);
					this._menuregistro.setObsMenuReg(this.statusMenuRegApl);

				} else {
					this.DataDistriPlanta = {
						ID_RUTA: '',
						DESCRIPCION: '',
						ESTADO: '',
						TIPO: '',
						PRIORIDAD: '',
						SECCIONES: '{}',
						DIAGRAMA: '{}'
					};
					this.modelDiagrama = { NODOS: [{}], CONECTORES: [{}] };
				}
				this.ReadOnlyEncabDP = true;
				break;

			case 'Eliminado':
				this.DataDP_Q.splice(this.statusMenuRegApl.BNumReg - 1, 1);
				this.statusMenuRegApl.BTotReg--;
				if (this.statusMenuRegApl.BNumReg > this.statusMenuRegApl.BTotReg) {
					this.statusMenuRegApl.BNumReg = this.statusMenuRegApl.BTotReg;
				}
				if (this.DataDP_Q.length > 0) {
					this.DataDistriPlanta = this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1];
					this.modelDiagrama = JSON.parse(this.DataDP_Q[this.statusMenuRegApl.BNumReg - 1].DIAGRAMA);
				} else {
					this.DataDistriPlanta = {
						ID_RUTA: '',
						DESCRIPCION: '',
						ESTADO: '',
						TIPO: '',
						PRIORIDAD: '',
						SECCIONES: '{}',
						DIAGRAMA: '{}'
					};
					this.modelDiagrama = { NODOS: [{}], CONECTORES: [{}] };
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
		this.vecNodosSelecc = JSON.parse(this.DataDistriPlanta.SECCIONES);
		this.treeList.instance.selectRows(this.vecNodosSelecc, false);
		this.statusSeccDP = '';
		this.diagReadOnly = true;
		this.treeList.instance.repaint();

		// Trae diagrama
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
		this.seccNodosBak =  JSON.parse(JSON.stringify(this.seccNodos));
		this.seccConecBak =  JSON.parse(JSON.stringify(this.seccConec));

	}
	opEliminar(): void {
		// Confirma...
		/*alertify.confirm(
			'Eliminar ruta',
			'Desea eliminar la Ruta <i>' +
				this.DataDistriPlanta.ID_RUTA +
				' ' +
				this.DataDistriPlanta.DESCRIPCION +
				'</i> ?',
			() => {
				this.AccionEliminar();
			},
			() => {
				this.statusMenuRegApl.Status = '';
				this.statusMenuRegApl.OPCIONES = 'pos_Eliminar';
			}
		);*/
		this.confirmationService.confirm({
			message: 'Desea eliminar el Layout de Planta <i>' + this.DataDistriPlanta.ID_RUTA + ' ' + this.DataDistriPlanta.DESCRIPCION + '</i> ?',
			header: 'Eliminar layout de planta',
			icon: 'pi pi-exclamation-triangle',
			accept: () => {
				this.AccionEliminar();
			},
			reject: (type: any) => {
				this.statusMenuRegApl.Status = '';
				this.statusMenuRegApl.OPCIONES = 'pos_Eliminar';
			}
		});

	}
	// Ejecuta la eliminación
	AccionEliminar(): void {
		this._rutasdpservice
			.delete(this.DataDistriPlanta.ID_RUTA)
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
					this.ReadOnlyEncabDP = true;
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

	// Asocia los datos de las secciones
	DatItemsSeccDP(IdRuta: string): void {
		// this.s_seccdp.getSeccRutasDP(IdRuta).then( (data) => {
		// this.s_Generales
		// 	.setExecAPI('CONSULTA SECCIONES', { FILTRO: IdRuta })
		// 	.then((data) => {
		this._rutasdpservice.qsecciones().subscribe((resp) => {
			this.DatosSeccRutasDP = resp.data;
		});
	}

	onToolbarPreparing(e: any) {
		e.toolbarOptions.items.push(
		{
			location: 'before',
			widget: 'dxCheckBox', 
			options: {
				width: 400,
				text: 'Solo seleccionadas',
				onValueChanged: this.onSoloSeccSelec.bind(this)
			}
		});
  	}

	onSoloSeccSelec(e: any) {
		this.treeList.instance.forEachNode((node: any) => {
			if (!e.value) {
				node.data.IsActive = true;
			}
			else {
				if (!node.hasChildren) {
					if (!this.treeList.instance.isRowSelected(node.data.ITEM)) {
						node.data.IsActive = !e.value;
					}
				}
			}
		});
		if (!e.value) 
			this.treeList.instance.state(null); 
		else
			this.treeList.instance.option("filterValue", ["IsActive", "=", true]);
	}

	onContentReady(e: any): void {
		if (this.statusSeccDP === 'INI') {
			return;
		}

		const check = e.element.querySelectorAll('.dx-select-checkbox');
		// var store = this.treeList.instance.getDataSource().store();

		check.forEach((ele: any, ixfila: any) => {
			const inst = dxCheckBox.getInstance(ele);
			// store.load().done((items) => {
			//  let lastId = items[items.length - 1].ID + 1;
			// });
			if (inst) {
				if (this.statusSeccDP !== 'ED') {
					inst.option('disabled', true);
				} else {
					inst.option('disabled', false);
				}
			}
		});
	}

	onCellPrepared(e: any): void {
		// Solo deja seleccionables las operativas
		if (
			e.rowType == 'data' &&
			e.cellElement.querySelector('.dx-select-checkbox')
		) {
			const check = e.cellElement.querySelectorAll('.dx-select-checkbox');
			check.forEach((ele: any, ixfila: any) => {
				const inst = dxCheckBox.getInstance(ele);
				if (e.data.TIPO !== 'OPERATIVA') {
					inst.option('visible', false);
				}
			});
		}
	}

	// Marca sección y agrega componente al diagrama
	selecSeccion(e: any): void {

		// *** si ES ADICION *** //
		if (e.currentSelectedRowKeys.length > 0) {

			if (this.statusSeccDP === '' || this.eliminarNodo || e.selectedRowKeys.length === 0) return;

			const seccNueva = e.selectedRowKeys[e.selectedRowKeys.length - 1];
			let NodoSecc = this.DatosSeccRutasDP.find((s) => s.ITEM === seccNueva)!;
			
			this.elemNodo =
			{
				id: seccNueva,
				text: seccNueva + ' ' + NodoSecc.DESCRIPCION,
				type: this.NodosSvg[this.seccNodos.length % 8].id, // 'seccionpro',
				x: this.seccNodos.length > 0 ? String(Number(this.seccNodos[this.seccNodos.length - 1].x) + 80) : '50',
				y: this.seccNodos.length > 0 ? String(Number(this.seccNodos[this.seccNodos.length - 1].y) + 110) : '50',
				width: '2520',
				height: '1080'
			};
			this.seccNodos = [...this.seccNodos, this.elemNodo];
			this.seccNodosDataSource = new ArrayStore({
				key: 'id',
				data: this.seccNodos
			});
			this.seccNodosBak =  JSON.parse(JSON.stringify(this.seccNodos));

			// Adiciona conectores
			if (this.seccNodos.length > 1) {
				const seccUlt = this.seccNodos[this.seccNodos.length - 2].id;
				const elemConect =
				{
					id: 'c_' + seccUlt,
					fromId: seccUlt,
					toId: seccNueva,
					text: '',
					fromPoint: '2',
					toPoint: '3'
				};
				this.seccConec = [...this.seccConec, elemConect];
				this.seccConecDataSource = new ArrayStore({
					key: 'id',
					data: this.seccConec
				});
				this.seccConecBak =  JSON.parse(JSON.stringify(this.seccConec));
			}
		}

		// *** si ES ELIMINACION *** //
		if (e.currentDeselectedRowKeys.length > 0) {

			const seccElim = e.currentDeselectedRowKeys[0];
			
			// Elimina nodo
			/*this.seccNodosDataSource._array.forEach( (item: any, index: any) => {
				if(item.id === seccElim) this.seccNodosDataSource._array.splice(index,1);
			  });*/
			this.seccNodos.forEach( (item: any, index: any) => {
				if(item.id === seccElim) this.seccNodos.splice(index,1);
			});
			this.seccNodosDataSource = new ArrayStore({
				key: 'id',
				data: this.seccNodos
			});
			this.seccNodosBak =  JSON.parse(JSON.stringify(this.seccNodos));

			// Elimina conectores
			/*this.seccConecDataSource._array.forEach( (item: any, index: any) => {
				if(item.fromId === seccElim) this.seccConecDataSource._array.splice(index,1);
			  });*/
			this.seccConec.forEach( (item: any, index: any) => {
				if(item.fromId === seccElim) this.seccConec.splice(index,1);
			});
			this.seccConecDataSource = new ArrayStore({
				key: 'id',
				data: this.seccConec
			});
			this.seccConecBak =  JSON.parse(JSON.stringify(this.seccConec));
		}

	}

	showPopup(popupMode: any, data: any): void {
		this.popupVisible = true;

		// Visualiza todas las secciones para selección
		if (this.ModoPopUp == 'treelist') {
			this.DatosSecciones = this.DatosSeccRutasDP;
		} 
	}
	confirmClick(e: any): void {
		// Agregar nodo y expandir
		if (this.ModoPopUp === 'treelist') {
			// Busca si existe nodo de secciones
			this.eliminarNodo = false
			const seccNodo = this.treeListLP.instance.getSelectedRowsData('all');
			if (!this.treeList.instance.isRowSelected(seccNodo[0].ITEM)) {
				this.treeList.instance.selectRows([seccNodo[0].ITEM], true);
			}
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
		this.SelNodoDato = this.treeListLP.instance.getSelectedRowsData('all');
		this.SelNodoLP = e.currentSelectedRowKeys;
	}

	diagramCambios(e: any): any {
		// Valida si hubo cambios de un nodo
		if(this.diagReadOnly || this.popupVisible || this.seccNodosDataSource._array.length === 0) return;
		
		// ** Valida ELIMINACIÓN ** //
		if (this.seccNodosBak.length > this.seccNodosDataSource._array.length) {
			// Confirma cual es el que falta
			this.seccNodosBak.forEach((nodo: any) => {
				const nodBusq = this.seccNodosDataSource._array.find((s: any) => s.id === nodo.id);
				if (nodBusq === undefined) {
					this.elemNodo = nodo; // ** Nodo eliminado
					return false;
				}
				return true;
			});
			if (!this.elemNodo.type.match('pro-')) return;
			this.confirmationService.confirm({
				message: 'Desea eliminar la sección <i>' + this.elemNodo.id + ' ' + this.elemNodo.text + '</i> ?',
				header: 'Eliminar sección',
				icon: 'pi pi-exclamation-triangle',
				accept: () => {
					this.eliminarNodoDiagrama();
				},
				reject: (type: any) => {
					this.cancelEliminarNodoDiagrama();
				}
			});
			e.component.option("hasChanges", false);
			return;
		}

		// ** Valida ADICIÓN ** //
		this.elemNodo = this.seccNodosDataSource._array[this.seccNodosDataSource._array.length - 1]; // ** Nodo info
		if (this.elemNodo.type.match('pro-')) {
			let NodoSecc = this.DatosSeccRutasDP.find((s) => s.ITEM === Number(this.elemNodo.id));
			if(NodoSecc === undefined) 
			{
				// Remueva el que acaba de arrastrar (drop)
				this.seccNodosDataSource._array.pop();
				this.popupVisible = true;
				this.ModoPopUp = 'treelist';
				this.showPopup('Secciones', '')
			}
		}
		e.component.option("hasChanges", false);
	}
	eliminarNodoDiagrama(): void {
		this.eliminarNodo = true;
		this.treeList.instance.deselectRows([this.elemNodo.id]);
		this.seccNodosBak = JSON.parse(JSON.stringify(this.seccNodos));
		this.seccConecBak = JSON.parse(JSON.stringify(this.seccConec));
	}
	cancelEliminarNodoDiagrama(): void {
		this.eliminarNodo = false;
		console.log('cancel');
		this.seccNodosDataSource = new ArrayStore({
			key: 'id',
			data: JSON.parse(JSON.stringify(this.seccNodosBak))
		});
		this.seccConecDataSource = new ArrayStore({
			key: 'id',
			data: JSON.parse(JSON.stringify(this.seccConecBak))
		});
		this.seccNodos = JSON.parse(JSON.stringify(this.seccNodosBak));
		this.seccConec = JSON.parse(JSON.stringify(this.seccConecBak));
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

	dragEnd(unit: any, sizes: any ): any {
		// const ed = this.diagLay.instance.element();
		// ed.style.width = sizes[1];
		this.diagLay.instance.repaint();
	}
	onIniDiagrama(e: any): any {
		this.diagLay.instance.repaint();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	ngOnInit(): any {

		this.rutas.queryParams.subscribe((params) => {
		});

		this.PrmMenuReg = {
			TABLA_BASE: 'RUTAS_PRODUCCION',
			APLICACION: 'PRO-012',
			USUARIO: 'XTEIN',
			OPCIONES: '_INI_',
			Status: '',
			BNumReg: 0,
			BTotReg: 0,
		};

		this.DataDistriPlanta = {
			ID_RUTA: '',
			DESCRIPCION: '',
			ESTADO: '',
			TIPO: '',
			PRIORIDAD: '',
			SECCIONES: '',
			DIAGRAMA: '{}'
		};

		this.appSettingsService.getSettings().subscribe((datos) => {
			this.DatItemsSeccDP('');
			this._menuregistro.setObsMenuReg(this.PrmMenuReg);
		});

	}

	
	ngAfterViewInit(): void {
		const x = setTimeout(() => {
			this.diagLay.instance.repaint();
		}, 1000);
	}
}
