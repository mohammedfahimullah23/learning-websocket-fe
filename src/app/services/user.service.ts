import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environtment';
import { Session } from '../interfaces/session';
import { PutUser, User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/users`;

  public createUser(userData: User): Observable<User> {
    const api = `${this.apiUrl}/create`;
    console.log('api', api);
    return this.http.post<User>(api, userData);
  }

  public getUserDetailsBySessionId(
    userId: string,
    sessionId: string
  ): Observable<User> {
    const api = `${this.apiUrl}/user/${userId}/session/${sessionId}`;
    return this.http.get<User>(api);
  }

  public updatedUserActiveStatus(
    userId: string,
    sessionId: string,
    isActive: boolean
  ): Observable<User> {
    const data = {
      isActive: isActive,
    };
    const api = `${this.apiUrl}/user/${userId}/session/${sessionId}/status`;
    console.log('api', api);
    return this.http.post<User>(api, data);
  }

  public getAllActiveUsers(sessionId:string): Observable<User[]> {
    const api = `${this.apiUrl}/active-users/session/${sessionId}`;
    return this.http.get<User[]>(api);
  }
}
