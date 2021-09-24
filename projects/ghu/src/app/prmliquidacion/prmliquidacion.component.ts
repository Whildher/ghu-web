import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDropDownBoxComponent } from 'devextreme-angular';
import { Empleados } from '../servicios/_empleados.class';
import { SdatosService } from '../servicios/_sdatos.service';

@Component({
  selector: 'app-prmliquidacion',
  templateUrl: './prmliquidacion.component.html',
  styleUrls: ['./prmliquidacion.component.css']
})
export class PrmliquidacionComponent implements OnInit {
  @ViewChild('ddLEmple', { static: false }) ddLEmple?: DxDropDownBoxComponent;

  DFEmpleados: Empleados = new Empleados();
  GLEmpleados: any;
  DPeriodos: any;
  isGridBoxOpened: boolean=false;
  valSeleccEmpleado: string = '';
  valSeleccEmpresa: string = '';
  valSeleccGrupo: string = '';
  gridBoxValue: number[] = [];
  gridColumns: any = ['ID_EMPLEADO', 'NOMBRE_COMPLETO'];
  gridColConceptos: any = ['ID_CONCEPTO', 'NOMBRE'];
  gridBoxValueConcepto: number[] = [];
  valSeleccConcepto: string = '';
  DGrupos: any;
  DEmpresas: any;
  GLConceptos: any;
  titLiquidacion: string = "";
  id_Liquidacion: string = "";
  valSeleccPeriodo: string = "";

  colBusq: any = "GRUPO";
  colBusqEmpre: any = "ID_EMPRESA";
  loadingVisible = false;
  TotalLiquidacion: string = '';
  CalcTotLiq: number = 0;
  aceptar = false;
  showPortal = false;
  editRow: number = -1;
  datFilaEdit: any;
  gridPresExp: any;

  // Lista de tipos de liquidaciones
  itmListaLiq: string[] = [
    'Primas',
    'Vacaciones',
    'Cesantías',
    'Intereses a las Cesantías',
    'Liquidacion definitiva'
  ]

  // Alert de mensajes
  displayModal: boolean = false;
  errMsg: string = "";
  errTit: string = "";
  
  constructor(private _sdatos: SdatosService, 
              private route: ActivatedRoute,
              private router: Router,
              public datepipe: DatePipe) 
  { 
    const prm = { FILTRO: '' };
    this._sdatos.getDatos('LISTA EMPLEADOS',prm).subscribe((data: any)=> {
      this.GLEmpleados = JSON.parse(data);
    });
    this._sdatos.getDatos('LISTA GRUPOS',prm).subscribe((data: any)=> {
      this.DGrupos = JSON.parse(data);
    });
    this._sdatos.getDatos('LISTA EMPRESAS',prm).subscribe((data: any)=> {
      this.DEmpresas = JSON.parse(data);
    });
    this.isGridBoxOpened = false;

    this.seleccEmpleado = this.seleccEmpleado.bind(this);
    this.onGridBoxOptionChanged = this.onGridBoxOptionChanged.bind(this);

  }

  seleccEmpleado(item: any){
    return this.valSeleccEmpleado;
  }
  seleccConcepto(item: any){
    return this.valSeleccConcepto;
  }

  onGridBoxOptionChanged(e: any){
    if (e.name === "value"){
      this.isGridBoxOpened = false;

      // Datos del empleado
      var dat = e.value;
      if(dat.length > 0)
        this.valSeleccEmpleado = dat[0].ID_EMPLEADO;
      const prm = { FILTRO: this.valSeleccEmpleado };
      this._sdatos.getDatos('DATOS CONTRATO',prm).subscribe((data: any)=> {
        this.DFEmpleados = JSON.parse(data);
      });
    }
  }
  onPeriodoSelecc(e: any){
    this.valSeleccPeriodo = e.value;

    // Busca y asigna fechas de acuerdo al periodo
    let infoPer = this.DPeriodos.filter((s: any) => s.PERIODO === this.valSeleccPeriodo); 
    if (infoPer !== undefined) {
      const fD: Date = new Date();
      this.DFEmpleados.FECHA_INICIAL = infoPer[0].FECHA_DESDE;
      this.DFEmpleados.FECHA_FINAL = infoPer[0].FECHA_HASTA;  
      this.DFEmpleados.FECHA_INI_BASE = infoPer[0].FECHA_DESDE;  
      this.DFEmpleados.FECHA_FIN_BASE = infoPer[0].FECHA_HASTA;  
    }

  }
  onFechaCambio(e: any){
    console.log(e); 
  }

