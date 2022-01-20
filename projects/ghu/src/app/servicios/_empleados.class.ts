export class Empleados {
    constructor(
      public ID_EMPLEADO?: string,
      public NOMBRE_COMPLETO?: string,
      public FECHA_INICIAL?: Date,
      public FECHA_FINAL?: Date,
      public FECHA_INI_BASE?: Date,
      public FECHA_FIN_BASE?: Date,
      public ID_EMPRESA?: string,
      public GRUPO?: string,
      public CONTRATO?: string,
      public DIAS?: number,
      public TVPRIMA?: number,
      public TDPRIMA?: number,
      public TVCES?: number,
      public TDCES?: number,
      public TVINT?: number,
      public TDINT?: number,
      public TVVAC?: number,
      public TDVAC?: number,
      public TTOT?: number,
      public ID_CAUSA?: string,
      public COMENTARIOS?: string,
      public GEN_NOM?: boolean,
      public ELIM_LIQ?: string
	) {}

}

export class ListaEmpleados {
    constructor(
		public ID_EMPLEADO?: string,
		public NOMBRE?: string
	) {}

}

export class HistoricoLiq {
    constructor(
      public ID?: number,
      public ID_EMPLEADO?: string,
      public FECHA_INICIAL?: Date,
      public FECHA_FINAL?: Date,
      public DIAS?: number,
      public VALOR?: number,
      public SALARIO?: number,
      public NUM_LIQ?: string,
      public ID_LIQ?: string,
      public ID_APL?: string,
      public ID_RPT?: string
	) {}

}

export class TiposLiq {
  constructor(
    public idliq: string,
    public nomliq: string,
    public descliq?: string,
    public img?: string,
    public abrev?: string
  ) {}
}

export class LiqCompoAct  {
  constructor(
    public Primas: boolean,
    public Cesantias: boolean,
    public IntCesantias: boolean,
    public Vacaciones: boolean,
    public Contrato: boolean
    ) {}
  }

export class Novedades  {
  constructor(
    public ID_EMPLEADO: string,
    public NOMBRE: string,
    public ID_CONCEPTO: string,
    public VALOR: number
    ) {}
  }

  export class DLiquidacion  {
    constructor(
      public ID_CONCEPTO: string,
      public NOMBRE: string,
      public BASE: number,
      public DIAS: number,
      public TOTAL: number,
      public OPCION: string
      ) {}
    }
  
  export class Conceptos  {
  constructor(
    public ID_CONCEPTO: string,
    public NOMBRE: string,
    public TIPO_VALOR: string
    ) {}
  }
  
export class Liquidaciones {
  constructor(
    public DOCUMENTO: string,
    public FECHA: Date,
    public EMPLEADO: string,
    public PERIODO: string,
    public TIPO: string,
    public FILTRO: string,
    public REPORTE: string
    ) {}
  }