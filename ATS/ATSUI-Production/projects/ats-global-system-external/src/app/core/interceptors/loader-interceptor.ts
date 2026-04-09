import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpResponse,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShareService } from '../services/share.service';
import { NgxSpinnerService } from 'ngx-spinner';
 
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];
 
    constructor(private _share: ShareService,private _spinner:NgxSpinnerService) { }
 
    removeRequest(req: HttpRequest<any>) {
        const i = this.requests.indexOf(req);
        if (i >= 0) {
            this.requests.splice(i, 1);
        }
      // this._share.isLoading.next(this.requests.length > 0);
      if(this.requests.length > 0 === false){
          this._spinner.hide();
      }
    }
 
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.has(SkipLoader)) {
            const headers = req.headers.delete(SkipLoader);
            return next.handle(req.clone({ headers }));
        }
        this.requests.push(req);
       // this._share.isLoading.next(true);
       this._spinner.show();
        return Observable.create((observer:any) => {
            const subscription = next.handle(req)
                .subscribe(
                    event => {
                        if (event instanceof HttpResponse) {
                            this.removeRequest(req);
                            observer.next(event);
                        }
                    },
                    err => {
                        this.removeRequest(req);
                        observer.error(err);
                    },
                    () => {
                        this.removeRequest(req);
                        observer.complete();
                    });
            // remove request from queue when cancelled
            return () => {
                this.removeRequest(req);
                subscription.unsubscribe();
            };
        });
    }
}


export const SkipLoader = "skiploader";