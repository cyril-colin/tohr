import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JWT_KEY } from '../core/services/proxy/proxy-authent/proxy-authent.service';
import { CurrentUserService } from '../core/services/current-user/current-user.service';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthentInterceptor implements HttpInterceptor {

  constructor(
    private currentUserService: CurrentUserService,
    private router: Router,
  ) {}

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
      if (event.status === 401 && this.currentUserService.isLogged) {
        console.error('Your JWT is invalid. Please login.');
        this.currentUserService.logout();
        this.router.navigate(['/']);
      }

      return throwError(event);
  }));

  }

  private isAuthentRequest(request: HttpRequest<any>): boolean {
    return request.method === 'POST' && request.url.endsWith('/login');
  }
}
