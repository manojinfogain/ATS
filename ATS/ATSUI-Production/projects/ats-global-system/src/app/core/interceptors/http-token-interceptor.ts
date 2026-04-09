import { Injectable} from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
@Injectable()

 export class HttpTokenInterceptor{
     constructor(private _storageServe:GetSetStorageService){}
     intercept(req:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{
       
      if (req.headers.has(SkipInterceptor)) {
        const headers = req.headers.delete(SkipInterceptor);
        return next.handle(req.clone({ headers }));
      }
        const headersConfig = {
         //   'Content-Type': 'application/json',
           // 'Accept': 'application/json',
           // 'Accept-Language': this._storageServe.getLang()
          };
          
          const token = this._storageServe.getToken();
          const tokenEx = this._storageServe.getTokenEx();
          const tokenTemp = this._storageServe.getTokenExTemp();
          if (token) {
            this._storageServe.destroyTokenEx();
            this._storageServe.destroyTokenExTemp();
           headersConfig['Authorization'] = `bearer ${token}`;
          }
          /**
           * append token for external api
           */
          if (tokenEx) {
            this._storageServe.destroyTokenExTemp();
            headersConfig['Authorization'] = `bearer ${tokenEx}`;
           }

           /**
           * append token otp authentication
           */
           if (tokenTemp) {
            headersConfig['Authorization'] = `bearer ${tokenTemp}`;
           }
        const request = req.clone({setHeaders:headersConfig})
        return next.handle(request);
     }
    
}

export const SkipInterceptor = "Skip Interceptor";