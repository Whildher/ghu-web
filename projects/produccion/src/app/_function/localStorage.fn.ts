export const fnLocal = {
	agregar(name: string, array: object) {
		localStorage.setItem(name, JSON.stringify(array));
	  },
	  get(name: string) {
		let _string = localStorage.getItem(name)!;
		return JSON.parse(_string);
	  },
	  remove(item: string) {
	   return localStorage.removeItem(item);
	  }
  }