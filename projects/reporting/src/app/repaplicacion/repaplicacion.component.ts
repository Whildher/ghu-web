import { Component, DebugElement, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SdatrepService } from '../servicios/sdatrep.service';
import { SreportesService } from '../servicios/sreportes.service';

@Component({
  selector: 'app-repaplicacion',
  templateUrl: './repaplicacion.component.html',
  styleUrls: ['./repaplicacion.component.css']
})
export class RepaplicacionComponent implements OnInit {
	//subscription: Subscription;
  reportes: any;
  @Input() public idApl: string;
  @Output() messageEvent = new EventEmitter<string>();
  @Output() onSeleccVistaRouter = new EventEmitter<any>();

  constructor(private _sreportes: SreportesService,
              private _sdatosrep: SdatrepService,
              private route: ActivatedRoute,
              private router: Router) { 
    // Eventos en operaciones de registro
		/*this.subscription = this._sreportes
      .getObsDatosReporteApl()
      .subscribe((datrep) => {
        const vnav = datrep.split('|');
        if(vnav[0] === 'listarep') {
          this.CargarReportesApl(vnav[1]);
        }
    });*/

    this.CargarReportesApl = this.CargarReportesApl.bind(this);
  }

  // Carga reportes asociados a cada aplicación
  CargarReportesApl(IdApl: string): void {
    const prmRepApl = { APLICACION: IdApl, USUARIO: 'XTEIN'};
    this._sdatosrep.getDatReporteApl(prmRepApl).subscribe((data)=> {
      this.reportes = data;
    })
  }

  IrAFiltro(e: any, IdRep: string, NombreRep: string) {
    const rfiltro = JSON.stringify(this.reportes[1].filtro);
    //this.router.navigate(['/filtrorep', {dfiltro: rfiltro}], {skipLocationChange: true});
    this.onSeleccVistaRouter.emit('filtro');
    this._sreportes.setObsDatosReporteApl('nav:Filtro '+NombreRep);
  }

  IrAVerReporte(e: any, IdRep: string, NombreRep: string) {
    this.router.navigate(['/visorrep', {IdReporte: IdRep}], {skipLocationChange: true});
    //this._sreportes.setObsDatosReporteApl('nav:'+IdRep);
    this._sreportes.setObsDatosReporteApl('nav:Visualización '+NombreRep);
  }

  ngOnInit(): void {
    /*this.route.params.subscribe(parameter => {
      this.CargarReportesApl(parameter['IdApl'])
    });*/
    this.CargarReportesApl(this.idApl);
    //window.history.pushState("", "", '/');
  }
  ngOnDestroy() { 
    //this.subscription.unsubscribe();
  }
  ngOnChanges() {
     this.CargarReportesApl(this.idApl);
    }   

}
