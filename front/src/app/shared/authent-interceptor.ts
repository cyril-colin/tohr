import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JWT_KEY } from '../core/services/proxy/proxy-authent/proxy-authent.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthentInterceptor implements HttpInterceptor {

  constructor() {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // For authentication request, let caller
    // handle response himself.
    if (this.isAuthentRequest(req)) {
      return next.handle(req);
    }

    req = req.clone({
      headers: req.headers
        .append('Authorization', 'Bearer ' + localStorage.getItem(JWT_KEY))
    });



    return next.handle(req).pipe(catchError((event) => {
      if (event.status === 504) {
        console.error('Authent interceptor : ', event);
      }

      return throwError(event);
  }));

  }

  private isAuthentRequest(request: HttpRequest<any>): boolean {
    return request.method === 'POST' && request.url.endsWith('/login');
  }
}
