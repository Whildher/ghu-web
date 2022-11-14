import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDrawerComponent, DxDrawerModule, DxListModule, DxRadioGroupModule, 
         DxToolbarModule, DxButtonModule } from 'devextreme-angular';
import { DxReportViewerComponent } from 'devexpress-reporting-angular';
import 'devexpress-reporting/dx-richedit';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private route: ActivatedRoute) { }

  title = 'DXReportDesignerSample';
  getDesignerModelAction = "ReportDesigner/GetReportDesignerModel";

  reportUrl: string = '';
  hostUrl: string = '';
  invokeAction: string = "";

  DocumentReady(e: any) {  
  }
  CustomizeElements(e: any) {  
  }
  BeforeRenderRpt(e: any) {  
    e.args.reportPreview.zoom(-1);  
  }  

  ngOnInit(): void {
    this.route.params.subscribe(parameter => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const codePrm = urlParams.get('prm_rpt');
      var prm_safe = decodeURIComponent(codePrm?? '');
  
      let prm = JSON.parse(prm_safe);
      //let prm = [{"CAMPO":"Mes_Start","EXPRESION":"01/01/2021"},{"CAMPO":"Mes_End","EXPRESION":"12/31/2021"}];
      this.reportUrl = prm.Datos.IdRpt + '?clid=' + prm.Datos.clid + '&' + JSON.stringify(prm);
      this.hostUrl = 'http://190.85.54.78:5200/';
      // this.hostUrl = 'http://localhost:8200/';
      console.log("reporte........", this.hostUrl);
      this.invokeAction = "DXXRDV";
    });

  }

}
