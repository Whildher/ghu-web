import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../_class/appsettings.class';
import { AppsettingsService } from '../appsettings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalsService } from '../globals.service';
import { HistoricoLiq } from '../servicios/_empleados.class';
import { SdatosService } from '../servicios/_sdatos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nomelec',
  templateUrl: './nomelec.component.html',
  styleUrls: ['./nomelec.component.css']
})
export class NomelecComponent implements OnInit {

  DLiquidaciones: HistoricoLiq[] = [];
  usuario: string;
  readonly allowedPageSizes = [5, 10, 20, 50, 100, 'all'];
	appsettings: AppSettings;
	subscription: Subscription;
  archExcelLiq: string = "";
  titLiquidacion: string = "";
  estadoGen: boolean = false;
  estadoGenDoc: string;

  imgError: string = '../assets/errorelec.png';
  imgXML: string = '../assets/xmlelec.png';
  imgOK: string = '../assets/okelec.png';

  // Alert de mensajes
  displayModal: boolean = false;
  errMsg: string = "";
  errTit: string = "";
  minFecha: Date = new Date('2021,9,1');

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
  generaElectronica(Tipo: string, NumDoc: string, ano: number, mes: number, idapl: string, numliq: string) {
    var prm = {};
    if (idapl !== "GHU-027")
      prm = { ID_DOC: NumDoc.split(' ')[0], NC_DOC: NumDoc.split(' ')[1], ID_APLICACION: idapl };
    else
      prm = { ID_DOC: ano, NC_DOC: mes, ID_APLICACION: idapl, NUM_LIQ: numliq };

    this.estadoGen = true; 
    this.estadoGenDoc = NumDoc;
    this._sdatos.genElectronica(Tipo, prm).subscribe((data: any)=> {
      alert(data);
      this.estadoGen = false;
      this.estadoGenDoc = "";
    },
    (err: any) => {
      this.displayModal = true;
      this.errMsg = err.error.Message;
      this.errTit = "Error de registro electrónico";
      this.estadoGen = false;
      return;
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
