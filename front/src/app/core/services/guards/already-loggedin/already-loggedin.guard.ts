import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrentUserService } from '../../current-user/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class AlreadyLoggedinGuard implements CanActivate {
  constructor(
    private currentUserService: CurrentUserService,
    private router: Router,
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.isLogginPage && this.currentUserService.isLogged) {
        this.router.navigate(['private', 'browser']);
      }
      return true;
  }

  get isLogginPage(): boolean {
    return this.router.url === '/';
  }

}
