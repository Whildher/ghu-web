export class FlowNode {
	constructor(
		public id: string,
		public text: string,
		public type: string,
		public x: string,
		public y: string,
		public width: string,
		public height: string,
		public textStyle?: string,
		public contenedor?: string,
		public bloqSeccion?: boolean
	) {}
}

export class childFlowNode {
	constructor(
		public id: string,
		public text: string,
		public type: string
	) {}
}

export class FlowEdge {
	constructor(
		public id: string,
		public fromId: string,
		public toId: string,
		public text: string,
		public fromPoint: string,
		public toPoint: string,
		public conecStyle?: string,
		public bloqConn?: boolean
) {}
}

export class MDistriplantas {
	constructor(
		public ID_RUTA: string,
		public DESCRIPCION: string,
		public ESTADO: string,
		public TIPO: string,
		public PRIORIDAD: string,
		public SECCIONES: any,
		public DIAGRAMA: any
	) {}
}

export class MSecciones {
	constructor(
		public ID_UN: string,
		public ID_SECCION: string,
		public ITEM: number,
		public DESCRIPCION: string,
		public ANTERIOR: number,
		public ID_UN_ITEM: string,
		public ASIGNABLE: boolean,
		public ESTADO: string,
		public INVENTARIO: boolean,
		public TIPO: string,
		public MANO_OBRA: boolean,
		public MSG: string,
		public IsActive: boolean
	) {}
}
