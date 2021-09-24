import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AppSettings } from "./_class/appsettings.class";

const SETTINGS_LOCATION = "./assets/appsettings.json";

@Injectable({
  providedIn: 'root'
})
export class AppsettingsService {
  public settingsApp: AppSettings;

  constructor(private http: HttpClient) {
  }
  
  getSettings(): Observable<AppSettings> {
    return this.http.get(SETTINGS_LOCATION)
      .pipe(map((response: any) => 
        { 
          this.settingsApp = response;
          return (response || {})
        }),
       catchError((err) => { return this.handleErrors(err); })
      );
  }
  
  private handleErrors(error: any): Observable<AppSettings> {
      // Return default configuration values
      alert(error);
      return of<AppSettings>(new AppSettings());
  }
  
}
