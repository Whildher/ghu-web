import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent, DxTooltipComponent } from 'devextreme-angular';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { AppsettingsService } from '../appsettings.service';
import { GlobalsService } from '../globals.service';
import { Empleados, LiqCompoAct } from '../servicios/_empleados.class';
import { SdatosService } from '../servicios/_sdatos.service';
import { SVisorService } from '../visor/models/s-visor.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.css']
})
export class NominaComponent implements OnInit {
  @ViewChild('GLiqNomina', { static: false }) gridNomina: DxDataGridComponent;
  @ViewChild('ToolTipConcepto', { static: false }) toolTipConcept: DxTooltipComponent;

  PrmGeneracion: any;
  DFEmpleados: Empleados = new Empleados();
  DConceptos: any;
  GLEmpleados: any;
  DNomina: any;
  isGridBoxOpened: boolean=false;
  valSeleccEmpleado: string = '';
  valSeleccEmpresa: string = '';
  valSeleccGrupo: string = '';

  filtroLiq: string = "";
  titLiquidacion: string = "";
  id_Liquidacion: string = "";
  num_liq: string = "";
  usuario: string;
  modoOperacion: string;
  loadingVisible = false;
  conc_dev: any;
  conc_ded: any;
  cfg_concep: any;
  novedades: any;
  p_filtro: any;
  p_numliq: any;

  tipVisible: boolean = false;
  TooltipTarget: any;
  diasConc: any;
  valorConc: any;

  // Nombre de archivo de exportación
  archExcelNomina: string = "";

  // Alert de mensajes
  displayModal: boolean = false;
  errMsg: string = "";
  errTit: string = "";
  minFecha: Date = new Date('2021,9,1');
  isVisible = false;
  type = 'info';
  message = 'msg';

  datConcepto: string;
  popupVisible: boolean = false;
  aceptaCambiosConcepto: any;
  cancelaCambios: any;
  positionOf: string;
  titCantidad: string;
  canConcepto: string;
  valConcepto: number;
  fechaDesdeNov: any;
  fechaHastaNov: any;
  titEmpleadoNov: string;
  empleadoNov: string;
  conceptoNov: string;
  infoNovedad: string;

