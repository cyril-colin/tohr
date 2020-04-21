import { Injectable } from '@angular/core';
import { JWT_KEY } from '../proxy/proxy-authent/proxy-authent.service';
import { User } from '../../model/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private isLogged$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() { }

  get currentUser(): User {
    if (!this.isLogged) {
      console.warn('Attempt to get the current user while not logged.');
      return null;
    }
    const userAsB64 = localStorage.getItem(JWT_KEY).split('.')[1];
    const userAsJSON = atob(userAsB64);
    return JSON.parse(userAsJSON) as User;
  }
  get isLogged(): boolean {
    return !!localStorage.getItem(JWT_KEY);
  }



  isLoggedListener$(): BehaviorSubject<boolean> {
    this.isLogged$.next(this.isLogged);
    return this.isLogged$;
  }

  logout(): void {
    this.isLogged$.next(false);
    localStorage.removeItem(JWT_KEY);
  }
}
