import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router } from '@angular/router';
import { DxDrawerComponent, DxDrawerModule, DxListModule, DxRadioGroupModule, 
         DxToolbarModule, DxButtonModule } from 'devextreme-angular';
import { Subscription } from 'rxjs';
import { SdatrepService } from '../servicios/sdatrep.service';
import { SreportesService } from '../servicios/sreportes.service';
import {MenuItem} from 'primeng/api'; 
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {SplitterModule} from 'primeng/splitter';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  //@ViewChild('IniFiltro', {static: true}) template
  
  navigation: any;
  text: string;
  selectedOpenMode: string = 'shrink';
  selectedPosition: string = 'left';
  selectedRevealMode: string = 'slide';
  isDrawerOpen: boolean = true;
  elementAttr: any;
  Vista: string = 'listarep';
	subscription: Subscription;
  readonly home = {icon: 'pi pi-home', name: 'home'};
  public itemsNav: MenuItem[] = [];
  IdAplicacion: string = 'PRO-013';
  msgnav: string = '';
  elemNav: MenuItem = {};
  visor_router: string;

  constructor(private _sreportes: SreportesService,
              private _sdatosrep: SdatrepService,
              private router: Router,
              private cdRef: ChangeDetectorRef,
              private ngZone: NgZone) {
    this.text = '';
		this.subscription = this._sreportes
      .getObsDatosReporteApl()
      .subscribe(datrep => {
          if(datrep.match('nav:')) {
            const vnav = datrep.split(':');
            this.elemNav = { label:'<a href="#">' + vnav[1] + '</a>', escape: false};
            this.itemsNav = [...this.itemsNav, this.elemNav];
          }
    });

  }
  
  receiveMessage(e: any) {
    this.itemsNav.push({label:'<a href="#">Uno</a>', escape: false});
  }
  
  toolbarContent = [{
    widget: 'dxButton',
    location: 'before',
    options: {
        icon: 'menu',
        onClick: () => this.isDrawerOpen = !this.isDrawerOpen
    }},
    {
      widget: 'dxButton',
      location: 'after',
      options: {
        icon: 'smalliconslayout',
        text: 'Diseñador',
        onClick: () => this.onOpenDiseRep()
    }
    }];

  // Selecciona aplicacion y carga reportes asociados
  selAplicacion(e: any): void {
    this.Vista = 'listarep';
    //this._sreportes.setObsDatosReporteApl('listarep|'+e.itemData.ID_APLICACION);
    //this.router.navigate(['/repaplicacion', {IdApl: e.itemData.ID_APLICACION}], {skipLocationChange: true});
    this.IdAplicacion = e.itemData.ID_APLICACION;
  }

  OnItemBread(e: any): void {
    if (e.item.name === 'home') {
      //this.toolbarContent[0].options.onClick();
      //this.router.navigate(['/repaplicacion', {IdApl: this.IdAplicacion}], {skipLocationChange: true});
      this.visor_router = "aplicacion";
      this.IdAplicacion = e.itemData.ID_APLICACION;
      this.itemsNav = [
        {label:'<a href="#">' + this.itemsNav[0].label + '</a>', escape: false}
      ];
    }
  }

  clickHome(e: any) {
    //this.router.navigate(['/principal']);
  }


  seleccVista(vista: any) {
    this.visor_router = 'filtro';
  }

  ngOnInit(): void {
    //this.viewContainerRef.createEmbeddedView(this.template);

    // Activar cuanto esté ensamblado el proyecto principal
    //this.route.params.subscribe(parameter => {
    //  this.IdAplicacion = parameter['IdApl']
    //});

    //this.router.navigate(['/repaplicacion', {IdApl: this.IdAplicacion}], {skipLocationChange: true});
    const prmrep = { USUARIO: 'XTEIN', APLICACION: this.IdAplicacion };
    this._sdatosrep.getDatReporte(prmrep).subscribe((data)=> {
      this.text = JSON.stringify(data[0].reportes);
      this.navigation = data;
      //this._sreportes.setObsDatosReporteApl('listarep|'+data[0].items[0].ID_APLICACION);

      this.itemsNav = [
        {label:'<a href="#">' + data[0].items[0].text + '</a>', escape: false}
      ];
    })

    this._sreportes.evRutaNav.subscribe((msg: string) => {
      this.ngZone.run( () => {
        this.itemsNav.push({label:'<a href="#">Zona</a>', escape: false});
        });
    })

    /*this.itemsNav = [
      {label:'<a href="#">Reportes</a>', escape: false},
      {label:'<a href="#">Rutas de partes</a>', escape: false},
      {label:'<a href="#">Filtro</a>', escape: false}
    ];*/

    // Visor por defecto
    this.visor_router = 'aplicacion';

    console.log('items nav',this.itemsNav);

  }

  // Llama diseñador de reportes
  onOpenDiseRep(): void {
    this.router.navigate(['/designer'], {skipLocationChange: true});
  }

  ngOnDestroy() { 
    this.subscription.unsubscribe();
  }
}
