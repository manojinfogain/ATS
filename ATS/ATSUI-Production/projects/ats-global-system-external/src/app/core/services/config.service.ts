import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<any> {
     const httpopt = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        }
    return this.http.get('assets/config/config.json',httpopt); // Path to your JSON file
  }

  setConfig(config: any) {
    this.config = config;
  }

  getConfig(): any {
    return this.config;
  }

  get(key: string): any {
    return this.config ? this.config[key] : null;
  }
}
