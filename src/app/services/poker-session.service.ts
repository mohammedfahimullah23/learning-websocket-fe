import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/environtment';
import { Session } from '../interfaces/session';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokerSessionService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  createPokerSession(sessionData: Session): Observable<Session> {
    const api = `${this.apiUrl}/sessions/create`;
    return this.http.post<Session>(api, sessionData);
  }

  getPokerSession(sessionId: string): Observable<Session> {
    const api = `${this.apiUrl}/sessions/${sessionId}`;
    return this.http.get<Session>(api);
  }
}
