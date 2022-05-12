import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Conceptos, DLiquidacion, Empleados, HistoricoLiq, LiqCompoAct, ListaEmpleados, Novedades } from '../servicios/_empleados.class';
import { SdatosService } from '../servicios/_sdatos.service';
import 'devextreme/dist/css/dx.light.css';
import { DxDataGridComponent, DxDropDownBoxComponent, DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
import 'devextreme/dist/css/dx.light.css';
import 'devextreme/dist/css/dx.common.css';
import { DatePipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import dxCheckBox from 'devextreme/ui/check_box';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import dxDataGrid from 'devextreme/ui/data_grid';
import { SVisorService } from '../visor/models/s-visor.service';
import { GlobalsService } from '../globals.service';
import { AppsettingsService } from '../appsettings.service';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';

@Component({
  selector: 'app-liqgenerada',
  templateUrl: './liqgenerada.component.html',
  styleUrls: ['./liqgenerada.component.css'],
  providers: [DatePipe]
})
export class LiqgeneradaComponent implements OnInit {
  @ViewChild('ddLEmple', { static: false }) ddLEmple?: DxDropDownBoxComponent;
  @ViewChild('ddLConceptos', { static: false }) ddLConceptos?: DxDropDownBoxComponent;
  @ViewChild('GLiqPrestaciones', { static: false }) dataGridPres?: DxDataGridComponent;
  @ViewChild('GLiqOtros', { static: false }) dataGridOtros?: DxDataGridComponent;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid?: DxDataGridComponent;
  @ViewChild('GLiqPrestMasiva', { static: false }) gridNomina: DxDataGridComponent;

  PrmGeneracion: any;
  DFEmpleados: Empleados = new Empleados();
  GLEmpleados: any;
  isGridBoxOpened: boolean=false;
  valSeleccEmpleado: string = '';
  valSeleccEmpresa: string = '';
  valSeleccGrupo: string = '';
  gridBoxValue: number[] = [];
  gridColumns: any = ['ID_EMPLEADO', 'NOMBRE_COMPLETO'];
  gridColConceptos: any = ['ID_CONCEPTO', 'NOMBRE'];
  gridBoxValueConcepto: number[] = [];
  valSeleccConcepto: string = '';
  llaveNov: string[] = ["ID_CONCEPTO"];

  DLiquidaciones: HistoricoLiq[] = [];
  DPrestaciones: any;
  DPrestMasiva: any;
  DGrupos: any;
  DEmpresas: any;
  DNovedades: Novedades[] = [];
  DLiquidacionFinal: DLiquidacion[] = [];
  GLConceptos: any;
  filasInactivas: number[];
  campoCambio: string;
  imgImprimir: string = '../assets/printliq.png';
  imgEliminarLiq: string = '../assets/elimliq.png';
  
  colBusq: any = "GRUPO";
  colBusqEmpre: any = "ID_EMPRESA";
  loadingVisible = false;
  TotalLiquidacion: string = '';
  CalcTotLiq: number = 0;
  aceptar = false;
  showPortal = false;
  titLiquidacion: string = "";
  id_Liquidacion: string = "";
  editRow: number = -1;
  datFilaEdit: any;
  itemsInformes: MenuItem[] = [];
  gridPresExp: any;
  dropDownOptions: object;
  usuario: string;
  modoOperacion: string;
  btnCambioDias: any;
  btnEliminarLiq: any;
  valAjusteDias: number;
  conc_dev: any;
  conc_ded: any;
  cfg_concep: any;
  novedades: any;
  num_liq: string = "";

  // Nombre de archivo de exportación
  archExcelLiq: string = "";
  archExcelLiqHis: string = "";
  archExcelNomina: string = "";

  // Alert de mensajes
  displayModal: boolean = false;
  errMsg: string = "";
  errTit: string = "";
  minFecha: Date = new Date('2021,9,1');
  isVisible = false;
  type = 'info';
  message = 'msg';

  // Personalización
  elemActivos: LiqCompoAct = new LiqCompoAct(false,false,false,false,false);
  filtroMasivo: boolean = false;

  // Lista de tipos de liquidaciones
  itmListaLiq: string[] = [
    'Primas',
    'Vacaciones',
    'Cesantías',
    'Intereses a las Cesantías',
    'Liquidacion definitiva'
  ]
  
  constructor(private _sdatos: SdatosService, 
              private route: ActivatedRoute,
              private router: Router,
              public datepipe: DatePipe,
              private SVisor: SVisorService,
              public globals: GlobalsService,
              private appSettingsService: AppsettingsService) 
    { 
    const prm = { FILTRO: '' };
    this._sdatos.getDatos('LISTA EMPLEADOS',prm).subscribe((data: any)=> {
      this.GLEmpleados = JSON.parse(data);
    });
    this._sdatos.getDatos('LISTA GRUPOS',prm).subscribe((data: any)=> {
      this.DGrupos = JSON.parse(data);
    });
    this._sdatos.getDatos('LISTA EMPRESAS',prm).subscribe((data: any)=> {
      this.DEmpresas = JSON.parse(data);
    });
    this._sdatos.getDatos('LISTA CONCEPTOS',prm).subscribe((data: any)=> {
      this.GLConceptos = JSON.parse(data);
    });
    this.isGridBoxOpened = false;
    this.dropDownOptions = { width: 500 };
    this.filasInactivas = [];

    this.seleccEmpleado = this.seleccEmpleado.bind(this);
    this.onGridBoxOptionChanged = this.onGridBoxOptionChanged.bind(this);
    this.editorPreparing = this.editorPreparing.bind(this);
    this.setCellDias = this.setCellDias.bind(this);
    this.setCellBase = this.setCellBase.bind(this);
    this.setCellBaseLiq = this.setCellBaseLiq.bind(this);
    this.setCellPrima = this.setCellPrima.bind(this);
    this.setCellCesantias = this.setCellCesantias.bind(this);
    this.setCellInt = this.setCellInt.bind(this);
    this.setCellVacaciones = this.setCellVacaciones.bind(this);
    this.onCellPrepared = this.onCellPrepared.bind(this);
    this.ImprimirTablaLiq = this.ImprimirTablaLiq.bind(this);
    this.onIniciarLiqPres = this.onIniciarLiqPres.bind(this);
    this.setCellFDesde = this.setCellFDesde.bind(this);
    this.onCellPreparedNov = this.onCellPreparedNov.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.insertRow = this.insertRow.bind(this);
    this.updatingRow = this.updatingRow.bind(this);
    this.setCellConcepto = this.setCellConcepto.bind(this);
    this.customizeColumns = this.customizeColumns.bind(this);

  }

  seleccEmpleado(item: any){
    return this.valSeleccEmpleado;
  }
  seleccConcepto(item: any){
    return this.valSeleccConcepto;
  }

  onGridBoxOptionChanged(e: any){
      if (e.name === "value"){
          this.isGridBoxOpened = false;

          // Datos del empleado
          var dat = e.value;
          if(dat.length > 0)
            this.valSeleccEmpleado = dat[0].ID_EMPLEADO;
          const prm = { FILTRO: this.valSeleccEmpleado };
          this._sdatos.getDatos('DATOS CONTRATO',prm).subscribe((data: any)=> {
            this.DFEmpleados = JSON.parse(data);
          });
        }
      }
  onEmpresaSelecc(e: any){
    this.valSeleccEmpresa = e.value;
  }
  onGrupoSelecc(e: any){
    this.valSeleccGrupo = e.value.split(' > ')[0];
  }

  onGridBoxConceptoChanged(e: any){
    if (e.name === "value"){
        this.isGridBoxOpened = false;

        // Datos del empleado
        const prm = { FILTRO: '' };
        this._sdatos.getDatos('CONCEPTOS',prm).subscribe((data: any)=> {
          this.DFEmpleados = JSON.parse(data);
        });
      }
    }

  onEditorPreparingNov (e: any) {
    if (e.parentType !== "dataRow")  
        return;  
    if (e.dataField === "FECHA_HASTA") {
        console.log('editor');  
        let startDate = this.minFecha;  
        e.editorOptions.min = startDate;  
    }  
  }

  setCellFDesde(newData: any, value: any, currentRowData: any) {
    newData.FECHA_DESDE = value;
    this.minFecha = value;
  }
  setCellConcepto (rowData: any, value: any, currentRowData: any, elem: any) {
    const dcon = this.GLConceptos.find((s: any) => s.ID_CONCEPTO === value)!;
    if (dcon != undefined) {
      rowData.ID_CONCEPTO = value;
      rowData.NOMBRE = dcon.NOMBRE;
      console.log('DATOS....',elem);
    }
  }

  setCellConceptoMas(rowData: any, value: any, currentRowData: any, col: any) {
    console.log("Actualizar celda....",currentRowData,value) 
    // Asigna valor si es devengado o deducido
    if(this.conc_dev.match(col)) rowData[col] = Math.abs(value);
    if(this.conc_ded.match(col)) rowData[col] = -Math.abs(value);
    if(!this.conc_ded.match(col) && !this.conc_dev.match(col)) rowData[col] = Math.abs(value);

    // Marca la celda como cambiada
    if (!currentRowData.V__CAMBIOS.match(col+',')) {
      rowData.V__CAMBIOS = currentRowData.V__CAMBIOS + col + ',';
    }

    // Totaliza
    if(col !== "DIAS") {
      let tdev = 0;
      let tded = 0;
      for (let k = 0; k < this.conc_dev.split(',').length-1; k++) {
        const colliq = this.conc_dev.split(',')[k];
        tdev += (colliq !== col) ? Number(currentRowData[colliq]) : Math.abs(Number(value));
      }
      for (let k = 0; k < this.conc_ded.split(',').length-1; k++) {
        const colliq = this.conc_ded.split(',')[k];
        tded += (colliq !== col) ? Number(currentRowData[colliq]) : -Math.abs(Number(value));
      }
      rowData.TOTAL_DEVENGADO = tdev;
      rowData.TOTAL_DEDUCIDO = tded;
      rowData.TOTAL = tdev - Math.abs(tded);
    }

  }

  // Inserta nueva novedad
  async insertRow(e: any) {
    for (let key in e.data) {
      if ((e.data[key] === "" || e.data[key] === null || Number(e.data[key]) == 0) && key.match("ID_CONCEPTO|BASE|DIAS|TOTAL"))
      {
        this.displayModal = true;
        this.errMsg = 'Concepto o Valor debe ser diferente de nulos o ceros!';
        this.errTit = "Valores nulos";
        this.loadingVisible = false;
        e.cancel = true;
        return;
      }
    }

  }

  // Valida datos completos
  updatingRow(e: any) {
    for (let key in e.newData) {
      if ((e.newData[key] === "" || e.newData[key] === null || Number(e.newData[key]) == 0) && key.match("ID_CONCEPTO|BASE|DIAS|TOTAL"))
      {
        this.displayModal = true;
        this.errMsg = 'Concepto o Valor debe ser diferente de nulos o ceros!';
        this.errTit = "Valores nulos";
        this.loadingVisible = false;
        e.cancel = true;
        return;
      }
    }
    for (let key in e.oldData) {
      if ((e.newData[key] === "" || e.newData[key] === null || Number(e.newData[key]) == 0) && key.match("ID_CONCEPTO|BASE|DIAS|TOTAL"))
      {
        this.displayModal = true;
        this.errMsg = 'Concepto o Valor debe ser diferente de nulos o ceros!';
        this.errTit = "Valores nulos";
        this.loadingVisible = false;
        e.cancel = true;
        return;
      }
    }
  }

  insertRowLiq(e: any) {
    this.AjusteLiquidacion(e.data, e.data, e.data, this.id_Liquidacion);
  }
  updateRowLiq(e: any) {
    this.AjusteLiquidacion(e.data, e.data, e.data, this.id_Liquidacion);
  }
  deleteRowLiq(e: any) {
    e.data.OPCION = 'eliminar';
    this.AjusteLiquidacion(e.data, e.data, e.data, 'eliminar');
  }


  // Evita eliminar ciertas filas
  onCellPreparedLiq(e: any) {
    if (e.columnIndex == 0 && e.rowType == "data") {  
      if (e.data.OPCION == 'FIJA')  // estas filas no se permiten eliminar 
      { 
        const delButton = e.cellElement.getElementsByClassName('dx-link-delete');
        if (delButton !== undefined) delButton[0].remove();
      }
    }  
    if (e.rowType === 'totalFooter') {
      if (e.summaryItems.length > 0 && e.summaryItems[0].value > 0) {
        e.cellElement.querySelector(".dx-datagrid-summary-item").style.fontWeight = 'bold';
        e.cellElement.querySelector(".dx-datagrid-summary-item").style.color = '#064e8d';
        e.cellElement.querySelector(".dx-datagrid-summary-item").style.fontSize = '20px';
      }
    }
  }

  // Evita eliminar ciertas filas
  onCellPreparedMasiva(e: any) {
    if (e.rowType === 'totalFooter') {
      if (e.summaryItems.length > 0 && e.summaryItems[0].value != 0) {
        e.cellElement.querySelector(".dx-datagrid-summary-item").style.fontWeight = 'bold';
        e.cellElement.querySelector(".dx-datagrid-summary-item").style.color = '#064e8d';
        e.cellElement.querySelector(".dx-datagrid-summary-item").style.fontSize = '20px';
      }
    }
    if (e.rowType === "data" && e.column.dataField.match("TOTAL_DEVENGADO|TOTAL_DEDUCIDO")) {
      e.cellElement.style.backgroundColor = "#cae6fc";
    }
    if (e.rowType === "data" && e.column.dataField === "TOTAL") {
      e.cellElement.style.backgroundColor = "#90cd93";
      e.cellElement.style.fontWeight = 'bold';
    }
    if (e.rowType === 'header') {
      e.cellElement.style.backgroundColor = "rgb(17, 65, 128)";
      e.cellElement.style.color = 'white';
      e.cellElement.style.textAlign = 'center';
    }
    if(e.rowType === "data" && !e.column.dataField.match("TOTAL_DEVENGADO|TOTAL_DEDUCIDO|TOTAL|ID_EMPLEADO|APELLIDO_COMPLETO") ) {
      if(e.data.V__CAMBIOS !== "")
        if (e.data.V__CAMBIOS.match(e.column.dataField+',')) {
          e.cellElement.style.background = "lightsalmon" 
        }
    }
  }

    // Nueva
  clickNueva(e: any) {
    // Prepara nueva liquidación

  }
  clickNuevaLiq(e: any) {

  }
  clickHome(e: any) {
    this.router.navigate(['/principal']);
  }
  clickBuscarLiq(e: any) {
    // Vista/Zoom de las liquidaciones generadas
    const prm = { 
      ID_LIQ: this.id_Liquidacion 
    };
    this._sdatos.getDatos('CONSULTA LIQUIDACIONES',prm).subscribe((data: any)=> {
      this.SVisor.DatosVisor = JSON.parse(data);
      this.SVisor.PrmVisor = {
        Titulo: this.titLiquidacion,
        Columnas: [
          { Nombre: 'FECHA', Titulo: 'Fecha gen' },
          { Nombre: 'FECHA_INICIAL', Titulo: 'Fecha Inicial' },
          { Nombre: 'FECHA_FINAL', Titulo: 'Fecha final' },
          { Nombre: 'DOCUMENTO', Titulo: 'Documento' },
          { Nombre: 'NUM_EMPL', Titulo: 'Num Empl.' },
          { Nombre: 'FILTRO', Titulo: 'Filtro' },
        ]
      };
      this.SVisor.setObsVisor(true);
    });

  }
  
  // Pre-liquida
  clickLiquida(e: any) {
    this.gridPresExp = Object.assign({}, this.dataGridPres);

    // Valida que estén completos los datos
    if(this.DFEmpleados.FECHA_INICIAL === undefined || this.DFEmpleados.FECHA_FINAL === undefined ||
       this.DFEmpleados.FECHA_INI_BASE === undefined || this.DFEmpleados.FECHA_FIN_BASE === undefined)
    {
      this.displayModal = true;
      this.errMsg = `Debe seleccionar un rango de fechas, Fechas de Liquidacion y Fechas de Base!`;
      this.errTit = "Faltan datos";
      this.loadingVisible = false;
      return;
    }

    // inactiva checks de asociacion salario básico
    const check = document.querySelectorAll('.dx-checkbox');
    check.forEach((ele: any) => {
      const inst = dxCheckBox.getInstance(ele);
      if (inst) {
          inst.option('value', false);
      }
    });

    this.showLoadPanel();

    // Valida si hay filtro masivo
    if (this.valSeleccEmpleado == "") {
      this.filtroMasivo = true;
    }
    else {
      this.filtroMasivo = false;
    }
    const fD = this.datepipe.transform(this.DFEmpleados.FECHA_INICIAL, 'MM/dd/yyyy');  
    const fH = this.datepipe.transform(this.DFEmpleados.FECHA_FINAL, 'MM/dd/yyyy');  
    const fBD = this.datepipe.transform(this.DFEmpleados.FECHA_INI_BASE, 'MM/dd/yyyy');  
    const fBH = this.datepipe.transform(this.DFEmpleados.FECHA_FIN_BASE, 'MM/dd/yyyy');  
    const prm = { ID_EMPLEADO: this.valSeleccEmpleado, 
                  FECHA_DESDE: fD, 
                  FECHA_HASTA: fH, 
                  FECHA_INI_BASE: fBD, 
                  FECHA_FIN_BASE: fBH, 
                  ID_LIQ: this.id_Liquidacion, 
                  EMPRESA: this.valSeleccEmpresa,
                  GRUPO: this.valSeleccGrupo,
                  GEN_NOM: this.DFEmpleados.GEN_NOM,
                  ELIM_LIQ: this.DFEmpleados.ELIM_LIQ,
                  COMENTARIOS: this.DFEmpleados.COMENTARIOS
                };
    console.log(prm);
    this._sdatos.getDatos('PRE LIQUIDACION',prm).subscribe((data: any)=> {
      
      if (data === null) {
        this.displayModal = true;
        this.errMsg = `Error Liquidando base. <br /><i>Nulos!</i> : `+JSON.stringify(prm);
        this.errTit = "Liquidando base";
        this.loadingVisible = false;
        return;
      }

      var datRes = JSON.parse(data);
      if (datRes[0].ErrMensaje != '')
      {
        this.displayModal = true;
        this.errMsg = `Error Liquidando base. <br /><i>` + datRes[0].ErrMensaje + `</i>`;
        this.errTit = "Liquidando base";
        this.loadingVisible = false;
        return;
      }

      // Asigna datos del histórico
      this.DLiquidaciones = JSON.parse(data);

      // Numero y consecutivo liquidacion
      this.num_liq = this.DLiquidaciones[0].NUM_LIQ?.replace('|',' ')?? '';
      this.titLiquidacion = this.titLiquidacion.substring(0,this.titLiquidacion.indexOf('[') < 0 ? this.titLiquidacion.length : this.titLiquidacion.indexOf('[')-1) + ' [' + this.num_liq + ']';

      // Datos globales de la liquidación
      this.globals.dat_liq =  { id_apl: this.DLiquidaciones[0].ID_APL?? '', 
                                id_liq: this.DLiquidaciones[0].ID_LIQ?? '', 
                                nom_liq: this.id_Liquidacion, 
                                filtro: this.valSeleccEmpleado,
                                num_liq: this.DLiquidaciones[0].NUM_LIQ?.replace('|',' ')?? '',
                                id_rep: this.DLiquidaciones[0].ID_RPT?? ''
                              };

      // Liquida prestaciones
      const prmLiq =  { ID_EMPLEADO: this.valSeleccEmpleado, 
                        FECHA_DESDE: fD, 
                        FECHA_HASTA: fH, 
                        NUM_LIQ: this.DLiquidaciones[0].NUM_LIQ, 
                        ID_LIQ: this.id_Liquidacion,
                        EMPRESA: this.valSeleccEmpresa ?? "",
                        GRUPO: this.valSeleccGrupo ?? ""
                      };
      console.log(prmLiq);
      this._sdatos.getDatos('LIQUIDACION PRESTACIONES',prmLiq).subscribe((data: any)=> {
        
        var datRes = JSON.parse(data);
        if (datRes == null)
        {
          this.displayModal = true;
          this.errMsg = `Error en el cálculo de la liquidación. Nulo</i>`;
          this.errTit = "Error de cálculo";
          this.loadingVisible = false;
          return;
        }
        if (datRes[0].ErrMensaje != '')
        {
          this.displayModal = true;
          this.errMsg = `Error en el cálculo de la liquidación. <br /><i>` + datRes[0].ErrMensaje + `</i>`;
          this.errTit = "Error de cálculo";
          this.loadingVisible = false;
          return;
        }

        // Si es un solo empleado
        if (!this.filtroMasivo) {

          this.DLiquidacionFinal = datRes;
          const valLiq = JSON.parse(data);
          this.TotalLiquidacion = valLiq[0].TOTAL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        }

        // Si es masiva 
        else {
          this.DPrestMasiva = JSON.parse(data);
        }

        this.loadingVisible = false;

      });
    });
  }

  consultaLiquidacion(NumLiq: string) {
    this.showLoadPanel();

    const prmLiq =  {  
      NUM_LIQ: NumLiq, 
      ID_LIQ: this.id_Liquidacion
    };
    console.log(prmLiq);
    this._sdatos.getDatos('CONSULTA LIQUIDACIONES',prmLiq).subscribe((data: any)=> {

      switch (this.id_Liquidacion) {
        case "GHU-027":
          this.id_Liquidacion = 'Nómina';
          break;
      
        default:
          break;
      }

      var datRes = JSON.parse(data);
      if (datRes == null)
      {
        this.displayModal = true;
        this.errMsg = `Error en la consulta de la liquidación. Nulo</i>`;
        this.errTit = "Error consultando";
        this.loadingVisible = false;
        return;
      }
      if (datRes[0].ErrMensaje != '')
      {
        this.displayModal = true;
        this.errMsg = `Error en la consulta de la liquidación. <br /><i>` + datRes[0].ErrMensaje + `</i>`;
        this.errTit = "Error consultando";
        this.loadingVisible = false;
        return;
      }

      // Modo consulta
      if (datRes[0].MODO === 'masiva')
        this.filtroMasivo = true;
      else
        this.filtroMasivo = false;

      // Si es un solo empleado
      if (!this.filtroMasivo) {

        this.DLiquidaciones = datRes[0].HISTORICO;
        this.DLiquidacionFinal = datRes[0].PRESTACIONES;
        const valLiq = datRes[0].PRESTACIONES;
        this.valSeleccEmpleado = datRes[0].ID_EMPLEADO;
        this.TotalLiquidacion = valLiq[0].TOTAL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Datos globales de la liquidación
        this.globals.dat_liq =  { id_apl: datRes[0].ID_APL?? '', 
                                  id_liq: datRes[0].ID_LIQ?? '', 
                                  nom_liq: this.id_Liquidacion, 
                                  filtro: this.valSeleccEmpleado,
                                  num_liq: datRes[0].NUM_LIQ?.replace('|',' ')?? '',
                                  id_rep: datRes[0].ID_RPT?? ''
                                };
      }

      // Si es masiva 
      else {
        const datRes = JSON.parse(data);
        this.DPrestMasiva = datRes[0].NOMINA;

        // Datos globales de la liquidación
        this.globals.dat_liq =  { id_apl: datRes[0].ID_APL?? '', 
                                  id_liq: datRes[0].ID_LIQ?? '', 
                                  nom_liq: this.id_Liquidacion, 
                                  filtro: this.valSeleccEmpleado,
                                  num_liq: datRes[0].NUM_LIQ?.replace('|',' ')?? '',
                                  id_rep: datRes[0].ID_RPT?? ''
                                };

        // Conceptos DV y DD
        const concep = JSON.parse(datRes[0].CONCEPTOS);
        this.conc_dev = concep.DEVENGADOS;
        this.conc_ded = concep.DEDUCIDOS;

        // Configuración conceptos extendidos
        this.cfg_concep = datRes[0].CONFIG_CONCEPTOS;

        // Novedades detalladas
        this.novedades = datRes[0].NOVEDADES;
      }

      this.btnCambioDias = {
        icon: 'edit',
        type: 'default',
        onClick: this.ajusteDias.bind(this)
      }
      this.btnEliminarLiq = {
        icon: 'trash',
        onClick: this.ajusteDias.bind(this)
      }

      // Parámetros
      this.DFEmpleados.ID_EMPLEADO = datRes[0].ID_EMPLEADO;
      this.DFEmpleados.NOMBRE_COMPLETO = datRes[0].NOMBRE_COMPLETO;
      this.DFEmpleados.FECHA_INICIAL = datRes[0].FECHA_INICIAL;
      this.DFEmpleados.FECHA_FINAL = datRes[0].FECHA_FINAL;
      this.loadingVisible = false;
    });

  }

  onToolbarPreparing(e: any) {
    let toolbarItems = e.toolbarOptions.items;
  
    e.toolbarOptions.items.unshift(
      {
          location: 'before',
          widget: 'dxCheckBox', 
          options: {
              width: 400,
              text: 'Asignar Salario Básico como valor base',
              onValueChanged: this.onValueChangeBasicoGen.bind(this)
          }
      },
      {
        location: 'before',
        widget: 'dxCheckBox',
        options: {
            width: 400,
            text: 'Asignar Salario Básico a valores nulos/cero',
            onValueChanged: this.onValueChangeBasicoCero.bind(this)
        }
      },
      {
        location: 'before',
        template: 'cambioDias'
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'print',
          onClick: this.ImprimirTablaLiq.bind(this)
        }
      }
    );

    // Modifies an existing item
    toolbarItems.forEach((item: any) => {                    
      if (item.name === "searchPanel") {
        item.location = "before";
      }
    });

  }

  // Asignación de Salario Básico como Valor Base de liquidación
  onValueChangeBasicoGen(e: any) {
    if(e.value) 
    {
      this.DPrestMasiva.forEach((el: any) => {
        el.BASE = el.BASICO;
        el.BASE_CAMBIO = true;
        this.AjusteLiquidacion(el, el.BASICO, el, 'base');
      });
    }
    else
    {
      this.DPrestMasiva.forEach((el: any) => {
        el.BASE = el.BASE_ORG;
        el.BASE_CAMBIO = false;
        this.AjusteLiquidacion(el, el.BASE, el, 'base');
      });
    }
  }
  // Asignación de Salario Básico como Valor Base de liquidación
  onValueChangeBasicoCero(e: any) {
    if(e.value) 
    {
      this.DPrestMasiva.forEach((el: any) => {
        if(el.BASE === null || el.BASE === 0 ) 
        {
          el.BASE = el.BASICO;
          el.BASE_CAMBIO = true;
          this.AjusteLiquidacion(el, el.BASICO, el, 'base');
        }
      });
    }
    else
    {
      this.DPrestMasiva.forEach((el: any) => {
        if(el.BASE_CAMBIO) 
        {
          el.BASE = el.BASE_ORG;
          el.BASE_CAMBIO = false;
          this.AjusteLiquidacion(el, el.BASE, el, 'base');
        }
      });
    }
  }

  ImprimirTablaLiq(e: any) {
    const check = document.querySelectorAll("[id^='GLiqPrestMasiva']");
    var instg;
    check.forEach((ele: any) => {
      instg = dxDataGrid.getInstance(ele);
    });
    
    const doc = new jsPDF();
    exportDataGridToPdf({
        jsPDFDocument: doc,
        component: instg
    }).then(() => {
        doc.save('LiqPrestaciones.pdf');
    })
  }

  onKeyDown(event: any) {
  }

  // Si hay modificación de días o base de liquidación
  // *** MASIVO ***
  setCellDias (newData: any, value: any, currentRowData: any) {
    currentRowData.DIAS = value;
    this.AjusteLiquidacion(newData, value, currentRowData, 'dias');
  }
  setCellBase (newData: any, value: any, currentRowData: any) {
    currentRowData.BASE = value;
    this.AjusteLiquidacion(newData, value, currentRowData, 'base');
  }

  // Si hay modificación de días o base de liquidación
  // *** INDIVIDUAL ***
  setCellPrima(newData: any, value: any, currentRowData: any) {
    currentRowData.PRIMA = value;
    this.AjusteLiquidacion(newData, value, currentRowData, 'PRIMA');
  }
  setCellCesantias(newData: any, value: any, currentRowData: any) {
    currentRowData.CESANTIAS = value;
    this.AjusteLiquidacion(newData, value, currentRowData, 'CESANTIAS');
  }
  setCellInt(newData: any, value: any, currentRowData: any) {
    currentRowData.INTERESES = value;
    this.AjusteLiquidacion(newData, value, currentRowData, 'INTERESES');
  }
  setCellVacaciones(newData: any, value: any, currentRowData: any) {
    currentRowData.VACACIONES = value;
    this.AjusteLiquidacion(newData, value, currentRowData, 'VACACIONES');
  }
  setCellBaseLiq(newData: any, value: any, currentRowData: any) {
    newData.BASE = value;
    newData.TOTAL = value;
    this.campoCambio = "BASE";
  }
  onEditingStartLiqInd(e: any) {
    if(e.data.CONCEPTO === 'Liquidado') {
      e.cancel = true;
    }
  }
  onRowPreparedLiqInd(e: any){
    if (e.rowType === "data") {
      if(e.data.CONCEPTO === "Liquidado"){
          e.rowElement.style.backgroundColor = "lightsalmon";
          e.rowElement.style.fontWeight = "bold";
          }
      }
  }
  onEditorPreparing(e: any) {
    if (e.dataField === undefined) return;
    if (e.parentType == "dataRow") {
        e.editorOptions.onFocusIn = (args: any) => {            
          var input = args.element.querySelector(".dx-texteditor-input");  
          if(input != null){  
              input.select();  
          }  
        }
      }
  }

  // Liquida ajuste
  AjusteLiquidacion(newData: any, value: any, currentRowData: any, colmodif: string) {
    const prmLiq =  { 
      ID_EMPLEADO: this.valSeleccEmpleado, 
      DATOS_CAMBIO: currentRowData, 
      DATOS_TOTAL: !this.filtroMasivo ? this.DLiquidacionFinal : currentRowData, //this.DPrestMasiva,
      ID_LIQ: this.id_Liquidacion,
      NUM_LIQ: !this.filtroMasivo ? this.num_liq : this.num_liq
    };
    console.log("Antes de ajuste liq....",prmLiq);
    this._sdatos.getDatos('AJUSTE PRESTACIONES',prmLiq).subscribe((data: any)=> {
      console.log("Despues de ajuste liq....",data);
      const valLiq = JSON.parse(data);
      if (valLiq[0].ErrMensaje != '')
      {
        this.displayModal = true;
        this.errMsg = `Error de ajuste en la liquidación de ` + colmodif + `. <br /><i>` + valLiq[0].ErrMensaje + `</i>`;
        this.errTit = "Error de ajuste";
        this.loadingVisible = false;
        return;
      }

      if (!this.filtroMasivo) {
        this.TotalLiquidacion = valLiq[0].TOTAL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.DLiquidacionFinal = JSON.parse(data);

        // Asigna sección de totales
        /*this.DFEmpleados.TVPRIMA = valLiq[1].PRIMA;
        this.DFEmpleados.TVCES = valLiq[1].CESANTIAS;
        this.DFEmpleados.TVINT = valLiq[1].INTERESES;
        this.DFEmpleados.TVVAC = valLiq[1].VACACIONES;
        this.DFEmpleados.TDPRIMA = valLiq[2].PRIMA;
        this.DFEmpleados.TDCES = valLiq[2].CESANTIAS;
        this.DFEmpleados.TDINT = valLiq[2].INTERESES;
        this.DFEmpleados.TDVAC = valLiq[2].VACACIONES;
        this.DFEmpleados.TTOT = valLiq[0].TOTAL;*/
      }
      else {
        const dnom = this.DPrestMasiva.find((s: any) => s.ID_EMPLEADO === valLiq[0].ID_EMPLEADO)!;
        if (dnom !== undefined) {
          dnom[valLiq[0].ID_CONCEPTO] = valLiq[0].VALOR;

          let tdev = 0;
          let tded = 0;
          for (let k = 0; k < this.conc_dev.split(',').length-1; k++) {
            const colliq = this.conc_dev.split(',')[k];
            tdev += Math.abs(dnom[colliq]);
          }
          for (let k = 0; k < this.conc_ded.split(',').length-1; k++) {
            const colliq = this.conc_ded.split(',')[k];
            tded += Math.abs(dnom[colliq]);
          }
          dnom.TOTAL_DEVENGADO = tdev;
          dnom.TOTAL_DEDUCIDO = tded;
          dnom.TOTAL = tdev - Math.abs(tded);
  
        }
        // Valida si hubo cambio de valor
        /*if(colmodif === 'dias') {
          this.DPrestMasiva[ix].DIAS = value;
          if (this.DPrestMasiva[ix].DIAS != this.DPrestMasiva[ix].DIAS_ORG)
            this.DPrestMasiva[ix].DIAS_CAMBIO = true;
        }
        else {
          this.DPrestMasiva[ix].BASE = value;
          if (this.DPrestMasiva[ix].BASE != this.DPrestMasiva[ix].BASE_ORG)
            this.DPrestMasiva[ix].BASE_CAMBIO = true;
        }
        this.DPrestMasiva[ix].TOTAL = valLiq[0].TOTAL;*/

  
      }

      this.type = 'success';
      this.message = "Empleado actualizado!";
      this.isVisible = true;
  });
  }

  // Si hubo cambios, señalar
  onCellPrepared(e: any) {
    if(e.rowType === "data" && e.column.dataField === "DIAS" ) {
        if(this.DPrestMasiva[e.data.ITEM-1].DIAS_CAMBIO)
          e.cellElement.style.background = "lightsalmon" 
        else
          e.cellElement.style.background = "white";
        // Tracks the `Amount` data field
        /*e.watch(function() {
            return e.data.DIAS;
        }, function() {
            e.cellElement.style.background = e.data.DIAS != dias ? "green" : "red";
        })*/
    }
    if(e.rowType === "data" && e.column.dataField === "BASE" ) {
      if(this.DPrestMasiva[e.data.ITEM-1].BASE_CAMBIO)
        e.cellElement.style.background = "lightsalmon" 
      else  
        e.cellElement.style.background = "white";
    }
  }

  onFocusedCellChanged(event: any) {
    this.editRow = event.rowIndex;
  }

  editorPreparing(e: any) {
    e.editorOptions.onValueChanged((args: any) => {  
      this.datFilaEdit = e.row.data;
    });
  }

  updateRow(e: any) {
    /*for (let key in e.newData) {
      this.datFilaEdit = e.row.data;
    }*/
  }

  // Actualiza dato modificado -- Liquidación Masiva
  updateRowMas(e: any) {
    // Actualiza BD
    this.AjusteLiquidacion(e.data, e.data, e.data, this.id_Liquidacion);
  }

  onIniciarLiqPres(e: any) {
    
  }

  onToolbarPreparingNov(e: any) {
    let toolbarItems = e.toolbarOptions.items;
  
    e.toolbarOptions.items.unshift(
      {
          location: 'before',
          template: 'titNovedades'
      }
    );
  }
  onInitNewRowNov(e: any) {
    //e.data.ID_EMPLEADO = this.DFEmpleados.ID_EMPLEADO;
    //e.data.NOMBRE_COMPLETO = this.DFEmpleados.NOMBRE_COMPLETO;
    e.data.ID_CONCEPTO = "";
    e.data.BASE = 0;
    e.data.DIAS = 0;
    e.data.TOTAL = 0;
    e.data.OPCION = '';
    e.data.NOMBRE = '';
  }
  onSelectionChanged(selectedRowKeys: any, cellInfo: any, dropDownBoxComponent: any) {
    cellInfo.setValue(selectedRowKeys[0]);
    if(selectedRowKeys.length > 0) {
        dropDownBoxComponent.close();
    }
  }  

  onContentReady(e: any) {  
    let check = e.element.querySelectorAll('.dx-header-row .dx-checkbox');  
    /*check.onclick(() => {  
          alert(check.dxCheckBox('instance').option('value'));  
    });*/  
}  
onValueChangedTodo(e: any) {
  if (e.value)
    this.dataGridOtros?.instance.selectAll();
  else
    this.dataGridOtros?.instance.deselectAll();
}
  onCellPreparedNov(e: any) {
		// Solo deja seleccionables las operativas
    /*if(e.rowType === 'header' && e.column.command == "select") {  
      var commandCell = e.cellElement;  
      commandCell.innerHTML = '<dx-check-box class="dx-show-invalid-badge dx-checkbox dx-checkbox-checked dx-widget" role="checkbox" aria-checked="true" tabindex="0"><input type="hidden" value="false"><div class="dx-checkbox-container"><span class="dx-checkbox-icon"></span></div></dx-check-box>';  
    }  */
		if (
			e.rowType == 'data' &&
			e.cellElement.querySelector('.dx-select-checkbox')
		) {
			let check = e.cellElement.querySelectorAll('.dx-select-checkbox');
			check.forEach((ele: any, ixfila: any) => {
				const inst = dxCheckBox.getInstance(ele);
				if (e.data.ID_CONCEPTO != 'GENERAL') {
          inst.option('visible', false);
          this.filasInactivas.push(e.data.ID);
          //e.cellElement.off();
        }
			});
		}
	}
  onSelectionChangedNov(e:any){  
      var disabledKeys = e.currentSelectedRowKeys.filter((i: any) => this.filasInactivas.indexOf(i) > -1);
      if (disabledKeys.length > 0)  
         e.component.deselectRows(disabledKeys);  
  }  

  // Cambio de datos en la liquidacion
  editorPreparing2(e: any) {
    if (e.parentType == 'dataRow' && e.dataField.match('PRIMA|CESANTIAS|INTERESES|VACACIONES|DIAS|BASE')) 
    {  
      e.editorOptions.onKeyDown = (k : any) => {  
        if (k.event.key.match('Enter|Tab')) {
          this.aceptar = true;
        }
      };
      e.editorOptions.onFocusOut = (x: any) => {
        this.aceptar = true;
      }
      if(this.aceptar) {
        const prmLiq =  { 
                          ID_EMPLEADO: this.valSeleccEmpleado, 
                          DATOS_CAMBIO: e.row.data, 
                          DATOS_TOTAL: this.DPrestaciones,
                          ID_LIQ: this.id_Liquidacion
                        };
        this._sdatos.getDatos('AJUSTE PRESTACIONES',prmLiq).subscribe((data: any)=> {
          const valLiq = JSON.parse(data);

          if (!this.filtroMasivo) {
              this.TotalLiquidacion = valLiq[0].TOTAL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              this.DPrestaciones = JSON.parse(data);

              // Asigna sección de totales
              this.DFEmpleados.TVPRIMA = valLiq[1].PRIMA;
              this.DFEmpleados.TVCES = valLiq[1].CESANTIAS;
              this.DFEmpleados.TVINT = valLiq[1].INTERESES;
              this.DFEmpleados.TVVAC = valLiq[1].VACACIONES;
              this.DFEmpleados.TDPRIMA = valLiq[2].PRIMA;
              this.DFEmpleados.TDCES = valLiq[2].CESANTIAS;
              this.DFEmpleados.TDINT = valLiq[2].INTERESES;
              this.DFEmpleados.TDVAC = valLiq[2].VACACIONES;
              this.DFEmpleados.TTOT = valLiq[0].TOTAL;
            }
          else {
            const ix = e.row.data.ITEM - 1;
            this.DPrestMasiva[ix].TOTAL = valLiq[0].TOTAL;
          }
          });
          this.aceptar = false;
      };

      /*e.editorElement.dxTextBox('instance').option('onValueChanged', (args: any) => {
          console.log(args);
      });*/  
      //e.event.preventDefault();  
      //e.event.stopPropagation();          

    }
  }

  // Ajuste de días general
  ajusteDias(e: any) {
    // Actualiza la tabla con los días señalados
    this.DPrestMasiva.forEach((ele: any) => {
      ele.DIAS = this.valAjusteDias;
    });

    // Actualiza en base de datos

  }

  customizeColumns(columns: any) {
    if (this.gridNomina===undefined) return;
    var items = this.gridNomina.instance.getDataSource().items();  
    columns.forEach((col: any)=> {  
      if(typeof items[0][col.dataField] === "number"){  
        col.dataType = "number";  
        col.format = "#,##0";  
      }  
      if(col.dataField.match("ErrMensaje|V__CAMBIOS")) {  
        col.visible = false;
      }
      if(col.dataField === "TOTAL"){  
        col.fixed = true;
        col.fixedPosition = "right";
      }
      if(col.dataField.match("TOTAL_DEVENGADO|TOTAL_DEDUCIDO|TOTAL|ID_EMPLEADO|APELLIDO_COMPLETO|BASICO|TRANSPORTE")){  
        col.allowEditing = false;
      }
      if(!col.dataField.match("TOTAL_DEVENGADO|TOTAL_DEDUCIDO|TOTAL|ID_EMPLEADO|APELLIDO_COMPLETO|BASICO|TRANSPORTE")){  
        col.setCellValue = (rowData: any, value: any, currentRowData: any) => {
          this.setCellConceptoMas(rowData, value, currentRowData, col.dataField);
        };

        // Header a las columnas
        const dcon = this.cfg_concep.find((s: any) => s.ID_CONCEPTO === col.dataField)!;
        if (dcon != undefined) {
          col.caption = '[' + col.dataField + '] ' + dcon.NOMBRE;
          col.width = "150";
        }
      }
    })  
  }
  onContentReadyMasiva(e: any) {
    if (!e.component.__columndded) {
      e.component.__columndded = true;
      e.component.addColumn(this.columnOptions);
    }
  }
  columnOptions: object = {
    name: "Acciones",
    width: 100,
    dataField: '',
    cellTemplate: 'cellAcciones',
    visibleIndex: 2
  };

  onExporting(e: any) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Liquidaciones');
    
    exportDataGrid({
      component: e.component,
      worksheet: worksheet,
      autoFilterEnabled: true
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), this.archExcelNomina);
      });
    });

    e.cancel = true;
  }

  imprimirLiquida(filtro: any) {
    const prmLiq = {Datos:  { clid: this.globals.clid, 
                              IdLiq: this.globals.dat_liq.id_liq, 
                              IdRpt: this.globals.dat_liq.id_rep, 
                              NumLiq: this.globals.dat_liq.num_liq, 
                              Filtro: "$"+filtro+"$" 
                            }};
    var prm_safe = encodeURIComponent(JSON.stringify(prmLiq));
    window.open('/visorrep?prm_rpt='+prm_safe, '_blank');

    //this.router.navigateByUrl('/visorrep?id=REPORTE');
    //this.router.navigate(['/visorrep']);

  }
  
  onShown() {
    /*setTimeout(() => {
        this.loadingVisible = false;
    }, 3000);*/
  }

  onHidden() {
  }

  showLoadPanel() {
    this.DLiquidaciones = [];
    this.loadingVisible = true;
  }

  ngOnInit(): void {
    this.usuario = this.globals.nom_usr;
    var transaccion = "";

    debugger
    //this.router.navigate(['/liqgenerada', {TipoLiq: IdLiq, NomLiq: NomLiq, PrmLiq: JSON.stringify({ NumLiq: numliq, ID_EMPLEADO: 'consulta'})}], {skipLocationChange: true});

    // Confecciona los elementos de acuerdo al tipo de liquidacion
    this.route.params.subscribe(parameter => {
      this.titLiquidacion = parameter['NomLiq'];
      this.id_Liquidacion = parameter['TipoLiq'];
      this.PrmGeneracion  = JSON.parse(parameter['PrmLiq']);
      this.globals.tit_pag = this.titLiquidacion;
  
      // Filtro de generación
      if (this.PrmGeneracion.ID_EMPLEADO != 'consulta') {
        this.DFEmpleados.FECHA_INICIAL = this.PrmGeneracion.FECHA_DESDE;
        this.DFEmpleados.FECHA_FINAL = this.PrmGeneracion.FECHA_HASTA;
        this.DFEmpleados.FECHA_INI_BASE = this.PrmGeneracion.FECHA_INI_BASE;
        this.DFEmpleados.FECHA_FIN_BASE = this.PrmGeneracion.FECHA_FIN_BASE;
        this.DFEmpleados.ID_EMPLEADO = this.PrmGeneracion.ID_EMPLEADO;
        this.DFEmpleados.NOMBRE_COMPLETO = this.PrmGeneracion.NOMBRE;
        this.DFEmpleados.ID_EMPRESA = this.PrmGeneracion.EMPRESA;
        this.DFEmpleados.GRUPO = this.PrmGeneracion.GRUPO;
        this.DFEmpleados.CONTRATO = this.PrmGeneracion.CONTRATO;
        this.DFEmpleados.DIAS = this.PrmGeneracion.DIAS;
        this.DFEmpleados.ID_CAUSA = this.PrmGeneracion.ID_CAUSA;
        this.DFEmpleados.COMENTARIOS = this.PrmGeneracion.COMENTARIOS;
        this.DFEmpleados.GEN_NOM = this.PrmGeneracion.GEN_NOM;
        this.DFEmpleados.ELIM_LIQ = this.PrmGeneracion.ELIM_LIQ;
        this.valSeleccEmpleado = this.PrmGeneracion.ID_EMPLEADO;
        this.valSeleccEmpresa = this.PrmGeneracion.EMPRESA;
        this.valSeleccGrupo = this.PrmGeneracion.GRUPO;
        this.modoOperacion = 'generacion';
        transaccion = parameter['TipoLiq'];
      }
      else
      {
        this.num_liq = this.PrmGeneracion.NumLiq;
        this.titLiquidacion = parameter['NomLiq'] + ' [' + this.PrmGeneracion.NumLiq + ']';
        this.consultaLiquidacion(this.PrmGeneracion.NumLiq);
        this.modoOperacion = 'consulta';
        transaccion = parameter['NomLiq'];
      }
  
      switch (transaccion) {
        case 'Primas':
        case 'Liquidación de Primas':
          this.elemActivos.Primas = true;
          this.archExcelLiq = "LiqPrima";
          this.archExcelLiqHis = "LiqHisBasePrima";
          this.archExcelNomina = "LiqPrima.xlsx";
          break;
      
        case 'Cesantías':
        case 'Liquidación de Cesantías':
          this.elemActivos.Cesantias = true;
          this.archExcelLiq = "LiqCesantias";
          this.archExcelLiqHis = "LiqHisBaseCes";
          this.archExcelNomina = "LiqCesantias.xlsx";
          break;
      
        case 'Int Cesantías':
        case 'Liquidación de Int Cesantías':
          this.elemActivos.IntCesantias = true;
          this.archExcelLiq = "LiqIntCesantias";
          this.archExcelLiqHis = "LiqHisBaseIntCes";
          this.archExcelNomina = "LiqIntCesantias.xlsx";
          break;
      
        case 'Vacaciones':
        case 'Liquidación de Vacaciones':
          this.elemActivos.Vacaciones = true;
          this.archExcelLiq = "LiqVacaciones";
          this.archExcelLiqHis = "LiqHisBaseIntVac";
          this.archExcelNomina = "LiqVacaciones.xlsx";
          break;
        
        case 'Contrato':
        case 'Liquidación de Contrato':
          this.elemActivos.Contrato = true;
          break;
          
        default:
          this.archExcelLiq = "LiqNomina";
          this.archExcelLiqHis = "LiqHisNomina";
          break;
      }
      
    });

    // Menú de informes
    this.itemsInformes = [
      {
          label: 'Imprimir',
          icon: 'pi pi-flag'
      },
      {
          label: 'Liqudación',
          icon: 'pi pi-file'
      }
    ];

  }
  ngAfterViewInit(): void {  
    this.ddLConceptos?.instance.option("dropDownOptions.width", 600);  
    if (this.modoOperacion != 'consulta') {
      this.clickLiquida(undefined);
    }
  }  
}
