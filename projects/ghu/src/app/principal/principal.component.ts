import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Card } from 'primeng/card';
import { Liquidaciones, TiposLiq } from '../servicios/_empleados.class';
import { SdatosService } from '../servicios/_sdatos.service';

import { AppSettings } from '../_class/appsettings.class';
import { AppsettingsService } from '../appsettings.service';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GlobalsService } from '../globals.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { JsonDataSourceWizardPageId } from '@devexpress/analytics-core/analytics-wizard';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  @ViewChild('GLiquidaciones', { static: false }) ddGLiq?: DxDataGridComponent;

  items: TiposLiq[] = [];
  DLiquidaciones: Liquidaciones[] = [];
  archExcelLiq: string = "";
  readonly allowedPageSizes = [5, 10, 20, 50, 100, 'all'];
	appsettings: AppSettings;
	subscription: Subscription;
  imgImprimir: string = '../assets/print.png';
  usuario: string;
  empresa: string;

  GLEmpleados: any;
  isGridBoxOpened: boolean=false;
  gridBoxValue: number[] = [];
  gridColumns: any = ['ID_EMPLEADO', 'NOMBRE_COMPLETO'];
  valSeleccEmpleado: string = '';
	dropDownOptions = { width: 700 };

  menuliq: any = [{ titulo: "Liquidacion Primas", letra: "P"},
                        { titulo: "Liquidacion Vacaciones", letra: "V"},
                        { titulo: "Liquidacion Cesantías", letra: "C"},
                        { titulo: "Liquidacion Int Cesantías", letra: "I"}
                       ];
  menuinf: any = [{ titulo: "Total devengados por empleado mes", letra: "Dmes"},
                        { titulo: "Total devengados por meses", letra: "Dxmes"},
                        { titulo: "Planilla general", letra: "Pg"},
                        { titulo: "Planilla mensual", letra: "Pm"},
                        { titulo: "Reporte a plataforma", letra: "Pl"},
                        { titulo: "General de empleados", letra: "Ge"},
                        { titulo: "Vencimientos de contratos", letra: "Ven"}
                       ];
  menupro: any = [{ titulo: "Generación contable", letra: "Gcon"},
                        { titulo: "Generacion a PILA", letra: "Pila"},
                        { titulo: "Contratos", letra: "Cont"},
                        { titulo: "Nómina electrónica", letra: "Nelec"}
                       ];
  menuesp: any = [{ titulo: "Configuración notificaciones", letra: "Not"},
                        { titulo: "Certificación Laboral", letra: "Cert"},
                        { titulo: "Carta terminación contrato", letra: "Term"},
                        { titulo: "Plantilla creación empleados", letra: "Crea"},
                        { titulo: "Carta apertura cuenta", letra: "Ape"}
                       ];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private appSettingsService: AppsettingsService,
              private _sdatos: SdatosService,
              public globals: GlobalsService) 
  { 
    this.appSettingsService.getSettings();

    this.seleccEmpleado = this.seleccEmpleado.bind(this);
    this.onGridBoxOptionChanged = this.onGridBoxOptionChanged.bind(this);
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

  seleccEmpleado(item: any){
    return this.valSeleccEmpleado;
  }
  onGridBoxOptionChanged(e: any){
    if (e.name === "value"){
      this.isGridBoxOpened = false;

      // Datos del empleado
      var dat = e.value;
      if(dat.length > 0)
        this.valSeleccEmpleado = dat[0].ID_EMPLEADO;
      
      // Carga la grid de liquidaciones posibles para ese empleado
      const prm = { FILTRO: this.valSeleccEmpleado };
      this._sdatos.getDatos('LIQUIDACIONES EMPLEADO',prm).subscribe((data: any)=> {
        this.DLiquidaciones = JSON.parse(data);
      });
    }
  }

  // Llama a la liquidación respectiva
  IrALiquidacion(datLiq: string, tipo: string, numliq: string, filtro: string) {
    const IdLiq = datLiq;
    const NomLiq = tipo;
    if (datLiq != 'GHU-027')
      this.router.navigate(['/liqgenerada', {TipoLiq: IdLiq, NomLiq: NomLiq, PrmLiq: JSON.stringify({ NumLiq: numliq, ID_EMPLEADO: 'consulta'})}], {skipLocationChange: true});
    else
    {
      this.router.navigate(['/nomina', {TipoLiq: IdLiq, NomLiq: NomLiq, PrmLiq: JSON.stringify({ NumLiq: numliq, ID_EMPLEADO: 'consulta', Filtro: filtro})}], {skipLocationChange: true});
    }
  }

  genLiq(e: any, IdLiq: string, NomLiq: string) {
    this.router.navigate(['/prmliquidacion', {TipoLiq: IdLiq, NomLiq: NomLiq}], {skipLocationChange: true});
  }
  genLiqPres(e: any) {
    this.router.navigate(['/prmliquidacion', {TipoLiq: e.itemData.idliq, NomLiq: e.itemData.nomliq}], {skipLocationChange: true});
  }

  // Generación de informes
  informes(nominf: string) {
    switch (nominf) {
      case 'dev-emp-mes':
        this.router.navigate(['/reportes']); //,{usuario: this.globals.usuario, reporte: nominf}], {skipLocationChange: true});
        //window.open('/reportes', '_blank');
        break;
    
      default:
        break;
    }

  }

  // Generación de procesos
  proceso(nomproc: any) {
    switch (nomproc.itemData.titulo) {
      case 'Nómina electrónica':
        this.router.navigate(['/nomelec',{tipopro: 'Generación electrónica'}], {skipLocationChange: true});
        break;
    
      case 'Planilla mensual':
        this.router.navigate(['/liqmensual',{tipopro: 'Liquidación Mensual'}], {skipLocationChange: true});
        break;
    
      default:
        break;
    }

  }

  navegarFila() {
    this.ddGLiq?.instance.navigateToRow('NOM 4');
  }

  cargarLiquidaciones() {
    const prm = { FILTRO: '' };
    this._sdatos.getDatos('LIQUIDACIONES',prm).subscribe((data: any)=> {
      this.DLiquidaciones = JSON.parse(data);
    });
  }

  ngOnInit(): void {
    this.archExcelLiq = "Liquidaciones";

    this.items = [
      { idliq: "Primas", nomliq: "Liquidación prima de servicio",
          descliq: "Liquida prima de servicios semestralmente general para todos los empleados o para un empleado específico u otro filtro",
          img: '../../assets/fondo5.jpg', abrev: "P"
        },
      { idliq: "Cesantías", nomliq: "Liquidación Cesantías",
          descliq: "Liquida anualmente las cesantías general para todos los empleados o para un empleado específico u otro filtro",
          img: '../../assets/fondo11.jpg', abrev: "C"} ,
      { idliq: "Int Cesantías", nomliq: "Liquidación Int Cesantías",
          descliq: "Liquida intereses as las Cesantías anualmente general para todos los empleados o para un empleado específico u otro filtro",
          img: '../../assets/fondo17.jpg', abrev: "I"} ,
      { idliq: "Vacaciones", nomliq: "Liquidación Vacaciones",
          descliq: "Liquida vacaciones general para todos los empleados o para un empleado específico u otro filtro",
          img: '../../assets/fondo21.jpg', abrev: "V"} ,
      { idliq: "Contrato", nomliq: "Liquidación Contrato",
          descliq: "Liquida contrato definitivo para un empleado específico o masivamente. Para contratos a término fijo, indefinido u otros",
          img: '../../assets/fondo11.jpg', abrev: "Def"} 
    ];

    // Parámetros de entrada
    if(this.globals.usuario == "" || this.globals.usuario == undefined) {
      this.route.queryParamMap.pipe().subscribe((res: any) => { 
        this.globals.usuario  = res.params.usuario; 
        this.globals.nom_usr  = res.params.nom_usr; 
        this.globals.clid = res.params.clid; 
        this.usuario  = res.params.nom_usr; 
        this.empresa = res.params.clid;
        this.globals.tit_pag = "Gestión Humana";
      });
    }
    else {
      this.usuario = this.globals.nom_usr
    }

  }

  ngAfterViewInit() {
    this.globals.tit_pag = "Gestión Humana";

    // Aplica img
    var pcard = document.getElementsByClassName('p-card') as HTMLCollectionOf<HTMLElement>;
    for(var k=0; k < pcard.length; k++ ) {
      //pcard[k].setAttribute('style','background: linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url("' + this.items[k].img + '");');
      pcard[k].style.background = 'linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url("' + this.items[k].img + '")';
      pcard[k].style.backgroundRepeat = 'no-repeat';
      pcard[k].style.backgroundSize = 'cover';
      //pcard[k].style.background.position= '50% 50%';
      //pcard[k].style.width= '100%';
      //pcard[k].style.overflow= 'hidden';
    }

    var pcard = document.getElementsByClassName('items') as HTMLCollectionOf<HTMLElement>;
    for(var k=0; k < pcard.length; k++ ) {
      //pcard[k].setAttribute('style','background: linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url("' + this.items[k].img + '");');
      pcard[k].style.background = 'linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url("' + this.items[k].img + '")';
      pcard[k].style.backgroundRepeat = 'no-repeat';
      pcard[k].style.backgroundSize = 'cover';
      //pcard[k].style.background.position= '50% 50%';
      //pcard[k].style.width= '100%';
      //pcard[k].style.overflow= 'hidden';
    }

    // Asocia color al encabezado --- al navegar entre routes se pierde ya que crea el de liqcontrato
    var ptoolbar = document.getElementsByClassName('p-toolbar') as HTMLCollectionOf<HTMLElement>;
    var t = 0;
    if(ptoolbar.length > 1)
      t = ptoolbar.length - 1;
    ptoolbar[t].style.background = "#2196F3";
    ptoolbar = document.getElementsByClassName('titPpal') as HTMLCollectionOf<HTMLElement>;
    ptoolbar[0].style.color = "white";

    // Datos de configuración inicial
    this.appSettingsService.getSettings().subscribe((datos) => {
      const prm = { FILTRO: '' };
      this._sdatos.getDatos('LIQUIDACIONES',prm).subscribe((data: any)=> {
        this.DLiquidaciones = JSON.parse(data);
      },
      (err: any)=> {
        alert(err.error.Message);
        return;
      });
      this._sdatos.getDatos('LISTA EMPLEADOS',prm).subscribe((data: any)=> {
        this.GLEmpleados = JSON.parse(data);
      });
    })

  }

  imprimirLiquida(IdLiq: string, IdRpt: string, NumLiq: string, Filtro: string) {
    //this.router.navigate(['/visorrep']);
    const prmLiq = {Datos: {clid: this.appSettingsService.settingsApp.clid, IdLiq, IdRpt, NumLiq, Filtro}};
    var prm_safe = encodeURIComponent(JSON.stringify(prmLiq));
    window.open('/visorrep?prm_rpt='+prm_safe, '_blank');

  }

  
}
