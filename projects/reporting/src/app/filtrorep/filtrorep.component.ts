import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SreportesService } from '../servicios/sreportes.service';
import { RFiltro } from '../_class/rfiltro.class';

@Component({
  selector: 'app-filtrorep',
  templateUrl: './filtrorep.component.html',
  styleUrls: ['./filtrorep.component.css']
})
export class FiltrorepComponent implements OnInit {
  @Input() public idApl: string;

  //subscription: Subscription;
  DFiltro: RFiltro[] = [];

  constructor(private _sreportes: SreportesService,
              private route: ActivatedRoute,
              private router: Router) 
    { 
		/*this.subscription = this._sreportes
      .getObsDatosReporteApl()
      .subscribe((datrep) => {
        const vnav = datrep.split('|');
        if(vnav[0] === 'filtrorep') {
          const dfiltro = JSON.parse(vnav[1]);
          this.DatosFiltro(dfiltro);
        }
    });*/

		this.DatosFiltro = this.DatosFiltro.bind(this);
  }

  private DatosFiltro(dfiltro: RFiltro[]): any {
    this.DFiltro = this._sreportes.DFiltro;
  }

  ngOnInit(): void {
    //this.DFiltro = this._sreportes.DFiltro;
    //window.history.pushState("", "", '/');
    this.route.params.subscribe(parameter => {
      this.DFiltro = JSON.parse(parameter['dfiltro'])
    });
  }
  ngOnDestroy() { 
    //this.subscription.unsubscribe();
  }

}
