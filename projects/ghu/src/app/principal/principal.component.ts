import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'primeng/card';
import { Liquidaciones, TiposLiq } from '../servicios/_empleados.class';
import { SdatosService } from '../servicios/_sdatos.service';

import { AppSettings } from '../_class/appsettings.class';
import { AppsettingsService } from '../appsettings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  items: TiposLiq[] = [];
  DLiquidaciones: Liquidaciones[] = [];
  archExcelLiq: string = "";
  readonly allowedPageSizes = [5, 10, 20, 50, 100, 'all'];
	appsettings: AppSettings;
	subscription: Subscription;

  constructor(private router: Router,
              private appSettingsService: AppsettingsService,
              private _sdatos: SdatosService) 
  { 
    this.appSettingsService.getSettings();
  }

  onToolbarPreparing(e: any) {
    let toolbarItems = e.toolbarOptions.items;
  
    e.toolbarOptions.items.unshift(
      {
          location: 'before',
          template: 'titLiquidaciones'
      }
    );
  }

  // Llama a la liquidación respectiva
  IrALiquidacion(datLiq: string, tipo: string) {
    const IdLiq = datLiq;
    const NomLiq = tipo;
    this.router.navigate(['/liquidaciones', {TipoLiq: IdLiq, NomLiq: NomLiq}], {skipLocationChange: true});
  }

  genLiq(e: any, IdLiq: string, NomLiq: string) {
    this.router.navigate(['/prmliquidacion', {TipoLiq: IdLiq, NomLiq: NomLiq}], {skipLocationChange: true});
  }

  ngOnInit(): void {
    this.archExcelLiq = "Liquidaciones";

    this.items = [
      { idliq: "Primas", nomliq: "Liquidación prima de servicio",
          descliq: "Liquida prima de servicios semestralmente general para todos los empleados o para un empleado específico u otro filtro",
          img: '../../assets/fondo3.jpg'
        },
      { idliq: "Cesantías", nomliq: "Liquidación Cesantías",
          descliq: "Liquida anualmente las cesantías general para todos los empleados o para un empleado específico u otro filtro",
          img: '../../assets/fondo18.jpg'} ,
      { idliq: "Int Cesantías", nomliq: "Liquidación Int Cesantías",
          descliq: "Liquida intereses as las Cesantías anualmente general para todos los empleados o para un empleado específico u otro filtro",
          img: '../../assets/fondo17.jpg'} ,
      { idliq: "Vacaciones", nomliq: "Liquidación Vacaciones",
          descliq: "Liquida vacaciones general para todos los empleados o para un empleado específico u otro filtro",
          img: '../../assets/fondo8.jpg'} ,
      { idliq: "Contrato", nomliq: "Liquidación Contrato",
          descliq: "Liquida contrato definitivo para un empleado específico o masivamente. Para contratos a término fijo, indefinido u otros",
          img: '../../assets/fondo11.jpg'} 
    ];

    this.appSettingsService.getSettings().subscribe((datos) => {
      const prm = { FILTRO: '' };
      this._sdatos.getDatos('LIQUIDACIONES',prm).subscribe((data: any)=> {
        this.DLiquidaciones = JSON.parse(data);
      });
    })

  }

  ngAfterViewInit() {
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

    // Asocia color al encabezado --- al navegar entre routes se pierde ya que crea el de liqcontrato
    var ptoolbar = document.getElementsByClassName('p-toolbar') as HTMLCollectionOf<HTMLElement>;
    var t = 0;
    if(ptoolbar.length > 1)
      t = ptoolbar.length - 1;
    ptoolbar[t].style.background = "#2196F3";
    ptoolbar = document.getElementsByClassName('titPpal') as HTMLCollectionOf<HTMLElement>;
    ptoolbar[0].style.color = "white";

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

}
