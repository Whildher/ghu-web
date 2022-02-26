import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../_class/appsettings.class';
import { AppsettingsService } from '../appsettings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalsService } from '../globals.service';
import { HistoricoLiq } from '../servicios/_empleados.class';
import { SdatosService } from '../servicios/_sdatos.service';
import { Subscription } from 'rxjs';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-nomelec',
  templateUrl: './nomelec.component.html',
  styleUrls: ['./nomelec.component.css']
})
export class NomelecComponent implements OnInit {

  DLiquidaciones: any;
  usuario: string;
  readonly allowedPageSizes = [5, 10, 20, 50, 100, 'all'];
	appsettings: AppSettings;
	subscription: Subscription;
  archExcelLiq: string = "";
  titLiquidacion: string = "";
  estadoGen: boolean = false;
  estadoGenDoc: string;
  LDocEmitidos: any;

  imgError: string = '../assets/errorelec.png';
  imgXML: string = '../assets/xmlelec.png';
  imgOK: string = '../assets/okelec.png';

  // Alert de mensajes
  displayModal: boolean = false;
  errMsg: string = "";
  errTit: string = "";
  minFecha: Date = new Date('2021,9,1');
  listaLotes: MenuItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private appSettingsService: AppsettingsService,
    private _sdatos: SdatosService,
    private globals: GlobalsService) 
  { 
    this.appSettingsService.getSettings();

   }

   onToolbarPreparing(e: any) {
    let toolbarItems = e.toolbarOptions.items;
  
    e.toolbarOptions.items.unshift(
      {
          location: 'before',
          template: 'titLiquidaciones'
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
  cargarLiquidaciones() {
    const prm = { FILTRO: '' };
    this._sdatos.getDatos('LIQUIDACIONES',prm).subscribe((data: any)=> {
      this.DLiquidaciones = JSON.parse(data);
    });
  }

  // Llama a la liquidación respectiva
  IrALiquidacion(datLiq: string, tipo: string) {
    const IdLiq = datLiq;
    const NomLiq = tipo;
    this.router.navigate(['/liquidaciones', {TipoLiq: IdLiq, NomLiq: NomLiq}], {skipLocationChange: true});
  }

  // Proceso generacion Nómina electrónica
  generaElectronica(Tipo: string, NumDoc: string, ano: number, mes: number, idapl: string, numliq: string, filadatos: any) {
    var prm = {};
    if (idapl !== "GHU-027")
      prm = { ID_DOC: NumDoc.split(' ')[0], NC_DOC: NumDoc.split(' ')[1], ID_APLICACION: idapl };
    else
      prm = { ID_DOC: ano, NC_DOC: mes, ID_APLICACION: idapl, NUM_LIQ: numliq };

    // Muestra indicador...
    filadatos.data.GENERAR = true;
    this.estadoGenDoc = NumDoc;
    this._sdatos.genElectronica(Tipo, prm).subscribe((data: any)=> {
      this.LDocEmitidos = JSON.parse(data);
      alert("Total:"+this.LDocEmitidos.length+" "+this.LDocEmitidos);
      filadatos.data.GENERAR = false;
      this.estadoGenDoc = "";
    },
    (err: any) => {
      this.displayModal = true;
      this.errMsg = err.error.Message;
      this.errTit = "Error de registro electrónico";
      filadatos.data.GENERAR = false;
      return;
  });
  }

  IrAEstado(estado: string, ano: any, mes: any) {
    switch (estado) {
      case "consulta":
        const prm = { ID_DOC: ano, NC_DOC: mes };
        this._sdatos.getDatos('RESULTADO EMISION NOMINA',prm).subscribe((data: any)=> {
          this.LDocEmitidos = JSON.parse(data);
        });
        break;
    
      default:
        break;
    }
  }
  listaDropDnLotes(e: any, ano: any, mes: any) {
    var datLotes = this.DLiquidaciones.find((t: any) => t.ANO == ano && t.MES == mes);
    if (datLotes !== undefined) {
      datLotes.LOTES.forEach((el: any) => {
        el.command = () => this.IrAListaDoc(el.label)
      });
      this.listaLotes = datLotes.LOTES;
    }
  }
  IrAListaDoc(item: any) {
    item = item.split('>')[0].trim();
    const prm = { lote_id: item };
    this._sdatos.getDatos('CONSULTA LOTE NOMINA',prm).subscribe((data: any)=> {
      const datos = JSON.parse(data);
      if (datos[0].ErrMensaje != '') {
        this.displayModal = true;
        this.errMsg = 'Error en consulta de lote: ' + datos[0].ErrMensaje;
        this.errTit = "Error consulta nomina electrónica";
        return;
      }
      this.router.navigate(['/listadocelec',{datos: JSON.stringify(datos), ano: datos[0].ANO, mes: datos[0].MES, lote_id: item }], {skipLocationChange: true});
    });
  }

  clickHome(e: any) {
    this.router.navigate(['/principal']);
  }

  ngOnInit(): void {
    this.archExcelLiq = "NominasElectronicas";
    this.usuario = this.globals.nom_usr;

    this.route.params.subscribe(parameter => {
      this.titLiquidacion = parameter['tipopro'];
    });

    const prm = { FILTRO: '' };
    this._sdatos.getDatos('LIQUIDACIONES ELECTRONICA',prm).subscribe((data: any)=> {
      this.DLiquidaciones = JSON.parse(data);
    });

  }
}
