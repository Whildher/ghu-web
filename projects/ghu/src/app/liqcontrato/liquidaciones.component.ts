import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Empleados, HistoricoLiq, LiqCompoAct, ListaEmpleados, Novedades } from '../servicios/_empleados.class';
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

@Component({
  selector: 'app-liquidaciones',
  templateUrl: './liquidaciones.component.html',
  styleUrls: ['./liquidaciones.component.css'],
  providers: [DatePipe]
})
export class LiquidacionesComponent implements OnInit {
  @ViewChild('ddLEmple', { static: false }) ddLEmple?: DxDropDownBoxComponent;
  @ViewChild('GLiqPrestaciones', { static: false }) dataGridPres?: DxDataGridComponent;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid?: DxDataGridComponent;

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

  DLiquidaciones: HistoricoLiq[] = [];
  DPrestaciones: any;
  DPrestMasiva: any;
  DGrupos: any;
  DEmpresas: any;
  DNovedades: Novedades[] = [];
  GLConceptos: any;

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

  // Nombre de archivo de exportaci??n
  archExcelLiq: string = "";
  archExcelLiqHis: string = "";

  // Alert de mensajes
  displayModal: boolean = false;
  errMsg: string = "";
  errTit: string = "";

  // Personalizaci??n
  elemActivos: LiqCompoAct = new LiqCompoAct(false,false,false,false,false);
  filtroMasivo: boolean = false;

  // Lista de tipos de liquidaciones
  itmListaLiq: string[] = [
    'Primas',
    'Vacaciones',
    'Cesant??as',
    'Intereses a las Cesant??as',
    'Liquidacion definitiva'
  ]
  
  constructor(private _sdatos: SdatosService, 
              private route: ActivatedRoute,
              private router: Router,
              public datepipe: DatePipe,
              private SVisor: SVisorService) 
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

