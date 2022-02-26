import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { AppsettingsService } from '../appsettings.service';
import { GlobalsService } from '../globals.service';
import { SdatosService } from '../servicios/_sdatos.service';

@Component({
  selector: 'app-listadocelec',
  templateUrl: './listadocelec.component.html',
  styleUrls: ['./listadocelec.component.css']
})
export class ListadocelecComponent implements OnInit {

  DListaDoc: any;
  readonly allowedPageSizes = [5, 10, 20, 50, 100, 'all'];
  archExcelLiq: string = "";
  titListaDocGen: string;
  usuario: string;
  archExcelNomina: string;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private appSettingsService: AppsettingsService,
    private _sdatos: SdatosService,
    private globals: GlobalsService) { }

  onToolbarPreparing(e: any) {
    let toolbarItems = e.toolbarOptions.items;
  
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        template: 'btnIrALiqElec'
      },
      {
          location: 'before',
          template: 'titLiquidaciones'
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          onClick: this.cargarDocs.bind(this)
        }
      }
    );
  }
  cargarDocs() {

  }
  onCellPrepared(e: any) {
    if(e.rowType === "data" && e.column.dataField === "STATUS") {
      e.cellElement.style.color = e.data.ERROR !== "" ? "white" : "black";
      e.cellElement.style.background = e.data.ERROR !== "" ? "red" : "white";
    }
  }
  IrALiqElec(e: any) {
    this.router.navigate(['/nomelec',{tipopro: 'Generación electrónica'}], {skipLocationChange: true});
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

  ngOnInit(): void {
    this.archExcelLiq = "NominasElectronicas";
    this.usuario = this.globals.nom_usr;

    this.route.params.subscribe(parameter => {
      const dat = parameter['datos'];
      const ano = parameter['ano'];
      const mes = parameter['mes'];
      const lote_id = parameter['lote_id'];
      this.DListaDoc = JSON.parse(dat);
      this.archExcelNomina = "EstadoNomElec-"+ano+"-"+mes+".xlsx";
      this.titListaDocGen = "Lista de documentos emitidos Periodo: " + ano + "-" + mes + " Lote: " + lote_id;
    });

  }

}
