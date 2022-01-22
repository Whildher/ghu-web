import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SdatosService } from '../servicios/_sdatos.service';

@Component({
  selector: 'app-liqdetalle',
  templateUrl: './liqdetalle.component.html',
  styleUrls: ['./liqdetalle.component.css']
})
export class LiqdetalleComponent implements OnInit {
  @Input() idEmpleado: string;
  @Input() data: any;
  @ViewChild('GPeriodo', { static: false }) gridNomina: DxDataGridComponent;

  DLiqPeriodo: any;

  constructor(private _sdatos: SdatosService) 
    { 
      this.customizeColumns = this.customizeColumns.bind(this);

    }

  customizeColumns(columns: any) {
    var items = this.gridNomina.instance.getDataSource().items();  
    columns.forEach((col: any)=> {  
      if(typeof items[0][col.dataField] === "number"){  
        col.dataType = "number";  
        col.format = "#,##0";  
      }  
      if(col.dataField.match("FECHA_INICIAL|FECHA_FINAL")) {  
        col.dataType = "date";  
        col.format = "yyyy-MM-dd";  
      }  
      if(col.dataField.match("ErrMensaje|CONCEPTOS|PERIODO|ID_EMPLEADO")) {  
        col.visible = false;
      }
      if(col.dataField === "TOTAL"){  
        col.fixed = true;
        col.fixedPosition = "right";
      }
    })  
  }

  // Personaliza grid
  onCellPreparedLiq(e: any) {
    if (e.rowType === "data" && e.column.dataField.match("TOTAL_DEV|TOTAL_DED")) {
      e.cellElement.style.backgroundColor = "#cae6fc";
    }
    if (e.rowType === "data" && e.column.dataField === "TOTAL") {
      e.cellElement.style.backgroundColor = "#90cd93";
      e.cellElement.style.fontWeight = 'bold';
    }
    if (e.rowType === 'header') {
      e.cellElement.style.backgroundColor = "moccasin";
      e.cellElement.style.color = 'blue';
      e.cellElement.style.textAlign = 'center';
    }
  }
  
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const prmLiq =  {  
      NUM_LIQ: this.data.ANO_MES, 
      ID_LIQ: "GHU-027",
      FILTRO: "*"+this.idEmpleado+"*"
    };
    this._sdatos.getDatos('CONSULTA LIQUIDACIONES',prmLiq).subscribe((data: any)=> {
      const res = JSON.parse(data);
      this.DLiqPeriodo = res[0].NOMINA;
    });
  }

}
