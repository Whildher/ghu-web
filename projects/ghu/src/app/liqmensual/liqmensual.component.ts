import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { GlobalsService } from '../globals.service';
import { SdatosService } from '../servicios/_sdatos.service';

@Component({
  selector: 'app-liqmensual',
  templateUrl: './liqmensual.component.html',
  styleUrls: ['./liqmensual.component.css']
})
export class LiqmensualComponent implements OnInit {
  @ViewChild('GMensual', { static: false }) gridNomina: DxDataGridComponent;

  DMensual: any;
  DListaMeses: any;
  isGridBoxOpened: boolean=false;
  titLiqMensual: string = "Periodo: ";
  usuario: string;
  archExcelNomina: string;
  cfg_concep: any;
  readonly allowedPageSizes = [5, 10, 20, 50, 100, 'all'];

  // Alert de mensajes
  displayModal: boolean = false;
  errMsg: string = "";
  errTit: string = "";
  minFecha: Date = new Date('2021,9,1');
  isVisible = false;
  type = 'info';
  message = 'msg';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _sdatos: SdatosService,
              public globals: GlobalsService
              ) 
    { 
      this.customizeColumns = this.customizeColumns.bind(this);
      this.onSeleccConcepto = this.onSeleccConcepto.bind(this);

    }

  onGridBoxOptionChanged(e: any) {
  }
  onSeleccConcepto(e: any) {

    // Verificar que no exista
    const prm = { FILTRO: '', NUM_LIQ: e.selectedRowsData[0].DOCUMENTO };
    this._sdatos.getDatos('LIQUIDACION MENSUAL',prm).subscribe((data: any)=> {
      try {
        const res = JSON.parse(data);
        if (res[0].ErrMensaje != '')
        {
          this.displayModal = true;
          this.errMsg = `Error en la consulta de la liquidación. <br /><i>` + res[0].ErrMensaje + `</i>`;
          this.errTit = "Error consultando";
          return;
        }
          this.DMensual = res;
        this.gridNomina.instance.refresh();
        this.titLiqMensual = "Periodo: " + res[0].PERIODO[0].FECHA_INI + " - " + res[0].PERIODO[0].FECHA_FIN;
        this.archExcelNomina = "LiqMensual"+e.selectedRowsData[0].ANO_MES+".xlsx";
  
        // Configuración conceptos extendidos
        this.cfg_concep = res[0].CONCEPTOS;
        } 
      catch (error) {
        this.displayModal = true;
        this.errMsg = 'Error en la consulta de la liquidación:'+error;
        this.errTit = "Error consultando";
      }
    });
    this.isGridBoxOpened = false;

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
    if (e.rowType === "data" && e.column.dataField.match("TOTAL_DEV|TOTAL_DED")) {
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
  }
  customizeColumns(columns: any) {
    var items = this.gridNomina.instance.getDataSource().items();  
    columns.forEach((col: any)=> {  
      if(typeof items[0][col.dataField] === "number"){  
        col.dataType = "number";  
        col.format = "#,##0";  
      }  
      if(col.dataField.match("ErrMensaje|CONCEPTOS|PERIODO")) {  
        col.visible = false;
      }
      if(col.dataField === "TOTAL"){  
        col.fixed = true;
        col.fixedPosition = "right";
      }
      if(!col.dataField.match("TOTAL_DEVENGADO|TOTAL_DEDUCIDO|TOTAL|ID_EMPLEADO|APELLIDO_COMPLETO")){  
        // Header a las columnas
        const dcon = this.cfg_concep.find((s: any) => s.ID_CONCEPTO === col.dataField)!;
        if (dcon != undefined) {
          col.caption = '[' + col.dataField + '] ' + dcon.NOMBRE;
          col.width = "150";
        }
      }
    })  
  }
  onToolbarPreparing(e: any) {
    let toolbarItems = e.toolbarOptions.items;
  
    e.toolbarOptions.items.unshift(
      {
          location: 'before',
          template: 'titLiquidaciones'
      },
    );
  }
  onExporting(e: any) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Employees');
    
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


  clickHome(e: any) {
    this.router.navigate(['/principal']);
  }
  
  ngOnInit(): void {
    this.usuario = this.globals.nom_usr;
    this.globals.tit_pag = "Liquidación mensual";
  }
  ngAfterViewInit(): void {  
    const prm = { FILTRO: '' };
    this.route.params.subscribe(res => {
      this._sdatos.getDatos('MESES LIQUIDACIONES',prm).subscribe((data: any)=> {
        this.DListaMeses = JSON.parse(data);
      });
    });
  }  

}
