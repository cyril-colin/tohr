import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as HttpStatus from 'http-status-codes';

@Injectable()
export class UnavailabletInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((event) => {
      if (event.status === HttpStatus.GATEWAY_TIMEOUT) {
        this.router.navigate(['/unavailable']);
      }

      return throwError(event);
  }));

  }

}
