import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next
            .handle(this.addHeaders(request))
            .pipe(catchError((error) => throwError(error)));
    }

    addHeaders(request: HttpRequest<any>): HttpRequest<any> {
        const headers = {
            'Content-Type': 'application/json',
        };

        return request.clone({
            url: `${environment.apiHost}${environment.apiEndpoint}${request.url}`,
            withCredentials: false,
            setHeaders: headers,
        });
    }
}