    this.seleccEmpleado = this.seleccEmpleado.bind(this);
    this.onGridBoxOptionChanged = this.onGridBoxOptionChanged.bind(this);
    this.editorPreparing = this.editorPreparing.bind(this);
    this.setCellDias = this.setCellDias.bind(this);
    this.setCellBase = this.setCellBase.bind(this);
    this.setCellPrima = this.setCellPrima.bind(this);
    this.setCellCesantias = this.setCellCesantias.bind(this);
    this.setCellInt = this.setCellInt.bind(this);
    this.setCellVacaciones = this.setCellVacaciones.bind(this);
    this.onCellPrepared = this.onCellPrepared.bind(this);
    this.ImprimirTablaLiq = this.ImprimirTablaLiq.bind(this);
    this.onIniciarLiqPres = this.onIniciarLiqPres.bind(this);

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
        var dat = e.value;
        if(dat.length > 0)
          this.valSeleccEmpleado = dat[0].ID_EMPLEADO;
        const prm = { FILTRO: this.valSeleccEmpleado };
        this._sdatos.getDatos('DATOS CONTRATO',prm).subscribe((data: any)=> {
          this.DFEmpleados = JSON.parse(data);
        });
      }
    }

  // Nueva
  clickNueva(e: any) {
    // Prepara nueva liquidaci??n

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

    // Valida que est??n completos los datos
    if(this.DFEmpleados.FECHA_INICIAL === undefined || this.DFEmpleados.FECHA_FINAL === undefined ||
       this.DFEmpleados.FECHA_INI_BASE === undefined || this.DFEmpleados.FECHA_FIN_BASE === undefined)
    {
      this.displayModal = true;
      this.errMsg = `Debe seleccionar un rango de fechas, Fechas de Liquidacion y Fechas de Base!`;
      this.errTit = "Faltan datos";
      this.loadingVisible = false;
      return;
    }

    // inactiva checks de asociacion salario b??sico
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
                  GRUPO: this.valSeleccGrupo
                };
    this._sdatos.getDatos('PRE LIQUIDACION',prm).subscribe((data: any)=> {
      
      var datRes = JSON.parse(data);
      if (datRes[0].ErrMensaje != '')
      {
        this.displayModal = true;
        this.errMsg = `Error Liquidando base. <br /><i>` + datRes[0].ErrMensaje + `</i>`;
        this.errTit = "Liquidando base";
        this.loadingVisible = false;
        return;
      }

      // Asigna datos del hist??rico
      this.DLiquidaciones = JSON.parse(data);
      
      // Liquida prestaciones
      const prmLiq =  { ID_EMPLEADO: this.valSeleccEmpleado, 
                        FECHA_DESDE: fD, 
                        FECHA_HASTA: fH, 
                        NUM_LIQ: this.DLiquidaciones[0].NUM_LIQ, 
                        ID_LIQ: this.id_Liquidacion,
                        EMPRESA: this.valSeleccEmpresa ?? "",
                        GRUPO: this.valSeleccGrupo ?? ""
                      };
      this._sdatos.getDatos('LIQUIDACION PRESTACIONES',prmLiq).subscribe((data: any)=> {
        
        var datRes = JSON.parse(data);
        if (datRes == null)
        {
          this.displayModal = true;
          this.errMsg = `Error en el c??lculo de la liquidaci??n. Nulo</i>`;
          this.errTit = "Error de c??lculo";
          this.loadingVisible = false;
          return;
        }
        if (datRes[0].ErrMensaje != '')
        {
          this.displayModal = true;
          this.errMsg = `Error en el c??lculo de la liquidaci??n. <br /><i>` + datRes[0].ErrMensaje + `</i>`;
          this.errTit = "Error de c??lculo";
          this.loadingVisible = false;
          return;
        }

        // Si es un solo empleado
        if (!this.filtroMasivo) {

          this.DPrestaciones = datRes;
          const valLiq = JSON.parse(data);
          this.TotalLiquidacion = valLiq[0].TOTAL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

          // Asigna secci??n de totales
          this.DFEmpleados.TVPRIMA = valLiq[1].PRIMA;
          this.DFEmpleados.TDPRIMA = valLiq[2].PRIMA;
          this.DFEmpleados.TVCES = valLiq[1].CESANTIAS;
          this.DFEmpleados.TDCES = valLiq[2].CESANTIAS;
          this.DFEmpleados.TVINT = valLiq[1].INTERESES;
          this.DFEmpleados.TDINT = valLiq[2].INTERESES;
          this.DFEmpleados.TVVAC = valLiq[1].VACACIONES;
          this.DFEmpleados.TDVAC = valLiq[2].VACACIONES;
          this.DFEmpleados.TTOT = valLiq[0].TOTAL;
        }

        // Si es masiva 
        else {
          this.DPrestMasiva = JSON.parse(data);
        }

        this.loadingVisible = false;

      });
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
              text: 'Asignar Salario B??sico como valor base',
              onValueChanged: this.onValueChangeBasicoGen.bind(this)
          }
      },
      {
        location: 'before',
        widget: 'dxCheckBox',
        options: {
            width: 400,
            text: 'Asignar Salario B??sico a valores nulos/cero',
            onValueChanged: this.onValueChangeBasicoCero.bind(this)
        }
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

  // Asignaci??n de Salario B??sico como Valor Base de liquidaci??n
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
  // Asignaci??n de Salario B??sico como Valor Base de liquidaci??n
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

  // Si hay modificaci??n de d??as o base de liquidaci??n
  // *** MASIVO ***
  setCellDias (newData: any, value: any, currentRowData: any) {
    currentRowData.DIAS = value;
    this.AjusteLiquidacion(newData, value, currentRowData, 'dias');
  }
  setCellBase (newData: any, value: any, currentRowData: any) {
    currentRowData.BASE = value;
    this.AjusteLiquidacion(newData, value, currentRowData, 'base');
  }

  // Si hay modificaci??n de d??as o base de liquidaci??n
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

  // Liquida ajuste
  AjusteLiquidacion(newData: any, value: any, currentRowData: any, colmodif: string) {
    const prmLiq =  { 
      ID_EMPLEADO: this.valSeleccEmpleado, 
      DATOS_CAMBIO: currentRowData, 
      DATOS_TOTAL: !this.filtroMasivo ? this.DPrestaciones : this.DPrestMasiva,
      ID_LIQ: this.id_Liquidacion
    };
    this._sdatos.getDatos('AJUSTE PRESTACIONES',prmLiq).subscribe((data: any)=> {
      const valLiq = JSON.parse(data);
      if (valLiq[0].ErrMensaje != '')
      {
        this.displayModal = true;
        this.errMsg = `Error de ajuste en la liquidaci??n de ` + colmodif + `. <br /><i>` + valLiq[0].ErrMensaje + `</i>`;
        this.errTit = "Error de ajuste";
        this.loadingVisible = false;
        return;
      }

      if (!this.filtroMasivo) {
        this.TotalLiquidacion = valLiq[0].TOTAL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.DPrestaciones = JSON.parse(data);

        // Asigna secci??n de totales
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
        const ix = currentRowData.ITEM - 1;

        // Valida si hubo cambio de valor
        if(colmodif === 'dias') {
          this.DPrestMasiva[ix].DIAS = value;
          if (this.DPrestMasiva[ix].DIAS != this.DPrestMasiva[ix].DIAS_ORG)
            this.DPrestMasiva[ix].DIAS_CAMBIO = true;
        }
        else {
          this.DPrestMasiva[ix].BASE = value;
          if (this.DPrestMasiva[ix].BASE != this.DPrestMasiva[ix].BASE_ORG)
            this.DPrestMasiva[ix].BASE_CAMBIO = true;
        }
        this.DPrestMasiva[ix].TOTAL = valLiq[0].TOTAL;
      }
    });
  }

  // Si hubo cambios, se??alar
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
    for (let key in e.newData) {
      this.datFilaEdit = e.row.data;
    }
  }

  onIniciarLiqPres(e: any) {
    
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

              // Asigna secci??n de totales
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

  imprimirLiquida(e: any) {
    /*const url = this.router.serializeUrl(
      this.router.createUrlTree(['/visorrep', { id: 'REPORTE' }])
    );
  */
    window.open('/visorrep?id=REPORTE', '_blank');
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

    // Confecciona los elementos de acuerdo al tipo de liquidacion
    this.route.params.subscribe(parameter => {
      this.titLiquidacion = parameter['NomLiq'];
      this.id_Liquidacion = parameter['TipoLiq'];

      switch (parameter['TipoLiq']) {
        case 'Primas':
          this.elemActivos.Primas = true;
          this.archExcelLiq = "LiqPrima";
          this.archExcelLiqHis = "LiqHisBasePrima";
          break;
      
        case 'Cesant??as':
          this.elemActivos.Cesantias = true;
          this.archExcelLiq = "LiqCesantias";
          this.archExcelLiqHis = "LiqHisBaseCes";
          break;
      
        case 'Int Cesant??as':
          this.elemActivos.IntCesantias = true;
          this.archExcelLiq = "LiqIntCesantias";
          this.archExcelLiqHis = "LiqHisBaseIntCes";
          break;
      
        case 'Vacaciones':
          this.elemActivos.Vacaciones = true;
          this.archExcelLiq = "LiqVacaciones";
          this.archExcelLiqHis = "LiqHisBaseIntVac";
          break;
        
        case 'Contrato':
          this.elemActivos.Contrato = true;
          break;
          
        default:
          break;
      }
      
    });

    // Men?? de informes
    this.itemsInformes = [
      {
          label: 'Imprimir',
          icon: 'pi pi-flag'
      },
      {
          label: 'Liqudaci??n',
          icon: 'pi pi-file'
      }
    ];

  }
  ngAfterViewInit(): void {  
    this.ddLEmple?.instance.option("dropDownOptions.width", 600);  
  }  
}
