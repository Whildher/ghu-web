import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { custShapesDiagrama } from './_class/libsvg.class';
const SETTINGS_LOCATION = "./assets/libsvg.json";

@Injectable({
  providedIn: 'root'
})
export class LibsvgService {
  custShapes: custShapesDiagrama[];

  constructor(private http: HttpClient) {
  }
  
  getArchivo(): Observable<custShapesDiagrama> {
    return this.http.get(SETTINGS_LOCATION)
      .pipe(map((response: any) => 
        { 
          this.custShapes = response;
          return (response || [{}])
        }),
       catchError((err) => { return this.handleErrors(err); })
      );
  }
  
  private handleErrors(error: any): Observable<custShapesDiagrama> {
      // Return default configuration values
      alert(error);
      return of<custShapesDiagrama>(new custShapesDiagrama());
  }

}
