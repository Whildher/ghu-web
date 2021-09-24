export class Menureg {
	constructor(
		public TABLA_BASE: string,
		public C: boolean,
		public M: boolean,
		public E: boolean,
		public G: boolean,
		public D: boolean,
		public B: boolean,
		public F: boolean,
		public V: boolean,
		public Y: boolean,
		public O: boolean,
		public P: boolean,
		public A: boolean,
		public R: boolean,
		public T: boolean,
		public S: boolean,
		public U: boolean,
		public I: boolean,
		public N: boolean,
		public X: boolean
	) {}
}

export class datosMenuConfig {
	constructor(
		public TABLA_BASE: string,
		public APLICACION: string,
		public OPCIONES: string,
		public BNumReg: number,
		public BTotReg: number,
		public Status: string,
		public USUARIO?: string
	) {}
}

export class MenuClass {
	constructor(
		public name: string,
		public icon: string,
		public visible: boolean,
		public uso: boolean,
		public items?: SubMenu[]
	) {}
}
class SubMenu {
	constructor(
		public text: string,
		public name: string,
		public icon: string,
		public visible: boolean,
		public uso: boolean
	) {}
}