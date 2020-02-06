import { Injectable } from '@angular/core';
import { JWT_KEY } from '../proxy/proxy-authent/proxy-authent.service';
import { User } from '../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

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

  logout(): void {
    localStorage.removeItem(JWT_KEY);
  }
}
