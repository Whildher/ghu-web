import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDrawerComponent, DxDrawerModule, DxListModule, DxRadioGroupModule, 
         DxToolbarModule, DxButtonModule } from 'devextreme-angular';
import { DxReportViewerComponent } from 'devexpress-reporting-angular';
import 'devexpress-reporting/dx-richedit';
import { ActivatedRoute } from '@angular/router';
import { SreportesService } from '../sreportes.service';

@Component({
  selector: 'app-visorrep',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './visorrep.component.html',
  styleUrls: ['./visorrep.component.css',
  "../../../../../node_modules/jquery-ui/themes/base/all.css",
  "../../../../../node_modules/devextreme/dist/css/dx.common.css",
  "../../../../../node_modules/devextreme/dist/css/dx.light.css",
  "../../../../../node_modules/devexpress-richedit/dist/dx.richedit.css",
  "../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.common.css",
  "../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.light.css",
  "../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-querybuilder.css",
  "../../../../../node_modules/devexpress-reporting/dist/css/dx-webdocumentviewer.css",
  "../../../../../node_modules/devexpress-reporting/dist/css/dx-reportdesigner.css"]

})
export class VisorrepComponent implements OnInit {
  navigation: any;
  elementAttr: any;

  constructor(private _sreportes: SreportesService,
              private route: ActivatedRoute) { }

  title = 'DXReportDesignerSample';
  getDesignerModelAction = "ReportDesigner/GetReportDesignerModel";

  reportUrl: string = '';
  hostUrl: string = '';
  invokeAction: string = "";

  ngOnInit(): void {
    this.route.params.subscribe(parameter => {
      //let prm = [{"zona":"0CO10"},{"zona":"0COM1"},{"zona":"0COM2"},{"zona":"0COM3"},{"zona":"0COM4"},{"zona":"0COM5"},{"zona":"0COM6"},{"zona":"0COM7"},{"zona":"0COM8"},{"zona":"0COM9"},{"zona":"0PFRO"},{"zona":"0PSUR"},{"zona":"0PTCA"},{"zona":"1BUCA"},{"zona":"1FLOR"},{"zona":"1GIRO"},{"zona":"1LEBR"},{"zona":"1OTRO"},{"zona":"1PIED"},{"zona":"1RION"},{"zona":"2ACAP"},{"zona":"2AGUA"},{"zona":"2ANGE"},{"zona":"2AREN"},{"zona":"2AYAC"},{"zona":"2BANC"},{"zona":"2BARR"},{"zona":"2BLAC"},{"zona":"2BODC"},{"zona":"2CAIM"},{"zona":"2CAND"},{"zona":"2CHIM"},{"zona":"2CLAR"},{"zona":"2CONT"},{"zona":"2COST"},{"zona":"2CURU"},{"zona":"2CURV"},{"zona":"2GAMA"},{"zona":"2GLOR"},{"zona":"2GUAM"},{"zona":"2LASP"},{"zona":"2LLAN"},{"zona":"2LOBA"},{"zona":"2MARQ"},{"zona":"2MATA"},{"zona":"2MORA"},{"zona":"2MORR"},{"zona":"2NORE"},{"zona":"2NORO"},{"zona":"2OCAÑ"},{"zona":"2PAIL"},{"zona":"2PALE"},{"zona":"2PAPA"},{"zona":"2PATI"},{"zona":"2PELA"},{"zona":"2PILE"},{"zona":"2REGI"},{"zona":"2RIOD"},{"zona":"2RION"},{"zona":"2RIOV"},{"zona":"2SAAN"},{"zona":"2SALO"},{"zona":"2SANA"},{"zona":"2SANB"},{"zona":"2SANM"},{"zona":"2SANR"},{"zona":"2SIMA"},{"zona":"2SIMI"},{"zona":"2TAMA"},{"zona":"2VEGA"},{"zona":"2ZAPT"},{"zona":"3AGUA"},{"zona":"3AGUS"},{"zona":"3BADI"},{"zona":"3BECE"},{"zona":"3BUEN"},{"zona":"3CEJA"},{"zona":"3CEJO"},{"zona":"3CELU"},{"zona":"3DIST"},{"zona":"3ELMO"},{"zona":"3GBAR"},{"zona":"3GFON"},{"zona":"3GUAC"},{"zona":"3GUAT"},{"zona":"3HATO"},{"zona":"3JOCA"},{"zona":"3LAJA"},{"zona":"3LAPA"},{"zona":"3LASR"},{"zona":"3LAVE"},{"zona":"3LOMA"},{"zona":"3LOSB"},{"zona":"3MANA"},{"zona":"3MARI"},{"zona":"3MEZA"},{"zona":"3NUEV"},{"zona":"3PATI"},{"zona":"3POND"},{"zona":"3PUEB"},{"zona":"3SAND"},{"zona":"3SANJ"},{"zona":"3URUM"},{"zona":"3VALE"},{"zona":"3VALL"},{"zona":"3VILL"},{"zona":"4-111"},{"zona":"4-112"},{"zona":"44016"},{"zona":"4CAND"},{"zona":"4CARI"},{"zona":"4CERR"},{"zona":"4COCO"},{"zona":"4COLO"},{"zona":"4CORD"},{"zona":"4GRAN"},{"zona":"4GUAC"},{"zona":"4GUAM"},{"zona":"4IBER"},{"zona":"4ISLA"},{"zona":"4MAYA"},{"zona":"4OLLE"},{"zona":"4ORIH"},{"zona":"4PALM"},{"zona":"4PALO"},{"zona":"4PALR"},{"zona":"4PUEB"},{"zona":"4REPO"},{"zona":"4RIOF"},{"zona":"4SANJ"},{"zona":"4SANP"},{"zona":"4SANR"},{"zona":"4SECR"},{"zona":"4SEVI"},{"zona":"4SEVL"},{"zona":"4TASJ"},{"zona":"4TUCU"},{"zona":"4VARE"},{"zona":"911NO"},{"zona":"9BAST"},{"zona":"9CURI"},{"zona":"9GAIR"},{"zona":"9LA30"},{"zona":"9MINC"},{"zona":"9NORT"},{"zona":"9PANT"},{"zona":"9S08"},{"zona":"9S16"},{"zona":"9S23"},{"zona":"9SANP"},{"zona":"9VILA"},{"zona":"9VILL"},{"zona":"9ZONA"},{"zona":"CGA"},{"zona":"CI"},{"zona":"YOPAL"},{"zona":"ZONA_CINCO"},{"zona":"ZONA_CUATRO"},{"zona":"ZONA_DOS"},{"zona":"ZONA_OCHO"},{"zona":"ZONA_SEIS"},{"zona":"ZONA_SIETE"},{"zona":"ZONA_TRES"},{"zona":"ZONA_UNO"}];
      //this.reportUrl = 'RepLayoutPlanta?'+JSON.stringify(prm);
      let prm = [{"CAMPO":"Mes_Start","EXPRESION":"01/01/2021"},{"CAMPO":"Mes_End","EXPRESION":"12/31/2021"}];
      this.reportUrl = 'RptDevengados?'+JSON.stringify(prm);
      //this.hostUrl = 'http://190.85.54.78:5000/';
      this.hostUrl = 'http://localhost:8200/';
      this.invokeAction = "DXXRDV";
    });

  }

}