  onEmpresaSelecc(e: any){
    this.valSeleccEmpresa = e.value;
  }
  onGrupoSelecc(e: any){
    this.valSeleccGrupo = e.value.split(' > ')[0];
  }

  onGridBoxConceptoChanged(e: any){
    if (e.name === "value"){
        this.isGridBoxOpened = false;

        // Datos del empleado
        var dat = e.value;
        if(dat.length > 0)
          this.valSeleccEmpleado = dat[0].ID_EMPLEADO;
        const prm = { FILTRO: this.valSeleccEmpleado };
        this._sdatos.getDatos('DATOS CONTRATO',prm).subscribe((data: any)=> {
          this.DFEmpleados = JSON.parse(data);
        });
      }
    }

  clickHome(e: any) {
    this.router.navigate(['/principal']);
  }

  // Pre-liquida
  clickLiquida(e: any) {

    // Valida que estén completos los datos
    if(this.DFEmpleados.FECHA_INICIAL === undefined || 
       this.DFEmpleados.FECHA_INI_BASE === undefined || this.DFEmpleados.FECHA_FIN_BASE === undefined)
    {
      this.displayModal = true;
      this.errMsg = `Debe seleccionar un rango de fechas, Fechas de Liquidacion y Fechas de Base!`;
      this.errTit = "Faltan datos";
      this.loadingVisible = false;
      return;
    }

    // Prepara parámetros y los envía
    const fD = this.datepipe.transform(this.DFEmpleados.FECHA_INICIAL, 'MM/dd/yyyy');  
    const fH = this.datepipe.transform(this.DFEmpleados.FECHA_FINAL, 'MM/dd/yyyy');  
    const fBD = this.datepipe.transform(this.DFEmpleados.FECHA_INI_BASE, 'MM/dd/yyyy');  
    const fBH = this.datepipe.transform(this.DFEmpleados.FECHA_FIN_BASE, 'MM/dd/yyyy');  
    const prm = { ID_EMPLEADO: this.valSeleccEmpleado, 
                  NOMBRE: this.DFEmpleados.NOMBRE_COMPLETO,
                  FECHA_DESDE: fD, 
                  FECHA_HASTA: fH, 
                  FECHA_INI_BASE: fBD, 
                  FECHA_FIN_BASE: fBH, 
                  ID_LIQ: this.id_Liquidacion, 
                  EMPRESA: this.valSeleccEmpresa,
                  GRUPO: this.valSeleccGrupo,
                  CONTRATO: this.DFEmpleados.CONTRATO,
                  DIAS: this.DFEmpleados.DIAS
                };
    const IdLiq = this.id_Liquidacion;
    const NomLiq = this.titLiquidacion;
    this.router.navigate(['/liqgenerada', {TipoLiq: IdLiq, NomLiq: NomLiq, PrmLiq: JSON.stringify(prm)}], {skipLocationChange: true});

  }

  onShown() {
    /*setTimeout(() => {
        this.loadingVisible = false;
    }, 3000);*/
  }

  onHidden() {
  }


  ngOnInit(): void {
    // Confecciona los elementos de acuerdo al tipo de liquidacion
    this.route.params.subscribe(parameter => {
      this.titLiquidacion = parameter['NomLiq'];
      this.id_Liquidacion = parameter['TipoLiq'];

      const prm = { FILTRO: this.id_Liquidacion };
      this._sdatos.getDatos('LISTA PERIODOS',prm).subscribe((data: any)=> {
        this.DPeriodos = JSON.parse(data);
        this.DPeriodos.forEach((ele: any) => {
          ele.FECHA_DESDE = this.datepipe.transform(ele.FECHA_DESDE, 'MM/dd/yyyy');
          ele.FECHA_HASTA = this.datepipe.transform(ele.FECHA_HASTA, 'MM/dd/yyyy');
          ele.FECHA_INI_BASE = this.datepipe.transform(ele.FECHA_INI_BASE, 'MM/dd/yyyy');
          ele.FECHA_FIN_BASE = this.datepipe.transform(ele.FECHA_FIN_BASE, 'MM/dd/yyyy');
          });
      });

    });

  }

  ngAfterViewInit(): void {  
    this.ddLEmple?.instance.option("dropDownOptions.width", 600);  
  }  

}
