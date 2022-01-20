import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppsettingsService } from './appsettings.service';
import { GlobalsService } from './globals.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ghu';
  usuario: string;
  titLiquidacion: string = "Gestión Humana";

  constructor(private route: ActivatedRoute,
              private appSettingsService: AppsettingsService,
              private router: Router,
              public globals: GlobalsService
              ) 
  { 
    this.appSettingsService.getSettings();
  }

  clickHome(e: any) {
    this.router.navigate(['/principal']);
  }
  ngOnInit(): void {

    // Parámetros de entrada
    /*if(this.globals.usuario == "" || this.globals.usuario == undefined) {
      this.route.queryParamMap.pipe().subscribe((res: any) => { 
        this.globals.usuario  = res.params.usuario; 
        this.globals.nom_usr  = res.params.nom_usr; 
        this.globals.clid = res.params.clid; 
        this.usuario  = res.params.nom_usr; 
        //this.globals.setVariables(res.params.clid,res.params.usuario,res.params.nom_usr,'principal');
      });
    }
    else
      this.usuario = this.globals.nom_usr */

  }

}
