import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export const JWT_KEY = 'access_token';

export interface LoginData {
  login: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProxyAuthentService {
  endpoint = '/api';
  constructor(private httpClient: HttpClient) { }
  /**
   * login function by basic autentication.
   *
   * @param username Login
   * @param password The password
   */
  login(loginData: LoginData): Observable<object> {
    return this.httpClient.post<any>(this.endpoint + '/login', loginData).pipe(
      tap(res => {
        localStorage.setItem(JWT_KEY, res.accessToken);
      }));
  }
}