  // Personalización
  elemActivos: LiqCompoAct = new LiqCompoAct(false,false,false,false,false);
  filtroMasivo: boolean = false;
  readonly allowedPageSizes = [5, 10, 20, 50, 100, 'all'];

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
              private globals: GlobalsService,
              private appSettingsService: AppsettingsService) 
  { 
    this.aceptaCambiosConcepto = {
      icon: 'check',
      text: 'Aceptar',
      onClick: this.actualizarNovedad.bind(this)
    };
    this.cancelaCambios = {
      text: 'Cancelar',
      onClick(e: any) {
        this.popupVisible = false;
      },
    };

    this.consultaLiquidacion = this.consultaLiquidacion.bind(this);
    this.customizeColumns = this.customizeColumns.bind(this);
    this.actualizarNovedad = this.actualizarNovedad.bind(this);
    this.onCellHoverChanged = this.onCellHoverChanged.bind(this);

  }

  clickHome(e: any) {
    this.router.navigate(['/principal']);
  }

  consultaLiquidacion(NumLiq: string, Filtro: string) {
    this.showLoadPanel();

    // **** Consulta liquidación de Nómina
    const prmLiq =  {  
      NUM_LIQ: NumLiq, 
      ID_LIQ: this.id_Liquidacion,
      FILTRO: Filtro
    };
    this._sdatos.getDatos('CONSULTA LIQUIDACIONES',prmLiq).subscribe((data: any)=> {

      this.id_Liquidacion = 'Nómina';

      var datRes = JSON.parse(data);
      if (datRes == null)
      {
        this.displayModal = true;
        this.errMsg = `Error en la consulta de la liquidación. Nulo</i>`;
        this.errTit = "Error consultando";
        this.loadingVisible = false;
        return;
      }
      if (datRes[0].NOMINA[0].ErrMensaje != '')
      {
        this.displayModal = true;
        this.errMsg = `Error en la consulta de la liquidación. <br /><i>` + datRes[0].ErrMensaje + `</i>`;
        this.errTit = "Error consultando";
        this.loadingVisible = false;
        return;
      }

      // Si es un solo empleado
      if (!this.filtroMasivo) {
        this.DNomina = datRes[0].NOMINA;
      }

      // Si es masiva 
      else {
        this.DNomina = datRes[0].NOMINA;

        // Conceptos DV y DD
        const concep = JSON.parse(datRes[0].CONCEPTOS);
        this.conc_dev = concep.DEVENGADOS;
        this.conc_ded = concep.DEDUCIDOS;

        // Configuración conceptos extendidos
        this.cfg_concep = datRes[0].CONFIG_CONCEPTOS;

        // Novedades detalladas
        this.novedades = datRes[0].NOVEDADES;

        // Filtro de generación
        this.filtroLiq = datRes[0].FILTRO_GEN;
      }

      // Parámetros
      this.DFEmpleados.ID_EMPLEADO = datRes[0].ID_EMPLEADO;
      this.DFEmpleados.NOMBRE_COMPLETO = datRes[0].NOMBRE_COMPLETO;
      this.DFEmpleados.FECHA_INICIAL = datRes[0].FECHA_INICIAL;
      this.DFEmpleados.FECHA_FINAL = datRes[0].FECHA_FINAL;

      this.loadingVisible = false;
    });

    // Diversos conceptos de nomina
    this._sdatos.getDatos('LISTA CONCEPTOS',prmLiq).subscribe((data: any)=> {
      this.DConceptos = JSON.parse(data);
    });

  }

    // Evita eliminar ciertas filas
    onCellPreparedLiq(e: any) {
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

    customizeColumns(columns: any) {
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
        if(col.dataField === "APELLIDO_COMPLETO"){  
          col.fixed = true;
          col.fixedPosition = "left";
        }
        if(col.dataField.match("TOTAL_DEVENGADO|TOTAL_DEDUCIDO|TOTAL|ID_EMPLEADO|APELLIDO_COMPLETO")){  
          col.allowEditing = false;
        }
        if(!col.dataField.match("TOTAL_DEVENGADO|TOTAL_DEDUCIDO|TOTAL|ID_EMPLEADO|APELLIDO_COMPLETO")){  
          col.setCellValue = (rowData: any, value: any, currentRowData: any) => {
            this.setCellConcepto(rowData, value, currentRowData, col.dataField);
          };

          // Header a las columnas
          const dcon = this.cfg_concep.find((s: any) => s.ID_CONCEPTO === col.dataField)!;
          if (dcon != undefined) {
            col.caption = '[' + col.dataField + '] ' + dcon.NOMBRE;
          }
          col.width = "150";
        }
      })  
    }
    setCellConcepto(rowData: any, value: any, currentRowData: any, col: any) { 
      // Asigna valor si es devengado o deducido
      if(this.conc_dev.match(col)) rowData[col] = Math.abs(value);
      if(this.conc_ded.match(col)) rowData[col] = -Math.abs(value);

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
      else {
        rowData.DIAS = Math.abs(value);
      }

    }
  
    // Actualiza dato modificado
    updateRowNom(e: any) {
      // Actualiza BD
      const prm = { NUM_LIQ: this.num_liq, DATOS_CAMBIO: e.data, NOVEDADES: this.novedades };
      this._sdatos.getDatos('ACTUALIZAR NOMINA',prm).subscribe((data: any)=> {
        const res = JSON.parse(data);
        if (res[0].ErrMensaje != '')
        {
          this.displayModal = true;
          this.errMsg = res[0].ErrMensaje;
          this.errTit = "Error actualización liquidación";
          return;
        }
        this.type = 'success';
        this.message = "Empleado actualizado!";
        this.isVisible = true;
      });
    }

    onExporting(e: any) {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Nómina');
      
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
  

  onShown() {
  }
  onHidden() {
  }
  showLoadPanel() {
    this.loadingVisible = true;
  }

  onCellHoverChanged(e: any) {
    if (e.rowType === "data") {
      var novdet = this.novedades.find((n:any) => n.ID_CONCEPTO === e.column.dataField && n.ID_EMPLEADO === e.data.ID_EMPLEADO);
      if (novdet !== undefined) {
        if (e.eventType === "mouseover") {
            this.TooltipTarget = e.cellElement;
            /*this.diasConc = e.data.DIAS;
            this.valorConc = e.value;*/
            this.infoNovedad = "<table>"+
                               "<tr><td>Cantidad:</td><td>"+novdet.VALOR_NOVEDAD+"</td></tr>"+
                               "<tr><td>Desde:</td><td>"+novdet.FECHA_DESDE_NOV+"</td></tr>"+
                               "<tr><td>Hasta:</td><td>"+novdet.FECHA_HASTA_NOV+"</td></tr>"+
                               "</table>"
            this.toolTipConcept.instance.show();
            //e.preventDefault();
            //this.toolTipConcept.instance.on('mouseout', this.hideTooltip)
        } else {
            this.toolTipConcept.instance.hide();
        }
     }
    }
  }
  hideTooltip() {
    this.toolTipConcept.instance.hide();
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

  // Edita solo las que piden mas de un dato -- Novedades detalladas
  onEditingStart(e: any) {
    const dcon = this.cfg_concep.find((s: any) => s.ID_CONCEPTO === e.column.dataField && s.CONDICION !== '')!;
    if (dcon !== undefined) {
      const dnov = this.novedades.find((s: any) => s.ID_EMPLEADO === e.data.ID_EMPLEADO && s.ID_CONCEPTO === e.column.dataField)!;
      this.datConcepto = "Datos para " + e.column.dataField;
      this.titEmpleadoNov = "Empleado: " + e.data.ID_EMPLEADO + ' ' + e.data.APELLIDO_COMPLETO;
      this.titCantidad = "Dias";
      if (dnov !== undefined) {
        this.canConcepto = dnov.VALOR_NOVEDAD;
        this.fechaDesdeNov = dnov.FECHA_DESDE_NOV;
        this.fechaHastaNov = dnov.FECHA_HASTA_NOV;
        }
      else {
        this.canConcepto = '0';
        this.fechaDesdeNov = new Date();
        this.fechaHastaNov = new Date();
      }
      this.valConcepto = e.data[e.column.dataField];
      this.empleadoNov = e.data.ID_EMPLEADO;
      this.conceptoNov = e.column.dataField;
      this.popupVisible = true;
      e.cancel = true;
    }
  }

  // Actualiza los datos de la novedad
  actualizarNovedad(e: any) {
    // Valida datos
    const dnov = this.novedades.find((s: any) => s.ID_EMPLEADO === this.empleadoNov && s.ID_CONCEPTO === this.conceptoNov)!;
    if (dnov !== undefined) {
      dnov.VALOR_NOVEDAD = this.canConcepto;
      dnov.FECHA_DESDE_NOV = this.fechaDesdeNov;
      dnov.FECHA_HASTA_NOV = this.fechaHastaNov;
    }
    else {
      this.novedades.push({ ID_EMPLEADO: this.empleadoNov, ID_CONCEPTO: this.conceptoNov,
                            VALOR_NOVEDAD: this.canConcepto,
                            FECHA_DESDE_NOV: this.fechaDesdeNov,
                            FECHA_HASTA_NOV: this.fechaHastaNov
                          })
    }

    // Actualizar la grid y la tabla
    const dnom = this.DNomina.find((s: any) => s.ID_EMPLEADO === this.empleadoNov)!;
    if (dnom !== undefined) {
      dnom[this.conceptoNov] = this.valConcepto;

      // Marca la celda como cambiada
      if (!dnom.V__CAMBIOS.match(this.conceptoNov+',')) {
        dnom.V__CAMBIOS = dnom.V__CAMBIOS + this.conceptoNov + ',';
      }
      
      // Totaliza
      if(this.conceptoNov !== "DIAS") {
        let tdev = 0;
        let tded = 0;
        for (let k = 0; k < this.conc_dev.split(',').length-1; k++) {
          const colliq = this.conc_dev.split(',')[k];
          tdev += (colliq !== this.conceptoNov) ? Number(dnom[colliq]) : Math.abs(Number(this.valConcepto));
        }
        for (let k = 0; k < this.conc_ded.split(',').length-1; k++) {
          const colliq = this.conc_ded.split(',')[k];
          tded += (colliq !== this.conceptoNov) ? Number(dnom[colliq]) : -Math.abs(Number(this.valConcepto));
        }
        dnom.TOTAL_DEVENGADO = tdev;
        dnom.TOTAL_DEDUCIDO = tded;
        dnom.TOTAL = tdev - Math.abs(tded);

        // Actualiza BD
        var datGrid = { data: dnom };
        this.updateRowNom(datGrid);
      }
      this.popupVisible = false;
      
    }

  }

  onToolbarPreparing(e: any) {
    let toolbarItems = e.toolbarOptions.items;
  
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        template: 'conceptosTemplate',
      },
      {
        location: 'before',
        template: 'filtroGen',
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          onClick: this.cargarLiquidaciones.bind(this)
        }
      }
    );
  }

  cargarLiquidaciones(e: any) {
    this.id_Liquidacion = "GHU-027";
    this.consultaLiquidacion(this.p_numliq, this.p_filtro);
  }

  onSeleccConcepto(e: any) {
    var posCol = 0;
    if (e.selectedRowsData[0].TIPO_VALOR === "Devengado")
      posCol = this.gridNomina.instance.columnOption("TOTAL_DEVENGADO", "visibleIndex");
    else
      posCol = this.gridNomina.instance.columnOption("TOTAL_DEDUCIDO", "visibleIndex");

    // Verificar que no exista
    const exis = this.gridNomina.instance.columnOption(e.selectedRowKeys[0], "visibleIndex");
    if (!exis) {
      try {
        this.gridNomina.instance.addColumn({ dataField: e.selectedRowKeys[0], visibleIndex: posCol });
        
        // Personalización de la columna
        if (e.selectedRowsData[0].TIPO_VALOR === "Devengado")
          this.conc_dev += e.selectedRowKeys[0] + ",";
        else
          this.conc_ded += e.selectedRowKeys[0] + ",";
        var columnOptions = this.gridNomina.instance.getVisibleColumns()[posCol];
        columnOptions.setCellValue = (rowData: any, value: any, currentRowData: any) => {
          this.setCellConcepto(rowData, value, currentRowData, e.selectedRowKeys[0]);
        };
        columnOptions.dataType = "number";  
        columnOptions.format = "#,##0";  

        // Valor cero por defecto
        for (let k = 0; k < this.DNomina.length; k++) {
          this.DNomina[k][e.selectedRowKeys[0]] = 0;
        }

      } 
      catch (error) {
        this.displayModal = true;
        this.errMsg = 'Error al agregar concepto (verificar que no esté agregado):'+error;
        this.errTit = "Error agregando concepto";
      }
    }
    else {
      this.displayModal = true;
      this.errMsg = 'Ya existe agregado este concepto: '+e.selectedRowKeys[0];
      this.errTit = "Error agregando concepto";
    }
    this.isGridBoxOpened = false;
  }
  onGridBoxOptionChanged(e: any) {
  }

  
  ngOnInit(): void {
    this.usuario = this.globals.nom_usr;

    // Confecciona los elementos de acuerdo al tipo de liquidacion
    this.route.params.subscribe(parameter => {
      this.titLiquidacion = parameter['NomLiq'];
      this.id_Liquidacion = parameter['TipoLiq'];
      this.PrmGeneracion  = JSON.parse(parameter['PrmLiq']);
      this.num_liq = this.PrmGeneracion.NumLiq;

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
      }
      else
      {
        // Verifica si es masiva la consulta o de un solo empleado
        let pfiltro = this.PrmGeneracion.Filtro;
        if (pfiltro.split('$').length-1 == 2) {
          // Consulta de un solo empleado
          this.filtroMasivo = false;
          //pfiltro = pfiltro.split('$').join('');
        }
        else
        this.filtroMasivo = true;

        this.p_filtro = pfiltro;
        this.p_numliq = this.PrmGeneracion.NumLiq;
        this.titLiquidacion = parameter['NomLiq'] + ' [' + this.PrmGeneracion.NumLiq + ']';
        this.consultaLiquidacion(this.PrmGeneracion.NumLiq, pfiltro);
        this.modoOperacion = 'consulta';
        this.globals.tit_pag = this.titLiquidacion;
      }
  
      this.archExcelNomina = "LiqNomina.xlsx";
      
    });

  }

}
