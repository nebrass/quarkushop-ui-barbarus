import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {BarbarusLoginDto} from '../../models/barbarus/barbarus-login-dto';
import {Router} from '@angular/router';
import {AccessToken} from '../../models/accessToken/access-token';
import {map} from 'rxjs/operators';

const baseUrl = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class BarbarusService {
  private refreshTokenTimeout: number;

  constructor(private http: HttpClient, private router: Router) {
  }

  getBarbarusLogin(): Observable<BarbarusLoginDto> {
    return this.http.get<BarbarusLoginDto>(`${baseUrl}/barbarus/sse`);
  }

  getRefreshToken(): Observable<AccessToken> {
    const accessToken: AccessToken = {
      accessToken: this.getStoredAccessToken(),
      refreshToken: this.getStoredRefreshToken()
    };
    return this.http.post<AccessToken>(`${baseUrl}/user/refresh-token`, accessToken);
  }

  performLogout(): Observable<any> {
    const accessToken: AccessToken = {
      accessToken: this.getStoredAccessToken(),
      refreshToken: this.getStoredRefreshToken()
    };

    return this.http.post(`${baseUrl}/barbarus/logout`, accessToken);
  }

  refreshToken(): Observable<any> {
    if (!this.isConnected()) {
      return of();
    }
    return this.getRefreshToken()
      .pipe(map((data) => {
        localStorage.removeItem('refresh_token');
        localStorage.setItem('refresh_token', data.refreshToken);
        this.startRefreshTokenTimer();
        return data;
      }, error => {
        console.error(error);
      }));
  }

  isConnected(): boolean {
    return localStorage.getItem('access_token') != null;
  }

  getStoredAccessToken(): string {
    return localStorage.getItem('access_token');
  }

  getStoredRefreshToken(): string {
    return localStorage.getItem('refresh_token');
  }

  logout(): void {
    if (this.isConnected()) {
      this.performLogout().subscribe(
        () => {
        },
        error => {
          if ([401, 403].includes(error.status)) {
            this.clearLocalStorage();
            this.router.navigate(['/barbarus']);
          } else {
            console.error(error);
          }
        }
      );

      this.clearLocalStorage();
      this.router.navigate(['/']);
    }
  }

  clearLocalStorage(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.stopRefreshTokenTimer();
  }

  private startRefreshTokenTimer(): void {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.getStoredRefreshToken().split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (25 * 60 * 1000);
    console.warn('Timeout is: ' + timeout);
    console.warn('Expire time is: ' + expires.getTime());
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }
}
